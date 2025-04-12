FROM node:18

# Instalar dependências do sistema e bibliotecas adicionais necessárias para o Chrome
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libvulkan1  # Dependência faltante

# Baixar o pacote .deb do Google Chrome
RUN mkdir -p /etc/apt/keyrings && \
    curl -fsSL -k https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o /tmp/google-chrome.deb && \
    dpkg -i /tmp/google-chrome.deb && \
    apt-get install -f -y && \
    rm /tmp/google-chrome.deb

# Define o diretório de trabalho
WORKDIR /app

# Copiar e instalar dependências do Node
COPY package*.json ./
RUN npm install

# Copiar o restante do projeto
COPY . .

EXPOSE 3001

CMD ["npm", "start"]
