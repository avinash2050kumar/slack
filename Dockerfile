FROM node:alpine

RUN apk update && apk add bash

WORKDIR /app

# Set environment variable here
ENV PORT=3004

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
