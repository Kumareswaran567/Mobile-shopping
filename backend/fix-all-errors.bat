@echo off
echo ========================================
echo Fixing All Errors
echo ========================================
echo.

echo Step 1: Killing process on port 4000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4000 ^| findstr LISTENING') do (
    echo Killing process ID: %%a
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 >nul
echo Port 4000 cleared.
echo.

echo Step 2: Fixing database structure...
call npm run fix-db
if errorlevel 1 (
    echo.
    echo Database fix failed!
    echo Check PostgreSQL is running and credentials are correct.
    pause
    exit /b 1
)
echo.

echo Step 3: Testing database connection...
call npm run test-db
if errorlevel 1 (
    echo.
    echo Database test failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo All errors fixed!
echo ========================================
echo.
echo Now you can start the server:
echo   npm run dev
echo.
pause
