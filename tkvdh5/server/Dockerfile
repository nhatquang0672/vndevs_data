FROM node:22-alpine


WORKDIR /app

# Copy your prebuilt files
COPY . .

# Make start.sh executable
RUN chmod +x ./start.sh

# Default command
CMD ["sh", "./start.sh"]
