'use client';

import { Package, Search, Truck, CheckCircle, Clock } from 'lucide-react';

interface StatusCount {
  total: number;
  inTransit: number;
  delivered: number;
  pending: number;
}

interface TrackingDashboardProps {
  statusCount: StatusCount;
  onSearch: (query: string) => void;
}

export function TrackingDashboard({ statusCount, onSearch }: TrackingDashboardProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Поиск по трек номеру..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {statusCount.total}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Всего посылок</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {statusCount.inTransit}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">В пути</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />
            </div>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {statusCount.delivered}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Доставлено</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            </div>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {statusCount.pending}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Ожидается</p>
        </div>
      </div>
    </div>
  );
}
