import { NextResponse } from 'next/server';
import { clearAllData } from '@/lib/cleanup';

export async function POST(request: Request) {
  try {
    // Проверка админского токена
    const adminToken = request.headers.get('x-admin-token');
    if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const results = await clearAllData();
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Ошибка при очистке данных:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    );
  }
}
