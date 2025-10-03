#!/bin/bash

# Judges Management System - Stop Local Development Services

echo "🛑 Stopping Judges Management System..."

# Kill processes by PID if files exist
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo "✅ Backend stopped (PID: $BACKEND_PID)"
    fi
    rm -f .backend.pid
fi

if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo "✅ Frontend stopped (PID: $FRONTEND_PID)"
    fi
    rm -f .frontend.pid
fi

# Fallback: kill by process name
pkill -f "spring-boot:run"
pkill -f "ng serve"

# Clean up log files
rm -f backend.log frontend.log

echo "✅ All services stopped"