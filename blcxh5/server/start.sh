#!/bin/bash

CENTER_PORT=9053
SERVER_PORT=9056

echo "[INFO] Starting blcx-center on port ${CENTER_PORT}..."
cd /app/blcx-center
nohup java -jar blcx-center.jar > /app/blcx-center.log 2>&1 &

echo "[INFO] Waiting 10 seconds for blcx-center to initialize..."
sleep 10 

echo "[INFO] Starting blcx-server on port ${SERVER_PORT}..."
cd /app/blcx-server
nohup java -jar blcx-server.jar > /app/blcx-server.log 2>&1 &

echo "[INFO] All services started. Tailing logs..."
tail -F /app/blcx-center.log /app/blcx-server.log
