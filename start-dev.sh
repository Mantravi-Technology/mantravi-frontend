#!/bin/bash

# Mantravi Development Server Startup Script

echo "🚀 Starting Mantravi Development Server..."
echo ""

# Kill any existing Node.js servers on port 5503
echo "🔍 Checking for existing servers..."
lsof -ti:5503 | xargs kill -9 2>/dev/null && echo "✅ Stopped existing server" || echo "ℹ️  No existing server found"

# Wait a moment
sleep 1

# Start the server
echo "📦 Starting Node.js server on port 5503..."
echo ""
node server.js

