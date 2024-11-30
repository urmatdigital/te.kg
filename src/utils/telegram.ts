import { TelegramWebAppInitData, TelegramUser } from '@/types/telegram';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          query_id?: string;
          user?: TelegramUser;
          auth_date: string;
          hash: string;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
          setParams: (params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
          }) => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        onEvent: (eventType: string, callback: () => void) => void;
        offEvent: (eventType: string, callback: () => void) => void;
      };
    };
  }
}

export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    return window.Telegram.WebApp;
  }
  return null;
};

export const parseTelegramInitData = (initData: string): TelegramWebAppInitData => {
  try {
    const params = new URLSearchParams(initData);
    const data: Partial<TelegramWebAppInitData> = {};
    
    // Получаем hash отдельно, так как он может содержать специальные символы
    const [baseData, hash] = initData.split('&hash=');
    data.hash = hash;

    // Парсим остальные данные
    for (const [key, value] of params.entries()) {
      if (key === 'user') {
        data.user = JSON.parse(value);
      } else if (key === 'auth_date') {
        data.auth_date = value;
      } else if (key === 'query_id') {
        data.query_id = value;
      }
    }

    return data as TelegramWebAppInitData;
  } catch (error) {
    console.error('Error parsing Telegram init data:', error);
    throw new Error('Failed to parse Telegram init data');
  }
};

export const validateAuthDate = (authDate: number): boolean => {
  const MAX_AGE = 86400; // 24 hours
  const now = Math.floor(Date.now() / 1000);
  return now - authDate < MAX_AGE;
};
