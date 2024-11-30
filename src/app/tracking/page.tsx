'use client';

import { useEffect, useState } from 'react';
import { TrackingList } from '@/components/tracking/TrackingList';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Plus } from 'lucide-react';

// Sample tracking data
const DEMO_TRACKINGS = [
  {
    id: '1',
    trackingNumber: 'SF139450623730',
    description: 'Часы',
    weight: '0.5 кг',
    statuses: [
      {
        status: 'Дата регистрации клиентом',
        date: '02.09.2024 07:44',
        completed: true
      },
      {
        status: 'Склад в Китае',
        date: '31.08.2024 10:59',
        completed: true
      },
      {
        status: 'Бишкек',
        date: 'нет данных',
        completed: false
      },
      {
        status: 'Выдан клиенту',
        date: 'нет данных',
        completed: false
      }
    ]
  }
];

export default function TrackingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const tid = localStorage.getItem('telegram_id');
    setIsLoggedIn(!!tid);
  }, []);

  if (isLoggedIn === null) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    window.location.href = '/';
    return null;
  }

  return (
    <main className="flex-1 pb-20">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Посылки</h1>
            <button
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
          
          <TrackingList initialTrackings={DEMO_TRACKINGS} />
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
