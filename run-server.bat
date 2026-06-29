@echo off
cd /d "%~dp0"
echo Starting ARS Fuel server in background...
start "ARS Fuel Server" /min cmd /c "node server.js > server.log 2>&1"
echo Server started (check server.log)
