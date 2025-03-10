# Use a Python base image
FROM python:3.10-slim

# Make a working directory
WORKDIR /app

# Copy over your requirements file
COPY requirements.txt /app

# Install your dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy your app source code into the container
COPY . /app

# Expose the port Streamlit will run on
EXPOSE 8501

# Default command to run your app
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
