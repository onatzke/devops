FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production PORT=3000

ARG IMAGE_VERSION
LABEL version=$IMAGE_VERSION

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

RUN mkdir -p /data && chown -R node:node /data

EXPOSE 3000

USER node

CMD ["node", "src/server.js"]