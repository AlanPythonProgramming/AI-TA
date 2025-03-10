from opik import Opik
from opik.evaluation import evaluate
from opik.evaluation.metrics import (AnswerRelevance, ContextRecall, ContextPrecision)
from openai import OpenAI
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
import chromadb
from chromadb.config import Settings
import voyageai
from dotenv import load_dotenv
import os
import json

load_dotenv()
vo = voyageai.Client(api_key=os.getenv("VOYAGE_API_KEY"))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

os.environ["OPIK_API_KEY"] = os.getenv("OPIK_API_KEY") 
os.environ["OPIK_WORKSPACE"] = os.getenv("OPIK_WORKSPACE")
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

def read_json(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

def initialize_chromadb(path):
    return chromadb.PersistentClient(path=path, settings=Settings())

def get_embedding(text, input_type="document"):
    result = vo.embed([text], model="voyage-3", input_type=input_type)
    return result.embeddings[0]

def rerank(query, documents):
    reranking = vo.rerank(query, documents, model='rerank-2', top_k=5)
    res = []
    for r in reranking.results:
        res.append(r.document)
    return res

def query_database(collection, query, top_k=20):
    query_vector = get_embedding(query, input_type="query")
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=top_k
    )
    docs = []
    for doc in results["documents"]:
        # docs += '\n-----------------NEW DOCUMENT----------------\n'.join(doc)
        docs.extend(doc)
    return docs

db = initialize_chromadb("comp1531")
collection_whole = db.get_collection(name="fixed_length_assessment_chunks")
docs = read_json("complete_assessment_chunks.json")

class ElasticsearchBM25:
    def __init__(self, create_index, index_name: str = "assessment_bm25_retrieval"):
        self.es_client = Elasticsearch("http://localhost:9200")
        self.index_name = index_name
        if create_index:
            self.create_index()

    def create_index(self):
        index_settings = {
            "settings": {
                "analysis": {
                    "analyzer": {
                        "default": {
                            "type": "english"
                        }
                    }
                },
                "similarity": {
                    "default": {
                        "type": "BM25"
                    }
                }
            },
            "mappings": {
                "properties": {
                    "content": {"type": "text", "analyzer": "english"},
                    "summary": {"type": "text", "analyzer": "english"},
                    "doc_id": {"type": "keyword", "index": False},
                    "chunk_id": {"type": "keyword", "index": False}
                }
            }
        }
        if not self.es_client.indices.exists(index=self.index_name):
            self.es_client.indices.create(index=self.index_name, body=index_settings)
            print(f"Created index: {self.index_name}")

    def index_documents(self, documents):
        # documents: List[Dict], each with at least
        # { "content": "...", "doc_id": "...", "chunk_id": "..." }
        actions = []
        for doc in documents:
            actions.append({
                "_index": self.index_name,
                "_source": {
                    "content": doc["content"],
                    "summary": doc['summary'],
                    "doc_id": doc["doc_id"],
                    "chunk_id": doc["chunk_id"]
                },
            })
        success, _ = bulk(self.es_client, actions)
        self.es_client.indices.refresh(index=self.index_name)
        return success

    def search(self, query: str, k: int = 20):
        self.es_client.indices.refresh(index=self.index_name)
        search_body = {
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["content", "summary"]
                }
            },
            "size": k,
        }
        response = self.es_client.search(index=self.index_name, body=search_body)
        return [
            {
                "doc_id": hit["_source"]["doc_id"],
                "chunk_id": hit["_source"]["chunk_id"],
                "content": hit["_source"]["content"],
                "score": hit["_score"],
            }
            for hit in response["hits"]["hits"]
        ]

def prepare_es_docs(docs):
    """
    Convert your docs array into a list of dicts for ES ingestion.
    Returns something like:
    [
      {
        "doc_id": "path/to/file1.txt",
        "chunk_id": "0",
        "content": "...",   # the chunk content
        "summary": "..."    # optional
      },
      ...
    ]
    """
    es_docs = []
    for file_dict in docs:
        file_path = file_dict["filePath"]
        for idx, chunk_info in enumerate(file_dict["chunks"]):
            content = chunk_info["content"]
            summary = chunk_info["summary"]

            # chunk_id is a string
            chunk_id = str(idx)

            es_docs.append({
                "doc_id": file_path,   # We can treat the full path as doc_id
                "chunk_id": chunk_id,
                "content": content,
                "summary": summary
            })
    return es_docs

def create_elasticsearch_bm25_index(docs):
    es_bm25 = ElasticsearchBM25(create_index=False)
    es_bm25.index_documents(prepare_es_docs(docs))
    return es_bm25

def combine_ranks(semantic_ranking, bm25_ranking, semantic_weight=0.8, bm25_weight=0.2):
    combined_scores = {}

    # Gather all unique IDs from both sets
    all_ids = set(semantic_ranking.keys()) | set(bm25_ranking.keys())
    # print("ALL IDS", all_ids)

    for uid in all_ids:
        score = 0.0
        # If present in semantic
        if uid in semantic_ranking:
            rank = semantic_ranking[uid]
            # 1-based rank
            score += semantic_weight * (1.0 / (rank + 1))
        # If present in BM25
        if uid in bm25_ranking:
            rank = bm25_ranking[uid]
            score += bm25_weight * (1.0 / (rank + 1))
        combined_scores[uid] = score

    # sort descending by combined score
    ranked_uids = sorted(combined_scores.keys(), key=lambda x: combined_scores[x], reverse=True)
    # print("RANKED UIDS", ranked_uids)
    return ranked_uids, combined_scores

def rag_fusion_search(query, top_k, collection, es_client, chunk_data_map, semantic_weight=0.8, bm25_weight=0.2):
    # 1) Semantic search in Chroma
    query_vec = get_embedding(query, input_type="query")
    semantic_results = collection.query(query_embeddings=[query_vec], n_results=50)  # some large cutoff
    semantic_ranking = {
        uid: rank for rank, uid in enumerate(semantic_results["ids"][0])
    }

    # 2) Keyword search in ES
    bm25_hits = es_client.search(query, k=50)
    bm25_ranking = {}
    for rank, hit in enumerate(bm25_hits):
        unique_id = f"{hit['doc_id']}_{hit['chunk_id']}"
        bm25_ranking[unique_id] = rank

    # 3) Combine
    ranked_uids, combined_scores = combine_ranks(
        semantic_ranking, bm25_ranking, semantic_weight, bm25_weight
    )

    # 4) Take the top_k
    final_uids = ranked_uids[:top_k]

    # 5) Retrieve chunk content/metadata
    #    Chroma results only hold the top_50 from semantic, so if something from BM25 is
    #    not in those top_50, you might need a separate approach to fetch chunk text.
    #    Alternatively, keep a dictionary of chunk_id -> chunk_data from your original JSON.

    # Here we do a sample approach if you have chunk_data_map built:
    results = []
    for uid in final_uids:
        # get the chunk data
        chunk = chunk_data_map.get(uid, None)
        if chunk:
            results.append({
                "unique_id": uid,
                "content": chunk["content"],
                "summary": chunk["summary"],
                "score": combined_scores[uid]
            })

    return results

def create_chunk_data_map():
    chunk_data_map = {}

    for file_dict in docs:
        file_path = file_dict["filePath"]
        for idx, chunk_info in enumerate(file_dict["chunks"]):
            chunk_id = str(idx)
            unique_id = f"{file_path}_{chunk_id}"
            chunk_data_map[unique_id] = {
                "content": chunk_info["content"],
                "summary": chunk_info["summary"],
                "filePath": file_path
            }
    return chunk_data_map


openai_client = OpenAI(api_key=OPENAI_API_KEY)
client = Opik()
dataset = client.get_dataset(name="RAG evaluation dataset")
es = create_elasticsearch_bm25_index(docs)
data_map = create_chunk_data_map()

def chat(message):
    completion = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=message
    )
    return completion.choices[0].message.content

def run_rag_pipeline(question):
    # your RAG pipeline is called here
    
    retrieved_results = rag_fusion_search(question, 25, collection_whole, es, data_map)
    retrieved_context = [f"Summary: {res['summary']}\n\nContent:\n{res["content"]}"for res in retrieved_results]
    retrieved_context = rerank(question, retrieved_context)
    context_string = '----------New Document---------------'.join(retrieved_context)
    messages = [
        {
            "role": "system",
            "content": [{"type": "text", "text": "You are an AI tutor for a software engineering course. Use supporting documents to help answer the student's question."}]
        },
        {
            "role": "user",
            "content": [{"type": "text", "text": f"Supporting context:\n{context_string}\n\nQuestion: {question}"}]
        }
    ]
    generated_answer = chat(messages)
    return generated_answer, retrieved_context
  
def evaluation_task(dataset_item):
    # your LLM application is called here
    question = dataset_item.get("user_question", "")
    generated_answer, retrieved_context = run_rag_pipeline(question)

    result = {
        "input": question,
        "output": generated_answer,
        "context": retrieved_context
    }
    return result

metrics = [AnswerRelevance(model="gpt-4o-mini"), ContextRecall(model="gpt-4o-mini"), ContextPrecision(model="gpt-4o-mini")]

eval_results = evaluate(
    experiment_name="complete advanced rerank top 5",
    dataset=dataset,
    task=evaluation_task,
    scoring_metrics=metrics,
)