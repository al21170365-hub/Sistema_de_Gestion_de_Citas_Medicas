# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose port (adjust if your app uses a different port)
EXPOSE 9797

# Default command to run the application
CMD ["npm", "start", "dev"]
