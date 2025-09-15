FROM node:18-alpine

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy app source
COPY . .

EXPOSE 5000

# Run normally (no nodemon)
CMD ["npm", "start"]
