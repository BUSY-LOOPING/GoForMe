FROM node:18-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache netcat-openbsd dos2unix

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p uploads logs uploads/runner_images

COPY docker-entrypoint.sh /usr/local/bin/
RUN dos2unix /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh
EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
