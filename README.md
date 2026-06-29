# ARS Fuel Site - Server

This repository contains the static site and a simple Node.js Express server which:

- Serves the static files (`index.html`, `script.js`, `styles.css`).
- Runs a long-running Telegram bot via server-side polling so it stays online when your computer is off.
- Exposes simple endpoints to list subscribers and trigger broadcasts.

Quick start (recommended on a VPS or cloud host):

1. Install Node.js (v16+).
2. Copy your Telegram bot token into `telegram_token.txt` in the project root, or set `TELEGRAM_TOKEN` as an environment variable.
3. Install deps and start:

```powershell
npm install
npm start
```

The app serves the site on port `3000` by default. Set `PORT` env var to change.

Endpoints:
- `GET /health` — health check.
- `GET /subscribers` — list subscribers known by server bot.
- `POST /broadcast` — JSON `{ "topic": "prices" }` to broadcast to subscribers of that topic.
- `POST /promote` — JSON `{ "chat_id": 123 }` toggle promote a subscriber.

Deployment tips:
- Use a process manager (PM2, systemd) to keep the server running and restart on crash.
- For HTTPS (recommended if exposing webhooks), use a reverse proxy like Nginx or a platform that provides HTTPS.
# 🚀 АРС — Сучасна Заправка

Модерний веб-сайт для управління заправною станцією з системою ролей, логіном та інтеграцією Telegram-бота.

## 📋 Вимоги

- **Windows**: Python 3.x (встановлено за замовчуванням на більшості ПК)
- **Mac/Linux**: Python 3.x або Node.js

## 🎯 Швидкий Старт

### Варіант 1: На Windows (Найпростіший)

1. **Подвійний клік** на файл `start-server.bat` в папці проекту
2. Браузер автоматично відкриється на: `http://localhost:8000`

### Варіант 2: Вручну через Командний рядок

```bash
cd C:\Users\mustr\ars-fuel-site
python -m http.server 8000
```

Потім откройте браузер: `http://localhost:8000`

### Варіант 3: На Mac/Linux

Запустіть файл `start-server.sh`:
```bash
chmod +x start-server.sh
./start-server.sh
```

## 👤 Облікові дані

| Роль | Логін | Пароль |
|------|-------|--------|
| 🔒 Адміністратор | `admin` | `0000` |
| 👨‍💼 Співробітник | `sub` | `1111` |

## 📱 Функціональність

### 🔑 Система логіну
- Безпечний вхід через кнопку "Увійти" у верхній панелі
- Модальне вікно для введення облікових даних
- Автоматичне збереження сесії

### 👨‍💼 Роль Адміністратора
✅ Змінювати номер телефону служби підтримки  
✅ Встановлювати рівень готовності (0-100%)  
✅ Керувати статусом заправки (Відкрита/Зачинена)  
✅ Встановлювати цілі ціни на паливо (А95, Дизель, Газ)  
✅ Редагувати кількість колонок (2-16)  
✅ Додавати токен Telegram-бота  
✅ Публікувати оголошення для всіх та персоналу  

### 👨 Роль Співробітника
✅ Переглядати стан заправки  
✅ Читати оголошення для персоналу  
✅ Бачити актуальні ціни та рівень готовності  

### 🤖 Telegram-Бот
- Введіть токен свого бота в адмін-панелі
- Синхронізуйте дані натиском на кнопку "Синхронізувати"
- Бот буде використовувати токен для надсилання сповіщень

## 💾 Збереження Даних

Усі зміни автоматично зберігаються в **localStorage** браузера. Дані зберігаються навіть після закриття сайту.

## 🎨 Дизайн

- 🌙 Темна тема з градієнтом
- 📱 Адаптивний для мобільних пристроїв  
- ⚡ Гладкі анімації і переходи
- 🎯 Інтуїтивний інтерфейс

## 📁 Структура Проекту

```
ars-fuel-site/
├── index.html           # Основна сторінка
├── script.js           # Логіка та обробка подій
├── styles.css          # Стилі та дизайн
├── start-server.bat    # Запуск сервера (Windows)
├── start-server.sh     # Запуск сервера (Mac/Linux)
└── README.md           # Цей файл
```

## 🔧 Технологічні Стеки

- **HTML5** - Семантична розмітка
- **CSS3** - Сучасні стилі, градієнти, анімації
- **JavaScript (Vanilla)** - Функціональність без фреймворків
- **localStorage** - Збереження даних в браузері

## 🚀 Поради

- 💡 Щоб припинити сервер: натисніть `Ctrl+C` в терміналі
- 📝 Всі дані зберігаються локально на вашому комп'ютері
- 🔐 Система логіну захищає адміністративну панель
- 🔄 Сторінка автоматично оновлює час кожну хвилину

## 📞 Контакти і Підтримка

Щоб змінити номер підтримки - увійдіть як адміністратор і відредагуйте номер в адмін-панелі.

---

**Розроблено для АРС Заправки** 🚗⛽
