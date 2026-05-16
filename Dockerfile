FROM n8nio/n8n:latest

USER root

COPY . /custom-node

WORKDIR /custom-node

RUN npm install --include=dev

RUN npm run build

RUN chown -R node:node /custom-node

USER node