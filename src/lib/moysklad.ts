import { createClient } from '@supabase/supabase-js';

const MOYSKLAD_API_URL = 'https://api.moysklad.ru/api/remap/1.2';

// Интерфейсы
interface CounterpartyQueryParams {
  limit?: number;
  offset?: number;
  tags?: string;
}

interface CounterpartyAddress {
  postalCode?: string;
  country?: string;
  region?: string;
  city?: string;
  street?: string;
  house?: string;
  apartment?: string;
  addInfo?: string;
}

interface CounterpartyContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
}

export type CompanyType = 'legal' | 'entrepreneur' | 'individual';

export interface Counterparty {
  id?: string;
  name: string;
  code?: string;
  externalCode?: string;
  companyType: CompanyType;
  archived: boolean;
  created?: string;
  updated?: string;
  description?: string;
  phone?: string;
  fax?: string;
  email?: string;
  actualAddress?: string;
  actualAddressFull?: CounterpartyAddress;
  legalAddress?: string;
  legalAddressFull?: CounterpartyAddress;
  inn?: string;
  kpp?: string;
  ogrn?: string;
  ogrnip?: string;
  okpo?: string;
  legalTitle?: string;
  legalFirstName?: string;
  legalLastName?: string;
  legalMiddleName?: string;
  discountCardNumber?: string;
  birthDate?: string;
  sex?: 'male' | 'female';
  tags?: string[];
  contactpersons?: CounterpartyContact[];
}

interface CounterpartyResponse {
  rows: Counterparty[];
  meta: {
    size: number;
    limit: number;
    offset: number;
  };
}

interface CounterpartySearchParams {
  search?: string;
  filter?: string;
  limit?: number;
  offset?: number;
  order?: string;
}

export class MoyskladAPI {
  private login: string;
  private password: string;
  private basicAuth: string;

  constructor() {
    this.login = process.env.MOYSKLAD_LOGIN || '';
    this.password = process.env.MOYSKLAD_PASSWORD || '';
    
    if (!this.login || !this.password) {
      throw new Error('Отсутствуют учетные данные МойСклад');
    }

    this.basicAuth = Buffer.from(`${this.login}:${this.password}`).toString('base64');
  }

  // Получение списка контрагентов
  async getCounterparties(params: CounterpartyQueryParams = {}): Promise<Counterparty[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());
      if (params.tags) queryParams.append('tags', params.tags);

      const url = `${MOYSKLAD_API_URL}/entity/counterparty${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${this.basicAuth}`,
          'Accept-Encoding': 'gzip',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка API МойСклад: ${response.status}`);
      }

      const data = await response.json();
      return data.rows;
    } catch (error) {
      console.error('Ошибка при получении контрагентов:', error);
      throw error;
    }
  }

  // Удаление контрагента
  async deleteCounterparty(id: string): Promise<void> {
    try {
      const response = await fetch(`${MOYSKLAD_API_URL}/entity/counterparty/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${this.basicAuth}`
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка при удалении контрагента: ${response.status}`);
      }
    } catch (error) {
      console.error(`Ошибка при удалении контрагента ${id}:`, error);
      throw error;
    }
  }

  async getMoyskladToken(): Promise<string> {
    try {
      const response = await fetch(`${MOYSKLAD_API_URL}/security/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.basicAuth}`,
          'Accept-Encoding': 'gzip',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting Moysklad token:', error);
      throw error;
    }
  }

  async searchCounterparties(params: CounterpartySearchParams): Promise<CounterpartyResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.filter) {
      queryParams.append('filter', params.filter);
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.offset) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params.order) {
      queryParams.append('order', params.order);
    }

    const response = await fetch(`/api/moysklad/counterparties?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch counterparties');
    }
    return response.json();
  }

  async getCounterparty(id: string): Promise<Counterparty> {
    const response = await fetch(`/api/moysklad/counterparties/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch counterparty');
    }
    return response.json();
  }

  async createCounterparty(data: Partial<Counterparty>): Promise<Counterparty> {
    const response = await fetch('/api/moysklad/counterparties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create counterparty');
    }
    return response.json();
  }

  async updateCounterparty(id: string, data: Partial<Counterparty>): Promise<Counterparty> {
    const response = await fetch(`/api/moysklad/counterparties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update counterparty');
    }
    return response.json();
  }

  async saveMoyskladToken(userId: string, token: string) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase
      .from('users')
      .update({ moysklad_token: token })
      .eq('id', userId);

    if (error) {
      console.error('Error saving Moysklad token:', error);
      throw error;
    }
  }

  async validateMoyskladToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${MOYSKLAD_API_URL}/entity/counterparty?limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Encoding': 'gzip'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Экспортируем функции для использования в других модулях
export const {
  getCounterparty,
  updateCounterparty,
  searchCounterparties,
} = new MoyskladAPI();
