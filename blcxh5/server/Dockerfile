FROM amazoncorretto:17.0.17

WORKDIR /app

COPY blcx-center /app/blcx-center
COPY blcx-server /app/blcx-server
COPY start.sh stop.sh /app/

RUN chmod +x /app/start.sh /app/stop.sh

EXPOSE 9053 9056

CMD ["/app/start.sh"]
