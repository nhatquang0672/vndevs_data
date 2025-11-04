# Use lightweight official OpenJDK 17 image
FROM openjdk:17.0.1-jdk-slim

# Set environment variables
ENV TZ=Asia/Ho_Chi_Minh
ENV APP_HOME=/app

# Create working directory
WORKDIR $APP_HOME

# Copy your project files (both backends + scripts)
COPY blcx-server ./blcx-server
COPY blcx-center ./blcx-center
COPY start.sh .
COPY stop.sh .

# Make scripts executable
RUN chmod +x start.sh stop.sh

# Expose default ports (optional — change to your actual ports)
EXPOSE 8080 8081

# Set default command
CMD ["./start.sh"]
