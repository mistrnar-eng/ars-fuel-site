const STORAGE_KEY = 'ars-fuel-state';

const defaultState = {
  role: 'guest',
  stationOpen: true,
  reason: 'Всі колонки працюють. Очікуйте мінімальний час обслуговування.',
  pumps: 8,
  readinessLevel: 98,
  phoneNumber: '+38 (099) 123-45-67',
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
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultState, ...JSON.parse(saved), prices: { ...defaultState.prices, ...(JSON.parse(saved).prices || {}) }, messages: { ...defaultState.messages, ...(JSON.parse(saved).messages || {}) } } : defaultState;
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

let state = loadState();

// Modal elements
const loginModalBtn = document.getElementById('login-modal-btn');
const loginModal = document.getElementById('login-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalRoleSelect = document.getElementById('modal-role-select');
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

// Info display elements
const staffPanel = document.getElementById('staff-panel');
const phoneDisplay = document.getElementById('phone-number');
const readinessDisplay2 = document.getElementById('readiness-level');

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
  if (botIdDisplay && state.telegramToken) {
    botIdDisplay.textContent = `Bot ID: ${getBotIdFromToken(state.telegramToken)}`;
  }
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
  loginModalBtn.textContent = isLoggedIn ? 'Профіль' : 'Увійти';

  // Admin panel visibility
  adminPanel.hidden = !isAdmin;
  staffPanel.hidden = !isStaff;

  // Update station info
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
  const role = modalRoleSelect.value;
  const username = modalLoginInput.value.trim();
  const password = modalPasswordInput.value.trim();

  // Valid credentials
  const validCredentials = {
    staff: { username: 'sub', password: '1111' },
    admin: { username: 'admin', password: '0000' },
  };

  const candidate = validCredentials[role];
  if (candidate && username === candidate.username && password === candidate.password) {
    state.role = role;
    saveState();
    closeModal();
    render();
    showToast(`Вхід виконано як ${role === 'admin' ? 'адміністратор' : 'співробітник'}`);
  } else {
    modalError.style.display = 'block';
    modalError.textContent = 'Невірний логін або пароль';
  }
}

function logout() {
  state.role = 'guest';
  saveState();
  render();
  showToast('Ви вийшли з системи');
}

// Modal event listeners
loginModalBtn.addEventListener('click', () => {
  if (state.role === 'guest') {
    openModal();
  } else {
    closeModal();
  }
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
});

telegramTokenInput.addEventListener('input', () => {
  state.telegramToken = telegramTokenInput.value;
  saveState();
});

statusSelect.addEventListener('change', () => {
  state.stationOpen = statusSelect.value === 'open';
  saveState();
  render();
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
});

dieselInput.addEventListener('input', () => {
  state.prices.diesel = Number(dieselInput.value);
  saveState();
  render();
});

gasInput.addEventListener('input', () => {
  state.prices.gas = Number(gasInput.value);
  saveState();
  render();
});

allMessageInput.addEventListener('input', () => {
  state.messages.all = allMessageInput.value;
  saveState();
  render();
});

staffMessageInput.addEventListener('input', () => {
  state.messages.staff = staffMessageInput.value;
  saveState();
  render();
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

// Telegram Bot Interface Event Listeners
const copyBotIdBtn = document.getElementById('copy-bot-id-btn');
if (copyBotIdBtn) {
  copyBotIdBtn.addEventListener('click', () => {
    const botId = getBotIdFromToken(state.telegramToken);
    if (botId !== 'Не встановлено') {
      navigator.clipboard.writeText(botId).then(() => {
        showToast(`✅ Bot ID скопійовано: ${botId}`);
      });
    } else {
      showToast('⚠️ Токен не встановлено. Встановіть його в адмін-панелі');
    }
  });
}

// Alert checkboxes - enable/disable notifications
const alertCheckboxes = document.querySelectorAll('.alert-item input[type="checkbox"]');
alertCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const alertType = checkbox.id;
    const isEnabled = checkbox.checked;
    showToast(`${isEnabled ? '🔔' : '🔕'} ${alertType.replace('alert-', '').replace(/-/g, ' ')} - ${isEnabled ? 'включено' : 'вимкнено'}`);
  });
});

// Test Message Sender
const sendTestMessageBtn = document.getElementById('send-test-message-btn');
if (sendTestMessageBtn) {
  sendTestMessageBtn.addEventListener('click', () => {
    const chatId = document.getElementById('test-chat-id').value.trim();
    const message = document.getElementById('test-message').value.trim();
    const statusDisplay = document.getElementById('test-message-status');

    if (!chatId) {
      statusDisplay.textContent = '❌ Введіть Chat ID';
      statusDisplay.style.color = 'var(--danger)';
      return;
    }

    if (!message) {
      statusDisplay.textContent = '❌ Введіть текст повідомлення';
      statusDisplay.style.color = 'var(--danger)';
      return;
    }

    if (!state.telegramToken) {
      statusDisplay.textContent = '❌ Токен бота не встановлено';
      statusDisplay.style.color = 'var(--danger)';
      return;
    }

    // Simulate sending
    statusDisplay.textContent = '📨 Надсилання повідомлення...';
    statusDisplay.style.color = 'var(--muted)';

    setTimeout(() => {
      statusDisplay.textContent = '✅ Тестове повідомлення надіслано! (это демо-режим)';
      statusDisplay.style.color = 'var(--accent)';
      showToast(`📨 Повідомлення надіслано в чат ${chatId}`);
      document.getElementById('test-chat-id').value = '';
      document.getElementById('test-message').value = '';
    }, 1000);
  });
}

render();
setInterval(() => render(), 60000);
