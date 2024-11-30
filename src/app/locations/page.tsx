'use client'

import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { LocationsSection } from '@/components/dashboard/LocationsSection'
import { MobileMenu } from '@/components/dashboard/MobileMenu'
import { Card } from '@/components/ui/Card'
import { MapPin } from 'lucide-react'

export default function LocationsPage() {
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
          Пункты приема
        </h1>

        <div className="space-y-6">
          <LocationsSection />

          <Card variant="default" className="p-6">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d93561.93331260461!2d74.5698!3d42.8746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389eb7dc91b3c881%3A0x492ebaf57cdee27d!2z0JHQuNGI0LrQtdC6!5e0!3m2!1sru!2skg!4v1234567890"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              />
            </div>
          </Card>

          <Card variant="default" className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              График работы пунктов приема
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Будние дни (Пн-Пт)</h3>
                <p className="text-gray-600 dark:text-gray-300">09:00 - 18:00</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Суббота</h3>
                <p className="text-gray-600 dark:text-gray-300">10:00 - 16:00</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Воскресенье</h3>
                <p className="text-gray-600 dark:text-gray-300">Выходной</p>
              </div>
            </div>
          </Card>
        </div>

        <MobileMenu />
      </div>
    </div>
  )
}
