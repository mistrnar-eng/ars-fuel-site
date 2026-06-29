const fs = require('fs');
const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const http = require('http');
const WebSocket = require('ws');

const STATE_FILE = path.join(__dirname, 'server_state.json');
let wss;

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch (e) {
    return { subscribers: [], offset: 0 };
  }
}

function saveState(s) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2), 'utf8');
  if (wss) broadcastStateUpdate();
}

function getStationState() {
  return state.station || {
    name: 'АРС',
    open: true,
    reason: 'Всі колонки працюють. Очікуйте мінімальний час обслуговування.',
    prices: { a95: 54.2, diesel: 49.6, gas: 28.5 },
    messages: { all: 'Приємної дороги та безпечного заправлення.' },
    readiness: 98,
    phone: '+38 (099) 123-45-67',
    hours: 'Пн-Нд 24/7',
  };
}

const state = loadState();
state.station = state.station || getStationState();
state.subscribers = state.subscribers || [];

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || (fs.existsSync(path.join(__dirname, 'telegram_token.txt')) ? fs.readFileSync(path.join(__dirname, 'telegram_token.txt'),'utf8').trim() : null);
if (!TELEGRAM_TOKEN) console.warn('No TELEGRAM_TOKEN set; bot will not start until token provided as env or telegram_token.txt');

const TELEGRAM_API = (method) => `https://api.telegram.org/bot${TELEGRAM_TOKEN}/${method}`;

async function telegramApi(method, params = {}) {
  if (!TELEGRAM_TOKEN) throw new Error('No token');
  const url = TELEGRAM_API(method);
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

async function handleUpdate(u) {
  try {
    if (u.message) {
      const m = u.message;
      const chat = m.chat.id;
      if (m.text === '/start') {
        // add subscriber if not present
        let sub = state.subscribers.find(s => String(s.chat_id) === String(chat));
        if (!sub) {
          sub = { chat_id: chat, name: m.from.username || (m.from.first_name || 'user'), topics: [], isAdmin: false };
          state.subscribers.push(sub);
          saveState(state);
        }
        // send greeting with 3-col keyboard and settings
        const buttons = [
          [{ text: 'Стан', callback_data: '/status' }, { text: 'Ціни', callback_data: '/prices' }, { text: 'Графік', callback_data: '/hours' }],
        ];
        buttons.push([{ text: '⚙️ Налаштування', callback_data: '/settings' }]);
        if (sub.isAdmin) buttons.push([{ text: '🔐 Адмін меню', callback_data: '/admin' }]);
        await telegramApi('sendMessage', { chat_id: chat, text: '<b>👋 Привіт!</b> Я бот АРС.', parse_mode: 'HTML', reply_markup: { inline_keyboard: buttons } });
      }
      // simple command handlers
      if (m.text && m.text.trim() === '/status') {
        const text = generateTelegramResponseForCommand('status');
        await telegramApi('sendMessage', { chat_id: chat, text });
      }
      if (m.text && m.text.trim() === '/prices') {
        const text = generateTelegramResponseForCommand('prices');
        await telegramApi('sendMessage', { chat_id: chat, text });
      }
      if (m.text && m.text.trim() === '/subscribe') {
        if (!state.subscribers) state.subscribers = [];
        if (!state.subscribers.find((s) => String(s.chat_id) === String(chat))) {
          state.subscribers.push({ chat_id: chat, name: m.from?.username || m.from?.first_name, topics: [] });
          saveState(state);
        }
        await telegramApi('sendMessage', { chat_id: chat, text: 'Ви підписані на розсилки.' });
      }
      if (m.text && m.text.trim() === '/unsubscribe') {
        state.subscribers = (state.subscribers || []).filter((s) => String(s.chat_id) !== String(chat));
        saveState(state);
        await telegramApi('sendMessage', { chat_id: chat, text: 'Ви відписані від розсилок.' });
      }
    }

    if (u.callback_query) {
      const cb = u.callback_query;
      const data = cb.data;
      const from = cb.from;
      const chat = cb.message?.chat?.id || from.id;

      // settings menu
      if (data === '/settings') {
        const topics = ['status','prices','announcement','readiness','contact','hours'];
        const kb = [];
        for (let i=0;i<topics.length;i+=2) kb.push([{ text: topics[i], callback_data: '/topic_'+topics[i] }, topics[i+1] ? { text: topics[i+1], callback_data: '/topic_'+topics[i+1] } : null].filter(Boolean));
        kb.push([{ text: '⬅️ Назад', callback_data: '/back' }]);
        try { await telegramApi('deleteMessage', { chat_id: chat, message_id: cb.message.message_id }); } catch (e) {}
        await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
        await telegramApi('sendMessage', { chat_id: chat, text: 'Налаштування — оберіть теми', reply_markup: { inline_keyboard: kb } });
        return;
      }

      if (data && data.startsWith('/topic_')) {
        const topic = data.replace('/topic_','');
        let sub = state.subscribers.find(s => String(s.chat_id) === String(chat));
        if (!sub) { sub = { chat_id: chat, name: from.username || from.first_name, topics: [], isAdmin: false }; state.subscribers.push(sub); }
        const has = sub.topics.includes(topic);
        if (has) sub.topics = sub.topics.filter(t=>t!==topic); else sub.topics.push(topic);
        saveState(state);
        await telegramApi('answerCallbackQuery', { callback_query_id: cb.id, text: has ? 'Відписано' : 'Підписано' });
        return;
      }

      if (data === '/status' || data === '/prices' || data === '/hours' || data === '/readiness' || data === '/contact') {
        try { await telegramApi('deleteMessage', { chat_id: chat, message_id: cb.message.message_id }); } catch(e){}
        await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
        const respText = generateTelegramResponseForCommand(data.replace('/',''));
        await telegramApi('sendMessage', { chat_id: chat, text: respText, parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: '⬅️ Назад', callback_data: '/back' }]] } });
        return;
      }

      // fallback for other callbacks: echo intent
      if (data) {
        try { await telegramApi('deleteMessage', { chat_id: chat, message_id: cb.message.message_id }); } catch(e){}
        await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
        const respText = generateTelegramResponseForCommand(data.replace('/',''));
        await telegramApi('sendMessage', { chat_id: chat, text: respText, parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: '⬅️ Назад', callback_data: '/back' }]] } });
        return;
      }

      if (data === '/back') {
        try { await telegramApi('deleteMessage', { chat_id: chat, message_id: cb.message.message_id }); } catch(e){}
        await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
        // send greeting with keyboard
        const st = state.station || {};
        const buttons = [
          [{ text: 'Стан', callback_data: '/status' }, { text: 'Ціни', callback_data: '/prices' }, { text: 'Графік', callback_data: '/hours' }],
        ];
        buttons.push([{ text: '⚙️ Налаштування', callback_data: '/settings' }]);
        const text = `<b>👋 Привіт!</b> Я бот АРС.`;
        await telegramApi('sendMessage', { chat_id: chat, text, parse_mode: 'HTML', reply_markup: { inline_keyboard: buttons } });
        return;
      }
      
      // admin menu
      if (data === '/admin') {
        const sub = state.subscribers.find(s => String(s.chat_id) === String(chat));
        if (!sub || !sub.isAdmin) {
          await telegramApi('answerCallbackQuery', { callback_query_id: cb.id, text: 'Немає доступу', show_alert: true });
          return;
        }
        try { await telegramApi('deleteMessage', { chat_id: chat, message_id: cb.message.message_id }); } catch(e){}
        const adminKb = [
          [{ text: '🔁 Статус → розсилка', callback_data: '/admin_broadcast_status' }, { text: '💰 Ціни → розсилка', callback_data: '/admin_broadcast_prices' }],
          [{ text: '📢 Оголошення → розсилка', callback_data: '/admin_broadcast_announcement' }],
          [{ text: '⬅️ Назад', callback_data: '/back' }]
        ];
        await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
        await telegramApi('sendMessage', { chat_id: chat, text: 'Адмін меню', reply_markup: { inline_keyboard: adminKb } });
        return;
      }

      // admin actions
      if (data === '/admin_broadcast_prices' || data === '/admin_broadcast_announcement' || data === '/admin_broadcast_status') {
        const sub = state.subscribers.find(s => String(s.chat_id) === String(chat));
        if (!sub || !sub.isAdmin) { await telegramApi('answerCallbackQuery', { callback_query_id: cb.id, text:'Немає доступу', show_alert:true }); return; }
        await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
        const topic = data.includes('prices') ? 'prices' : data.includes('announcement') ? 'announcement' : 'status';
        broadcastToSubscribers(topic);
        try { await telegramApi('deleteMessage', { chat_id: chat, message_id: cb.message.message_id }); } catch(e){}
        await telegramApi('sendMessage', { chat_id: chat, text: `Розсилка ${topic} розпочата`, reply_markup: { inline_keyboard: [[{ text: '⬅️ Назад', callback_data: '/admin' }]] } });
        return;
      }
    }
  } catch (e) { console.warn('handleUpdate error', e); }
}

async function pollLoop() {
  if (!TELEGRAM_TOKEN) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${state.offset || 0}&timeout=10`);
    const json = await res.json();
    if (json && json.result && json.result.length) {
      for (const u of json.result) {
        state.offset = (u.update_id + 1);
        handleUpdate(u);
      }
      saveState(state);
    }
  } catch (e) { console.warn('poll error', e); }
}

async function broadcastToSubscribers(topic) {
  const text = buildBroadcastText(topic);
  const subs = state.subscribers || [];
  const targets = subs.filter(s => Array.isArray(s.topics) && s.topics.includes(topic));
  for (const s of targets) {
    try { await telegramApi('sendMessage', { chat_id: s.chat_id, text }); } catch (e) { console.warn('broadcast fail', e); }
  }
}

function buildBroadcastText(topic) {
  const st = getStationState();
  if (topic === 'status') return `${st.name}: ${st.open ? 'Відкрито' : 'Зачинено'} ${st.reason ? '— ' + st.reason : ''}`;
  if (topic === 'prices') return `Ціни: А95 ${Number(st.prices.a95).toFixed(2)} грн/л, ДП ${Number(st.prices.diesel).toFixed(2)} грн/л, Газ ${Number(st.prices.gas).toFixed(2)} грн/м³`;
  if (topic === 'announcement') return `Оголошення: ${st.messages.all || ''}`;
  if (topic === 'readiness') return `Рівень готовності: ${st.readiness}%`;
  return `Оновлення: ${topic}`;
}

// start polling interval
setInterval(pollLoop, 3000);

// Express server
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/health', (req,res)=> res.json({ ok: true }));

app.get('/subscribers', (req,res)=> res.json({ subscribers: state.subscribers }));

app.get('/state', (req,res)=> res.json({ state: state.station || getStationState() }));
app.post('/state', (req,res)=>{
  const newStation = req.body || {};
  const oldStation = state.station || {};
  state.station = { ...oldStation, ...newStation };
  saveState(state);

  try {
    if (JSON.stringify(oldStation.prices || {}) !== JSON.stringify(state.station.prices || {})) {
      console.log('Prices changed on server — broadcasting prices');
      broadcastToSubscribers('prices');
    }
    if ((oldStation.open !== state.station.open) && typeof state.station.open !== 'undefined') {
      console.log('Status changed on server — broadcasting status');
      broadcastToSubscribers('status');
    }
    if ((oldStation.messages || {}).all !== (state.station.messages || {}).all) {
      console.log('Announcement changed on server — broadcasting announcement');
      broadcastToSubscribers('announcement');
    }
  } catch (e) { console.warn('Broadcast on state change failed', e); }

  res.json({ ok: true });
});

app.post('/promote', (req,res)=>{
  const { chat_id } = req.body;
  const sub = state.subscribers.find(s=>String(s.chat_id)===String(chat_id));
  if (!sub) return res.status(404).json({ error: 'not found' });
  sub.isAdmin = !sub.isAdmin; saveState(state);
  res.json({ ok: true, isAdmin: sub.isAdmin });
});

app.post('/remove_subscriber', (req,res) => {
  const { chat_id } = req.body;
  const before = (state.subscribers || []).length;
  state.subscribers = (state.subscribers || []).filter(s => String(s.chat_id) !== String(chat_id));
  saveState(state);
  res.json({ ok: true, removed: before - state.subscribers.length });
});

app.post('/broadcast', async (req,res)=>{
  const topic = req.body && req.body.topic;
  if (!topic) return res.status(400).json({ error: 'topic required' });
  broadcastToSubscribers(topic);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'state', payload: { state: state.station || getStationState(), subscribers: state.subscribers || [] } }));
});

function broadcastStateUpdate() {
  if (!wss) return;
  const payload = JSON.stringify({ type: 'state', payload: { state: state.station || getStationState(), subscribers: state.subscribers || [] } });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

server.listen(PORT, ()=> console.log('Server running on', PORT));
console.log('Server setup complete');
