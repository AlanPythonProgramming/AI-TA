# -*- coding: utf-8 -*-

import streamlit as st
from openai import OpenAI, AssistantEventHandler
import io
from typing_extensions import override
import os
from dotenv import load_dotenv

# setup
load_dotenv()
client = OpenAI(api_key="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")

st.title("ChatGPT with File Search and System Prompting")

# initialize session state variables
if "openai_model" not in st.session_state:
    st.session_state["openai_model"] = "gpt-4o-mini" 

if 'system_prompt' not in st.session_state:
    system_prompt = """You are a university tutor answering students' queries. Provide hints in terms of what the user should think about in order to solve the problem.
                       It is ok to give some starting lines of working but never give the full solution or any code, even if the user asks for it."""
    st.session_state['system_prompt'] = system_prompt

if "messages" not in st.session_state:
    st.session_state.messages = []

if 'assistant' not in st.session_state:
    # vector_store = client.beta.vector_stores.create(name="experiment")
    # file_paths = ["few_questions_from_actl.md", "Business Plan.pdf"]
    # file_streams = [open(path, "rb") for path in file_paths]
    # file_batch = client.beta.vector_stores.file_batches.upload_and_poll(
    #     vector_store_id=vector_store.id, files=file_streams
    # )
    # all_files = list(client.beta.vector_stores.files.list(vector_store.id))
    # print(all_files)

    assistant = client.beta.assistants.create(
        name="University tutor",
        instructions=st.session_state['system_prompt'],
        model=st.session_state["openai_model"],
        # tools=[{"type": "file_search"}],
        # tool_resources={
        #     "file_search": {
        #         "vector_store_ids": [vector_store.id]
        #     }
        # }
    )
    st.session_state['assistant'] = assistant.id
    st.success("Assistant created.")

if "thread" not in st.session_state:
    # message_file = client.files.create(
    #     file=open("23_ACTL2131_Exercises.pdf", "rb"), purpose="assistants"
    # )
    # with st.spinner("Creating conversation thread..."):
    thread = client.beta.threads.create(
        messages=[]
    )

    st.session_state['thread'] = thread.id
    st.success("Conversation thread created.")

# allow user to modify system prompt
new_system_prompt = st.text_area("Enter a system prompt:", st.session_state['system_prompt'], height=150)

# update system prompt if changed
if new_system_prompt != st.session_state['system_prompt']:
    st.session_state['system_prompt'] = new_system_prompt
    st.session_state.messages[0] = {"role": "system", "content": st.session_state['system_prompt']}
    with st.spinner("Updating assistant with new system prompt..."):
        client.beta.assistants.update(
            assistant_id=st.session_state['assistant'],
            instructions=st.session_state['system_prompt'],
        )
        st.success("System prompt updated.")

# Handle file uploads
# uploaded_files = st.file_uploader("Upload documents for file search", accept_multiple_files=True, key='file_uploader')

# if uploaded_files and 'uploaded_files' not in st.session_state:
#     st.session_state['uploaded_files'] = uploaded_files

# if 'uploaded_files' in st.session_state and st.session_state['uploaded_files']:
#     with st.spinner("Uploading files as message attachments..."):
#         # Convert Streamlit UploadedFile objects to binary streams
#         file_streams = [('document.pdf', io.BytesIO(file.read())) for file in st.session_state['uploaded_files']]
#         attachments = []

#         # Upload each file and get its file ID
#         for file_name, file_stream in file_streams:
#             message_file = client.files.create(file=file_stream, purpose="assistants")
#             attachments.append({"file_id": message_file.id, "tools": [{"type": "file_search"}]})

#         # Attach the uploaded files to the conversation thread
#         message = client.beta.threads.messages.create(
#             thread_id=st.session_state['thread'],
#             role="user",
#             content="I have uploaded files for file search.",
#             attachments=attachments
#         )

#         # Clear the uploaded_files after processing
#         st.session_state['uploaded_files'] = []

# if 'uploaded_files' not in st.session_state:
#     st.session_state['uploaded_files'] = True
#     message_file = client.files.create(
#         file=open("23_ACTL2131_Exercises.pdf", "rb"), purpose="assistants"
#     )
#     # Attach the uploaded files to the conversation thread
#     message = client.beta.threads.messages.create(
#         thread_id=st.session_state['thread'],
#         role="user",
#         content="I have uploaded files for file search.",
#         attachments={ "file_id": message_file.id, "tools": [{"type": "file_search"}] }
#     )

# display chat history
st.header("Chat History")
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# handle user input and assistant response
if prompt := st.chat_input("Ask a question:"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    message = client.beta.threads.messages.create(
        thread_id = st.session_state['thread'],
        role = "user",
        content = prompt
    )

    try:
        run = client.beta.threads.runs.create_and_poll(
            thread_id=st.session_state['thread'],
            assistant_id=st.session_state['assistant']
        )

        # retrieve messages from the run
        messages = list(client.beta.threads.messages.list(
            thread_id=st.session_state['thread'],
            run_id=run.id,
        ))

        print(messages)

        # process the assistant's response
        if messages:
            message_content = messages[0].content[0].text
            st.session_state.messages.append({"role": "assistant", "content": message_content.value})
            with st.chat_message("assistant"):
                st.markdown(message_content.value)
        else:
            st.error("No messages retrieved from the run. ")

    except Exception as e:
        st.error(f"An error occurred while processing your request: {e}")
