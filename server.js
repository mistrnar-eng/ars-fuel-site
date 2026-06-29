const fs = require('fs');
const path = require('path');
const express = require('express');
const fetch = require('node-fetch');

const STATE_FILE = path.join(__dirname, 'server_state.json');

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch (e) {
    return { subscribers: [], offset: 0 };
  }
}

function saveState(s) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2), 'utf8');
}

const state = loadState();

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

      if (data === '/back') {
        try { await telegramApi('deleteMessage', { chat_id: chat, message_id: cb.message.message_id }); } catch(e){}
        await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
        await telegramApi('sendMessage', { chat_id: chat, text: '<b>👋 Привіт!</b> Я бот АРС.', parse_mode: 'HTML' });
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
  if (topic === 'status') return `Стан: ${process.env.STATION_STATUS || '---'}`;
  if (topic === 'prices') return `Ціни оновлені.`;
  if (topic === 'announcement') return `Оголошення: ${process.env.ANNOUNCEMENT || ''}`;
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

app.post('/promote', (req,res)=>{
  const { chat_id } = req.body;
  const sub = state.subscribers.find(s=>String(s.chat_id)===String(chat_id));
  if (!sub) return res.status(404).json({ error: 'not found' });
  sub.isAdmin = !sub.isAdmin; saveState(state);
  res.json({ ok: true, isAdmin: sub.isAdmin });
});

app.post('/broadcast', async (req,res)=>{
  const topic = req.body && req.body.topic;
  if (!topic) return res.status(400).json({ error: 'topic required' });
  broadcastToSubscribers(topic);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server running on', PORT));
console.log('Server setup complete');
