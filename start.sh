#!/bin/bash

# Futuristic Kanban Board - Start Script
echo "🚀 Starting Futuristic Kanban Board..."

# Start backend server
echo "📡 Starting backend server on port 3001..."
(cd backend && npm start) &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend development server
echo "🎨 Starting frontend development server on port 3000..."
(cd frontend && npm start) &
FRONTEND_PID=$!

echo "✅ Both servers are starting up!"
echo "🔗 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:3001/api"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to press Ctrl+C
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
