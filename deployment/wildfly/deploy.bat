@echo off
REM Deploy Script for Judges Management System on WildFly (Windows)
REM This script builds and deploys both frontend and backend as a single WAR file

setlocal enabledelayedexpansion

echo Starting deployment process for Judges Management System...

REM Configuration
set PROJECT_ROOT=%CD%\..\..\
set FRONTEND_DIR=%PROJECT_ROOT%frontend
set BACKEND_DIR=%PROJECT_ROOT%backend

REM Check if WildFly is installed
if "%WILDFLY_HOME%"=="" (
    echo ERROR: WILDFLY_HOME environment variable is not set.
    echo Please set WILDFLY_HOME to your WildFly installation directory.
    echo Example: set WILDFLY_HOME=C:\wildfly
    pause
    exit /b 1
)

if not exist "%WILDFLY_HOME%" (
    echo ERROR: WildFly directory not found at: %WILDFLY_HOME%
    pause
    exit /b 1
)

echo WildFly found at: %WILDFLY_HOME%

REM Step 1: Build Frontend
echo.
echo Building Angular Frontend...
cd /d "%FRONTEND_DIR%"

if not exist "package.json" (
    echo ERROR: package.json not found in frontend directory
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
)

REM Build frontend for production
echo Building frontend for production...
call npx ng build --configuration production

if not exist "dist\judges-management-frontend" (
    echo ERROR: Frontend build failed - dist directory not found
    pause
    exit /b 1
)

echo Frontend build completed successfully

REM Step 2: Build Backend with Frontend
echo.
echo Building Spring Boot Backend with embedded Frontend...
cd /d "%BACKEND_DIR%"

if not exist "pom.xml" (
    echo ERROR: pom.xml not found in backend directory
    pause
    exit /b 1
)

REM Clean and build the project
echo Cleaning previous builds...
call mvn clean

echo Building WAR file with embedded frontend...
call mvn package -DskipTests

set WAR_FILE=%BACKEND_DIR%\target\judges.war
if not exist "%WAR_FILE%" (
    echo ERROR: WAR file not found at: %WAR_FILE%
    pause
    exit /b 1
)

echo WAR file built successfully: %WAR_FILE%

REM Step 3: Deploy to WildFly
echo.
echo Deploying to WildFly...

set WILDFLY_DEPLOYMENTS=%WILDFLY_HOME%\standalone\deployments

REM Check if WildFly deployments directory exists
if not exist "%WILDFLY_DEPLOYMENTS%" (
    echo ERROR: WildFly deployments directory not found: %WILDFLY_DEPLOYMENTS%
    pause
    exit /b 1
)

REM Remove existing deployment if it exists
if exist "%WILDFLY_DEPLOYMENTS%\judges.war" (
    echo Removing existing deployment...
    del /f "%WILDFLY_DEPLOYMENTS%\judges.war"
    if exist "%WILDFLY_DEPLOYMENTS%\judges.war.deployed" del /f "%WILDFLY_DEPLOYMENTS%\judges.war.deployed"
    if exist "%WILDFLY_DEPLOYMENTS%\judges.war.failed" del /f "%WILDFLY_DEPLOYMENTS%\judges.war.failed"
)

REM Copy new WAR file
echo Copying WAR file to WildFly deployments...
copy "%WAR_FILE%" "%WILDFLY_DEPLOYMENTS%\"

REM Wait for deployment
echo.
echo Waiting for deployment to complete...
set TIMEOUT=60
set COUNTER=0

:wait_loop
if %COUNTER% geq %TIMEOUT% goto timeout
if exist "%WILDFLY_DEPLOYMENTS%\judges.war.deployed" goto deployed
if exist "%WILDFLY_DEPLOYMENTS%\judges.war.failed" goto failed

timeout /t 1 /nobreak >nul
set /a COUNTER+=1
echo .
goto wait_loop

:deployed
echo Deployment successful!
goto end

:failed
echo ERROR: Deployment failed!
echo Check WildFly logs for details: %WILDFLY_HOME%\standalone\log\server.log
pause
exit /b 1

:timeout
echo WARNING: Deployment status unknown after %TIMEOUT% seconds
echo Check WildFly admin console or logs for status

:end
echo.
echo Deployment process completed!
echo.
echo Deployment Information:
echo    Application URL: http://localhost:8080/judges/
echo    API Base URL: http://localhost:8080/judges/api/judges
echo    WildFly Admin Console: http://localhost:9990/
echo.
echo Notes:
echo    The frontend is served from the root context (/judges/)
echo    API endpoints are available at /judges/api/*
echo    Make sure your database is running and accessible
echo    Check WildFly logs if you encounter issues: %WILDFLY_HOME%\standalone\log\server.log
echo.
echo Happy coding!
pause