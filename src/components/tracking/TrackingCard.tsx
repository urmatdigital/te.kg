'use client';

import { Timeline } from './Timeline';
import { Package, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';

interface TrackingStatus {
  title: string;
  date?: string;
  isCompleted: boolean;
}

interface TrackingCardProps {
  trackingNumber: string;
  description: string;
  weight?: string;
  statuses: TrackingStatus[];
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TrackingCard({
  trackingNumber,
  description,
  weight,
  statuses,
  onClick,
  onEdit,
  onDelete,
}: TrackingCardProps) {
  const lastStatus = statuses.find(status => !status.isCompleted) || statuses[statuses.length - 1];
  const isDelivered = statuses[statuses.length - 1].isCompleted;

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:border-primary/20 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDelivered ? 'bg-green-100' : 'bg-primary/10'
            }`}>
              <Package className={`w-5 h-5 ${
                isDelivered ? 'text-green-600' : 'text-primary'
              }`} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{description}</h3>
              <p className="text-sm text-gray-500">{trackingNumber}</p>
              <p className="text-sm text-gray-500 mt-1">{weight ? `Вес: ${weight}` : 'Нет данных про вес'}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Статус</span>
            <span className="font-medium text-gray-900">{lastStatus.title}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-500">Дата</span>
            <span className="font-medium text-gray-900">{lastStatus.date}</span>
          </div>
        </div>
      </div>
      <div className="bg-amber-600 px-4 py-3 flex items-center justify-between">
        <span className="text-white font-medium">{trackingNumber}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-1 hover:bg-amber-500 rounded"
          >
            <Edit2 className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-amber-500 rounded"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <Timeline items={statuses} />
      </div>
    </div>
  );
}
