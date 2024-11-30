import { createClient } from '@supabase/supabase-js';
import { MoyskladAPI } from './moysklad';

// Создаем функцию для инициализации Supabase клиента
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Отсутствуют необходимые переменные окружения для Supabase:\n' +
      (!supabaseUrl ? '- NEXT_PUBLIC_SUPABASE_URL\n' : '') +
      (!supabaseKey ? '- SUPABASE_SERVICE_ROLE_KEY (Требуется service_role ключ, не anon ключ)\n' : '')
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Функция очистки всех куков через API
export async function clearAllCookies() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/cleanup/cookies`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка при удалении куков');
    }

    const result = await response.json();
    return {
      success: result.success,
      message: `${result.message} (удалено ${result.count} куков)`
    };
  } catch (error) {
    console.error('Ошибка при очистке куков:', error);
    return {
      success: false,
      message: 'Ошибка при очистке куков',
      error
    };
  }
}

// Функция очистки сессий пользователей
export async function clearUserSessions() {
  try {
    const supabase = getSupabaseClient();

    // Сначала очищаем таблицу auth.sessions напрямую через SQL
    const { error: sessionsError } = await supabase.rpc('cleanup_all_sessions');
    
    if (sessionsError) {
      console.error('Ошибка при очистке сессий:', sessionsError);
    }

    return {
      success: !sessionsError,
      message: sessionsError 
        ? 'Ошибка при очистке сессий пользователей' 
        : 'Все сессии пользователей успешно удалены'
    };
  } catch (error) {
    console.error('Ошибка при очистке сессий:', error);
    return {
      success: false,
      message: 'Ошибка при очистке сессий пользователей',
      error
    };
  }
}

// Функция очистки данных из таблиц Supabase
export async function clearSupabaseTables() {
  try {
    const supabase = getSupabaseClient();

    // Сначала удаляем записи из таблицы verification_codes
    const { error: verificationError } = await supabase
      .from('verification_codes')
      .delete()
      .not('id', 'is', null);

    if (verificationError) {
      console.error('Ошибка при очистке verification_codes:', verificationError);
      throw verificationError;
    }

    // Затем удаляем записи из таблицы users
    const { error: usersError } = await supabase
      .from('users')
      .delete()
      .not('id', 'is', null);

    if (usersError) {
      console.error('Ошибка при очистке users:', usersError);
      throw usersError;
    }

    // Очищаем таблицу orders (если есть)
    const { error: ordersError } = await supabase
      .from('orders')
      .delete()
      .not('id', 'is', null);

    if (ordersError && !ordersError.message.includes('does not exist')) {
      console.error('Ошибка при очистке orders:', ordersError);
      throw ordersError;
    }

    return {
      success: true,
      message: 'Данные успешно удалены из таблиц Supabase'
    };
  } catch (error) {
    console.error('Ошибка при очистке таблиц Supabase:', error);
    return {
      success: false,
      message: 'Ошибка при очистке таблиц Supabase',
      error
    };
  }
}

// Функция очистки контрагентов из МойСклад
export async function clearMoyskladCounterparties() {
  try {
    const moysklad = new MoyskladAPI();
    
    // Получаем всех контрагентов
    const counterparties = await moysklad.getCounterparties();
    
    // Удаляем каждого контрагента
    const deletePromises = counterparties.map(async (counterparty) => {
      try {
        if (!counterparty.id) {
          return { success: false, error: 'ID контрагента не определен' };
        }
        await moysklad.deleteCounterparty(counterparty.id);
        return { success: true, id: counterparty.id };
      } catch (error) {
        return { success: false, id: counterparty.id, error };
      }
    });
    
    const results = await Promise.all(deletePromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return {
      success: failed === 0,
      message: `Удалено ${successful} контрагентов, ошибок: ${failed}`,
      details: results
    };
  } catch (error) {
    console.error('Ошибка при очистке контрагентов МойСклад:', error);
    return {
      success: false,
      message: 'Ошибка при очистке контрагентов МойСклад',
      error
    };
  }
}

interface CleanupResult {
  success: boolean;
  message: string;
  error?: unknown;
}

interface AllDataResult {
  success: boolean;
  message: string;
  results?: {
    cookies: CleanupResult;
    sessions: CleanupResult;
    supabase: CleanupResult;
    moysklad: CleanupResult;
  };
  error?: unknown;
}

// Главная функция очистки всех данных
export async function clearAllData(): Promise<AllDataResult> {
  try {
    const results = {
      cookies: await clearAllCookies(),
      sessions: await clearUserSessions(),
      supabase: await clearSupabaseTables(),
      moysklad: await clearMoyskladCounterparties()
    };

    const allSuccess = Object.values(results).every(r => r.success);
    
    return {
      success: allSuccess,
      message: allSuccess ? 'Все данные успешно очищены' : 'Не все операции выполнены успешно',
      results
    };
  } catch (error) {
    return {
      success: false,
      message: 'Ошибка при очистке данных',
      error
    };
  }
}
