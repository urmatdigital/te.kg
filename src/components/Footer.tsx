'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#020817] py-8 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Логотип и описание */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
              <div className="relative h-8 md:h-12 w-8 md:w-12 transition-transform duration-300 group-hover:rotate-12">
                <Image
                  src="/logo.png"
                  alt="Tulpar Logo"
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
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
            <p className="text-sm text-gray-400">
              Безопасная авторизация через Telegram
            </p>
          </div>

          {/* Навигация */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase">
              Навигация
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Документация
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Поддержка
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase">
              Контакты
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@tulpar.express</li>
              <li>Telegram: @tulparexpress</li>
              <li>GitHub: github.com/tulparexpress</li>
            </ul>
          </div>
        </div>

        {/* Копирайт */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-center text-sm text-gray-400">
              {new Date().getFullYear()} Tulpar Express. Все права защищены.
            </p>
            <Link
              href="https://asystem.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative h-6 w-24">
                <Image
                  src="/asystem.svg"
                  alt="ASystem"
                  fill
                  className="object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
