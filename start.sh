#!/bin/bash

# Team Task Manager - Quick Start Script
# This script starts both backend and frontend servers

echo "🚀 Team Task Manager - Quick Start"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Check if MongoDB URI is set
if [ -z "$MONGODB_URI" ]; then
    echo "⚠️  MONGODB_URI environment variable not set"
    echo "   Backend will run in graceful degradation mode"
    echo "   Set MONGODB_URI in backend/.env to enable database"
    echo ""
fi

# Start backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
    echo ""
fi

# Start backend in background
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo "   Running on: http://localhost:5000"
echo ""

# Wait a moment for backend to start
sleep 3

# Go back to root
cd ..

# Start frontend
echo -e "${BLUE}Starting Frontend Server...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    echo ""
fi

# Start frontend in background
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "   Running on: http://localhost:5173"
echo ""

# Display information
echo "=================================="
echo -e "${GREEN}🎉 Both servers started!${NC}"
echo "=================================="
echo ""
echo "📌 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   API:      http://localhost:5000/api"
echo ""
echo "📝 Commands:"
echo "   View logs: npm run logs"
echo "   Stop all: pkill -f 'npm run dev'"
echo "   Backend logs: tail -f backend/logs/server.log"
echo "   Frontend logs: Press Ctrl+C in this window"
echo ""
echo "💾 Press Ctrl+C to stop all servers"
echo ""

# Wait for Ctrl+C
wait
