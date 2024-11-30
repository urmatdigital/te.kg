'use client'

import { Phone, Mail, Clock, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export function ContactsSection() {
  const contacts = [
    {
      icon: Phone,
      label: 'Телефон',
      value: '+996 555 123 456',
      action: 'tel:+996555123456'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'info@tulpar.kg',
      action: 'mailto:info@tulpar.kg'
    },
    {
      icon: Clock,
      label: 'Режим работы',
      value: 'Пн-Сб: 9:00 - 18:00'
    }
  ]

  return (
    <Card variant="default" className="p-6">
      <h2 className="text-lg font-semibold mb-4">Контактная информация</h2>
      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-center gap-3">
            <contact.icon className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{contact.label}</div>
              {contact.action ? (
                <a
                  href={contact.action}
                  className="text-gray-900 dark:text-white hover:text-primary transition-colors"
                >
                  {contact.value}
                </a>
              ) : (
                <div className="text-gray-900 dark:text-white">{contact.value}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
