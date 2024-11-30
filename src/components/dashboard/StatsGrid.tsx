'use client'

import { Package, Truck, MapPin } from 'lucide-react'
import { StatsCard } from './StatsCard'

export function StatsGrid() {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-4 mt-3 sm:mt-4">
      <StatsCard icon={Package} title="Посылок" value="12" />
      <StatsCard icon={Truck} title="В пути" value="3" />
      <StatsCard icon={MapPin} title="На складе" value="2" />
    </div>
  )
}
