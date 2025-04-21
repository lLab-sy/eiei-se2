FROM node:20-alpine

WORKDIR /app

# Install dependencies to build bcrypt
RUN apk add --no-cache python3 make g++ 

COPY package*.json ./

# Force bcrypt rebuild inside container
RUN yarn install --force

COPY . .

RUN yarn build

EXPOSE 1000

CMD ["yarn", "start"]
