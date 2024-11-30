'use client';

import { TransportType } from '@/types/schedule';

interface TransportTypeToggleProps {
  value: TransportType;
  onChange: (type: TransportType) => void;
}

export function TransportTypeToggle({ value, onChange }: TransportTypeToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => onChange('air')}
        className={`px-4 py-3 rounded-lg text-center transition-colors ${
          value === 'air'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        Авиа
      </button>
      <button
        onClick={() => onChange('auto')}
        className={`px-4 py-3 rounded-lg text-center transition-colors ${
          value === 'auto'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        Авто
      </button>
    </div>
  );
}
