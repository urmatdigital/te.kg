'use client';

import { TrackingCard } from '@/components/tracking/TrackingCard';
import { TrackingDashboard } from '@/components/tracking/TrackingDashboard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header as AppHeader } from '@/components/Header';
import { MessageCircle, Shield, Smartphone } from 'lucide-react';
import Image from 'next/image';

const sampleStatuses = [
  {
    title: 'Регистрация',
    date: '30.11.2024 19:32',
    isCompleted: true,
  },
  {
    title: 'Склад в Китае',
    date: '01.12.2024 10:15',
    isCompleted: true,
  },
  {
    title: 'В пути в Бишкек',
    date: '02.12.2024 08:45',
    isCompleted: false,
  },
  {
    title: 'Доставка клиенту',
    isCompleted: false,
  },
];

const sampleStatusCount = {
  total: 12,
  inTransit: 5,
  delivered: 4,
  pending: 3,
};

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const tid = localStorage.getItem('telegram_id');
    setIsLoggedIn(!!tid);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 pt-[72px] container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Добро пожаловать в Tulpar Express</h1>
            <p className="mb-8">Пожалуйста, войдите через Telegram для доступа к отслеживанию посылок</p>
            <button
              onClick={() => router.push('/auth')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
            >
              Войти через Telegram
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      <main className="flex-1 pt-[72px]">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Dashboard */}
          <section className="mb-8">
            <TrackingDashboard
              statusCount={sampleStatusCount}
              onSearch={handleSearch}
            />
          </section>

          {/* Tracking Cards */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Мои посылки
            </h2>
            <div className="space-y-4">
              <TrackingCard
                trackingNumber="43243256786786876"
                description="Посылка из Бишкека в Ош"
                weight="2.5 кг"
                statuses={sampleStatuses}
                onEdit={() => console.log('Edit clicked')}
                onDelete={() => console.log('Delete clicked')}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
