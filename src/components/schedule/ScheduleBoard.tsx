'use client';

import { Ship } from 'lucide-react';
import { COUNTRIES } from '@/types/schedule';
import Link from 'next/link';

interface ScheduleItem {
  fromDate: string;
  toDate: string;
  status: 'Ожидается' | 'Прибыл';
}

const DEMO_SCHEDULE = [
  { fromDate: '18.09', toDate: '11.11', status: 'Прибыл' },
  { fromDate: '20.09', toDate: '13.11', status: 'Ожидается' },
  { fromDate: '25.09', toDate: '18.11', status: 'Ожидается' },
];

export function ScheduleBoard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold dark:text-white">Табло</h2>
        <Ship className="w-6 h-6 text-primary" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="px-4 py-2 border rounded-lg dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-300">Китай</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="px-4 py-2 border rounded-lg dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-300">Кыргызстан</span>
          </div>
        </div>

        {DEMO_SCHEDULE.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-8">
              <span className="text-lg font-medium dark:text-white">{item.fromDate}</span>
              <span className="text-gray-400">→</span>
              <span className="text-lg font-medium dark:text-white">≈ {item.toDate}</span>
            </div>
            <span className={`${
              item.status === 'Прибыл' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
            }`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>

      <Link 
        href="/schedule" 
        className="mt-6 block text-center py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        Все расписание
      </Link>
    </div>
  );
}
