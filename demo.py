import streamlit as st
from openai import OpenAI
import os
from dotenv import load_dotenv
import json

# Function to retrieve the OpenAI API key
def get_openai_api_key():
    try:
        return st.secrets["OPENAI_API_KEY"]
    except AttributeError:
        return os.getenv("OPENAI_API_KEY")

# Retrieve the API key
OPENAI_API_KEY = get_openai_api_key()

# Validate the API key
if not OPENAI_API_KEY:
    st.error("OpenAI API key is not set. Please configure it in the secrets.")
    st.stop()

# Initialize the OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

# Set up two columns
st.title("AI-TA Demo")
st.markdown("""
Welcome to this demo app! 
There are two chatGPT systems, both of which are given the role of a university Math and Computer Science tutor.

The left column is a chatbot which will be filtered if its response provides the user with a full solution to a problem or is unrelated to Math and CS, and the right column is unfiltered.
If the left and right chatbots both give a response, then their response will be identical. Otherwise, the left side would output "Sorry I cannot answer that", but you can still see what would've been the answer using the right column.

You can use the example questions to get started, or enter one of your own in the textbox below! Please wait for a few seconds for each response.
            
Note: this is just a first iteration demo, so the filtering is not yet comprehensive, and may misclassify some responses.
""")

if "prompt_to_process" not in st.session_state:
    st.session_state["prompt_to_process"] = None

if "is_processing" not in st.session_state:
    st.session_state["is_processing"] = False

example_prompts = [
    "Who are you?",
    "Solve x^2-2*x+1==0",
    "Can you write me a python algorithm to sort an array?",
    "Meaning of life."
]

# Display each prompt as a clickable button
# for example in example_prompts:
#     if st.button(example):
#         st.session_state['prompt_to_process'] = example

if st.session_state["is_processing"]:
    st.write("Processing your request, please wait...")
else:
    for prompt in example_prompts:
        if st.button(prompt):
            st.session_state["prompt_to_process"] = prompt
            st.session_state["is_processing"] = True

    user_input = st.chat_input("Ask a question:")
    if user_input:
        st.session_state["prompt_to_process"] = user_input
        st.session_state["is_processing"] = True

col1, col2 = st.columns(2)


# Function to append messages to a JSONL file
def append_to_jsonl(file_path, messages):
    data = {"messages": messages}
    with open(file_path, 'a') as file:
        file.write('\n' + json.dumps(data))

# Initialize session state variables
if 'system_prompt' not in st.session_state:
    st.session_state['system_prompt'] = "You are a university tutor chatbot that answers student queries about Math and CS."
    with open("regulations_old.md", "r", encoding="utf-8") as file:
        regulations = file.read()
    st.session_state['regulations'] = regulations

if "tutor_messages" not in st.session_state:
    st.session_state["tutor_messages"] = []
    st.session_state["supervision_messages"] = []
    st.session_state["normal_tutor_messages"] = []

# Create assistants and threads if not already created
if 'tutor' not in st.session_state:
    st.session_state["tutor_model"] = "gpt-4o"
    st.session_state["supervisor_model"] = "gpt-4o-mini"

    tutor = client.beta.assistants.create(
        name="GPT-4o Tutor",
        instructions=st.session_state['system_prompt'],
        model=st.session_state["tutor_model"],
    )
    st.session_state['tutor'] = tutor.id
    # st.success("Tutor assistant created.")

    vector_store = client.beta.vector_stores.create(
        name="regulations",
        expires_after={
            "anchor": "last_active_at",
            "days": 1
        }
    )
    file_paths = ["regulations_old.md"]
    file_streams = [open(path, "rb") for path in file_paths]
    file_batch = client.beta.vector_stores.file_batches.upload_and_poll(
        vector_store_id=vector_store.id, files=file_streams
    )

    supervisor = client.beta.assistants.create(
        name="4o-mini Supervisor",
        instructions=st.session_state['regulations'],
        model=st.session_state["supervisor_model"],
    )
    st.session_state['supervisor'] = supervisor.id
    # st.success("Supervisor assistant created.")

if "tutor_thread" not in st.session_state:
    tutor_thread = client.beta.threads.create(messages=[])
    st.session_state['tutor_thread'] = tutor_thread.id
    # st.success("Regulated tutor conversation thread created.")

    supervision_thread = client.beta.threads.create(messages=[])
    st.session_state['supervision_thread'] = supervision_thread.id
    # st.success("Supervisor conversation thread created.")

    # Create normal tutor thread
    normal_tutor_thread = client.beta.threads.create(messages=[])
    st.session_state['normal_tutor_thread'] = normal_tutor_thread.id
    # st.success("Normal tutor conversation thread created.")

# Allow user to modify the system prompt
# new_system_prompt = st.text_area("Enter a system prompt:", st.session_state['system_prompt'], height=150)

# Update the system prompt if changed
# if new_system_prompt != st.session_state['system_prompt']:
#     st.session_state['system_prompt'] = new_system_prompt
#     with st.spinner("Updating assistant with new system prompt..."):
#         client.beta.assistants.update(
#             assistant_id=st.session_state['tutor'],
#             instructions=st.session_state['system_prompt'],
#         )
#         st.success("System prompt updated.")

# Get user input outside the columns
# user_input = st.chat_input('Ask a question:')
# if user_input:
#     st.session_state['prompt_to_process'] = user_input

if st.session_state['prompt_to_process']:
    # Append user message to both message histories
    with st.spinner("Processing..."):

        st.session_state['tutor_messages'].append({"role": "user", "content": st.session_state['prompt_to_process']})
        st.session_state['normal_tutor_messages'].append({"role": "user", "content": st.session_state['prompt_to_process']})

        # Process for regulated tutor
        try:
            # Send user message to regulated tutor thread
            client.beta.threads.messages.create(
                thread_id=st.session_state['tutor_thread'],
                role="user",
                content=st.session_state['prompt_to_process']
            )

            # Get assistant's response
            run = client.beta.threads.runs.create_and_poll(
                thread_id=st.session_state['tutor_thread'],
                assistant_id=st.session_state['tutor']
            )

            messages = list(client.beta.threads.messages.list(
                thread_id=st.session_state['tutor_thread'],
                run_id=run.id,
            ))

            if messages:
                response = messages[-1].content[0].text.value
            else:
                st.error("No messages retrieved from the regulated tutor run.")
            
            st.session_state['normal_tutor_messages'].append({"role": "assistant", "content": response})

            # Examine the assistant's response through supervisor
            supervision_prompt = f"#### {response}"
            st.session_state['supervision_messages'].append({"role": "user", "content": supervision_prompt})

            # Send to supervisor
            client.beta.threads.messages.create(
                thread_id=st.session_state['supervision_thread'],
                role="user",
                content=supervision_prompt
            )

            supervision_run = client.beta.threads.runs.create_and_poll(
                assistant_id=st.session_state['supervisor'],
                thread_id=st.session_state['supervision_thread'], 
            )

            supervision_messages = list(client.beta.threads.messages.list(
                thread_id=st.session_state['supervision_thread'],
                run_id=supervision_run.id,
            ))

            if supervision_messages:
                supervision_response = supervision_messages[-1].content[0].text.value
                st.session_state['supervision_messages'].append({"role": "assistant", "content": supervision_response})
            else:
                st.error("No messages retrieved from the supervisor run.")

            # Decide whether to display the assistant's response
            if "no" in supervision_response.lower():
                st.session_state['tutor_messages'].append({"role": "assistant", "content": response})
            else:
                st.session_state['tutor_messages'].append({"role": "assistant", "content": "Sorry, I cannot answer that."})

        except Exception as e:
            st.error(f"An error occurred while processing the regulated tutor response: {e}")

    st.session_state['prompt_to_process'] = None
    st.session_state["is_processing"] = False


# Column 1: Regulated GPT tutor
with col1:
    st.subheader("Regulated GPT Tutor")
    for message in st.session_state['tutor_messages']:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

# Column 2: Normal GPT tutor
with col2:
    st.subheader("Normal GPT Tutor")
    for message in st.session_state['normal_tutor_messages']:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])