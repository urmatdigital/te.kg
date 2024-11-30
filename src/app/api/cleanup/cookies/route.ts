import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE() {
  try {
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    
    allCookies.forEach(cookie => {
      cookieStore.delete(cookie.name);
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Все куки успешно удалены',
      count: allCookies.length
    });
  } catch (error) {
    console.error('Ошибка при удалении куков:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Ошибка при удалении куков',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
