'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Package, MapPin, Calendar, ChevronRight } from 'lucide-react'

interface ShipmentHistory {
  id: string
  trackingNumber: string
  status: string
  fromAddress: string
  toAddress: string
  date: string
  recipientName: string
}

export default function HistoryPage() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const [loading, setLoading] = useState(true)
  const [shipments, setShipments] = useState<ShipmentHistory[]>([])

  useEffect(() => {
    if (!user) {
      router.replace('/login')
      return
    }

    const fetchShipments = async () => {
      try {
        // TODO: Implement actual shipment history fetch
        // This is mock data
        setShipments([
          {
            id: '1',
            trackingNumber: 'TE123456',
            status: 'Доставлено',
            fromAddress: 'Бишкек, ул. Чуй 123',
            toAddress: 'Ош, ул. Ленина 45',
            date: '2024-01-20',
            recipientName: 'Азамат Асанов'
          },
          {
            id: '2',
            trackingNumber: 'TE123457',
            status: 'В пути',
            fromAddress: 'Ош, ул. Масалиева 78',
            toAddress: 'Бишкек, ул. Токтогула 89',
            date: '2024-01-19',
            recipientName: 'Айгуль Иманова'
          }
        ])
      } catch (error) {
        console.error('Error fetching shipments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchShipments()
  }, [user, router])

  if (!user) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Доставлено':
        return 'text-green-500'
      case 'В пути':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          История отправлений
        </h1>

        <div className="space-y-4">
          {shipments.map((shipment) => (
            <Card variant="default" className="p-4" key={shipment.id}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <span className="font-medium">#{shipment.trackingNumber}</span>
                  </div>
                  <span className={`font-medium ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-grow">
                      <p className="text-gray-500">От: {shipment.fromAddress}</p>
                      <p className="text-gray-500">Кому: {shipment.toAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(shipment.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-500">
                    Получатель: {shipment.recipientName}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/track?number=${shipment.trackingNumber}`)}
                    className="text-primary hover:text-primary/80"
                  >
                    Отследить
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {shipments.length === 0 && (
          <Card variant="secondary" className="p-6 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Нет отправлений
            </h3>
            <p className="text-gray-500 mb-4">
              У вас пока нет истории отправлений
            </p>
            <Button onClick={() => router.push('/send')}>
              Отправить посылку
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
