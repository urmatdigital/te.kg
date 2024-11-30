'use client';

import { useEffect, useState } from 'react';
import { LogOut, User, Building2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';

interface UserProfile {
  telegram_id: string;
  first_name: string;
  last_name: string | null;
  username: string | null;
  photo_url: string | null;
}

interface Counterparty {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  actualAddress?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [counterpartiesLoading, setCounterpartiesLoading] = useState(false);
  const [counterpartiesError, setCounterpartiesError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const tid = localStorage.getItem('telegram_id');
      if (tid) {
        const { data, error } = await supabase
          .from('users')
          .select('telegram_id, first_name, last_name, username, photo_url')
          .eq('telegram_id', tid)
          .single();

        if (data && !error) {
          setUser(data);
          // После успешной загрузки профиля загружаем контрагентов
          fetchCounterparties();
        } else {
          console.error('Error fetching user:', error);
          handleLogout();
        }
      } else {
        window.location.href = '/';
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const fetchCounterparties = async () => {
    setCounterpartiesLoading(true);
    setCounterpartiesError(null);
    try {
      const response = await fetch('/api/moysklad/counterparties');
      if (!response.ok) {
        throw new Error('Failed to fetch counterparties');
      }
      const data = await response.json();
      setCounterparties(data.rows || []);
    } catch (error) {
      console.error('Error fetching counterparties:', error);
      setCounterpartiesError('Не удалось загрузить список контрагентов');
    } finally {
      setCounterpartiesLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    
    // Очищаем куки
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    
    window.location.href = '/';
  };

  const getDisplayName = (user: UserProfile) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.first_name || user.username || 'Пользователь';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020817]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020817] pt-24">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Профиль пользователя */}
        <div className="px-4 py-6 sm:px-0 mb-8">
          <div className="bg-[#0a101f] shadow-lg sm:rounded-lg border border-gray-800">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 md:w-24 md:h-24">
                  {user.photo_url ? (
                    <Image
                      src={user.photo_url}
                      alt={getDisplayName(user)}
                      width={96}
                      height={96}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      className="rounded-full ring-2 ring-blue-500"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-medium">
                      {getDisplayName(user).charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    {getDisplayName(user)}
                  </h3>
                  {user.username && (
                    <p className="text-gray-400">@{user.username}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">ID: {user.telegram_id}</p>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-800 pt-6">
                <h4 className="text-lg font-medium text-white mb-4">
                  Действия
                </h4>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-[#0a101f] transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Список контрагентов */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-[#0a101f] shadow-lg sm:rounded-lg border border-gray-800">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-6 w-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-white">Контрагенты</h2>
                </div>
                {!counterpartiesLoading && !counterpartiesError && (
                  <span className="text-sm text-gray-400">
                    Всего: {counterparties.length}
                  </span>
                )}
              </div>

              {counterpartiesLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-400">Загрузка контрагентов...</p>
                </div>
              )}

              {counterpartiesError && (
                <div className="text-center py-8">
                  <p className="text-red-500">{counterpartiesError}</p>
                  <button
                    onClick={fetchCounterparties}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Попробовать снова
                  </button>
                </div>
              )}

              {!counterpartiesLoading && !counterpartiesError && (
                <div className="space-y-4">
                  {counterparties.map((counterparty) => (
                    <div
                      key={counterparty.id}
                      className="p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                    >
                      <h3 className="text-lg font-medium text-white mb-2">
                        {counterparty.name}
                      </h3>
                      {counterparty.description && (
                        <p className="text-gray-400 text-sm mb-2">{counterparty.description}</p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {counterparty.email && (
                          <p className="text-gray-400">
                            Email: <span className="text-blue-400">{counterparty.email}</span>
                          </p>
                        )}
                        {counterparty.phone && (
                          <p className="text-gray-400">
                            Телефон: <span className="text-blue-400">{counterparty.phone}</span>
                          </p>
                        )}
                        {counterparty.actualAddress && (
                          <p className="text-gray-400 md:col-span-2">
                            Адрес: <span className="text-blue-400">{counterparty.actualAddress}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
