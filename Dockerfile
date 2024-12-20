# Stage 1: Build the frontend
FROM node:18-alpine AS build-frontend

WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies

RUN npm install

# Copy the rest of the frontend code
COPY frontend/ ./

# Build the frontend
RUN npm run build

# Stage 2: Build the backend
FROM node:18-alpine

WORKDIR /app/backend

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend/ ./

# **Add this line to copy the frontend build into the backend's public directory**
COPY --from=build-frontend /app/frontend/build ./public

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
