'use client'

import { Card } from '@/components/ui/Card'
import { MapPin, Phone, Hash, Copy } from 'lucide-react'

interface AddressItemProps {
  icon: React.ReactNode
  label: string
  value: string
  copyable?: boolean
  onCopy?: () => void
}

function AddressItem({ icon, label, value, copyable, onCopy }: AddressItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}</span>
          {copyable && (
            <button
              onClick={onCopy}
              className="text-muted-foreground hover:text-primary transition-colors"
              title={`Копировать ${label.toLowerCase()}`}
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function AddressSection() {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Можно добавить toast уведомление о успешном копировании
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Card variant="default" className="p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Адрес склада в Китае</h2>
        <div className="px-3 py-1 bg-primary/10 dark:bg-primary/20 rounded-full">
          <span className="text-sm font-medium text-primary dark:text-primary/90">Активен</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <AddressItem 
          icon={<MapPin className="w-5 h-5" />}
          label="Адрес"
          value="广州市番禺区市广路钟二路段45号华家领航产业园1栋 107 思密特 1226308"
          copyable
          onCopy={() => copyToClipboard("广州市番禺区市广路钟二路段45号华家领航产业园1栋 107 思密特 1226308")}
        />
        <AddressItem 
          icon={<Phone className="w-5 h-5" />}
          label="Телефон"
          value="+8618924053083"
          copyable
          onCopy={() => copyToClipboard("+8618924053083")}
        />
        <AddressItem 
          icon={<Hash className="w-5 h-5" />}
          label="Код получателя"
          value="Si mi te (1226308)"
          copyable
          onCopy={() => copyToClipboard("Si mi te (1226308)")}
        />
      </div>
    </Card>
  )
}
