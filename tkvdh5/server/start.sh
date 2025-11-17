#!/bin/sh

# Start Admin
node ./admin/www.js >> admin.log 2>&1 &

# Start Main App
node ./app.js >> app.log 2>&1 &

# Keep container alive
tail -f admin.log app.log
