# Use an official Node.js image as the base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app (uncomment if using a build step, e.g., React/Vue/Next)
# RUN npm run build

# Expose the port the app runs on (change if needed)
EXPOSE 4000

# Start the application
CMD ["npm", "run", "dev"]