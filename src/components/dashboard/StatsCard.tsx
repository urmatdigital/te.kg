'use client'

import React from 'react'
import { ArrowDown, ArrowUp, LucideIcon, Minus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface StatsCardProps {
  icon: LucideIcon
  title: string
  value: string
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

export function StatsCard({ 
  icon: Icon, 
  title, 
  value, 
  description,
  trend = 'neutral',
  trendValue
}: StatsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500'
      case 'down':
        return 'text-red-500'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <Card variant="secondary" className="p-2 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-primary dark:text-primary/90">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{title}</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</span>
          {trendValue && (
            <div className="flex items-center gap-0.5">
              {getTrendIcon()}
              <span className={cn('text-sm font-medium', getTrendColor())}>{trendValue}</span>
            </div>
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
    </Card>
  )
}
