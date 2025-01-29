# Use Node.js LTS as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
# COPY package*.json ./

# Copy the rest of the application code
COPY . ./

# Install dependencies
RUN npm install

# Build the Next.js project
RUN npm run build

# Expose the frontend port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]