'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search, Package, Clock, MapPin } from 'lucide-react'

interface TrackingStatus {
  status: string
  location: string
  timestamp: string
  description: string
}

export default function TrackPage() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [trackingData, setTrackingData] = useState<TrackingStatus[]>([])
  const [error, setError] = useState('')

  if (!user) {
    router.replace('/login')
    return null
  }

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // TODO: Implement actual tracking logic
      // This is mock data
      setTrackingData([
        {
          status: 'В пути',
          location: 'Бишкек, Сортировочный центр',
          timestamp: new Date().toLocaleString(),
          description: 'Посылка отправлена в пункт назначения'
        },
        {
          status: 'Принято',
          location: 'Ош, Пункт приема',
          timestamp: new Date(Date.now() - 86400000).toLocaleString(),
          description: 'Посылка принята в обработку'
        }
      ])
    } catch (error) {
      console.error('Error tracking package:', error)
      setError('Не удалось получить информацию о посылке')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Отследить посылку
        </h1>

        <Card variant="default" className="p-4 mb-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                placeholder="Введите номер отслеживания"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Поиск...' : 'Найти'}
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </form>
        </Card>

        {trackingData.length > 0 ? (
          <div className="space-y-4">
            {trackingData.map((status, index) => (
              <Card variant="default" className="p-4" key={index}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {status.status === 'В пути' ? (
                      <Package className="w-6 h-6 text-primary" />
                    ) : (
                      <Clock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {status.status}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {status.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{status.location}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {status.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="secondary" className="p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Введите номер отслеживания, чтобы начать поиск
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
