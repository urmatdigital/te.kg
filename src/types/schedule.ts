export type TransportType = 'air' | 'auto';

export interface ShippingScheduleItem {
  fromDate: string;
  toDate: string;
  status: 'Ожидается' | 'Прибыл';
  type: TransportType;
}

export interface CountryOption {
  label: string;
  value: string;
  code: string; // ISO country code for flag
}

export const COUNTRIES: Record<string, CountryOption> = {
  CHINA: {
    label: 'Китай',
    value: 'china',
    code: 'CN'
  },
  KYRGYZSTAN: {
    label: 'Кыргызстан',
    value: 'kyrgyzstan',
    code: 'KG'
  },
  UZBEKISTAN: {
    label: 'Узбекистан',
    value: 'uzbekistan',
    code: 'UZ'
  }
};
