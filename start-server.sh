#!/bin/bash
cd "$(dirname "$0")"
echo ""
echo "🚀 Запускаємо АРС Заправку..."
echo ""
echo "📱 Відкриваємо у браузері: http://localhost:8000"
echo ""
echo "Натисніть Ctrl+C для зупинення сервера"
echo ""

python3 -m http.server 8000
