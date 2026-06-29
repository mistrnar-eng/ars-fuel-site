@echo off
cd /d "%~dp0"
echo.
echo 🚀 Запускаємо АРС Заправку...
echo.
echo 📱 Відкриваємо у браузері: http://localhost:8000
echo.
echo Натисніть Ctrl+C для зупинення сервера
echo.

python -m http.server 8000

if %errorlevel% neq 0 (
    echo.
    echo ❌ Помилка: Python не встановлений!
    echo Встановіть Python з https://www.python.org
    pause
)
