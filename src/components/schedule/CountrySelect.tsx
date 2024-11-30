'use client';

import { ChevronDown } from 'lucide-react';
import { CountryOption } from '@/types/schedule';
import ReactCountryFlag from 'react-country-flag';

interface CountrySelectProps {
  label: string;
  value: CountryOption;
  onChange: (country: CountryOption) => void;
  options: CountryOption[];
}

export function CountrySelect({
  label,
  value,
  onChange,
  options
}: CountrySelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <button
        onClick={() => {
          // TODO: Implement dropdown
          const nextIndex = (options.findIndex(o => o.value === value.value) + 1) % options.length;
          onChange(options[nextIndex]);
        }}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border rounded-lg hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <ReactCountryFlag
            countryCode={value.code}
            svg
            style={{
              width: '24px',
              height: '24px'
            }}
          />
          <span className="text-gray-900">{value.label}</span>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );
}
