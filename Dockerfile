FROM node:22-slim
WORKDIR /app
COPY package.json ./
COPY bin ./bin
RUN npm install -g @apify/actors-mcp-server
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENTRYPOINT ["node", "bin/server.js"]
