'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Menu, X, Bell, Settings, Sun, Moon, LogOut, User } from 'lucide-react';

interface UserProfile {
  telegram_id: string;
  first_name: string;
  last_name: string | null;
  username: string | null;
  photo_url: string | null;
}

export function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    // Проверяем сохраненную тему при загрузке
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

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
        } else {
          console.error('Error fetching user:', error);
          handleLogout();
        }
      } else {
        router.push('/');
      }
      setIsLoaded(true);
    };

    fetchUserProfile();

    // Закрываем меню при клике вне его
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    // Очищаем локальное хранилище
    localStorage.clear();
    
    // Очищаем куки
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }

    // Очищаем сессию в Supabase
    await supabase.auth.signOut();

    // Перенаправляем на главную
    router.push('/');
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const getDisplayName = (user: UserProfile) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.first_name || user.username || 'Пользователь';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#020817] backdrop-blur-sm border-b border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
              <div className="relative h-8 md:h-12 w-8 md:w-12 transition-transform duration-300 group-hover:rotate-12">
                <Image
                  src="/logo.png"
                  alt="Tulpar Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="relative h-6 md:h-12 w-28 md:w-40 ml-2 transition-opacity duration-300 group-hover:opacity-80">
                <Image
                  src="/logo_text_horizont.svg"
                  alt="Tulpar Express"
                  width={160}
                  height={48}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Правая часть */}
          <div className="flex items-center space-x-4">
            {/* Тема */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
              aria-label={isDarkMode ? 'Включить светлую тему' : 'Включить темную тему'}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Профиль пользователя */}
            <div className="relative" ref={menuRef}>
              {isLoaded ? (
                user ? (
                  <div className="flex items-center">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center space-x-3 group focus:outline-none"
                    >
                      <div className="relative w-9 h-9 md:w-10 md:h-10">
                        {user.photo_url ? (
                          <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500 transition-all duration-300">
                            <Image
                              src={user.photo_url}
                              alt={getDisplayName(user)}
                              width={40}
                              height={40}
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-medium">
                            {getDisplayName(user).charAt(0)}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Выпадающее меню */}
                    {isMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 rounded-lg shadow-lg bg-[#0a101f] ring-1 ring-gray-800 py-1 z-50">
                        <div className="px-4 py-3 border-b border-gray-800">
                          <p className="text-sm font-medium text-white">
                            {getDisplayName(user)}
                          </p>
                          {user.username && (
                            <p className="text-sm text-gray-400">
                              @{user.username}
                            </p>
                          )}
                        </div>
                        
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-800/50 transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          Мой профиль
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Выйти
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 animate-pulse">
                    <div className="w-10 h-10 bg-gray-700 rounded-full" />
                  </div>
                )
              ) : (
                <div className="flex items-center space-x-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-700 rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
