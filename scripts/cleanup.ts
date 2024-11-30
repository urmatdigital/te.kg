#!/usr/bin/env node
import { config } from 'dotenv';

// Загружаем переменные окружения до импорта модулей
config();

import { clearAllData, clearSupabaseTables, clearMoyskladCounterparties, clearAllCookies, clearUserSessions } from '../src/lib/cleanup.js';

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

const main = async () => {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();

  try {
    let result: AllDataResult | CleanupResult;

    switch (command) {
      case 'all':
        console.log('Очистка всех данных...');
        result = await clearAllData();
        break;

      case 'supabase':
        console.log('Очистка таблиц Supabase...');
        result = await clearSupabaseTables();
        break;

      case 'moysklad':
        console.log('Очистка контрагентов МойСклад...');
        result = await clearMoyskladCounterparties();
        break;

      case 'cookies':
        console.log('Очистка всех куков...');
        result = await clearAllCookies();
        break;

      case 'sessions':
        console.log('Очистка всех пользовательских сессий...');
        result = await clearUserSessions();
        break;

      default:
        console.error(`
Использование: npm run cleanup <команда>

Доступные команды:
  all       - очистить все данные (куки, сессии, таблицы Supabase и контрагентов МойСклад)
  supabase  - очистить только таблицы Supabase
  moysklad  - очистить только контрагентов МойСклад
  cookies   - очистить все куки
  sessions  - очистить все пользовательские сессии
        `);
        process.exit(1);
    }

    if (result.success) {
      if ('results' in result && result.results) {
        // Вывод детальных результатов для команды 'all'
        console.log('Результаты очистки:');
        Object.entries(result.results).forEach(([key, value]) => {
          console.log(`${key}: ${value.success ? '✓' : '✗'} ${value.message}`);
        });
      } else {
        console.log('Успешно:', result.message);
      }
      process.exit(0);
    } else {
      console.error('Ошибка:', result.message);
      if (result.error) console.error(result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('Критическая ошибка:', error);
    process.exit(1);
  }
};

main();
