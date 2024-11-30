'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { getTelegramWebApp } from '@/utils/telegram'
import Image from 'next/image'

interface TelegramUserData {
  id: number;
  first_name: string;
  last_name: string | null;
  username: string | null;
  photo_url: string | null;
  phone_number?: string;
  language_code: string | null;
}

export function UserProfile() {
  const [userData, setUserData] = useState<TelegramUserData | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useStore()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        // Получаем данные из Telegram WebApp
        const webApp = getTelegramWebApp()
        if (webApp && webApp.initDataUnsafe.user) {
          const telegramUser = webApp.initDataUnsafe.user
          setUserData({
            id: telegramUser.id,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name || null,
            username: telegramUser.username || null,
            photo_url: telegramUser.photo_url || null,
            language_code: telegramUser.language_code || null
          })

          // Обновляем данные в Supabase
          const { error } = await supabase
            .from('users')
            .update({
              first_name: telegramUser.first_name,
              last_name: telegramUser.last_name,
              username: telegramUser.username,
              photo_url: telegramUser.photo_url,
              language_code: telegramUser.language_code,
              last_seen: new Date().toISOString()
            })
            .eq('telegram_id', telegramUser.id)

          if (error) {
            console.error('Error updating user data:', error)
          }
        } else {
          // Если нет данных из WebApp, получаем из Supabase
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', user?.user_metadata?.telegram_id)
            .single()

          if (error) {
            console.error('Error fetching user data:', error)
          } else if (data) {
            setUserData({
              id: data.telegram_id,
              first_name: data.first_name,
              last_name: data.last_name || null,
              username: data.username || null,
              photo_url: data.photo_url || null,
              language_code: data.language_code || null
            })
          }
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <Card className="p-6">
      <div className="flex items-start space-x-6">
        {userData.photo_url ? (
          <div className="relative w-20 h-20">
            <Image
              src={userData.photo_url}
              alt={userData.first_name}
              fill
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-2xl text-blue-600">
              {userData.first_name.charAt(0)}
            </span>
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {userData.first_name} {userData.last_name}
            </h2>
          </div>

          <div className="mt-2 space-y-2 text-gray-600">
            {userData.username && (
              <p className="flex items-center">
                <span className="font-medium">Username:</span>
                <span className="ml-2">@{userData.username}</span>
              </p>
            )}
            <p className="flex items-center">
              <span className="font-medium">Telegram ID:</span>
              <span className="ml-2">{userData.id}</span>
            </p>
            {userData.language_code && (
              <p className="flex items-center">
                <span className="font-medium">Language:</span>
                <span className="ml-2">{userData.language_code.toUpperCase()}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
