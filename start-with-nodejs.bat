@echo off
cd /d "%~dp0"
echo.
echo 🚀 Запускаємо АРС Заправку через Node.js...
echo.

node server.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ Помилка: Node.js не встановлений!
    echo Встановіть Node.js з https://nodejs.org
    echo.
    echo 💡 Альтернатива - використовуйте start-server.bat
    pause
)
