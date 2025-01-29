FROM node:18-alpine

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Enable Corepack and use Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

# Copy package.json and yarn.lock first (for better caching)
# COPY package.json yarn.lock ./

# Copy the rest of the application code
COPY . ./

# Install dependencies
RUN yarn install

# Build the TypeScript project
RUN yarn build

EXPOSE 1000

CMD ["yarn", "start"]
