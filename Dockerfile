# Base image for building
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install  --force

# Copy the rest of the application
COPY . .

# Expose port 
EXPOSE 3002

CMD ["npm", "start"]