# Use Amazon Corretto 17 (JDK)
FROM amazoncorretto:17.0.17

# Set working directory
WORKDIR /app

# Copy your apps
COPY blcx-center blcx-server start.sh stop.sh /app/

# Make scripts executable
RUN chmod +x /app/start.sh /app/stop.sh

# Expose ports (adjust these if your .jar uses others)
EXPOSE 9053 9056

# Default command
CMD ["/app/start.sh"]
