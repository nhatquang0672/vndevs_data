#!/bin/sh

# Start Admin
node ./dist/admin/www.js >> admin.log 2>&1 &

# Start Main App
node ./dist/app.js >> app.log 2>&1 &

# Keep container alive
tail -f admin.log app.log
