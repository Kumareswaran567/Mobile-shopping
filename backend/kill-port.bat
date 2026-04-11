@echo off
echo ========================================
echo Killing process on port 4000
echo ========================================
echo.

echo Finding process on port 4000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4000 ^| findstr LISTENING') do (
    echo Killing process ID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if errorlevel 1 (
        echo Could not kill process %%a (might need admin rights)
    ) else (
        echo Process %%a killed successfully
    )
)

echo.
echo Port 4000 should now be free.
echo.
pause
