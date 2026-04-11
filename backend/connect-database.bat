@echo off
echo ========================================
echo Database Connection Setup
echo ========================================
echo.

echo Step 1: Testing database connection...
call npm run test-db
if errorlevel 1 (
    echo.
    echo ========================================
    echo Connection test failed!
    echo ========================================
    echo.
    echo Please check:
    echo 1. PostgreSQL is installed and running
    echo 2. Database 'mobilehub_db' exists
    echo 3. Password in .env file is correct
    echo.
    pause
    exit /b 1
)

echo.
echo Step 2: Setting up database tables...
call npm run setup-db
if errorlevel 1 (
    echo.
    echo ========================================
    echo Database setup failed!
    echo ========================================
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Database Connected Successfully!
echo ========================================
echo.
echo Next step: Start the server
echo   npm run dev
echo.
pause
