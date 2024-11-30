import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BOT_USERNAME = 'tulparexpress_bot';

export const TELEGRAM_COMMANDS = {
  START: '/start',
  HELP: '/help',
  TRACK: '/track',
  PROFILE: '/profile',
  CALCULATOR: '/calculator',
  SUPPORT: '/support',
  SETTINGS: '/settings',
} as const;

export const TELEGRAM_MESSAGES = {
  WELCOME_NEW: `🌟 Добро пожаловать в TULPAR EXPRESS!

Мы рады приветствовать вас в нашем сервисе международной доставки! 

🎁 Ваш код авторизации: {code}

📱 Для входа в личный кабинет:
1. Вернитесь на сайт
2. Введите полученный код
3. Нажмите "Войти"

📦 После авторизации вам будут доступны:
• ✈️ Отслеживание посылок
• 💰 Расчет стоимости доставки
• 📊 Личный кабинет
• 💬 Чат с поддержкой

❓ Используйте /help для просмотра всех команд`,

  WELCOME_BACK: `👋 С возвращением в TULPAR EXPRESS!

🎁 Ваш код авторизации: {code}

📱 Для входа в личный кабинет:
1. Вернитесь на сайт
2. Введите полученный код
3. Нажмите "Войти"

📦 Ваши активные посылки и другие функции станут доступны после авторизации`,

  HELP: `📚 Команды TULPAR EXPRESS:

📦 Посылки и доставка:
• 📍 /track - Отследить посылку
• 🧮 /calculator - Рассчитать стоимость

👤 Личный кабинет:
• 💼 /profile - Управление посылками
• ⚙️ /settings - Настройки профиля

🤝 Поддержка:
• 🆘 /support - Чат с оператором
• ❓ /help - Эта справка

💡 Подсказка: для полного доступа необходима авторизация на сайте`,

  UNAUTHORIZED: `⚠️ Для доступа к этой функции требуется авторизация

🔑 Как авторизоваться:
1. Перейдите по ссылке ниже
2. Получите код в этом чате
3. Введите код на сайте

🌐 Ссылка для авторизации:
https://t.me/${BOT_USERNAME}/start?start=auth`,

  TRACK_HELP: `📦 Отслеживание посылки:

• Введите команду /track с номером
• Пример: /track AB123456789CD

💡 В личном кабинете доступно отслеживание всех ваших посылок`,

  CALCULATOR_HELP: `🧮 Калькулятор стоимости:

Укажите параметры посылки:
• 📏 Габариты (ДxШxВ)
• ⚖️ Вес
• 📍 Город получения

💰 Поддерживаемые валюты:
• 🇷🇺 RUB
• 🇺🇸 USD
• 🇨🇳 CNY`,

  SUPPORT_WELCOME: `🤝 Поддержка TULPAR EXPRESS

💬 Чем можем помочь?
• 📦 Статус посылки
• 💳 Вопросы оплаты
• 📝 Оформление заказа
• ❓ Другое

⏱️ Среднее время ответа: 5-10 минут`,
} as const;

export const generateAuthLink = (telegramId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  return `${baseUrl}/auth?telegram_id=${telegramId}&start=auth`;
};

export const handleTelegramCommand = async (command: string, telegramId: string, args?: string[]) => {
  const generateAuthCode = async () => {
    const authCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Сохраняем код в базу с временем жизни
    await supabase
      .from('auth_codes')
      .insert([
        {
          telegram_id: telegramId,
          code: authCode,
          expires_at: new Date(Date.now() + 15 * 60 * 1000) // 15 минут
        }
      ]);
    
    return authCode;
  };

  switch (command) {
    case TELEGRAM_COMMANDS.START:
      if (args?.[0] === 'get_code') {
        const authCode = await generateAuthCode();
        
        // Проверяем, новый ли это пользователь
        const { data: user } = await supabase
          .from('users')
          .select('id, created_at')
          .eq('telegram_id', telegramId)
          .single();

        // Возвращаем соответствующее сообщение с кодом
        return user 
          ? TELEGRAM_MESSAGES.WELCOME_BACK.replace('{code}', authCode)
          : TELEGRAM_MESSAGES.WELCOME_NEW.replace('{code}', authCode);
      }

      // Проверяем, новый ли это пользователь
      const { data: user } = await supabase
        .from('users')
        .select('id, created_at')
        .eq('telegram_id', telegramId)
        .single();

      return user ? TELEGRAM_MESSAGES.WELCOME_BACK : TELEGRAM_MESSAGES.WELCOME_NEW;

    case TELEGRAM_COMMANDS.HELP:
      return TELEGRAM_MESSAGES.HELP;

    case TELEGRAM_COMMANDS.TRACK:
      if (!args?.length) {
        return TELEGRAM_MESSAGES.TRACK_HELP;
      }
      // Здесь будет логика отслеживания посылки
      return `🔍 Поиск посылки с номером ${args[0]}...`;

    case TELEGRAM_COMMANDS.CALCULATOR:
      return TELEGRAM_MESSAGES.CALCULATOR_HELP;

    case TELEGRAM_COMMANDS.SUPPORT:
      return TELEGRAM_MESSAGES.SUPPORT_WELCOME;

    case TELEGRAM_COMMANDS.PROFILE:
    case TELEGRAM_COMMANDS.SETTINGS:
      return TELEGRAM_MESSAGES.UNAUTHORIZED;

    default:
      return TELEGRAM_MESSAGES.HELP;
  }
};
