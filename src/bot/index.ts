import { Bot, InlineKeyboard, Context, Keyboard } from 'grammy';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения из .env файла
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = process.env.NEXT_PUBLIC_WEB_APP_URL;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!BOT_TOKEN) throw new Error('BOT_TOKEN is required');
if (!WEB_APP_URL) throw new Error('WEB_APP_URL is required');
if (!SUPABASE_URL) throw new Error('SUPABASE_URL is required');
if (!SUPABASE_ANON_KEY) throw new Error('SUPABASE_ANON_KEY is required');

console.log('Checking environment variables...');
console.log('BOT_TOKEN:', BOT_TOKEN ? '✓ Present' : '✗ Missing');
console.log('WEB_APP_URL:', WEB_APP_URL ? '✓ Present' : '✗ Missing');
console.log('SUPABASE_URL:', SUPABASE_URL ? '✓ Present' : '✗ Missing');
console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✓ Present' : '✗ Missing');

console.log('Starting bot with config:', {
  webAppUrl: WEB_APP_URL,
  botTokenPrefix: BOT_TOKEN.substring(0, 5) + '...',
  supabaseUrl: SUPABASE_URL
});

const bot = new Bot(BOT_TOKEN);

// Инициализируем Supabase клиент
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Функция для генерации случайного 6-значного кода
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Функция для генерации и сохранения кода подтверждения
async function generateAndSaveCode(telegramId: number): Promise<string> {
  try {
    // Генерируем 6-значный код
    const code = generateVerificationCode();
    const now = new Date();
    
    // Код действителен 5 минут
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

    console.log('Generating verification code:', {
      telegram_id: telegramId,
      code: code,
      expires_at: expiresAt.toISOString(),
      current_time: now.toISOString()
    });

    // Сначала деактивируем все старые коды для этого пользователя
    const { error: updateError } = await supabase
      .from('verification_codes')
      .update({ is_used: true })
      .eq('telegram_id', telegramId)
      .eq('is_used', false);

    if (updateError) {
      console.error('Error deactivating old codes:', updateError);
      throw new Error('Failed to deactivate old codes');
    }

    // Сохраняем новый код
    const { data, error } = await supabase
      .from('verification_codes')
      .insert([
        {
          telegram_id: telegramId,
          code: code,
          expires_at: expiresAt.toISOString(),
          is_used: false,
          created_at: now.toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving verification code:', error);
      throw new Error('Failed to save verification code');
    }

    console.log('Verification code saved successfully:', {
      id: data.id,
      telegram_id: data.telegram_id,
      expires_at: data.expires_at
    });

    return code;
  } catch (error) {
    console.error('Error in generateAndSaveCode:', error);
    throw error;
  }
}

// Функция для получения фото профиля пользователя
async function getUserProfilePhoto(ctx: Context): Promise<string | null> {
  try {
    const photos = await ctx.api.getUserProfilePhotos(ctx.from!.id, { limit: 1 });
    if (photos.total_count > 0) {
      const file = await ctx.api.getFile(photos.photos[0][0].file_id);
      const photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
      console.log('Got profile photo URL:', photoUrl);
      return photoUrl;
    }
    return null;
  } catch (error) {
    console.error('Error getting profile photo:', error);
    return null;
  }
}

// Функция для обработки пользователя
async function processUser(ctx: Context) {
  if (!ctx.from) {
    throw new Error('User context is missing');
  }

  try {
    console.log('Processing user:', ctx.from);

    // Получаем фото профиля
    const photoUrl = await getUserProfilePhoto(ctx);

    // Проверяем существование пользователя
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', ctx.from.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError);
      throw fetchError;
    }

    const userData = {
      telegram_id: ctx.from.id,
      first_name: ctx.from.first_name,
      last_name: ctx.from.last_name || null,
      username: ctx.from.username || null,
      language_code: ctx.from.language_code || null,
      photo_url: photoUrl,
      last_seen: new Date().toISOString()
    };

    if (existingUser) {
      console.log('Updating existing user');
      const { error: updateError } = await supabase
        .from('users')
        .update(userData)
        .eq('telegram_id', ctx.from.id);

      if (updateError) {
        console.error('Error updating user:', updateError);
        throw updateError;
      }

      return { isNewUser: false, userId: existingUser.id };
    } else {
      console.log('Creating new user with data:', userData);
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_seen: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting user:', insertError);
        throw insertError;
      }

      if (!newUser) {
        throw new Error('User was not created');
      }

      console.log('New user created:', newUser);
      return { isNewUser: true, userId: newUser.id };
    }
  } catch (error) {
    console.error('Error in processUser:', error);
    throw error;
  }
}

// Обработчик команды /start
bot.command('start', async (ctx) => {
  try {
    if (!ctx.message?.text) {
      await ctx.reply('Ошибка: неверный формат команды');
      return;
    }

    const startParam = ctx.message.text.split(' ')[1];
    
    // Если параметр get_code, генерируем код
    if (startParam === 'get_code') {
      const code = generateVerificationCode();
      const telegram_id = ctx.from.id;

      // Сохраняем код в базу данных
      const { error } = await supabase
        .from('verification_codes')
        .insert([
          {
            telegram_id,
            code,
            expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 минут
            is_used: false,
          },
        ]);

      if (error) {
        console.error('Error saving code:', error);
        await ctx.reply('Произошла ошибка при генерации кода. Пожалуйста, попробуйте позже.');
        return;
      }

      // Формируем URL для перехода
      const webAppUrl = process.env.NEXT_PUBLIC_WEB_APP_URL;
      const loginUrl = `${webAppUrl}/login?code=${code}`;

      // Отправляем сообщение с кодом и кнопкой
      await ctx.reply(`Ваш код подтверждения: ${code}`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Подтвердить вход',
                url: loginUrl,
              },
            ],
          ],
        },
      });
    } else {
      // Стандартное приветственное сообщение
      await ctx.reply(
        'Добро пожаловать в Tulpar Express! Для получения кода авторизации, пожалуйста, перейдите на сайт и нажмите "Получить код".'
      );
    }
  } catch (error) {
    console.error('Error in start command:', error);
    await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
  }
});

// Обработка нажатия на кнопку с кодом
bot.on('message:text', async (ctx) => {
  const text = ctx.message.text;
  
  // Проверяем, является ли текст 6-значным числом
  if (/^\d{6}$/.test(text)) {
    // Отправляем ссылку для входа
    const telegramId = ctx.from.id.toString();
    await ctx.reply(
      `[Войти в систему](${process.env.NEXT_PUBLIC_WEB_APP_URL}/login?telegram_id=${telegramId})`,
      {
        parse_mode: 'Markdown',
      }
    );
  }
});

// Обработка полученного контакта
bot.on('message:contact', async (ctx) => {
  try {
    if (!ctx.from || !ctx.message.contact) {
      throw new Error('Missing user or contact information');
    }

    // Проверяем, что контакт принадлежит пользователю
    if (ctx.from.id !== ctx.message.contact.user_id) {
      await ctx.reply('❌ Пожалуйста, отправьте свой собственный номер телефона.');
      return;
    }

    console.log('Received contact:', ctx.message.contact);

    // Обновляем номер телефона пользователя
    const { error: updateError } = await supabase
      .from('users')
      .update({
        phone_number: ctx.message.contact.phone_number,
        updated_at: new Date().toISOString()
      })
      .eq('telegram_id', ctx.from.id);

    if (updateError) {
      console.error('Error updating phone number:', updateError);
      throw updateError;
    }

    // Генерируем код подтверждения
    const verificationCode = await generateAndSaveCode(ctx.from.id);

    // Отправляем код подтверждения
    await ctx.reply(
      `📱 Ваш номер телефона успешно сохранен!\n\n🔐 Ваш код подтверждения: ${verificationCode}\n\nКод действителен в течение 5 минут.`,
      { parse_mode: 'HTML' }
    );

  } catch (error) {
    console.error('Error processing contact:', error);
    await ctx.reply('❌ Произошла ошибка при сохранении номера телефона. Пожалуйста, попробуйте позже.');
  }
});

// Запуск бота
async function startBot() {
  try {
    await bot.start();
    console.log('Bot started successfully');
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

startBot();

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('Received SIGINT signal');
  bot.stop();
});
process.once('SIGTERM', () => {
  console.log('Received SIGTERM signal');
  bot.stop();
});

export default bot;
