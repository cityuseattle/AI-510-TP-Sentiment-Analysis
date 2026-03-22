#!/usr/bin/env bash
set -e

# Reuse artifact if it already exists
if [ -f sentiment-image.tar ]; then
    echo "🟡 Artifact already exists — reusing sentiment-image.tar"
else
    echo "🔵 Downloading artifact: sentiment-image"
    gh run download --name sentiment-image
fi

echo "🔵 Loading Docker image..."
docker load -i sentiment-image.tar

echo "🔵 Starting backend container..."
docker rm -f sentiment-backend 2>/dev/null || true
docker run -d -p 5000:5000 --name sentiment-backend sentiment-analysis-app:ci

echo "Backend container started on port 5000"