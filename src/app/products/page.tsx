'use client';

import { BottomNav } from '@/components/navigation/BottomNav';

export default function ProductsPage() {
  return (
    <main className="flex-1 pb-20">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Товары</h1>
          <div className="text-center py-16">
            <p className="text-gray-500">Раздел в разработке</p>
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
