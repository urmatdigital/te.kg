import { TelegramUser } from '@/types/telegram';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cheerful-anchovy-factually.ngrok-free.app/api';

export async function validateTelegramData(checkString: string, hash: string) {
  try {
    const response = await fetch(`${API_URL}/auth/validate-telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ checkString, hash }),
    });

    if (!response.ok) {
      throw new Error('Validation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error validating Telegram data:', error);
    throw error;
  }
}

export async function authenticateWithTelegram(userData: TelegramUser) {
  try {
    const response = await fetch(`${API_URL}/auth/telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error authenticating with Telegram:', error);
    throw error;
  }
}
