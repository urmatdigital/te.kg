import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TelegramUser } from '@/types/telegram';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase credentials are not defined');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const userData: TelegramUser = await request.json();

    // Проверяем существует ли пользователь
    const { data: existingUser, error: searchError } = await supabase
      .from('users')
      .select()
      .eq('telegram_id', userData.id)
      .single();

    if (searchError && searchError.code !== 'PGRST116') {
      throw searchError;
    }

    let userId = existingUser?.id;

    if (!existingUser) {
      // Создаем нового пользователя
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          telegram_id: userData.id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          username: userData.username,
          photo_url: userData.photo_url
        })
        .select()
        .single();

      if (insertError) throw insertError;
      userId = newUser.id;
    }

    // Создаем JWT токен и сессию
    const { data, error: authError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: `${userData.id}@telegram.user`,
      options: {
        data: {
          telegram_id: userData.id,
          provider: 'telegram'
        }
      }
    });

    if (authError) throw authError;

    return NextResponse.json({
      success: true,
      token: data.properties.hashed_token
    });
  } catch (error) {
    console.error('Error authenticating with Telegram:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 400 }
    );
  }
}
