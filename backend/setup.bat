@echo off
echo ========================================
echo MobileHub Backend Setup
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed. Make sure Node.js is installed.
    pause
    exit /b 1
)

echo.
echo Step 2: Setting up database tables...
call npm run setup-db
if errorlevel 1 (
    echo ERROR: Database setup failed. Check your PostgreSQL connection in .env file.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure PostgreSQL is running
echo 2. Update backend\.env with your PostgreSQL password
echo 3. Run: npm run dev
echo.
pause
