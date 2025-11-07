# killall java

#!/bin/bash
echo "[INFO] Stopping Java services..."
pkill -f blcx-center.jar || true
pkill -f blcx-server.jar || true
