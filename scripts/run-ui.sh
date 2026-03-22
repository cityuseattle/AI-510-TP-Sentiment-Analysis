#!/usr/bin/env bash
set -e

# Always run from repo root
cd "$(dirname "$0")/.."

echo "🔵 Starting backend using run_from_artifact.sh..."
./scripts/run_from_artifact.sh

API_URL="https://${CODESPACE_NAME}-5000.preview.app.github.dev"
echo "Backend URL: $API_URL"

echo "🔵 Injecting backend URL into UI..."
echo "window.API_BASE = '$API_URL';" > ui/config.js

echo "Starting UI server on port 3000..."
cd ui
python3 -m http.server 3000