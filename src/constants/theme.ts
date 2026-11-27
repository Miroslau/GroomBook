export const LAYOUT = {
  timeColumnWidth: 72,
  dividerWidth: 2,
  slotHeight: 80,
} as const;

export const DARK_THEME = {
  // Фоны (от глубокого к приподнятому)
  bgBase: '#0F1521',
  bgSurface: '#151E2E',
  bgCard: '#1C283D',
  bgCardPressed: '#23324B',

  // Текст (мягкий контраст без режущего глаза #FFFFFF)
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#5B6B82',
  textOnAccent: '#0F1521',

  // Акценты
  accentPrimary: '#E6A53B', // Янтарный: линия таймлайна, выбранный день, счётчики
  accentSoft: 'rgba(230, 165, 59, 0.14)',

  // Статус записи (спокойный изумрудный, не «кислотный»)
  statusConfirmedBg: 'rgba(16, 185, 129, 0.16)',
  statusConfirmedBorder: 'rgba(52, 211, 153, 0.35)',
  statusConfirmedText: '#34D399',

  // Разделители
  borderStrong: '#24324A',
  borderSubtle: '#192336',
  dividerAccent: 'rgba(230, 165, 59, 0.55)',

  infoText: '#60A5FA',
  infoBg: 'rgba(96, 165, 250, 0.14)',

  dangerText: '#F87171',
  dangerBg: 'rgba(248, 113, 113, 0.12)',
  dangerBorder: 'rgba(248, 113, 113, 0.35)',
} as const;
