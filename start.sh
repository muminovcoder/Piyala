#!/bin/sh
set -e

# Start Nginx (daemon on by default — runs in background)
nginx

# Start Node.js backend in foreground
exec node server/server.js
