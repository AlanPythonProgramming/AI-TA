import streamlit as st
from openai import OpenAI
import os
from dotenv import load_dotenv
import json

# setup
# Function to retrieve the OpenAI API key
def get_openai_api_key():
    try:
        # Attempt to get the API key from Streamlit secrets
        return st.secrets["OPENAI_API_KEY"]
    except AttributeError:
        # Fallback to environment variable if not running on Streamlit
        return os.getenv("OPENAI_API_KEY")

# Retrieve the API key
OPENAI_API_KEY = get_openai_api_key()

# Validate the API key
if not OPENAI_API_KEY:
    st.error("OpenAI API key is not set. Please configure it in the secrets.")
    st.stop()

# Initialize the OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

st.title("Regulated GPT tutor")

def append_to_jsonl(file_path, data):
    data = {"messages": messages}
    
    with open(file_path, 'a') as file:
        file.write('\n'+json.dumps(data))


if 'system_prompt' not in st.session_state:
    # with open("instructions.md", "r", encoding="utf-8") as file:
    #     system_prompt = file.read()
    # st.session_state['system_prompt'] = system_prompt
    st.session_state['system_prompt'] = "You are a university tutor chatbot that answers student queries about Math and CS."
    with open("regulations_old.md", "r", encoding="utf-8") as file:
        regulations = file.read()
    st.session_state['regulations'] = regulations

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
        # tools=[{"type": "file_search"}],
        # tool_resources={
        #     "file_search": {
        #         "vector_store_ids": [vector_store.id]
        #     }
        # }
    )
    
    st.session_state['tutor'] = tutor.id
    st.success("tutor created.")

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
        # tools=[{"type": "file_search"}],
        # tool_resources={
        #     "file_search": {
        #         "vector_store_ids": [vector_store.id]
        #     }
        # }
    )
    st.session_state['supervisor'] = supervisor.id
    st.success("supervisor created.")

if "tutor_thread" not in st.session_state:
    # message_file = client.files.create(
    #     file=open("23_ACTL2131_Exercises.pdf", "rb"), purpose="assistants"
    # )
    # with st.spinner("Creating conversation thread..."):
    tutor_thread = client.beta.threads.create(
        messages=[]
    )

    st.session_state['tutor_thread'] = tutor_thread.id
    st.success("Conversation thread created.")

    supervision_thread = client.beta.threads.create(
        messages=[]
    )

    st.session_state['supervision_thread'] = supervision_thread.id
    st.success("Conversation thread created.")

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

        print("-----------------tutor's response-------------------")

        # examine the assistant's response through supervisor
        if messages:
            response = messages[0].content[0].text.value
            print(response)
        else:
            st.error("No messages retrieved from the run. ")
        
        messages = [
            {"role": "system", "content": st.session_state['system_prompt']},
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": response}
        ]
        append_to_jsonl("user_tutor_interactions.jsonl", messages)

        # supervision_prompt = f"""After the delimiter #### is the response which needs to be regulated. 
        # Check the rules in the document uploaded in your vector store and see if there are any violations of those rules. 
        # A yes to any of the rules would be considered a violation in which case you should just output 'yes', otherwise output 'no':
        # #### {response}"""
        supervision_prompt = f"#### {response}"
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
        
        messages = [
            {"role": "system", "content": st.session_state['regulations']},
            {"role": "user", "content": supervision_prompt},
            {"role": "assistant", "content": supervision_response}
        ]
        append_to_jsonl("tutor_supervisor_interactions.jsonl", messages)

        # display the validated response
        print("--------------------supervision response-------------------------")
        print(supervision_response)
        if "no" in supervision_response.lower():
            st.session_state.tutor_messages.append({"role": "assistant", "content": response})
            with st.chat_message("assistant"):
                st.markdown(response)
        else:
            st.session_state.tutor_messages.append({"role": "assistant", "content": "Sorry, I cannot answer that."})
            with st.chat_message("assistant"):
                st.markdown("Sorry, I cannot answer that.")

    except Exception as e:
        st.error(f"An error occurred while processing your request: {e}")
