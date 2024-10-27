import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", message="LangChainDeprecationWarning")

import streamlit as st
from openai import OpenAI, AssistantEventHandler
import io
from typing_extensions import override
import os
from dotenv import load_dotenv

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.document_loaders import TextLoader

# setup
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


st.title("Regulated GPT tutor")

def setup_retriever(regulations_path, chunk_size=200, chunk_overlap=20):
    loader = TextLoader(regulations_path, encoding='utf-8')
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["###"]
    )
    splits = text_splitter.split_documents(docs)
    
    print("The splits are:")
    for split in splits:
        print(split)
        print("-----------------------------")

    embeddings = OpenAIEmbeddings()

    vectorstore = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory="chroma_regulations"
    )

    retriever = vectorstore.as_retriever(search_kwargs={"k": 1}) 

    return retriever


if 'system_prompt' not in st.session_state:
    st.session_state['system_prompt'] = "You are a university tutor chatbot that answers student queries about Math and CS."

if "tutor_messages" not in st.session_state:
    st.session_state["tutor_messages"] = []
    st.session_state["supervision_messages"] = []

if 'tutor' not in st.session_state:

    st.session_state["tutor_model"] = "gpt-4o"
    st.session_state["supervisor_model"] = "gpt-4o-mini"

    tutor = client.beta.assistants.create(
        name="GPT-4o Tutor",
        instructions=st.session_state['system_prompt'],
        model=st.session_state["tutor_model"],
    )
    
    st.session_state['tutor'] = tutor.id
    st.success("tutor created.")

    # vector_store = client.beta.vector_stores.create(
    #     name="regulations",
    #     expires_after={
    #         "anchor": "last_active_at",
	#         "days": 1
    #     },
    #     chunking_strategy={
    #         "type": "static",
    #         "static": {
    #             "max_chunk_size_tokens": 100,
    #             "chunk_overlap_tokens": 0
    #         }
    #     }
    # )
    # file_paths = ["regulations.md"]
    # file_streams = [open(path, "rb") for path in file_paths]
    # file_batch = client.beta.vector_stores.file_batches.upload_and_poll(
    #     vector_store_id=vector_store.id, files=file_streams
    # )

    supervisor = client.beta.assistants.create(
        name="4o-mini Supervisor",
        instructions="You're the supervisor of a university tutor chatbot.", #st.session_state['regulations'],
        model=st.session_state["supervisor_model"],
        # tools=[{"type": "file_search", "file_search": {"max_num_results": 2}}],
        # tool_resources={
        #     "file_search": {
        #         "vector_store_ids": [vector_store.id]
        #     }
        # }
    )
    st.session_state['supervisor'] = supervisor.id
    st.success("supervisor created.")

if 'retriever' not in st.session_state:
    with st.spinner("Setting up RAG pipeline..."):
        retriever = setup_retriever("regulations.md", chunk_size=200, chunk_overlap=20)
        st.session_state['retriever'] = retriever
    st.success("RAG pipeline is ready.")


if "tutor_thread" not in st.session_state:
    # message_file = client.files.create(
    #     file=open("23_ACTL2131_Exercises.pdf", "rb"), purpose="assistants"
    # )
    # with st.spinner("Creating conversation thread..."):
    tutor_thread = client.beta.threads.create(
        messages=[]
    )

    st.session_state['tutor_thread'] = tutor_thread.id
    st.success("Tutor thread created.")

    supervision_thread = client.beta.threads.create(
        messages=[]
    )

    st.session_state['supervision_thread'] = supervision_thread.id
    st.success("Supervisor thread created.")

# allow user to modify system prompt
new_system_prompt = st.text_area("Enter a system prompt:", st.session_state['system_prompt'], height=150)

# update system prompt if changed
if new_system_prompt != st.session_state['system_prompt']:
    st.session_state['system_prompt'] = new_system_prompt
    # st.session_state.tutor_messages[0] = {"role": "system", "content": st.session_state['system_prompt']}
    with st.spinner("Updating assistant with new system prompt..."):
        client.beta.assistants.update(
            assistant_id=st.session_state['tutor'],
            instructions=st.session_state['system_prompt'],
        )
        st.success("System prompt updated.")

# display chat history
st.header("Chat History")
for message in st.session_state.tutor_messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# handle user input and assistant response
if prompt := st.chat_input("Ask a question:"):
    st.session_state.tutor_messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    message = client.beta.threads.messages.create(
        thread_id = st.session_state['tutor_thread'],
        role = "user",
        content = prompt
    )

    try:
        # get assistant's response
        run = client.beta.threads.runs.create_and_poll(
            thread_id=st.session_state['tutor_thread'],
            assistant_id=st.session_state['tutor']
        )

        messages = list(client.beta.threads.messages.list(
            thread_id=st.session_state['tutor_thread'],
            run_id=run.id,
        ))

        # examine the assistant's response through supervisor
        if messages:
            response = messages[0].content[0].text.value
            print(response)
        else:
            st.error("No messages retrieved from the run. ")

        print("\n\n------------------reached the supervision part-------------------")
        rag_prompt = f"""Retrieve any regulations from the document that might apply to this response. 
        Only include regulations that directly relate to evaluating this response:
        #### {response}"""


        docs = st.session_state['retriever'].invoke(rag_prompt)
        context = ""
        for doc in docs:
            print('----------------new chunk-----------------')
            print(doc)
            context += doc.page_content

        supervision_prompt = f""" 
        You are provided with the following regulation rules: "{context}".
        Carefully review each rule and compare it with the response: "{response}".
        Think step-by-step. A yes to any of the rules would be considered a violation in which case you should just output 'yes', otherwise output 'no'.
        """
        st.session_state.supervision_messages.append({"role": "user", "content": supervision_prompt})
   
        message = client.beta.threads.messages.create(
            thread_id = st.session_state['supervision_thread'],
            role="user",
            content=supervision_prompt
        )

        supervision_run = client.beta.threads.runs.create_and_poll(
            assistant_id=st.session_state['supervisor'],
            thread_id=st.session_state['supervision_thread'], 
        )
        messages = list(client.beta.threads.messages.list(
            thread_id=st.session_state['supervision_thread'],
            run_id=supervision_run.id,
        ))
        if messages:
            supervision_response = messages[0].content[0].text.value
            st.session_state.supervision_messages.append({"role": "assistant", "content": supervision_response})
        else:
            print("An error has occurred, no message")

        # display the validated response
        print("--------------------supervision response-------------------------")
        print(supervision_response)
        if "no" == supervision_response.lower():
            st.session_state.tutor_messages.append({"role": "assistant", "content": response})
            with st.chat_message("assistant"):
                st.markdown(response)
        else:
            st.session_state.tutor_messages.append({"role": "assistant", "content": "Sorry, I cannot answer that."})
            with st.chat_message("assistant"):
                st.markdown("Sorry, I cannot answer that.")

    except Exception as e:
        st.error(f"An error occurred while processing your request: {e}")
