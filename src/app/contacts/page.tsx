'use client'

import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { ContactsSection } from '@/components/dashboard/ContactsSection'
import { MobileMenu } from '@/components/dashboard/MobileMenu'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MessageSquare } from 'lucide-react'

export default function ContactsPage() {
  const router = useRouter()
  const user = useStore((state) => state.user)

  if (!user) {
    router.replace('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Контакты
        </h1>

        <div className="space-y-6">
          <ContactsSection />

          <Card variant="default" className="p-6">
            <h2 className="text-lg font-semibold mb-4">Напишите нам</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Тема обращения
                </label>
                <select className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2">
                  <option>Общий вопрос</option>
                  <option>Отследить посылку</option>
                  <option>Проблема с доставкой</option>
                  <option>Другое</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Сообщение
                </label>
                <textarea
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 h-32"
                  placeholder="Опишите ваш вопрос..."
                />
              </div>

              <Button className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Отправить сообщение
              </Button>
            </form>
          </Card>
        </div>

        <MobileMenu />
      </div>
    </div>
  )
}
