FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy application code
COPY src ./src
COPY tsconfig.json ./

# Build the application
RUN npm run build

# Expose API port
EXPOSE 3001

# Start the API server
CMD ["node", "dist/server.js"]
