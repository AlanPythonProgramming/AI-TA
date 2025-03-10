import os
from dotenv import load_dotenv
import voyageai
from openai import OpenAI
from pydantic import BaseModel
from typing import List
import chromadb
from chromadb.config import Settings
import json

load_dotenv()  # Loads environment variables from a .env file if present

VOYAGE_API_KEY = os.getenv("VOYAGE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not VOYAGE_API_KEY:
    raise ValueError("Please set your VOYAGE_API_KEY environment variable.")
if not OPENAI_API_KEY:
    raise ValueError("Please set your OPENAI_API_KEY environment variable.")

# Initialize the VoyageAI client
voyage_client = voyageai.Client(api_key=VOYAGE_API_KEY)
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# INITIALISING CHROMADB UTILITIES
def initialize_chromadb(path):
    return chromadb.PersistentClient(path=path, settings=Settings())

def get_embedding(text, input_type="document"):
    result = voyage_client.embed([text], model="voyage-3", input_type=input_type)
    return result.embeddings[0]


def query_database(collection, query, top_k=3):
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
collection_chunks = db.get_or_create_collection(name="general_tutorial_chunks")

def embed_and_store_in_chromadb(file):
    filename = file["filePath"]
    chunks = file["chunks"]
    for idx, chunk in enumerate(chunks):
        content = chunk["content"]
        summary = chunk["summary"]

        total_content = f"Summary:{summary}\n\nContent:\n{content}"
        embedding = get_embedding(total_content)
        
        unique_id = f"{filename}_{idx}"
        
        metadata = {"filePath": filename, "chunkIdx": idx}
        
        # Add this chunk to the collection
        collection_chunks.add(
            embeddings=[embedding],
            ids=[unique_id],
            metadatas=[metadata],
            documents=[total_content]
        )

        # collection_whole.add(
        #     embeddings=[embedding],
        #     ids=[unique_id],
        #     metadatas=[metadata],
        #     documents=[total_content]
        # )
    print("Embedded chunks from file", filename)

def generate_short_path(file_path: str, root_dir: str = "./assessments") -> str:
    """
    Given the full file path, return a short path string in the format:
    'From assessments -> subdir -> ... -> filename:'
    """
    abs_file_path = os.path.abspath(file_path)
    abs_base_dir = os.path.abspath(root_dir)
    # Compute the relative path from the base directory
    rel_path = os.path.relpath(abs_file_path, start=abs_base_dir)
    # Join the parts with " -> "
    parts = rel_path.split(os.sep)
    return "From assessments -> " + " -> ".join(parts) + ":"

# class Chunk(BaseModel):
#     summary: str
#     content: str

# class Chunks(BaseModel):
#     chunks: List[Chunk]

def chunk_document_with_llm(document_text: str) -> str:
    """
    Sends the entire document_text to the GPT-4o-mini model,
    instructing it to chunk the document semantically without losing information.
    Returns the chunked output as a string.
    """
    system_prompt = """
    You are an AI assistant that chunks documents into meaningful sections. 

    Please split the document into well-structured chunks, ensuring no information is summarised or lost.
    Feel free to have chunks of varying sizes, and if a document is already quite short, feel free to leave it as a single chunk.
    Each chunk should be between 500 to 2000 characters long.

    You should output the entire document back out, but inserting the token 'NEW CHUNK' as a separator between chunks.
    (And if the document already has that token, you can simply print it out as is.)
    """

    # Prepare the messages for the LLM
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": document_text}
    ]

    # Make the chat completion request
    completion = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.2,
        max_completion_tokens=16384,
    )

    # Extract the chunked text from the response
    return completion.choices[0].message.content

def contextualise_chunk(document, chunk, file_name) -> str:
    """
    Sends the entire document_text to the GPT-4o-mini model,
    instructing it to chunk the document semantically without losing information.
    Returns the chunked output as a string.
    """
    
    # Prepare the messages for the LLM
    prompt = f"""Following document has path: {file_name}
<document> 
{document} 
</document> 
Here is the chunk we want to situate within the whole document 
<chunk> 
{chunk} 
</chunk> 
Please give a short succinct context to situate this chunk within the overall document for the purposes of improving search retrieval of the chunk. Answer only with the succinct context and nothing else."""

    # Make the chat completion request
    completion = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_completion_tokens=256,
    )

    # Extract the chunked text from the response
    return completion.choices[0].message.content

def get_all_files_in_assessments(root_dir):
    """
    Recursively walk through the specified root_dir and yield full paths
    for every file found (ignoring hidden files).
    """
    extensions=(".js", ".ts", ".md", ".yaml")
    for current_path, dir, files in os.walk(root_dir):
        for filename in files:
            # if not filename.startswith("."):  # skip hidden/system files
            if filename.endswith(extensions): # only for general - tutorials
                yield os.path.join(current_path, filename)

def fixed_length_chunking(text, chunk_size=500, overlap=100):
    """
    Splits the text into fixed-length chunks with overlap.
    
    :param text: The full document text.
    :param chunk_size: Number of characters per chunk.
    :param overlap: Number of characters to overlap between chunks.
    :return: List of chunked text.
    """
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap  # Move start forward with overlap

    return chunks


def main():
    root_path = './general'
    all_files = list(get_all_files_in_assessments(root_path))
    file_count = 0
    chunking_record = []
    threshold = 2000
    print(f"Found {len(all_files)} files in the assessments directory.")
    

    for file_path in all_files:
        with open(file_path, "r", encoding="utf-8") as f:
            file_text = f.read()

        print(f"File name: {file_path} of length {len(file_text)}")
        short_path = generate_short_path(file_path, root_dir=root_path)

        if len(file_text) == 0:
            chunked_output["chunks"] = [{"summary": f"{short_path} This document is empty. It likely needs to be filled out by the student.", "content": ""}]
            chunking_record.append(chunked_output)
            file_count += 1
            print(f"\n--- Chunked {file_count} files, most recent being {file_path} ---\n")
            continue

        if len(file_text) > threshold:
            chunks = chunk_document_with_llm("Here is the document:\n" + file_text).split("NEW CHUNK")
            total_length = 0
            for chunk in chunks:
                total_length += len(chunk)
            if total_length <= len(file_text):
                print("!"*100)
                print(f"Something went wrong when chunking {file_path}\nLength of file: {len(file_text)}\nBut only got: {total_length}")
        else:
            chunks = [file_text]

        chunked_output = {"chunks": []}

        for chunk in chunks:
            summary = contextualise_chunk(file_text, chunk)
            summary = f"{short_path} {summary}"
            chunked_output["chunks"].append({"summary": summary, "content": chunk})
        
        # Prepend the short path to the summary of each chunk (rule-based modification)
        # for chunk in chunked_output.get("chunks", []):
        #     chunk["summary"] = f"{short_path} {chunk['summary']}"

        file_count += 1
        print(f"\n--- Chunked {file_count} files, most recent being {file_path} ---\n")
        # chunk_output = {"summary": summary, "content": chunk}
        chunking_record.append({"filePath": file_path, "chunks": chunked_output["chunks"]})

        embed_and_store_in_chromadb({"filePath": file_path, "chunks": chunked_output["chunks"]})

        if file_count < 10:
            for idx, chunk in enumerate(chunked_output.get("chunks", [])):
                print(f"Chunk {idx} Summary: {chunk['summary']}\n")
                print(f"Chunk {idx} Content:\n{chunk['content']}\n")
                print("-" * 60)
            print("\n" + "=" * 80 + "\n")
    
    print("Chunking complete. Stored all chunks in the tutorial chunks collection.")
    with open('recorded_tutorial_chunks.json', 'w') as f:
        json.dump(chunking_record, f, indent=4)


if __name__ == "__main__":
    main()
