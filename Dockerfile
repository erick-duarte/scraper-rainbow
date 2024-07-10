FROM debian:11

RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

RUN apt-get update && apt-get install -y chromium

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY app.js ./
COPY services ./services

ENV NODE_ENV=production

CMD ["/bin/bash"]

VOLUME ["/usr/src/app/config"]