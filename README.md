The code base for the tutoring chatbot is in "new".

First thing to do after cloning the repo is install all the required packages.

Then, setup the docker containerisations with **docker-compose up --build -d** which contains elastic search.

Create a .env file with the necessary env variables including at least the three envs as shown in .env.example

Finally, run app.py with **streamlit run app.py --server.port=8501 --server.address=0.0.0.0**

Elastic search will be running on port 9200, and the script will run on port 8501.

Apologies for the messy code base in advance.