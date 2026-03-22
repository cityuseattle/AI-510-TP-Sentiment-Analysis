#!/usr/bin/env bash
set -e

ARTIFACT_NAME="sentiment-image"
ARTIFACT_FILE="sentiment-image.tar"

echo "🔵 Downloading artifact: $ARTIFACT_NAME"
gh run download --name "$ARTIFACT_NAME"

echo "🔵 Artifact downloaded: $ARTIFACT_FILE"

echo "🔵 Loading Docker image..."
docker load -i "$ARTIFACT_FILE"

echo "🔵 Running container on port 5000..."
docker run -p 5000:5000 sentiment-analysis-app:ci