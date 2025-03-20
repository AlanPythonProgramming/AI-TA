from openai import OpenAI
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
import chromadb
from chromadb.config import Settings
import voyageai
from dotenv import load_dotenv
import os
import json
import streamlit as st
import pymongo
from datetime import datetime

load_dotenv()
vo = voyageai.Client(api_key=os.getenv("VOYAGE_API_KEY"))
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
mongo_client = pymongo.MongoClient("mongodb://mongo:27017/") #pymongo.MongoClient(os.getenv("MONGO_URI"))
mongo_db = mongo_client['comp1531_testing']
collection_logs = mongo_db['chat_logs']

def read_json(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

def initialize_chromadb():
    return chromadb.PersistentClient(path="/comp1531", settings=Settings())

def get_embedding(text, input_type="document"):
    result = vo.embed([text], model="voyage-3", input_type=input_type)
    return result.embeddings[0]

def rerank(query, documents):
    reranking = vo.rerank(query, documents, model='rerank-2', top_k=5)
    res = []
    for r in reranking.results:
        res.append(r.document)
    return res

def chat_tutor(messages):
    completion = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        temperature=0
    )
    return completion.choices[0].message.content

def chat_ui(messages):
    completion = openai_client.chat.completions.create(
        # model="ft:gpt-4o-mini-2024-07-18:loch:ai-tutor-ui-classifier:AmbSdfCs",
        model='gpt-4o-mini',
        messages=messages,
        temperature=0
    )
    return completion.choices[0].message.content

class ElasticsearchBM25:
    def __init__(self, create_index, index_name: str = "contextual_bm25_index"):
        self.es_client = Elasticsearch("http://elasticsearch:9200")
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

def run_rag_pipeline(question):
    
    retrieved_results = rag_fusion_search(question, 25, collection, es, data_map)
    retrieved_context = [f"Summary: {res['summary']}\n\nContent:\n{res['content']}"for res in retrieved_results]
    retrieved_context = rerank(question, retrieved_context)
    # messages = [
    #     {
    #         "role": "system",
    #         "content": [{"type": "text", "text": "You are an AI tutor for a software engineering course. Use supporting documents to help answer the student's question."}]
    #     },
    #     {
    #         "role": "user",
    #         "content": [{"type": "text", "text": f"Supporting context:\n{context_string}\n\nQuestion: {question}"}]
    #     }
    # ]
    # generated_answer = chat_tutor(messages)
    # return generated_answer, retrieved_context
    return retrieved_context


# Tutor system instructions
tutor_system = """INSTRUCTIONS: A tutor and a student work together to resolve software engineering questions for the course COMP1531 - Software Engineering Fundamentals. You need to role-play the tutor while the user roleplays the student.
The tutor is a soft-spoken empathetic teaching assistant who dislikes giving out direct answers when it comes to assessable tasks like project and lab functions. Instead, you prefer asking the student questions in this scenario to help them gain understanding.
You also hate to speak about topics outside of COMP1531. For general questions about concepts or coding unrelated to assessment functions, you can answer freely.

You should think logically following the process below:
 - Look at the user intent classification provided with the student query to determine your content and helpfulness.
 - If the user intent is 'general', you can feel free to provide large steps as hints or even code if it seems effective for student learning.
 - If the user intent is 'off-topic', just kindly refuse to answer saying you'd like to focus on COMP1531.
 - If the user intent is 'assessment', that means they are asking about assessable tasks. In this case you CANNOT under any circumstance give any code (including pseudocode) or implementations. Only guide them to understanding concepts related to their query.
"""

# UI system instructions for intent classification
ui_system = """You are a user intent classifier which assesses a student's query and determines its category. Given a user question, you should check whether this question is a general software engineering inquiry(general), an off-topic inquiry unrelated to software engineering topics(off-topic), or a question specifically related to any of the labs or project function specifications(assessment). You should follow a step-by-step process to make this classification.

First, check if the query is a follow up question to a previous query earlier in the conversation history. Make a classification based on that. For example sometimes a query may appear off-topic but is actually a continuation from the previous messages.

Then if the query is unrelated to the previous messages, use the relevant context that will be provided to see if the question relates closely with the assessment tasks. 

If so, then you should consider classifying the query as "assessment". 

Otherwise, you should determine whether the query is related to software engineering and coding or not. If the question is specific to technical software engineering knowledge, i.e. conceptual or coding-related queries, you should classify it as "general". If the question does not relate to technical software engineering knowledge, then you should classify the query as "off-topic".
"""

# Initialize the vector store and collection
db = initialize_chromadb()
collection = db.get_collection(name="fixed_length_assessment_chunks")
docs = read_json("complete_assessment_chunks.json")
es = create_elasticsearch_bm25_index(docs)
data_map = create_chunk_data_map()


# Initialize session state to store conversation history and user input
if 'tutor_history' not in st.session_state:
    st.session_state.tutor_history = [{"role": "system", "content": tutor_system}]
if 'ui_history' not in st.session_state:
    st.session_state.ui_history = ""
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []
if 'user_input' not in st.session_state:
    st.session_state.user_input = ""

st.title("COMP1531 Tutor Chat Interface")

# Function to process the question
def process_question():
    user_input = st.session_state.user_input
    if user_input:
        # Retrieve relevant documents from your knowledge base
        docs_list = run_rag_pipeline(user_input)
        docs = '----------New Document---------------'.join(docs_list)
        print(docs)
        
        # Build the intent classification prompt
        ui_prompt = f"""Here is the user query: {user_input}
Review the conversation history to check if this query is a follow-up to earlier messages:
<{st.session_state.ui_history}>

Relevant knowledge from the lab / project specifications:
<{docs}>

Classification should belong to these three categories: general, off-topic, assessment.
Output only the exact category label:"""
        
        # Call the intent classifier
        label = chat_ui([
            {"role": "system", "content": ui_system},
            {"role": "user", "content": ui_prompt}
        ])
        
        # Build the tutor prompt using the classified label and relevant docs
        tutor_prompt = f"""Student's message to you: {user_input}

Useful context from the assessment tasks knowledge base: {docs}

User intention label: {label}
If the user intent is "assessment", remember your boundaries and do not provide any code."""
        
        # Update tutor history and get the tutor's response
        st.session_state.tutor_history.append({"role": "user", "content": tutor_prompt})
        tutor_response = chat_tutor(st.session_state.tutor_history)
        st.session_state.tutor_history.append({"role": "assistant", "content": tutor_response})
        
        # Append the current exchange to the chat history
        st.session_state.chat_history.append({
            "student": user_input,
            "intent": label,
            "tutor": tutor_response
        })
        
        # Update the UI conversation history
        st.session_state.ui_history += f"STUDENT: {user_input}\nUSER INTENT: {label}\nTUTOR: {tutor_response}\n"
        
        # store logs in Mongo DB
        log_record = {
            "student_query": user_input,
            "intent_label": label,
            "tutor_response": tutor_response,
            "timestamp": datetime.utcnow().isoformat(),
            "context_docs": docs_list,
        }

        collection_logs.insert_one(log_record)

        # Clear the input box after processing
        st.session_state.user_input = ""

# Display the conversation history at the top
if st.session_state.chat_history:
    for msg in st.session_state.chat_history:
        st.markdown(f"**Student:** {msg['student']}")
        st.markdown(f"**User Intent:** {msg['intent']}")
        st.markdown(f"**Tutor:** {msg['tutor']}")
        st.markdown("---")

# Place the input box at the bottom with an on_change callback so that pressing Enter submits the query
st.text_input("Your question:", key="user_input", on_change=process_question)
