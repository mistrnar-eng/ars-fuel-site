const STORAGE_KEY = 'ars-fuel-state';

const defaultState = {
  role: 'guest',
  stationOpen: true,
  stationName: 'АРС',
  reason: 'Всі колонки працюють. Очікуйте мінімальний час обслуговування.',
  pumps: 8,
  readinessLevel: 98,
  phoneNumber: '+38 (099) 123-45-67',
  additionalPhones: ['+38 (067) 555-88-99', '+38 (050) 123-45-67'],
  telegramToken: '',
  prices: {
    a95: 54.2,
    diesel: 49.6,
    gas: 28.5,
  },
  messages: {
    all: 'Приємної дороги та безпечного заправлення.',
    staff: 'Перевірте готовність колонок до ранкової зміни.',
  },
  paymentOptions: ['Готівка', 'Картка', 'Apple Pay'],
  fines: ['Штраф за куріння на АЗС — 100 грн', 'Штраф за паркування в забороненій зоні — 150 грн'],
  media: [
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
    },
  ],
  theme: 'dark',
  botButtons: [
    { label: 'Статус', command: '/status' },
    { label: 'Ціни', command: '/prices' },
    { label: 'Оголошення', command: '/announce' },
    { label: 'Час роботи', command: '/hours' },
    { label: 'Контакти', command: '/contact' },
    { label: 'Готовність', command: '/readiness' },
  ],
  visibleSections: {
    status: true,
    prices: true,
    payments: true,
    media: true,
    telegram: true,
    staffPanel: true,
  },
  adminAccount: { username: 'admin', password: '0000' },
  staffAccounts: [{ username: 'sub', password: '1111' }],
  onlineUsers: [
    { name: 'Адмін', role: 'admin' },
    { name: 'Олена', role: 'staff' },
  ],
  language: 'uk',
  notificationsEnabled: {
    telegramGreeting: true,
    statusChange: true,
    priceChange: true,
    announcement: true,
  },
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultState;
    const parsed = JSON.parse(saved);
    return {
      ...defaultState,
      ...parsed,
      prices: { ...defaultState.prices, ...(parsed.prices || {}) },
      messages: { ...defaultState.messages, ...(parsed.messages || {}) },
      additionalPhones: parsed.additionalPhones || defaultState.additionalPhones,
      paymentOptions: parsed.paymentOptions || defaultState.paymentOptions,
      fines: parsed.fines || defaultState.fines,
      media: parsed.media || defaultState.media,
      botButtons: parsed.botButtons || defaultState.botButtons,
      visibleSections: { ...defaultState.visibleSections, ...(parsed.visibleSections || {}) },
      adminAccount: parsed.adminAccount || defaultState.adminAccount,
      staffAccounts: parsed.staffAccounts || defaultState.staffAccounts,
      onlineUsers: parsed.onlineUsers || defaultState.onlineUsers,
      role: parsed.role || defaultState.role,
    };
  } catch (error) {
    console.warn('Не вдалося завантажити стан з localStorage', error);
    return defaultState;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatPrice(value) {
  return `${Number(value).toFixed(2)} грн`;
}

// Simple translations (minimal)
const translations = {
  uk: {
    loginButton: 'Увійти',
    profileButton: 'Профіль',
    logoutLinkButton: 'Вийти',
    addPhonePrompt: 'Введіть номер телефону',
    addStaffPrompt: 'Логін співробітника',
  },
  en: {
    loginButton: 'Login',
    profileButton: 'Profile',
    logoutLinkButton: 'Logout',
    addPhonePrompt: 'Enter phone number',
    addStaffPrompt: 'Staff username',
  },
};

function t(key) {
  const lang = state?.language || 'uk';
  return (translations[lang] && translations[lang][key]) || key;
}

let state = loadState();

// Modal elements
const loginModalBtn = document.getElementById('login-modal-btn');
const loginModal = document.getElementById('login-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalLoginInput = document.getElementById('modal-login-input');
const modalPasswordInput = document.getElementById('modal-password-input');
const modalLoginBtn = document.getElementById('modal-login-btn');
const modalError = document.getElementById('modal-error');

// Role display elements
const roleTitle = document.getElementById('role-title');
const roleDescription = document.getElementById('role-description');
const currentUserDisplay = document.getElementById('current-user');
const logoutLinkBtn = document.getElementById('logout-link-btn');

// Admin panel elements
const adminPanel = document.getElementById('admin-panel');
const logoutBtn = document.getElementById('logout-btn');
const phoneInput = document.getElementById('phone-input');
const readinessInput = document.getElementById('readiness-input');
const readinessDisplay = document.getElementById('readiness-display');
const telegramTokenInput = document.getElementById('telegram-token-input');
const statusSelect = document.getElementById('status-select');
const statusReason = document.getElementById('status-reason');
const pumpsInput = document.getElementById('pumps-input');
const pumpsValue = document.getElementById('pumps-value');
const a95Input = document.getElementById('price-a95-input');
const dieselInput = document.getElementById('price-diesel-input');
const gasInput = document.getElementById('price-gas-input');
const allMessageInput = document.getElementById('all-message-input');
const staffMessageInput = document.getElementById('staff-message-input');
const saveBtn = document.getElementById('save-btn');
const syncBotBtn = document.getElementById('sync-bot-btn');
const toast = document.getElementById('toast');
const stationNameInput = document.getElementById('station-name-input');
const paymentOptionsInput = document.getElementById('payment-options-input');
const finesInput = document.getElementById('fines-input');
const mediaInput = document.getElementById('media-input');
const themeSelect = document.getElementById('theme-select');
const adminUsernameInput = document.getElementById('admin-username-input');
const adminPasswordInput = document.getElementById('admin-password-input');
const addPhoneNumberBtn = document.getElementById('add-phone-number-btn');
const phoneList = document.getElementById('phone-list');
const botButtonList = document.getElementById('bot-button-list');
const addBotButtonBtn = document.getElementById('add-bot-button-btn');
const staffList = document.getElementById('staff-list');
const addStaffBtn = document.getElementById('add-staff-btn');
const onlineUsersList = document.getElementById('online-users-list');
const downloadBotConfigBtn = document.getElementById('download-bot-config-btn');
const paymentOptionsList = document.getElementById('payment-options-list');
const fineListDisplay = document.getElementById('fine-list-display');
const mediaGallery = document.getElementById('media-gallery');
const additionalPhonesContainer = document.getElementById('additional-phones-container');
const brandName = document.getElementById('brand-name');
const sectionToggleInputs = document.querySelectorAll('.section-toggle');

// New UI elements
const notifTelegramGreeting = document.getElementById('notif-telegram-greeting');
const notifStatusChange = document.getElementById('notif-status-change');
const notifPriceChange = document.getElementById('notif-price-change');
const notifAnnouncement = document.getElementById('notif-announcement');
const adminBotSettings = document.getElementById('admin-bot-settings');
const broadcastTopicSelect = document.getElementById('broadcast-topic-select');
const broadcastSendBtn = document.getElementById('broadcast-send-btn');
const broadcastText = document.getElementById('broadcast-text');
const subscriberList = document.getElementById('subscriber-list');
const refreshSubsBtn = document.getElementById('refresh-subs-btn');
const settingsLoginAdminBtn = document.getElementById('settings-login-admin');
const settingsLoginStaffBtn = document.getElementById('settings-login-staff');

let realtimeIntervalId = null;
let priceBroadcastTimeout = null;

function schedulePriceBroadcast() {
  if (priceBroadcastTimeout) clearTimeout(priceBroadcastTimeout);
  priceBroadcastTimeout = setTimeout(() => {
    if (state.notificationsEnabled.priceChange) broadcastToSubscribers('prices');
  }, 1400);
}

// Info display elements
const staffPanel = document.getElementById('staff-panel');
const phoneDisplay = document.getElementById('phone-number');
const readinessDisplay2 = document.getElementById('readiness-level');

// Telegram chat UI elements (simple local simulation)
const navTelegram = document.getElementById('nav-telegram');
const telegramSection = document.getElementById('telegram');
const telegramChat = document.getElementById('telegram-chat');
const telegramMessages = document.getElementById('telegram-messages');
const telegramInput = document.getElementById('telegram-input');
const telegramSendBtn = document.getElementById('telegram-send-btn');
const telegramConnectionStatus = document.getElementById('telegram-connection-status');

// Polling state for Telegram API
let telegramPollIntervalId = null;
let telegramOffset = 0;

// Telegram Bot Commands
function getBotIdFromToken(token) {
  if (!token) return 'Не встановлено';
  return token.split(':')[0];
}

function generateTelegramResponse(command) {
  const status = state.stationOpen ? '✅ Відкрито' : '🔴 Зачинено';
  const responses = {
    '/status': `📍 **Статус АРС Заправки**\n\n${status}\n\n${state.reason}\n\nРівень готовності: ${state.readinessLevel}%`,
    '/prices': `💰 **Поточні Ціни**\n\nА95: ${state.prices.a95.toFixed(2)} грн/л\nДизель: ${state.prices.diesel.toFixed(2)} грн/л\nГаз: ${state.prices.gas.toFixed(2)} грн/м³`,
    '/announce': `📢 **Оголошення**\n\n${state.messages.all}`,
    '/hours': '🕐 **Час роботи**\n\nПонеділок-Неділя: 24/7',
    '/contact': `📞 **Служба Підтримки**\n\n${state.phoneNumber}`,
    '/readiness': `⚡ **Рівень Готовності**\n\n${state.readinessLevel}%\n\n${state.readinessLevel >= 90 ? '✅ Станція готова' : state.readinessLevel >= 70 ? '⚠️ Середній рівень' : '❌ Низький рівень'}`,
  };
  return responses[command] || 'Невідома команда. Спробуйте /status';
}

function simulateBotCommand(command) {
  const response = generateTelegramResponse(command);
  showToast(`🤖 Команда: ${command}\n${response}`);
}

function updateTelegramBotDisplay() {
  const botIdDisplay = document.getElementById('bot-id-display');
  if (botIdDisplay) {
    botIdDisplay.textContent = state.telegramToken ? `Bot ID: ${getBotIdFromToken(state.telegramToken)}` : 'Введіть токен спочатку';
  }
}

// Subscribers stored in state for demo (chat_ids)
if (!state.subscribers) state.subscribers = [];

function renderSubscribers() {
  if (!subscriberList) return;
  subscriberList.innerHTML = '';
  (state.subscribers || []).forEach((s) => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.padding = '6px 8px';
    row.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
    const topicsText = (s.topics && s.topics.length) ? ` — ${s.topics.join(', ')}` : '';
    row.innerHTML = `<span style="color:var(--muted)"></span><div style="display:flex;gap:6px"><button class="btn btn-secondary promote-btn" data-chat="${s.chat_id}">${s.isAdmin ? 'Зняти адмін' : 'Промотувати'}</button><button class="btn btn-secondary remove-btn" data-chat="${s.chat_id}">Видалити</button></div>`;
    row.firstChild.textContent = `${s.chat_id} (${s.name||'User'})${topicsText}`;
    subscriberList.appendChild(row);
  });

  // wire promote and remove buttons
  subscriberList.querySelectorAll('.promote-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chat = btn.dataset.chat;
      const sub = state.subscribers.find((x) => String(x.chat_id) === String(chat));
      if (!sub) return;
      sub.isAdmin = !sub.isAdmin;
      saveState();
      renderSubscribers();
      showToast(sub.isAdmin ? 'Підписник став адміном бота' : 'Адмін права знято');
    });
  });

  subscriberList.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chat = btn.dataset.chat;
      state.subscribers = (state.subscribers || []).filter((x) => String(x.chat_id) !== String(chat));
      saveState();
      renderSubscribers();
    });
  });
}


function renderAdditionalPhones() {
  additionalPhonesContainer.innerHTML = '';
  state.additionalPhones.forEach((phone, index) => {
    const item = document.createElement('div');
    item.className = 'phone-item';
    item.innerHTML = `<span>${phone}</span><button class="icon-btn" data-index="${index}" title="Видалити">✕</button>`;
    additionalPhonesContainer.appendChild(item);
  });
  additionalPhonesContainer.querySelectorAll('.icon-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.additionalPhones.splice(Number(button.dataset.index), 1);
      saveState();
      render();
    });
  });
}

function renderPaymentOptions() {
  if (!paymentOptionsList) return;
  paymentOptionsList.innerHTML = '';
  state.paymentOptions.forEach((option, index) => {
    const item = document.createElement('div');
    item.className = 'info-list-item';
    item.innerHTML = `<span>${option}</span><button class="icon-btn" data-index="${index}" title="Видалити">✕</button>`;
    paymentOptionsList.appendChild(item);
  });
  paymentOptionsList.querySelectorAll('.icon-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.paymentOptions.splice(Number(button.dataset.index), 1);
      saveState();
      render();
    });
  });
}

function renderFines() {
  if (!fineListDisplay) return;
  fineListDisplay.innerHTML = '';
  state.fines.forEach((fine, index) => {
    const item = document.createElement('div');
    item.className = 'info-list-item';
    item.innerHTML = `<span>${fine}</span><button class="icon-btn" data-index="${index}" title="Видалити">✕</button>`;
    fineListDisplay.appendChild(item);
  });
  fineListDisplay.querySelectorAll('.icon-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.fines.splice(Number(button.dataset.index), 1);
      saveState();
      render();
    });
  });
}

function renderMediaGallery() {
  if (!mediaGallery) return;
  mediaGallery.innerHTML = '';
  state.media.forEach((media, index) => {
    const card = document.createElement('div');
    card.className = 'media-card';
    if (media.type === 'image') {
      card.innerHTML = `<img src="${media.url}" alt="Media ${index + 1}" />`;
    } else if (media.type === 'video') {
      card.innerHTML = `<video controls src="${media.url}"></video>`;
    }
    mediaGallery.appendChild(card);
  });
}

function renderBotButtons() {
  if (!botButtonList) return;
  botButtonList.innerHTML = '';

  state.botButtons.forEach((button, index) => {
    const row = document.createElement('div');
    row.className = 'bot-button-item';
    row.innerHTML = `<span>${button.label} — ${button.command}</span><button class="icon-btn" data-index="${index}" title="Видалити">✕</button>`;
    botButtonList.appendChild(row);
  });

  botButtonList.querySelectorAll('.icon-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.botButtons.splice(Number(btn.dataset.index), 1);
      saveState();
      render();
    });
  });
}

function renderStaffAccounts() {
  if (!staffList) return;
  staffList.innerHTML = '';
  state.staffAccounts.forEach((account, index) => {
    const row = document.createElement('div');
    row.className = 'staff-item';
    row.innerHTML = `<span>${account.username}</span><button class="icon-btn" data-index="${index}" title="Видалити">✕</button>`;
    staffList.appendChild(row);
  });
  staffList.querySelectorAll('.icon-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.staffAccounts.splice(Number(btn.dataset.index), 1);
      saveState();
      render();
    });
  });
}

function renderOnlineUsers() {
  if (!onlineUsersList) return;
  onlineUsersList.innerHTML = '';
  state.onlineUsers.forEach((user) => {
    const row = document.createElement('div');
    row.className = 'online-user-item';
    row.innerHTML = `<span>${user.name} — ${user.role === 'admin' ? 'Адмін' : 'Співробітник'}</span>`;
    onlineUsersList.appendChild(row);
  });
}

function updateTheme() {
  document.body.classList.remove('theme-dark', 'theme-ocean', 'theme-sunrise');
  document.body.classList.add(`theme-${state.theme}`);
}

function downloadBotConfig() {
  const config = {
    token: state.telegramToken,
    stationName: state.stationName,
    phoneNumber: state.phoneNumber,
    additionalPhones: state.additionalPhones,
    prices: state.prices,
    messages: state.messages,
    paymentOptions: state.paymentOptions,
    fines: state.fines,
    botButtons: state.botButtons,
  };

  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'bot_config.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

function render() {
  const isAdmin = state.role === 'admin';
  const isStaff = state.role === 'staff' || isAdmin;
  const isLoggedIn = state.role !== 'guest';

  // Update role display
  const roleText = isAdmin ? 'Адміністратор' : isStaff ? 'Співробітник' : 'Гість';
  roleTitle.textContent = `Поточна роль: ${roleText}`;
  roleDescription.textContent = isAdmin
    ? 'Адмін бачить усю інформацію та може змінювати колонки, ціни, повідомлення й режим роботи.'
    : isStaff
      ? 'Співробітник бачить стан, загальні новини та особливі повідомлення для персоналу.'
      : 'Гість бачить статус, ціни та загальні повідомлення без доступу до змін.';
  
  currentUserDisplay.textContent = isLoggedIn ? `Автоматизовано як: ${roleText}` : 'Ви не авторизовані';
  logoutLinkBtn.style.display = isLoggedIn ? 'inline-block' : 'none';
  logoutLinkBtn.textContent = t('logoutLinkButton');
  loginModalBtn.textContent = isLoggedIn ? t('profileButton') : t('loginButton');

  // Admin panel visibility
  adminPanel.hidden = !isAdmin;
  staffPanel.hidden = !isStaff || !state.visibleSections.staffPanel;

  // Section visibility toggles and nav links
  const sectionMap = {
    status: document.getElementById('status'),
    prices: document.getElementById('prices'),
    payments: document.getElementById('payments'),
    media: document.getElementById('media'),
    telegram: document.getElementById('telegram'),
  };

  Object.entries(sectionMap).forEach(([key, section]) => {
    if (!section) return;
    section.hidden = !state.visibleSections[key] || (key.startsWith('telegram') && !isStaff);
  });

  const navMap = {
    'nav-status': state.visibleSections.status,
    'nav-prices': state.visibleSections.prices,
    'nav-telegram': state.visibleSections.telegram && isStaff,
    'nav-admin': isAdmin,
  };

  Object.entries(navMap).forEach(([id, visible]) => {
    const navItem = document.getElementById(id);
    if (navItem) navItem.hidden = !visible;
  });

  if (isAdmin) {
    sectionToggleInputs.forEach((toggle) => {
      const sectionName = toggle.dataset.section;
      toggle.checked = Boolean(state.visibleSections[sectionName]);
    });
  }

  // Update brand and station info
  if (brandName) brandName.textContent = state.stationName;
  document.getElementById('station-state-title').textContent = state.stationOpen ? 'Заправка відкрита' : 'Заправка зачинена';
  document.getElementById('station-state-pill').textContent = state.stationOpen ? 'Відкрито' : 'Зачинено';
  document.getElementById('station-state-pill').classList.toggle('status-pill-active', state.stationOpen);
  document.getElementById('station-reason').textContent = state.stationOpen
    ? state.reason || 'Всі колонки працюють. Очікуйте мінімальний час обслуговування.'
    : state.reason || 'На даний момент заправка тимчасово не працює.';

  document.getElementById('hero-status-pill').textContent = state.stationOpen ? 'Відкрито' : 'Зачинено';
  document.getElementById('hero-pumps').textContent = state.pumps;
  document.getElementById('hero-a95').textContent = state.prices.a95.toFixed(2);
  document.getElementById('hero-diesel').textContent = state.prices.diesel.toFixed(2);
  document.getElementById('hero-gas').textContent = state.prices.gas.toFixed(2);

  document.getElementById('all-message').textContent = state.messages.all;
  document.getElementById('staff-message').textContent = state.messages.staff;
  document.getElementById('price-a95').textContent = `${state.prices.a95.toFixed(2)} грн/л`;
  document.getElementById('price-diesel').textContent = `${state.prices.diesel.toFixed(2)} грн/л`;
  document.getElementById('price-gas').textContent = `${state.prices.gas.toFixed(2)} грн/м³`;

  // Update contact info
  phoneDisplay.textContent = state.phoneNumber;
  readinessDisplay2.textContent = `${state.readinessLevel}%`;

  // Update admin inputs if authorized
  if (isAdmin) {
    phoneInput.value = state.phoneNumber;
    readinessInput.value = state.readinessLevel;
    readinessDisplay.textContent = state.readinessLevel;
    telegramTokenInput.value = state.telegramToken;
    statusSelect.value = state.stationOpen ? 'open' : 'closed';
    statusReason.value = state.reason;
    pumpsInput.value = state.pumps;
    pumpsValue.textContent = state.pumps;
    a95Input.value = state.prices.a95;
    dieselInput.value = state.prices.diesel;
    gasInput.value = state.prices.gas;
    allMessageInput.value = state.messages.all;
    staffMessageInput.value = state.messages.staff;
    stationNameInput.value = state.stationName;
    paymentOptionsInput.value = state.paymentOptions.join('\n');
    finesInput.value = state.fines.join('\n');
    mediaInput.value = state.media.map((item) => `${item.type}|${item.url}`).join('\n');
    themeSelect.value = state.theme;
    adminUsernameInput.value = state.adminAccount.username;
    adminPasswordInput.value = state.adminAccount.password;
    renderAdditionalPhones();
    renderPaymentOptions();
    renderFines();
    renderMediaGallery();
    renderBotButtons();
    renderStaffAccounts();
    renderOnlineUsers();
    renderSubscribers();
  }


  document.getElementById('current-time').textContent = new Date().toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });

  updateTelegramBotDisplay();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove('show'), 1800);
}

// Modal functions
function openModal() {
  loginModal.hidden = false;
  modalLoginInput.value = '';
  modalPasswordInput.value = '';
  modalError.style.display = 'none';
  modalLoginInput.focus();
}

function closeModal() {
  loginModal.hidden = true;
}

function attemptLogin() {
  const username = modalLoginInput.value.trim();
  const password = modalPasswordInput.value.trim();

  const adminMatch = username === state.adminAccount.username && password === state.adminAccount.password;
  const staffMatch = state.staffAccounts.some((account) => account.username === username && account.password === password);

  if (adminMatch) {
    state.role = 'admin';
    saveState();
    closeModal();
    render();
    showToast('Вхід виконано як адміністратор');
    return;
  }

  if (staffMatch) {
    state.role = 'staff';
    saveState();
    closeModal();
    render();
    showToast('Вхід виконано як співробітник');
    return;
  }

  modalError.style.display = 'block';
  modalError.textContent = 'Невірний логін або пароль';
}

function logout() {
  state.role = 'guest';
  saveState();
  render();
  showToast('Ви вийшли з системи');
}

// Modal event listeners
// Always open the login modal from the top button (single entry point)
loginModalBtn.addEventListener('click', () => {
  openModal();
});

modalCloseBtn.addEventListener('click', closeModal);

modalLoginBtn.addEventListener('click', attemptLogin);

modalLoginInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') attemptLogin();
});

modalPasswordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') attemptLogin();
});

loginModal.addEventListener('click', (e) => {
  if (e.target === loginModal) closeModal();
});

logoutBtn.addEventListener('click', logout);
logoutLinkBtn.addEventListener('click', logout);

// Admin panel event listeners
phoneInput.addEventListener('input', () => {
  state.phoneNumber = phoneInput.value;
  saveState();
  render();
});

readinessInput.addEventListener('input', () => {
  state.readinessLevel = Number(readinessInput.value);
  readinessDisplay.textContent = state.readinessLevel;
  saveState();
  render();
  if (state.notificationsEnabled.statusChange) broadcastToSubscribers('readiness');
});

telegramTokenInput.addEventListener('input', () => {
  state.telegramToken = telegramTokenInput.value;
  saveState();
});

// Start/stop polling when token is changed
telegramTokenInput.addEventListener('change', () => {
  if (state.telegramToken) startTelegramPolling();
  else stopTelegramPolling();
});

statusSelect.addEventListener('change', () => {
  state.stationOpen = statusSelect.value === 'open';
  saveState();
  render();
  if (state.notificationsEnabled.statusChange) {
    broadcastToSubscribers('status');
  }
});

statusReason.addEventListener('input', () => {
  state.reason = statusReason.value;
  saveState();
  render();
});

pumpsInput.addEventListener('input', () => {
  state.pumps = Number(pumpsInput.value);
  pumpsValue.textContent = state.pumps;
  saveState();
  render();
});

a95Input.addEventListener('input', () => {
  state.prices.a95 = Number(a95Input.value);
  saveState();
  render();
  schedulePriceBroadcast();
});

dieselInput.addEventListener('input', () => {
  state.prices.diesel = Number(dieselInput.value);
  saveState();
  render();
  schedulePriceBroadcast();
});

gasInput.addEventListener('input', () => {
  state.prices.gas = Number(gasInput.value);
  saveState();
  render();
  schedulePriceBroadcast();
});

allMessageInput.addEventListener('input', () => {
  state.messages.all = allMessageInput.value;
  saveState();
  render();
  if (state.notificationsEnabled.announcement) broadcastToSubscribers('announcement');
});

staffMessageInput.addEventListener('input', () => {
  state.messages.staff = staffMessageInput.value;
  saveState();
  render();
});

stationNameInput.addEventListener('input', () => {
  state.stationName = stationNameInput.value;
  document.getElementById('brand-name').textContent = state.stationName;
  saveState();
});

paymentOptionsInput.addEventListener('input', () => {
  state.paymentOptions = paymentOptionsInput.value
    .split('\n')
    .map((option) => option.trim())
    .filter((option) => option);
  saveState();
  render();
});

finesInput.addEventListener('input', () => {
  state.fines = finesInput.value
    .split('\n')
    .map((fine) => fine.trim())
    .filter((fine) => fine);
  saveState();
  render();
});

mediaInput.addEventListener('input', () => {
  state.media = mediaInput.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
    .map((line) => {
      const [type, url] = line.split('|').map((item) => item.trim());
      return { type: type || 'image', url: url || '' };
    })
    .filter((item) => item.url);
  saveState();
  render();
});

themeSelect.addEventListener('change', () => {
  state.theme = themeSelect.value;
  saveState();
  updateTheme();
});

adminUsernameInput.addEventListener('input', () => {
  state.adminAccount.username = adminUsernameInput.value;
  saveState();
});

adminPasswordInput.addEventListener('input', () => {
  state.adminAccount.password = adminPasswordInput.value;
  saveState();
});

addPhoneNumberBtn.addEventListener('click', () => {
  const phone = window.prompt(t('addPhonePrompt'))?.trim();
  if (phone) {
    state.additionalPhones.push(phone);
    saveState();
    render();
  }
});

addBotButtonBtn.addEventListener('click', () => {
  const label = window.prompt('Назва кнопки')?.trim();
  const command = window.prompt('Команда (наприклад /info)')?.trim();
  if (label && command) {
    state.botButtons.push({ label, command });
    saveState();
    render();
  }
});

addStaffBtn.addEventListener('click', () => {
  const username = window.prompt(t('addStaffPrompt'))?.trim();
  const password = window.prompt('Введіть пароль')?.trim();
  if (username && password) {
    state.staffAccounts.push({ username, password });
    saveState();
    render();
  }
});

downloadBotConfigBtn.addEventListener('click', downloadBotConfig);

sectionToggleInputs.forEach((toggle) => {
  toggle.addEventListener('change', () => {
    state.visibleSections[toggle.dataset.section] = toggle.checked;
    saveState();
    render();
  });
});

saveBtn.addEventListener('click', () => {
  saveState();
  showToast('Зміни збережено');
});

syncBotBtn.addEventListener('click', () => {
  if (state.telegramToken) {
    showToast(`Бот синхронізовано з токеном: ${state.telegramToken.substring(0, 10)}...`);
  } else {
    showToast('Спочатку встановіть токен бота в адмін-панелі');
  }
});

// Notification toggles
if (notifTelegramGreeting) notifTelegramGreeting.checked = !!state.notificationsEnabled.telegramGreeting;
if (notifStatusChange) notifStatusChange.checked = !!state.notificationsEnabled.statusChange;
if (notifPriceChange) notifPriceChange.checked = !!state.notificationsEnabled.priceChange;
if (notifAnnouncement) notifAnnouncement.checked = !!state.notificationsEnabled.announcement;

if (notifTelegramGreeting) notifTelegramGreeting.addEventListener('change', () => { state.notificationsEnabled.telegramGreeting = notifTelegramGreeting.checked; saveState(); });
if (notifStatusChange) notifStatusChange.addEventListener('change', () => { state.notificationsEnabled.statusChange = notifStatusChange.checked; saveState(); });
if (notifPriceChange) notifPriceChange.addEventListener('change', () => { state.notificationsEnabled.priceChange = notifPriceChange.checked; saveState(); });
if (notifAnnouncement) notifAnnouncement.addEventListener('change', () => { state.notificationsEnabled.announcement = notifAnnouncement.checked; saveState(); });

// Real-time updates (render loop)
function startRealtimeUpdates() {
  stopRealtimeUpdates();
  render();
  realtimeIntervalId = setInterval(render, 2000);
}

function stopRealtimeUpdates() {
  if (realtimeIntervalId) { clearInterval(realtimeIntervalId); realtimeIntervalId = null; }
}

// Telegram Bot Interface Event Listeners
function appendMessage(who, text) {
  if (!telegramMessages) return;
  const el = document.createElement('div');
  el.className = `telegram-message ${who}`;
  el.textContent = text;
  telegramMessages.appendChild(el);
  // scroll to bottom
  telegramMessages.scrollTop = telegramMessages.scrollHeight;
}

function startTelegramConversation() {
  if (!telegramChat) return;
  // reveal chat area and focus input
  telegramChat.hidden = false;
  // send initial greeting
  appendMessage('bot', 'Привіт!');
  if (telegramInput) telegramInput.focus();
}

if (navTelegram) {
  navTelegram.addEventListener('click', (e) => {
    // ensure SPA-like navigation still works
    e.preventDefault();
    startTelegramConversation();
    location.hash = '#telegram';
  });
}

window.addEventListener('hashchange', () => {
  if (location.hash === '#telegram') startTelegramConversation();
  else {
    // remove last chat message when leaving section
    if (telegramMessages && telegramMessages.lastChild) telegramMessages.removeChild(telegramMessages.lastChild);
    if (telegramChat) telegramChat.hidden = true;
  }
});

if (telegramSendBtn) {
  telegramSendBtn.addEventListener('click', () => {
    const text = telegramInput?.value?.trim();
    if (!text) return;
    appendMessage('user', text);
    if (telegramInput) telegramInput.value = '';
    // simple bot reply after short delay
    setTimeout(() => appendMessage('bot', 'Привіт!'), 400);
  });
}

// --- Telegram API polling (best-effort from browser) ---
async function telegramApi(method, params = {}) {
  const token = state.telegramToken;
  if (!token) throw new Error('no-token');
  const url = `https://api.telegram.org/bot${token}/${method}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

async function pollTelegramOnce() {
  if (!state.telegramToken) {
    if (telegramConnectionStatus) telegramConnectionStatus.textContent = 'Статус бота: не підключено';
    return;
  }

  if (telegramConnectionStatus) telegramConnectionStatus.textContent = 'Статус бота: підключається...';

  try {
    const resp = await telegramApi('getUpdates', { offset: telegramOffset, timeout: 0 });
    if (!resp || !resp.ok) {
      if (telegramConnectionStatus) telegramConnectionStatus.textContent = 'Статус бота: помилка API';
      return;
    }

    if (telegramConnectionStatus) telegramConnectionStatus.textContent = 'Статус бота: підключено';

    for (const update of resp.result || []) {
      telegramOffset = update.update_id + 1;

      // handle callback button presses
      if (update.callback_query) {
        try {
          const cb = update.callback_query;
          const data = cb.data;
          const fromId = cb.from?.id;
          const msgChatId = cb.message?.chat?.id;
          // acknowledge callback
          // handle settings and topic toggles specially
          if (data === '/settings') {
            // build settings keyboard: 2 columns x 3 rows (6 topics)
            const topics = [
              { key: 'status', label: 'Статус' },
              { key: 'prices', label: 'Ціни' },
              { key: 'announcement', label: 'Оголошення' },
              { key: 'readiness', label: 'Готовність' },
              { key: 'contact', label: 'Контакти' },
              { key: 'hours', label: 'Час роботи' },
            ];
            const kb = [];
            for (let i = 0; i < topics.length; i += 2) {
              kb.push([
                { text: topics[i].label, callback_data: `/topic_${topics[i].key}` },
                topics[i + 1] ? { text: topics[i + 1].label, callback_data: `/topic_${topics[i + 1].key}` } : { text: ' ', callback_data: '/noop' },
              ]);
            }
            // delete previous menu message to keep chat clean
            try { await telegramApi('deleteMessage', { chat_id: msgChatId || fromId, message_id: cb.message.message_id }); } catch(e){}
            // add back button row
            kb.push([{ text: '⬅️ Назад', callback_data: '/back' }]);
            await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
            await telegramApi('sendMessage', { chat_id: msgChatId || fromId, text: 'Налаштування розсилок — оберіть теми, на які хочете підписатися або відписатися:', reply_markup: { inline_keyboard: kb } });
            continue;
          }

          if (data && data.startsWith('/topic_')) {
            const topic = data.replace('/topic_', '');
            const chat = cb.from?.id || cb.message?.chat?.id;
            if (!state.subscribers) state.subscribers = [];
            let subscriber = state.subscribers.find((s) => String(s.chat_id) === String(chat));
            if (!subscriber) {
              subscriber = { chat_id: chat, name: cb.from?.username || cb.from?.first_name, topics: [] };
              state.subscribers.push(subscriber);
            }
            subscriber.topics = subscriber.topics || [];
            const idx = subscriber.topics.indexOf(topic);
            if (idx === -1) {
              subscriber.topics.push(topic);
              await telegramApi('answerCallbackQuery', { callback_query_id: cb.id, text: `Підписано на ${topic}`, show_alert: false });
            } else {
              subscriber.topics.splice(idx, 1);
              await telegramApi('answerCallbackQuery', { callback_query_id: cb.id, text: `Відписано від ${topic}`, show_alert: false });
            }
            saveState();
            renderSubscribers();
            continue;
          }

          if (data === '/back') {
            // delete current menu and send greeting again
            try { await telegramApi('deleteMessage', { chat_id: msgChatId || fromId, message_id: cb.message.message_id }); } catch(e){}
            await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
            // send greeting again
            const buttons = (state.botButtons || []).map((b) => ({ text: b.label, callback_data: b.command }));
            const keyboardMain = [];
            for (let i = 0; i < buttons.length; i += 3) keyboardMain.push(buttons.slice(i, i + 3).map((btn) => ({ text: btn.text, callback_data: btn.callback_data })));
            keyboardMain.push([{ text: '⚙️ Налаштування', callback_data: '/settings' }]);
            await telegramApi('sendMessage', { chat_id: msgChatId || fromId, text: '<b>👋 Вітаємо на АРС!</b>\n\nЯ допоможу дізнатися актуальний стан, ціни та отримувати розсилки.\nОберіть опцію нижче або натисніть «⚙️ Налаштування», щоб керувати підписками.', parse_mode: 'HTML', reply_markup: { inline_keyboard: keyboardMain } });
            continue;
          }

          // admin menu handling
          if (data === '/admin') {
            const chat = cb.from?.id || cb.message?.chat?.id;
            const sub = (state.subscribers || []).find((s) => String(s.chat_id) === String(chat));
            if (!sub || !sub.isAdmin) {
              await telegramApi('answerCallbackQuery', { callback_query_id: cb.id, text: 'Немає доступу: потрібно бути адміном бота', show_alert: true });
              continue;
            }
            // delete previous menu
            try { await telegramApi('deleteMessage', { chat_id: msgChatId || fromId, message_id: cb.message.message_id }); } catch(e){}
            const adminKb = [
              [{ text: '🔁 Перемкнути статус', callback_data: '/admin_toggle_status' }, { text: '💰 Розсилка цін', callback_data: '/admin_broadcast_prices' }],
              [{ text: '📢 Розсилка оголошення', callback_data: '/admin_broadcast_announcement' }, { text: '🔄 Оновити підписників', callback_data: '/admin_refresh' }],
              [{ text: sub.isAdmin ? '🔒 Зняти себе як адмін' : '⭐ Промотувати себе адміном', callback_data: '/admin_promote_self' }],
              [{ text: '⬅️ Назад', callback_data: '/back' }],
            ];
            await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
            await telegramApi('sendMessage', { chat_id: msgChatId || fromId, text: 'Адмін меню — виберіть дію:', reply_markup: { inline_keyboard: adminKb } });
            continue;
          }

          // admin actions
          if (data === '/admin_toggle_status') {
            const chat = cb.from?.id || cb.message?.chat?.id;
            const sub = (state.subscribers || []).find((s) => String(s.chat_id) === String(chat));
            if (!sub || !sub.isAdmin) { await telegramApi('answerCallbackQuery', { callback_query_id: cb.id, text: 'Немає доступу', show_alert: true }); continue; }
            // toggle status
            state.stationOpen = !state.stationOpen;
            saveState(); render();
            try { await telegramApi('deleteMessage', { chat_id: msgChatId || fromId, message_id: cb.message.message_id }); } catch(e){}
            await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
            await telegramApi('sendMessage', { chat_id: msgChatId || fromId, text: `Статус змінено: ${state.stationOpen ? 'Відкрито' : 'Зачинено'}`, reply_markup: { inline_keyboard: [[{ text: '⬅️ Назад', callback_data: '/admin' }]] } });
            if (state.notificationsEnabled.statusChange) broadcastToSubscribers('status');
            continue;
          }

          if (data === '/admin_broadcast_prices') {
            const chat = cb.from?.id || cb.message?.chat?.id;
            const sub = (state.subscribers || []).find((s) => String(s.chat_id) === String(chat));
            if (!sub || !sub.isAdmin) { await telegramApi('answerCallbackQuery', { callback_query_id: cb.id, text: 'Немає доступу', show_alert: true }); continue; }
            try { await telegramApi('deleteMessage', { chat_id: msgChatId || fromId, message_id: cb.message.message_id }); } catch(e){}
            await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
            broadcastToSubscribers('prices');
            await telegramApi('sendMessage', { chat_id: msgChatId || fromId, text: 'Розсилка цін запущена', reply_markup: { inline_keyboard: [[{ text: '⬅️ Назад', callback_data: '/admin' }]] } });
            continue;
          }

          if (data === '/admin_broadcast_announcement') {
            const chat = cb.from?.id || cb.message?.chat?.id;
            const sub = (state.subscribers || []).find((s) => String(s.chat_id) === String(chat));
            if (!sub || !sub.isAdmin) { await telegramApi('answerCallbackQuery', { callback_query_id: cb.id, text: 'Немає доступу', show_alert: true }); continue; }
            try { await telegramApi('deleteMessage', { chat_id: msgChatId || fromId, message_id: cb.message.message_id }); } catch(e){}
            await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
            broadcastToSubscribers('announcement');
            await telegramApi('sendMessage', { chat_id: msgChatId || fromId, text: 'Розсилка оголошень запущена', reply_markup: { inline_keyboard: [[{ text: '⬅️ Назад', callback_data: '/admin' }]] } });
            continue;
          }

          if (data === '/admin_refresh') {
            const chat = cb.from?.id || cb.message?.chat?.id;
            const sub = (state.subscribers || []).find((s) => String(s.chat_id) === String(chat));
            if (!sub || !sub.isAdmin) { await telegramApi('answerCallbackQuery', { callback_query_id: cb.id, text: 'Немає доступу', show_alert: true }); continue; }
            await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
            const count = (state.subscribers || []).length;
            try { await telegramApi('deleteMessage', { chat_id: msgChatId || fromId, message_id: cb.message.message_id }); } catch(e){}
            await telegramApi('sendMessage', { chat_id: msgChatId || fromId, text: `Кількість підписників: ${count}`, reply_markup: { inline_keyboard: [[{ text: '⬅️ Назад', callback_data: '/admin' }]] } });
            continue;
          }

          if (data === '/admin_promote_self') {
            const chat = cb.from?.id || cb.message?.chat?.id;
            let sub = (state.subscribers || []).find((s) => String(s.chat_id) === String(chat));
            if (!sub) { sub = { chat_id: chat, name: cb.from?.username || cb.from?.first_name, topics: [], isAdmin: true }; state.subscribers.push(sub); }
            else sub.isAdmin = !sub.isAdmin;
            saveState(); renderSubscribers();
            await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
            try { await telegramApi('deleteMessage', { chat_id: msgChatId || fromId, message_id: cb.message.message_id }); } catch(e){}
            await telegramApi('sendMessage', { chat_id: msgChatId || fromId, text: sub.isAdmin ? 'Ви маєте права адміна бота' : 'Права адміна знято', reply_markup: { inline_keyboard: [[{ text: '⬅️ Назад', callback_data: '/back' }]] } });
            continue;
          }

          // default acknowledge and replace previous message
          try { await telegramApi('deleteMessage', { chat_id: msgChatId || fromId, message_id: cb.message.message_id }); } catch(e){}
          await telegramApi('answerCallbackQuery', { callback_query_id: cb.id, text: `Обрано: ${data}`, show_alert: false });
          // send response message with back button
          const respText = generateTelegramResponse(data);
          await telegramApi('sendMessage', { chat_id: msgChatId || fromId, text: respText, parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: '⬅️ Назад', callback_data: '/back' }]] } });
        } catch (e) {
          console.warn('Callback handling failed', e);
        }
        continue;
      }

      // also handle simple subscription commands (/subscribe, /unsubscribe)
      if (update.message && update.message.text) {
        const txt = update.message.text.trim();
        const chatId = update.message.chat.id;
        if (txt === '/subscribe') {
          if (!state.subscribers) state.subscribers = [];
          if (!state.subscribers.find((s) => String(s.chat_id) === String(chatId))) {
            state.subscribers.push({ chat_id: chatId, name: update.message.from?.username || update.message.from?.first_name });
            saveState();
            renderSubscribers();
          }
          await telegramApi('sendMessage', { chat_id: chatId, text: 'Ви підписані на розсилки.' });
        }
        if (txt === '/unsubscribe') {
          state.subscribers = (state.subscribers || []).filter((s) => String(s.chat_id) !== String(chatId));
          saveState();
          renderSubscribers();
          await telegramApi('sendMessage', { chat_id: chatId, text: 'Ви відписані від розсилок.' });
        }
      }

      // handle direct /start message
      if (update.message && update.message.text && update.message.text.trim() === '/start') {
        const chatId = update.message.chat.id;
        if (!state.notificationsEnabled.telegramGreeting) {
          console.log('Telegram greeting disabled by settings');
          continue;
        }

        // add subscriber if new
        if (!state.subscribers) state.subscribers = [];
        if (!state.subscribers.find((s) => String(s.chat_id) === String(chatId))) {
          state.subscribers.push({ chat_id: chatId, name: update.message.from?.username || update.message.from?.first_name });
          saveState();
          renderSubscribers();
        }

        // build inline keyboard from botButtons in 3 columns
        const buttons = (state.botButtons || []).map((b) => ({ text: b.label, callback_data: b.command }));
        const keyboard = [];
        for (let i = 0; i < buttons.length; i += 3) {
          keyboard.push(buttons.slice(i, i + 3).map((btn) => ({ text: btn.text, callback_data: btn.callback_data })));
        }
        // add separate settings button as its own centered row
        keyboard.push([{ text: '⚙️ Налаштування', callback_data: '/settings' }]);
        // add admin menu button if this user is a promoted admin
        try {
          const subCheck = state.subscribers.find((s) => String(s.chat_id) === String(chatId));
          if (subCheck && subCheck.isAdmin) keyboard.push([{ text: '🔐 Адмін меню', callback_data: '/admin' }]);
        } catch (e) {}
        try {
          await telegramApi('sendMessage', {
            chat_id: chatId,
            text: '<b>👋 Вітаємо на АРС!</b>\n\nЯ допоможу дізнатися актуальний стан, ціни та отримувати розсилки.\nОберіть опцію нижче або натисніть «⚙️ Налаштування», щоб керувати підписками.',
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: keyboard },
          });
          console.log('Sent greeting with keyboard to', chatId);
        } catch (sendErr) {
          console.warn('Send message failed', sendErr);
        }
      }
    }
  } catch (err) {
    console.error('Telegram polling error', err);
    if (telegramConnectionStatus) telegramConnectionStatus.textContent = 'Статус бота: не вдалося зʼєднатись з API (CORS або мережа)';
    showToast('Не вдалося підключитися до Telegram API з браузера; потрібен серверний проксі.');
    stopTelegramPolling();
  }
}

function startTelegramPolling() {
  stopTelegramPolling();
  if (!state.telegramToken) return;
  telegramOffset = 0;
  // run immediately and then interval
  pollTelegramOnce();
  telegramPollIntervalId = setInterval(pollTelegramOnce, 3500);
}

function stopTelegramPolling() {
  if (telegramPollIntervalId) {
    clearInterval(telegramPollIntervalId);
    telegramPollIntervalId = null;
  }
  if (telegramConnectionStatus) telegramConnectionStatus.textContent = 'Статус бота: не підключено';
}

// Admin broadcast: build text from topic
function buildBroadcastText(topic) {
  if (broadcastText && broadcastText.value && broadcastText.value.trim()) return broadcastText.value.trim();
  if (topic === 'status') return `${state.stationName}: ${state.stationOpen ? 'Відкрито' : 'Зачинено'} — ${state.reason}`;
  if (topic === 'prices') return `Ціни: А95 ${state.prices.a95.toFixed(2)} грн/л, ДП ${state.prices.diesel.toFixed(2)} грн/л, Газ ${state.prices.gas.toFixed(2)} грн/м³`;
  if (topic === 'announcement') return `Оголошення: ${state.messages.all}`;
  if (topic === 'readiness') return `Рівень готовності: ${state.readinessLevel}%`;
  if (topic === 'contact') return `Служба підтримки: ${state.phoneNumber}`;
  if (topic === 'hours') return `Час роботи: Понеділок-Неділя: 24/7`;
  return 'Оновлення від АРС';
}

async function broadcastToSubscribers(topic) {
  const text = buildBroadcastText(topic);
  // try server-side broadcast if server is hosting the bot
  try {
    const res = await fetch('/broadcast', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic }) });
    if (res.ok) {
      showToast('Розсилка ініційована на сервері');
      return;
    }
  } catch (e) {
    // server not available — fallback to client-side bot
  }

  const subs = state.subscribers || [];
  if (!state.telegramToken) return showToast('Спочатку встановіть токен бота або розгорніть сервер');
  // only send to subscribers who have this topic in their topics array
  const targets = (subs || []).filter((s) => Array.isArray(s.topics) && s.topics.includes(topic));
  if (!targets.length) return showToast('Немає підписників для цієї теми');
  showToast(`Розсилка ${targets.length}…`);
  for (const s of targets) {
    try {
      await telegramApi('sendMessage', { chat_id: s.chat_id, text });
    } catch (e) {
      console.warn('Broadcast failed for', s.chat_id, e);
    }
  }
  showToast('Розсилка завершена');
}

// start polling if token exists on load
if (state.telegramToken) startTelegramPolling();
// start UI and realtime loop
render();
startRealtimeUpdates();

// Wire admin broadcast controls
if (broadcastSendBtn) {
  broadcastSendBtn.addEventListener('click', () => {
    const topic = broadcastTopicSelect?.value || 'status';
    broadcastToSubscribers(topic);
  });
}

if (refreshSubsBtn) {
  refreshSubsBtn.addEventListener('click', () => renderSubscribers());
}

if (settingsLoginAdminBtn) {
  settingsLoginAdminBtn.addEventListener('click', () => {
    const username = window.prompt('Логін адміністратора:')?.trim();
    const password = window.prompt('Пароль адміністратора:')?.trim();
    if (!username || !password) return showToast('Введіть логін і пароль');
    if (username === state.adminAccount.username && password === state.adminAccount.password) {
      state.role = 'admin'; saveState(); render(); showToast('Увійшли як адміністратор');
    } else showToast('Невірний логін або пароль');
  });
}

if (settingsLoginStaffBtn) {
  settingsLoginStaffBtn.addEventListener('click', () => {
    const username = window.prompt('Логін співробітника:')?.trim();
    const password = window.prompt('Пароль співробітника:')?.trim();
    if (!username || !password) return showToast('Введіть логін і пароль');
    const staffMatch = state.staffAccounts.some((a) => a.username === username && a.password === password);
    if (staffMatch) { state.role = 'staff'; saveState(); render(); showToast('Увійшли як співробітник'); }
    else showToast('Невірний логін або пароль');
  });
}

// When polling receives /start, add subscriber if not exists
