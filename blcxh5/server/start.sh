#!/bin/bash
set -e

CENTER_PORT=9053
SERVER_PORT=9056

echo "[INFO] Starting blcx-center on port ${CENTER_PORT}..."
nohup java -jar /app/blcx-center/blcx-center.jar &
# Wait a few seconds before starting server
echo "[INFO] Waiting 5 seconds for blcx-center to initialize..."
sleep 5

echo "[INFO] Starting blcx-server on port ${SERVER_PORT}..."
nohup java -jar /app/blcx-server/blcx-server.jar &
# Keep container running by following logs
tail -f /app/blcx-center/nohup.out /app/blcx-server/nohup.out

# cd /home/server/blcx-center
# nohup java -jar blcx-center.jar &

# cd /home/server/blcx-server
# nohup java -jar blcx-server.jar &
