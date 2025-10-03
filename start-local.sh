#!/bin/bash

# Judges Management System - Local Development Startup Script

echo "🚀 Starting Judges Management System locally..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "❌ PostgreSQL is not running on localhost:5432"
    echo "Please start PostgreSQL or run the Docker command from LOCALHOST_SETUP.md"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
if ! command_exists java; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

if ! command_exists mvn; then
    echo "❌ Maven is not installed. Please install Maven 3.6 or higher."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ All prerequisites are installed"

# Start backend in background
echo "🔧 Starting Spring Boot backend..."
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 5

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Start frontend
echo "🎨 Starting Angular frontend..."
cd frontend
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Application is starting up!"
echo ""
echo "📍 URLs:"
echo "   Frontend: http://localhost:4200"
echo "   Backend:  http://localhost:8080"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop the application:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   Or use Ctrl+C if running in foreground"

# Save PIDs for cleanup script
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

echo ""
echo "⏳ Waiting for services to be ready..."
echo "   This may take 30-60 seconds..."

# Wait for user input to stop
echo ""
echo "Press Enter to stop all services..."
read

# Cleanup
echo "🛑 Stopping services..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
rm -f .backend.pid .frontend.pid
echo "✅ Services stopped"