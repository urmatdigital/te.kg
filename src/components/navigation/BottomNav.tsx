'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Package, ShoppingBag, Wallet, User } from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';

const navItems = [
  {
    label: 'Главная',
    icon: Home,
    href: '/',
  },
  {
    label: 'Товары',
    icon: ShoppingBag,
    href: '/products',
  },
  {
    label: 'Посылки',
    icon: Package,
    href: '/tracking',
  },
  {
    label: 'Финансы',
    icon: Wallet,
    href: '/finances',
  },
  {
    label: 'Профиль',
    icon: User,
    href: '/profile',
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 pb-safe">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center justify-center flex-1 h-16 text-xs ${
                  active ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                }`}
              >
                <item.icon className={`w-6 h-6 mb-1 ${
                  active ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                }`} />
                {item.label}
              </button>
            );
          })}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
