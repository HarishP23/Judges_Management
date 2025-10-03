# Running Judges Management System on Localhost

This is a full-stack application with a Spring Boot backend and Angular frontend. Follow these steps to run it locally.

## Quick Start (Recommended)

### Prerequisites
- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 16+** and **npm**
- **Docker** (for database)

### 1. Start Database
```bash
# Using Docker Compose (recommended)
docker-compose up -d postgres

# Or using Docker directly
docker run --name judges-postgres \
  -e POSTGRES_DB=judges_management_local \
  -e POSTGRES_USER=judges_user \
  -e POSTGRES_PASSWORD=local_password \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Start Application
```bash
# Run the automated startup script
./start-local.sh
```

### 3. Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080

### 4. Stop Application
```bash
# Stop all services
./stop-local.sh

# Stop database
docker-compose down
```

## Manual Setup (Alternative)

### Step 1: Database Setup

#### Option A: Docker PostgreSQL (Recommended)
```bash
docker-compose up -d postgres
```

#### Option B: Local PostgreSQL Installation
1. Install PostgreSQL on your system
2. Create a database and user:
```sql
CREATE DATABASE judges_management_local;
CREATE USER judges_user WITH PASSWORD 'local_password';
GRANT ALL PRIVILEGES ON DATABASE judges_management_local TO judges_user;
```

### Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the backend with local profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

The backend will start on `http://localhost:8080`

### Step 3: Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:4200`

## Access Points

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **API Endpoints**: http://localhost:8080/api/judges

## Development Notes

- The frontend is configured to proxy API calls to the backend during development
- Hot reload is enabled for both frontend and backend development
- The application uses Bootstrap for styling
- CORS is configured to allow frontend-backend communication

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running on port 5432
- Check database credentials in application-local.properties
- Verify the database exists and user has proper permissions

### Port Conflicts
- Backend default port: 8080 (can be changed in application-local.properties)
- Frontend default port: 4200 (can be changed in angular.json)

### Build Issues
- Ensure Java 17+ is installed and JAVA_HOME is set
- Clear Maven cache: `mvn clean`
- Clear npm cache: `npm cache clean --force`