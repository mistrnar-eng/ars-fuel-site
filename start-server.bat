@echo off
REM All-in-one setup and runner for ARS Fuel server
REM Usage: start-server.bat [TELEGRAM_TOKEN]
cd /d "%~dp0"
echo.
echo 🚀 ARS Fuel - all-in-one setup and runner
echo.
if "%~1" neq "" (
    echo Saving provided token to telegram_token.txt
    (echo %~1) > telegram_token.txt
)

echo Checking for Node.js in PATH...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Node.js not found in PATH. Install Node.js v16+ and re-run this script.
    pause
    exit /b 1
)

echo Installing npm dependencies (may take a moment)...
npm install --no-audit --no-fund

REM ensure server_state.json exists
if not exist server_state.json (
    echo {"subscribers": [], "offset": 0} > server_state.json
)

REM Create Scheduled Task to run server on startup
set TASKNAME=ARS-Fuel-Server
echo Creating scheduled task "%TASKNAME%" to run at startup...
schtasks /Query /TN "%TASKNAME%" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Existing task found — deleting it first
    schtasks /Delete /TN "%TASKNAME%" /F >nul 2>&1
)

REM Build the command for the scheduled task
REM Create a small wrapper batch to start the server (avoids complex quoting issues)
set RUNBATCH=%~dp0run-node.bat
echo @echo off>"%RUNBATCH%"
echo cd /d "%%~dp0">>"%RUNBATCH%"
echo node server.js ^> server.log 2^>^&1>>"%RUNBATCH%"

REM Create the scheduled task with highest privileges pointing to the wrapper
schtasks /Create /SC ONSTART /RL HIGHEST /TN "%TASKNAME%" /TR ""%RUNBATCH%"" /F >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Scheduled task created: %TASKNAME%
) else (
    echo Failed to create scheduled task (you may need to run this script as Administrator)
)

REM Ask whether to show logs in this terminal or start minimized
set /p SHOWLOGS=Would you like to show server logs in this terminal now? (Y/N): 
if /I "%SHOWLOGS%"=="Y" (
    echo Starting server in foreground (logs visible). Press Ctrl+C to stop.
    node server.js
) else (
    echo Starting server now (minimized)...
    start "ARS Fuel Server" /min "%RUNBATCH%"
    echo Server started in background. Check server.log for output.
)

echo The scheduled task will start the server automatically on next system boot.
echo.
pause

if %errorlevel% neq 0 (
    echo.
    echo ❌ Помилка: Python не встановлений!
    echo Встановіть Python з https://www.python.org
    pause
)
