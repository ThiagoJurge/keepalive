FROM python:3.11

WORKDIR /app

COPY requirements.txt .

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

ENV TZ=America/Sao_Paulo
RUN ln -fs /usr/share/zoneinfo/$TZ /etc/localtime && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y tzdata && \
    dpkg-reconfigure -f noninteractive tzdata && \
    rm -rf /var/lib/apt/lists/*


# Disable SSL verification (not secure)
RUN pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --cert /etc/ssl/certs/ca-certificates.crt -r requirements.txt || \
    pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --disable-pip-version-check --no-cache-dir --no-verify-ssl -r requirements.txt

RUN apt-get update && apt-get install -y iputils-ping



COPY . .

CMD ["python", "app.py"]
