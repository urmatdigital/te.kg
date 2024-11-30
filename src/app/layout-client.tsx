'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import RootLayoutClient from '@/components/RootLayoutClient';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="apple-touch-startup-image" href="/icon-192x192.png" />
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
