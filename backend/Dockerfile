FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 1000

CMD ["yarn", "start"]