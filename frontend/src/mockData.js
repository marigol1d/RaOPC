export const initiatorTickets = [
  {
    id: 'IT-1042',
    subject: 'Не открывается отчёт по продажам',
    category: 'Отчёты',
    status: 'ai_answered',
    priority: 'high',
    lastUpdate: 'Сегодня, 10:24',
    aiSummary:
      'Проверьте права доступа к разделу «Продажи» и обновите страницу. Если проблема сохранится, приложите скриншот ошибки.',
  },
  {
    id: 'IT-1043',
    subject: 'Ошибка 500 при сохранении профиля',
    category: 'Профиль',
    status: 'in_progress',
    priority: 'normal',
    lastUpdate: 'Сегодня, 09:10',
    aiSummary:
      'Сервис профилей нестабилен. Команда поддержки уже разбирается с проблемой.',
  },
  {
    id: 'IT-1039',
    subject: 'Предложение по улучшению формы заявки',
    category: 'Улучшения',
    status: 'closed',
    priority: 'low',
    lastUpdate: 'Вчера, 17:42',
    aiSummary:
      'Предложение зафиксировано в бэклоге продукта. О статусе внедрения сообщим дополнительно.',
  },
];

export const ticketThreads = {
  'IT-1042': [
    {
      id: 1,
      from: 'user',
      author: 'Инициатор',
      ts: '10:21',
      text: 'После нажатия «Сформировать отчёт» появляется пустой экран.',
    },
    {
      id: 2,
      from: 'ai',
      author: 'IntelliTicket AI',
      ts: '10:22',
      text: 'Проверьте, есть ли у вас права на раздел «Продажи», и попробуйте открыть отчёт в режиме инкогнито. Если ошибка сохранится, приложите скриншот.',
    },
  ],
  'IT-1043': [
    {
      id: 1,
      from: 'user',
      author: 'Инициатор',
      ts: '09:05',
      text: 'При сохранении профиля периодически появляется ошибка 500.',
    },
    {
      id: 2,
      from: 'ai',
      author: 'IntelliTicket AI',
      ts: '09:06',
      text: 'Похоже на временный сбой сервиса. Попробуйте выйти и снова войти. Мы передали информацию оператору поддержки.',
    },
  ],
  'IT-1039': [
    {
      id: 1,
      from: 'user',
      author: 'Инициатор',
      ts: '17:30',
      text: 'Было бы удобно сохранять черновик заявки, не отправляя её.',
    },
    {
      id: 2,
      from: 'ai',
      author: 'IntelliTicket AI',
      ts: '17:32',
      text: 'Идея принята. Мы передадим её продуктовой команде и сообщим о статусе реализации.',
    },
  ],
};

export const agentQueue = [
  {
    id: 'IT-1042',
    subject: 'Не открывается отчёт по продажам',
    source: 'ai_failed',
    status: 'waiting_operator',
    sla: 'Ответить за 25 мин',
    unread: true,
    category: 'Отчёты',
    priority: 'high',
  },
  {
    id: 'IT-1043',
    subject: 'Ошибка 500 при сохранении профиля',
    source: 'ai_escalation',
    status: 'in_progress',
    sla: 'В работе',
    unread: false,
    category: 'Профиль',
    priority: 'normal',
  },
  {
    id: 'IT-1039',
    subject: 'Предложение по улучшению формы заявки',
    source: 'direct',
    status: 'queued',
    sla: 'Низкий приоритет',
    unread: false,
    category: 'Улучшения',
    priority: 'low',
  },
];

export const managerMetrics = {
  avgFirstResponse: '6 мин',
  aiResolutionShare: '42 %',
  csat: '4.6 / 5',
  openTickets: 18,
  aiOnlyTickets: 37,
  operatorTickets: 51,
};

export const managerTicketsByCategory = [
  { category: 'Отчёты', total: 34, open: 5, aiResolved: 18 },
  { category: 'Доступ и права', total: 21, open: 3, aiResolved: 7 },
  { category: 'Платёж', total: 15, open: 4, aiResolved: 2 },
  { category: 'Профиль', total: 19, open: 2, aiResolved: 8 },
  { category: 'Улучшения', total: 9, open: 4, aiResolved: 3 },
];

export const managerRecentRatings = [
  { id: 'IT-1040', score: 5, comment: 'ИИ предложил точное решение' },
  {
    id: 'IT-1038',
    score: 4,
    comment: 'Оператор помог, но потребовалось время',
  },
  {
    id: 'IT-1035',
    score: 2,
    comment: 'Пришлось несколько раз объяснять проблему',
  },
];

export const managerUsers = [
  {
    id: 1,
    name: 'Анна Петрова',
    email: 'anna.petrova@example.com',
    role: 'Оператор',
    status: 'Активен',
  },
  {
    id: 2,
    name: 'Иван Смирнов',
    email: 'ivan.smirnov@example.com',
    role: 'Оператор',
    status: 'Активен',
  },
  {
    id: 3,
    name: 'Ольга Коваль',
    email: 'olga.koval@example.com',
    role: 'Менеджер',
    status: 'Активен',
  },
  {
    id: 4,
    name: 'Служебный ИИ-бот',
    email: 'bot@intelliticket.ai',
    role: 'Сервисная учётная запись',
    status: 'Заблокирован',
  },
];
