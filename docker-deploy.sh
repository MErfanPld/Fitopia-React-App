#!/usr/bin/env sh
set -e
echo "==> Building Fitopia image..."
docker compose build --no-cache
echo "==> Starting container..."
docker compose up -d
echo "==> Status:"
docker compose ps
echo ""
echo "App:  http://localhost:${HOST_PORT:-80}"
echo "Health: http://localhost:${HOST_PORT:-80}/health"
