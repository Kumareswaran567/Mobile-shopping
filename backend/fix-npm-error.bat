@echo off
echo ========================================
echo Fixing npm Error - Canceled
echo ========================================
echo.

echo Step 1: Cleaning npm cache...
call npm cache clean --force
if errorlevel 1 (
    echo Warning: Cache clean had issues, continuing...
)
echo.

echo Step 2: Removing node_modules and package-lock.json...
if exist node_modules (
    echo Removing node_modules folder...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Removing package-lock.json...
    del /f /q package-lock.json
)
echo.

echo Step 3: Installing dependencies with verbose output...
echo This may take a few minutes...
echo.
call npm install --verbose
if errorlevel 1 (
    echo.
    echo ========================================
    echo Installation failed!
    echo ========================================
    echo.
    echo Try these solutions:
    echo 1. Run as Administrator
    echo 2. Check your internet connection
    echo 3. Disable antivirus temporarily
    echo 4. Try: npm install --legacy-peer-deps
    pause
    exit /b 1
)

echo.
echo ========================================
echo Success! Dependencies installed.
echo ========================================
echo.
pause
