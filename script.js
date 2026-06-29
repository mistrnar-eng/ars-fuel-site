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
    telegramCommands: true,
    staffPanel: true,
  },
  adminAccount: { username: 'admin', password: '0000' },
  staffAccounts: [{ username: 'sub', password: '1111' }],
  onlineUsers: [
    { name: 'Адмін', role: 'admin' },
    { name: 'Олена', role: 'staff' },
  ],
  language: 'uk',
};

const translations = {
  uk: {
    telegramCommandsEyebrow: '🤖 Telegram Бот - Команди',
    telegramCommandsHeading: 'Управління через чат',
    botIdLabel: '📱 ID Бота:',
    copyBotId: '📋 Копіювати ID',
    readinessLabel: 'Рівень готовності',
    currentTimeLabel: 'Поточний час',
    supportLabel: 'Служба підтримки',
    originLabel: 'Оригінальна роль',
    welcomeMessage: 'Ласкаво просимо в АРС! Оберіть дію з кнопок нижче.',
    addPhonePrompt: 'Введіть додатковий номер телефону',
    addBotButtonLabel: 'Натисніть, щоб додати нову кнопку',
    addStaffPrompt: 'Введіть логін співробітника',
    downloadBotConfig: 'Завантажити конфігурацію бота',
    savedMessage: 'Зміни збережено',
    syncedBot: 'Бот синхронізовано',
    navStatus: 'Статус',
    navPrices: 'Ціни',
    navTelegram: 'Telegram',
    navAdmin: 'Управління',
    loginButton: 'Увійти',
    profileButton: 'Профіль',
    logoutLinkButton: 'Вийти',
    heroEyebrow: 'Преміальна заправка для дороги й бізнесу',
    heroHeading: 'Швидка заправка, чиста сервісна зона та прозорий режим роботи.',
    heroText: 'Сайт АРС дає змогу бачити актуальний стан роботи, цінники, повідомлення для всіх та персоналу, а також швидко змінювати параметри через адміністративну панель.',
    heroBtnStatus: 'Переглянути статус',
    heroBtnAdmin: 'Відкрити панель',
    loginModalTitle: 'Вхід до системи',
    loginPlaceholder: 'Введіть логін',
    passwordPlaceholder: 'Введіть пароль',
    loginSubmit: 'Увійти',
    saveButton: 'Зберегти зміни',
    downloadButton: 'Завантажити конфігурацію бота',
    addButtonLabel: 'Додати кнопку',
    addStaffBtn: 'Додати співробітника',
    chatIdPlaceholder: 'Введіть Telegram Chat ID',
    messagePlaceholder: 'Введіть текст повідомлення',
    sectionVisibilityHeading: 'Видимі колонки',
    sectionStatus: 'Стан',
    sectionPrices: 'Ціни',
    sectionPayments: 'Оплата',
    sectionMedia: 'Медіа',
    sectionTelegram: 'Telegram',
    sectionStaffPanel: 'Повідомлення персоналу',
  },
  en: {
    telegramCommandsEyebrow: '🤖 Telegram Bot - Commands',
    telegramCommandsHeading: 'Chat control panel',
    botIdLabel: '📱 Bot ID:',
    copyBotId: '📋 Copy ID',
    readinessLabel: 'Readiness level',
    currentTimeLabel: 'Current time',
    supportLabel: 'Support',
    originLabel: 'Current role',
    welcomeMessage: 'Welcome to ARS! Pick a button below to continue.',
    addPhonePrompt: 'Enter an additional phone number',
    addBotButtonLabel: 'Tap to add a new button',
    addStaffPrompt: 'Enter employee login',
    downloadBotConfig: 'Download bot config',
    savedMessage: 'Changes saved',
    syncedBot: 'Bot synced',
    navStatus: 'Status',
    navPrices: 'Prices',
    navTelegram: 'Telegram',
    navAdmin: 'Admin',
    loginButton: 'Login',
    profileButton: 'Profile',
    logoutLinkButton: 'Logout',
    heroEyebrow: 'Premium refueling for road and business',
    heroHeading: 'Fast refueling, clean service area, and transparent operation.',
    heroText: 'The ARS site shows current operating status, prices, announcements for everyone and staff, and allows fast changes through the admin panel.',
    heroBtnStatus: 'View status',
    heroBtnAdmin: 'Open dashboard',
    loginModalTitle: 'System login',
    loginPlaceholder: 'Enter login',
    passwordPlaceholder: 'Enter password',
    loginSubmit: 'Login',
    saveButton: 'Save changes',
    downloadButton: 'Download bot config',
    addButtonLabel: 'Add button',
    addStaffBtn: 'Add staff',
    chatIdPlaceholder: 'Enter Telegram Chat ID',
    messagePlaceholder: 'Enter message text',
    sectionVisibilityHeading: 'Visible sections',
    sectionStatus: 'Status',
    sectionPrices: 'Prices',
    sectionPayments: 'Payments',
    sectionMedia: 'Media',
    sectionTelegram: 'Telegram',
    sectionStaffPanel: 'Staff messages',
  },
  de: {
    telegramCommandsEyebrow: '🤖 Telegram-Bot - Befehle',
    telegramCommandsHeading: 'Steuerung über den Chat',
    botIdLabel: '📱 Bot-ID:',
    copyBotId: '📋 ID kopieren',
    readinessLabel: 'Bereitschaftsgrad',
    currentTimeLabel: 'Aktuelle Uhrzeit',
    supportLabel: 'Support',
    originLabel: 'Aktuelle Rolle',
    welcomeMessage: 'Willkommen bei ARS! Wählen Sie eine Schaltfläche aus.',
    addPhonePrompt: 'Geben Sie eine zusätzliche Telefonnummer ein',
    addBotButtonLabel: 'Klicken Sie, um eine neue Schaltfläche hinzuzufügen',
    addStaffPrompt: 'Geben Sie den Mitarbeiterlogin ein',
    downloadBotConfig: 'Bot-Konfiguration herunterladen',
    savedMessage: 'Änderungen gespeichert',
    syncedBot: 'Bot synchronisiert',
    navStatus: 'Status',
    navPrices: 'Preise',
    navTelegram: 'Telegram',
    navAdmin: 'Verwaltung',
    loginButton: 'Anmelden',
    profileButton: 'Profil',
    logoutLinkButton: 'Abmelden',
    heroEyebrow: 'Premium-Tanken für Straße und Geschäft',
    heroHeading: 'Schnelles Tanken, saubere Servicezone und transparenter Betrieb.',
    heroText: 'Die ARS-Seite zeigt den aktuellen Betriebsstatus, Preise, Ankündigungen für alle und Personal und ermöglicht schnelle Änderungen über das Admin-Panel.',
    heroBtnStatus: 'Status ansehen',
    heroBtnAdmin: 'Dashboard öffnen',
    loginModalTitle: 'Systemanmeldung',
    loginPlaceholder: 'Login eingeben',
    passwordPlaceholder: 'Passwort eingeben',
    loginSubmit: 'Anmelden',
    saveButton: 'Änderungen speichern',
    downloadButton: 'Bot-Konfiguration herunterladen',
    addButtonLabel: 'Taste hinzufügen',
    addStaffBtn: 'Mitarbeiter hinzufügen',
    chatIdPlaceholder: 'Telegram Chat ID eingeben',
    messagePlaceholder: 'Nachrichtentext eingeben',
    sectionVisibilityHeading: 'Sichtbare Bereiche',
    sectionStatus: 'Status',
    sectionPrices: 'Preise',
    sectionPayments: 'Zahlungen',
    sectionMedia: 'Medien',
    sectionTelegram: 'Telegram',
    sectionStaffPanel: 'Personalnachrichten',
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
      language: parsed.language || defaultState.language,
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
const commandsGrid = document.getElementById('commands-grid');
const additionalPhonesContainer = document.getElementById('additional-phones-container');
const brandName = document.getElementById('brand-name');
const languageButtons = document.querySelectorAll('.lang-button');
const sectionToggleInputs = document.querySelectorAll('.section-toggle');

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
  if (botIdDisplay) {
    botIdDisplay.textContent = state.telegramToken ? `Bot ID: ${getBotIdFromToken(state.telegramToken)}` : 'Введіть токен спочатку';
  }
}

function t(key) {
  return translations[state.language]?.[key] || translations.uk[key] || key;
}

function translatePage() {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      element.textContent = t(key);
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (key) {
      element.placeholder = t(key);
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach((element) => {
    const key = element.getAttribute('data-i18n-title');
    if (key) {
      element.title = t(key);
    }
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
  if (!commandsGrid || !botButtonList) return;
  commandsGrid.innerHTML = '';
  botButtonList.innerHTML = '';

  state.botButtons.forEach((button, index) => {
    const card = document.createElement('div');
    card.className = 'command-card';
    card.innerHTML = `
      <h4>${button.label}</h4>
      <code>${button.command}</code>
      <p>Натисніть для попереднього перегляду</p>
    `;
    const testButton = document.createElement('button');
    testButton.className = 'btn btn-sm';
    testButton.textContent = 'Тест';
    testButton.addEventListener('click', () => simulateBotCommand(button.command));
    card.appendChild(testButton);
    commandsGrid.appendChild(card);

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
    telegramCommands: document.getElementById('telegram-commands'),
  };

  Object.entries(sectionMap).forEach(([key, section]) => {
    if (!section) return;
    section.hidden = !state.visibleSections[key] || (key.startsWith('telegram') && !isStaff);
  });

  const navMap = {
    'nav-status': state.visibleSections.status,
    'nav-prices': state.visibleSections.prices,
    'nav-telegram': (state.visibleSections.telegram || state.visibleSections.telegramCommands) && isStaff,
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

  languageButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === state.language);
  });

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
  }

  document.getElementById('current-time').textContent = new Date().toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });

  translatePage();
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

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.language = button.dataset.lang;
    saveState();
    render();
  });
});

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
