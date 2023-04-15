FROM node:latest

WORKDIR /app

COPY ./package.json /app

RUN npm install

COPY . /app

VOLUME [ "/app/node_modules" ]

RUN npm run build
RUN npx migrate

CMD [ "npm", "start:prod" ]