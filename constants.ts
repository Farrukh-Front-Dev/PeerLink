
import { Language } from './types';

export const API_BASE_URL = 'https://platform.21-school.ru/services/21-school/api/v1';
export const AUTH_URL = 'https://auth.21-school.ru/auth/realms/EduPowerKeycloak/protocol/openid-connect/token';
export const CORS_PROXY = 'https://corsproxy.io/?';
export const FALLBACK_IMAGE = 'https://rdwloaqrgzbczanwfqso.supabase.co/storage/v1/object/public/avatars/1752679843293_school21.jpg';

export const THEME_PRESETS = [
  // Top 5 Best Themes
  { id: 'cyber', name: 'Cyberpunk', primary: '0 243 255', secondary: '188 19 254', hex: '#00f3ff' }, // Cyan & Purple
  { id: 'matrix', name: 'Matrix', primary: '0 255 65', secondary: '0 143 17', hex: '#00ff41' },   // Green & Dark Green
  { id: 'sunset', name: 'Sunset', primary: '255 153 0', secondary: '255 0 85', hex: '#ff9900' },  // Orange & Pink
  { id: 'royal', name: 'Royal', primary: '255 215 0', secondary: '75 0 130', hex: '#ffd700' },    // Gold & Indigo
  { id: 'blood', name: 'Vampire', primary: '255 0 0', secondary: '100 0 0', hex: '#ff0000' },     // Red & Dark Red
];

export const TRANSLATIONS = {
  EN: {
    searchPlaceholder: 'Search login...',
    notFound: 'Participant not found',
    level: 'Level',
    exp: 'XP',
    skills: 'Skills',
    projects: 'Projects',
    badges: 'Badges',
    logtime: 'Logtime (Hours)',
    offlineMode: 'Offline Mode',
    settings: 'Settings',
    connect: 'Connect',
    login: 'Login',
    password: 'Password',
    authDesc: 'Enter your School21 credentials to access the platform.',
    loading: 'Loading profile...',
    logout: 'Logout',
    campus: 'Campus',
    class: 'Class',
    welcome: 'Welcome to PeerLink',
    loginSubtitle: 'School21 Profile Viewer',
    error: 'Error',
    status: {
      finished: 'Finished',
      in_progress: 'In Progress',
      failed: 'Failed',
      unavailable: 'Unavailable'
    },
    // New
    feedback: 'Feedback',
    xpHistory: 'XP History',
    courses: 'Courses',
    coalition: 'Coalition',
    location: 'Workstation',
    punctuality: 'Punctuality',
    interest: 'Interest',
    thoroughness: 'Thoroughness',
    friendliness: 'Friendliness',
    theme: 'Theme'
  },
  RU: {
    searchPlaceholder: 'Поиск логина...',
    notFound: 'Участник не найден',
    level: 'Уровень',
    exp: 'XP',
    skills: 'Навыки',
    projects: 'Проекты',
    badges: 'Значки',
    logtime: 'Логтайм (Часы)',
    offlineMode: 'Офлайн режим',
    settings: 'Настройки',
    connect: 'Войти',
    login: 'Логин',
    password: 'Пароль',
    authDesc: 'Введите учетные данные School21 для доступа к платформе.',
    loading: 'Загрузка профиля...',
    logout: 'Выйти',
    campus: 'Кампус',
    class: 'Класс',
    welcome: 'Добро пожаловать в PeerLink',
    loginSubtitle: 'Просмотр профилей School21',
    error: 'Ошибка',
    status: {
      finished: 'Завершен',
      in_progress: 'В процессе',
      failed: 'Провален',
      unavailable: 'Недоступен'
    },
    // New
    feedback: 'Отзывы',
    xpHistory: 'История XP',
    courses: 'Курсы',
    coalition: 'Коалиция',
    location: 'Рабочее место',
    punctuality: 'Пунктуальность',
    interest: 'Интерес',
    thoroughness: 'Тщательность',
    friendliness: 'Дружелюбие',
    theme: 'Тема'
  },
  UZ: {
    searchPlaceholder: 'Login qidirish...',
    notFound: 'Ishtirokchi topilmadi',
    level: 'Daraja',
    exp: 'XP',
    skills: 'Ko\'nikmalar',
    projects: 'Loyihalar',
    badges: 'Nishonlar',
    logtime: 'Logtime (Soatlar)',
    offlineMode: 'Oflayn rejim',
    settings: 'Sozlamalar',
    connect: 'Kirish',
    login: 'Login',
    password: 'Parol',
    authDesc: 'Platformaga kirish uchun School21 ma\'lumotlarini kiriting.',
    loading: 'Profil yuklanmoqda...',
    logout: 'Chiqish',
    campus: 'Kampus',
    class: 'Sinf',
    welcome: 'PeerLink-ga xush kelibsiz',
    loginSubtitle: 'School21 Profil Ko\'ruvchi',
    error: 'Xato',
    status: {
      finished: 'Tugatilgan',
      in_progress: 'Jarayonda',
      failed: 'Muvaffaqiyatsiz',
      unavailable: 'Mavjud emas'
    },
    // New
    feedback: 'Sharhlar',
    xpHistory: 'XP Tarixi',
    courses: 'Kurslar',
    coalition: 'Koalitsiya',
    location: 'Ish joyi',
    punctuality: 'Aniqlik',
    interest: 'Qiziqish',
    thoroughness: 'Mukammallik',
    friendliness: 'Do\'stonalik',
    theme: 'Mavzu'
  }
};
