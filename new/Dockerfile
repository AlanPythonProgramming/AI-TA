FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt /app

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app
RUN mv /app/comp1531 /comp1531 

EXPOSE 8501

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; exit(0) if urllib.request.urlopen('http://0.0.0.0:8501/healthz').getcode() == 200 else exit(1)"

CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
