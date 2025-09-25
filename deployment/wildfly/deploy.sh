#!/bin/bash

# Deploy Script for Judges Management System on WildFly
# This script builds and deploys both frontend and backend as a single WAR file

set -e

echo "🚀 Starting deployment process for Judges Management System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/workspace"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"
WILDFLY_DEPLOYMENTS="${WILDFLY_HOME}/standalone/deployments"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if WildFly is installed
if [ -z "$WILDFLY_HOME" ]; then
    print_error "WILDFLY_HOME environment variable is not set."
    print_warning "Please set WILDFLY_HOME to your WildFly installation directory."
    echo "Example: export WILDFLY_HOME=/opt/wildfly"
    exit 1
fi

if [ ! -d "$WILDFLY_HOME" ]; then
    print_error "WildFly directory not found at: $WILDFLY_HOME"
    exit 1
fi

print_status "WildFly found at: $WILDFLY_HOME"

# Step 1: Build Frontend
echo
echo "📦 Building Angular Frontend..."
cd "$FRONTEND_DIR"

if [ ! -f "package.json" ]; then
    print_error "package.json not found in frontend directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing npm dependencies..."
    npm install
fi

# Build frontend for production
print_status "Building frontend for production..."
npx ng build --configuration production

if [ ! -d "dist/judges-management-frontend" ]; then
    print_error "Frontend build failed - dist directory not found"
    exit 1
fi

print_status "Frontend build completed successfully"

# Step 2: Build Backend with Frontend
echo
echo "🏗️ Building Spring Boot Backend with embedded Frontend..."
cd "$BACKEND_DIR"

if [ ! -f "pom.xml" ]; then
    print_error "pom.xml not found in backend directory"
    exit 1
fi

# Clean and build the project
print_status "Cleaning previous builds..."
mvn clean

print_status "Building WAR file with embedded frontend..."
mvn package -DskipTests

WAR_FILE="$BACKEND_DIR/target/judges.war"
if [ ! -f "$WAR_FILE" ]; then
    print_error "WAR file not found at: $WAR_FILE"
    exit 1
fi

print_status "WAR file built successfully: $WAR_FILE"

# Step 3: Deploy to WildFly
echo
echo "🚀 Deploying to WildFly..."

# Check if WildFly deployments directory exists
if [ ! -d "$WILDFLY_DEPLOYMENTS" ]; then
    print_error "WildFly deployments directory not found: $WILDFLY_DEPLOYMENTS"
    exit 1
fi

# Remove existing deployment if it exists
if [ -f "$WILDFLY_DEPLOYMENTS/judges.war" ]; then
    print_status "Removing existing deployment..."
    rm -f "$WILDFLY_DEPLOYMENTS/judges.war"
    rm -f "$WILDFLY_DEPLOYMENTS/judges.war.deployed"
    rm -f "$WILDFLY_DEPLOYMENTS/judges.war.failed"
fi

# Copy new WAR file
print_status "Copying WAR file to WildFly deployments..."
cp "$WAR_FILE" "$WILDFLY_DEPLOYMENTS/"

# Wait for deployment
echo
echo "⏳ Waiting for deployment to complete..."
TIMEOUT=60
COUNTER=0

while [ $COUNTER -lt $TIMEOUT ]; do
    if [ -f "$WILDFLY_DEPLOYMENTS/judges.war.deployed" ]; then
        print_status "Deployment successful!"
        break
    elif [ -f "$WILDFLY_DEPLOYMENTS/judges.war.failed" ]; then
        print_error "Deployment failed!"
        echo "Check WildFly logs for details: $WILDFLY_HOME/standalone/log/server.log"
        exit 1
    fi
    
    sleep 1
    COUNTER=$((COUNTER + 1))
    echo -n "."
done

if [ $COUNTER -eq $TIMEOUT ]; then
    print_warning "Deployment status unknown after $TIMEOUT seconds"
    print_warning "Check WildFly admin console or logs for status"
fi

echo
echo "🎉 Deployment process completed!"
echo
echo "📋 Deployment Information:"
echo "   • Application URL: http://localhost:8080/judges/"
echo "   • API Base URL: http://localhost:8080/judges/api/judges"
echo "   • WildFly Admin Console: http://localhost:9990/"
echo
echo "📝 Notes:"
echo "   • The frontend is served from the root context (/judges/)"
echo "   • API endpoints are available at /judges/api/*"
echo "   • Make sure your database is running and accessible"
echo "   • Check WildFly logs if you encounter issues: $WILDFLY_HOME/standalone/log/server.log"
echo
print_status "Happy coding! 🚀"