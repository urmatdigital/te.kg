import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const telegramId = request.cookies.get('telegram_id')?.value

  // Защищаем /profile
  if (request.nextUrl.pathname === '/profile') {
    if (!telegramId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Редиректим с /login на /profile если пользователь авторизован
  if (request.nextUrl.pathname === '/login') {
    if (telegramId) {
      return NextResponse.redirect(new URL('/profile', request.url))
    }
  }

  return NextResponse.next()
}

// Указываем пути, для которых будет работать middleware
export const config = {
  matcher: ['/profile', '/login']
}
