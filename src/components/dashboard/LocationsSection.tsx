'use client'

import { MapPin, Clock, Phone } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export function LocationsSection() {
  const locations = [
    {
      city: 'Бишкек',
      address: 'ул. Чуй 123',
      phone: '+996 555 123 456',
      hours: '09:00 - 18:00',
      coordinates: {
        lat: 42.8746,
        lng: 74.5698
      }
    },
    {
      city: 'Ош',
      address: 'ул. Ленина 45',
      phone: '+996 555 789 012',
      hours: '09:00 - 18:00',
      coordinates: {
        lat: 40.5140,
        lng: 72.8161
      }
    }
  ]

  return (
    <Card variant="default" className="p-6">
      <h2 className="text-lg font-semibold mb-4">Пункты приема</h2>
      <div className="space-y-6">
        {locations.map((location, index) => (
          <div key={index} className="space-y-3">
            <h3 className="font-medium text-gray-900 dark:text-white">{location.city}</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <a
                  href={`https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary"
                >
                  {location.address}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <a
                  href={`tel:${location.phone.replace(/\s/g, '')}`}
                  className="text-gray-600 dark:text-gray-300 hover:text-primary"
                >
                  {location.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-gray-600 dark:text-gray-300">
                  {location.hours}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
