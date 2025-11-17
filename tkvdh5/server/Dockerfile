FROM node:22-alpine
WORKDIR /app

# Copy prebuilt code and package files
COPY package*.json ./ 
COPY dist ./dist
COPY start.sh ./

# Install only production deps & make start.sh executable
RUN npm install --production && chmod +x ./start.sh

# Start app
CMD ["sh", "./start.sh"]
