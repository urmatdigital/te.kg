'use client'

import React, { ReactNode } from 'react'
import { Phone, MapPin, Search, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface MenuButtonProps {
  icon: ReactNode
  text: string
  className?: string
}

function MenuButton({ icon, text, className = '' }: MenuButtonProps) {
  const Icon = () => {
    if (React.isValidElement(icon)) {
      const iconProps = {
        ...icon.props,
        className: `w-4 h-4 sm:w-5 sm:h-5 ${icon.props.className || ''}`
      }
      return React.cloneElement(icon, iconProps)
    }
    return icon
  }

  return (
    <button className="flex items-center justify-between w-full p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center gap-2 sm:gap-3">
        <Icon />
        <span className={`text-sm sm:text-base text-gray-700 dark:text-gray-200 ${className}`}>{text}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
    </button>
  )
}

export function MenuSection() {
  return (
    <Card className="mt-3">
      <MenuButton icon={<Phone className="text-blue-500" />} text="Контактная информация" />
      <MenuButton icon={<MapPin className="text-green-500" />} text="Адреса складов" />
      <MenuButton icon={<Search className="text-purple-500" />} text="Отслеживание" />
      <MenuButton icon={<Settings className="text-orange-500" />} text="Настройки" />
      <MenuButton icon={<HelpCircle className="text-teal-500" />} text="Помощь" />
      <MenuButton 
        icon={<LogOut className="text-red-500" />} 
        text="Выйти" 
        className="text-red-500"
      />
    </Card>
  )
}
