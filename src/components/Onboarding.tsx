'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const slides = [
  {
    title: 'Добро пожаловать в Tulpar Express',
    description: 'Безопасная авторизация через Telegram для вашего удобства',
    image: '/icon-192x192.png'
  },
  {
    title: 'Простая авторизация',
    description: 'Используйте Telegram для быстрого и безопасного входа',
    image: '/icon-192x192.png'
  },
  {
    title: 'Готово к использованию',
    description: 'Нажмите кнопку ниже, чтобы получить код в Telegram',
    image: '/icon-192x192.png'
  }
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete();
    // Формируем URL для открытия Telegram с командой
    const telegramUrl = `https://t.me/${botUsername}?start=get_code`;
    window.location.href = telegramUrl;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020817] flex flex-col items-center justify-between p-8">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        <div className="flex flex-col items-center mt-[-100px]">
          <div className="relative w-20 h-20 mb-4">
            <Image
              src={slides[currentSlide].image}
              alt="Tulpar Express"
              width={96}
              height={96}
              priority
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              className="animate-pulse"
            />
          </div>
          <div className="relative w-80 h-14 mb-12">
            <Image
              src="/logo_text.svg"
              alt="Tulpar Express"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          {slides[currentSlide].title}
        </h2>
        
        <p className="text-gray-400 text-center mb-8 text-sm">
          {slides[currentSlide].description}
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-md px-4 flex flex-col items-center">
        <button
          onClick={handleNext}
          className="w-full py-3 px-4 bg-white text-[#020817] rounded-lg font-medium hover:bg-gray-100 transition-colors mb-4"
        >
          {currentSlide === slides.length - 1 ? 'Получить код' : 'Далее'}
        </button>
        
        {currentSlide === slides.length - 1 && (
          <p className="text-gray-400 text-xs text-center">
            Продолжая, вы соглашаетесь с{' '}
            <Link href="/privacy-policy" className="text-white hover:underline">
              Политикой в отношении обработки персональных данных
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
