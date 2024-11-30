'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { COUNTRIES, CountryOption, TransportType } from '@/types/schedule';
import { BottomNav } from '@/components/navigation/BottomNav';
import { CountrySelect } from '@/components/schedule/CountrySelect';
import { TransportTypeToggle } from '@/components/schedule/TransportTypeToggle';

// Sample schedule data with more realistic dates and additional information
const DEMO_SCHEDULE = [
  { fromDate: '18.09', toDate: '11.11', status: 'Ожидается', type: 'air' as TransportType, days: '54', route: 'Гуанчжоу-Львов' },
  { fromDate: '18.09', toDate: '11.11', status: 'Прибыл', type: 'air' as TransportType, days: '54', route: 'Гуанчжоу-Львов' },
  { fromDate: '20.09', toDate: '13.11', status: 'Ожидается', type: 'auto' as TransportType, days: '54', route: 'Иу-Львов' },
  { fromDate: '22.09', toDate: '15.11', status: 'Ожидается', type: 'air' as TransportType, days: '54', route: 'Гуанчжоу-Львов' },
  { fromDate: '25.09', toDate: '18.11', status: 'Прибыл', type: 'auto' as TransportType, days: '54', route: 'Иу-Львов' },
  { fromDate: '25.09', toDate: '18.11', status: 'Прибыл', type: 'air' as TransportType, days: '54', route: 'Гуанчжоу-Львов' },
  { fromDate: '25.09', toDate: '18.11', status: 'Ожидается', type: 'auto' as TransportType, days: '54', route: 'Иу-Львов' },
  { fromDate: '27.09', toDate: '20.11', status: 'Прибыл', type: 'air' as TransportType, days: '54', route: 'Гуанчжоу-Львов' },
];

export default function SchedulePage() {
  const router = useRouter();
  const [fromCountry, setFromCountry] = useState<CountryOption>(COUNTRIES.CHINA);
  const [toCountry, setToCountry] = useState<CountryOption>(COUNTRIES.UZBEKISTAN);
  const [transportType, setTransportType] = useState<TransportType>('auto');

  const filteredSchedule = DEMO_SCHEDULE.filter(item => item.type === transportType);

  const availableFromCountries = [COUNTRIES.CHINA];
  const availableToCountries = [COUNTRIES.KYRGYZSTAN, COUNTRIES.UZBEKISTAN];

  return (
    <main className="flex-1 pb-20">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">График отгрузок</h1>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-6 bg-gray-50 p-4 rounded-xl">
            <CountrySelect
              label="ВЫБЕРИТЕ СТРАНУ ОТПРАВКИ"
              value={fromCountry}
              onChange={setFromCountry}
              options={availableFromCountries}
            />

            <CountrySelect
              label="ВЫБЕРИТЕ СТРАНУ ДОСТАВКИ"
              value={toCountry}
              onChange={setToCountry}
              options={availableToCountries}
            />

            <TransportTypeToggle
              value={transportType}
              onChange={setTransportType}
            />
          </div>

          {/* Schedule Table */}
          <div className="bg-white rounded-lg shadow-sm border dark:bg-gray-800 dark:border-gray-700">
            <div className="grid grid-cols-4 px-4 py-3 border-b text-sm font-medium bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
              <div>Отправка</div>
              <div>Прибытие</div>
              <div>Маршрут</div>
              <div>Статус</div>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {filteredSchedule.map((item, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-4 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.fromDate}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({item.days} дней)</span>
                  </div>
                  <div>{item.toDate}</div>
                  <div className="text-gray-600 dark:text-gray-300">{item.route}</div>
                  <div className={`${
                    item.status === 'Прибыл' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
