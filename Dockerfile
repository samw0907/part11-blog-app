# Use a base image for Node.js
FROM node:20.14.0-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for backend
COPY package.json package-lock.json ./

# Install dependencies using npm ci for consistency
RUN npm ci

# Copy all backend source files
COPY . .

# Move to frontend directory and build frontend
WORKDIR /app/bloglist-frontend
COPY bloglist-frontend/package.json bloglist-frontend/package-lock.json ./
RUN npm ci
RUN npm run build

# Copy the built frontend files to the backend's build directory
WORKDIR /app
RUN cp -r bloglist-frontend/dist build

# Expose the port the app runs on
EXPOSE 3003

# Start the backend server
CMD ["npm", "start"]
