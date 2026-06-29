@echo off
cd /d "%~dp0"
echo.
echo 🚀 Запускаємо АРС Заправку...
echo.
echo 📱 Відкриваємо у браузері: http://localhost:3000
echo.
echo Натисніть Ctrl+C для зупинення сервера
echo.

where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo 🟢 Node found — starting server.js (port 3000)
    npm install --no-audit --no-fund >nul 2>&1
    node server.js
) else (
    echo ⚠️ Node not found — falling back to Python static server on port 8000
    python -m http.server 8000
)

if %errorlevel% neq 0 (
    echo.
    echo ❌ Помилка: Python не встановлений!
    echo Встановіть Python з https://www.python.org
    pause
)
