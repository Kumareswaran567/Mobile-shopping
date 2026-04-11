@echo off
echo ========================================
echo MobileHub - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then restart this script.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found
node --version
echo.

REM Check if npm packages are installed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
    echo.
) else (
    echo [OK] Dependencies already installed
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env >nul
    echo [OK] .env file created
    echo.
    echo [IMPORTANT] Please edit .env and set your PostgreSQL password!
    echo.
    pause
)

REM Setup database and start server
echo Setting up database connection and starting server...
echo.
call npm run connect

pause
