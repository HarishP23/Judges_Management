#!/bin/bash

# Quick build script - builds the integrated WAR without deploying
# Useful for testing the build process

set -e

PROJECT_ROOT="/workspace"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"

echo "🏗️ Quick Build - Judges Management System"
echo "==========================================="

# Build Frontend
echo "📦 Building Angular Frontend..."
cd "$FRONTEND_DIR"
npx ng build --configuration production
echo "✅ Frontend build completed"

# Build Backend with Frontend
echo "🔧 Building Spring Boot Backend with embedded Frontend..."
cd "$BACKEND_DIR"
mvn clean package -DskipTests
echo "✅ Backend build completed"

# Show result
WAR_FILE="$BACKEND_DIR/target/judges.war"
if [ -f "$WAR_FILE" ]; then
    echo "🎉 Build successful!"
    echo "📁 WAR file location: $WAR_FILE"
    echo "📊 WAR file size: $(du -h "$WAR_FILE" | cut -f1)"
    echo ""
    echo "Next steps:"
    echo "1. Set WILDFLY_HOME environment variable"
    echo "2. Run: ./deployment/wildfly/deploy.sh"
    echo "3. Access app at: http://localhost:8080/judges/"
else
    echo "❌ Build failed - WAR file not found"
    exit 1
fi