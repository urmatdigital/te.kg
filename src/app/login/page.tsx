'use client';

import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const VerificationInput = ({ value, onChange, onComplete }: { 
  value: string; 
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
}) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (index: number, value: string) => {
    if (value.length > 1) {
      // Обработка вставки
      const pastedValue = value.slice(0, 6).replace(/\D/g, '');
      const newValue = pastedValue.padEnd(6, '');
      onChange(newValue);
      if (pastedValue.length === 6) {
        onComplete(pastedValue);
      }
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newValue = value.slice(0, 1);
    const currentValue = Array.from(value || '').slice(0, 6);
    currentValue[index] = newValue;
    const finalValue = currentValue.join('');
    onChange(finalValue);

    if (newValue && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (finalValue.length === 6) {
      onComplete(finalValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
            return undefined;
          }}
          type="text"
          maxLength={6}
          value={value[index] || ''}
          onChange={(e) => handleInput(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-12 text-center border rounded-lg text-xl"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          id={`code-${index}`}
        />
      ))}
    </div>
  );
};

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Получаем код из URL
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('code');

    // Если есть код в URL, автоматически заполняем его
    if (urlCode && urlCode.length === 6) {
      setCode(urlCode);
      // Автоматически запускаем проверку кода
      verifyCode(urlCode);
    }
  }, []);

  const verifyCode = async (verificationCode: string) => {
    if (verificationCode.length !== 6) {
      setError('Код должен состоять из 6 цифр');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const currentTime = new Date().toISOString();
      
      // Проверяем код в базе данных
      const { data: verificationData, error: verificationError } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('code', verificationCode)
        .eq('is_used', false)
        .gt('expires_at', currentTime)
        .single();

      if (verificationError || !verificationData) {
        setError('Неверный или истекший код подтверждения');
        return;
      }

      // Помечаем код как использованный
      const { error: updateError } = await supabase
        .from('verification_codes')
        .update({ is_used: true })
        .eq('code', verificationCode);

      if (updateError) {
        console.error('Error updating verification code:', updateError);
        setError('Ошибка при проверке кода');
        return;
      }

      // Сохраняем telegram_id в localStorage и cookies
      const telegramId = verificationData.telegram_id;
      localStorage.setItem('telegram_id', telegramId);
      document.cookie = `telegram_id=${telegramId}; path=/; max-age=2592000`; // 30 дней
      
      // Перенаправляем на профиль
      window.location.href = '/profile';

    } catch (error) {
      console.error('Error verifying code:', error);
      setError('Ошибка при проверке кода');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Введите код подтверждения
        </h1>
        
        <VerificationInput
          value={code}
          onChange={setCode}
          onComplete={verifyCode}
        />

        {error && (
          <div className="mt-4 text-red-500 text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-4 text-center text-gray-500">
            Проверка кода...
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Код был отправлен в Telegram бота
        </div>
      </div>
    </div>
  );
}
