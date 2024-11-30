import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function SuccessPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Поздравляем! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Вы успешно авторизовались в системе Tulpar Express
          </p>
          <div className="text-sm text-gray-500">
            <p className="mb-2">
              Добро пожаловать, {session.user.user_metadata.full_name || 'Пользователь'}!
            </p>
            <p>
              Телефон: {session.user.user_metadata.phone_number || 'Не указан'}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Перейти в личный кабинет
          </button>
          <button
            onClick={() => window.Telegram?.WebApp?.close()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
