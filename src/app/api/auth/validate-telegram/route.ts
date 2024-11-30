import { createHash, createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { TelegramUser } from '@/types/telegram';

function createDataCheckString(data: Record<string, any>): string {
  // Создаем массив для сортировки
  const checkArray = [];
  
  // Добавляем только нужные поля в правильном формате
  if (data.auth_date) checkArray.push(`auth_date=${data.auth_date}`);
  if (data.query_id) checkArray.push(`query_id=${data.query_id}`);
  if (data.signature) checkArray.push(`signature=${data.signature}`);
  if (data.user) checkArray.push(`user=${data.user}`);

  // Сортируем по алфавиту и соединяем с переносом строки
  return checkArray.sort().join('\\n');
}

async function validateTelegramWebAppData(initData: string, hash: string): Promise<boolean> {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined');
    }

    // Создаем секретный ключ из токена бота
    const secretKey = createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN as string)
      .digest();

    // Создаем строку для проверки
    const dataCheckString = createDataCheckString(
      Object.fromEntries(new URLSearchParams(initData.split('&hash=')[0]))
    );

    // Вычисляем хеш
    const calculatedHash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Сравниваем хеши
    return calculatedHash === hash;
  } catch (error) {
    console.error('Error validating Telegram data:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { user: userJson, auth_date, hash } = await request.json();
    
    if (!userJson || !auth_date || !hash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Парсим данные пользователя
    const telegramUser: TelegramUser = JSON.parse(userJson);

    // Проверяем валидность данных
    const isValid = await validateTelegramWebAppData(
      `auth_date=${auth_date}&user=${userJson}`,
      hash
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid Telegram data' },
        { status: 401 }
      );
    }

    // Создаем или обновляем пользователя в Supabase
    const { data: user, error: upsertError } = await supabase
      .from('users')
      .upsert({
        telegram_id: Number(telegramUser.id),
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        username: telegramUser.username,
        language_code: telegramUser.language_code,
        photo_url: telegramUser.photo_url,
        auth_date: new Date(parseInt(auth_date) * 1000).toISOString(),
      })
      .select()
      .single();

    if (upsertError) {
      throw upsertError;
    }

    // Создаем сессию
    const { data: { session }, error: sessionError } = await supabase.auth.signInWithPassword({
      email: `${telegramUser.id}@telegram.user`,
      password: createHash('sha256').update(hash).digest('hex'),
    });

    if (sessionError) {
      throw sessionError;
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error in Telegram validation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
