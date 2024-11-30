'use client';

import { useState } from 'react';
import { TrackingCard } from './TrackingCard';
import { AddTrackingDialog } from './AddTrackingDialog';
import { Button } from '../ui-new/button';
import { Input } from '../ui-new/input';
import { Search, Plus } from 'lucide-react';

interface Status {
  status: string;
  date: string;
  completed: boolean;
}

interface TrackingData {
  id: string;
  trackingNumber: string;
  description: string;
  weight: string;
  statuses: Status[];
}

interface TrackingListProps {
  initialTrackings?: TrackingData[];
}

export function TrackingList({ initialTrackings = [] }: TrackingListProps) {
  const [trackings, setTrackings] = useState<TrackingData[]>(initialTrackings);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredTrackings = trackings.filter((tracking) =>
    tracking.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tracking.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTracking = ({ trackingNumber, description }: { trackingNumber: string; description: string }) => {
    const newTracking: TrackingData = {
      id: Math.random().toString(36).substr(2, 9),
      trackingNumber,
      description,
      weight: '',
      statuses: [
        {
          status: 'Зарегистрирован',
          date: new Date().toLocaleString(),
          completed: true
        }
      ]
    };
    setTrackings([...trackings, newTracking]);
  };

  const handleDeleteTracking = (id: string) => {
    setTrackings(trackings.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Поиск по трек номеру или описанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить
        </Button>
      </div>

      <div className="space-y-4">
        {filteredTrackings.map((tracking) => (
          <TrackingCard
            key={tracking.id}
            trackingNumber={tracking.trackingNumber}
            description={tracking.description}
            weight={tracking.weight}
            statuses={tracking.statuses.map(status => ({
              title: status.status,
              date: status.date,
              isCompleted: status.completed
            }))}
            onDelete={() => handleDeleteTracking(tracking.id)}
          />
        ))}
        {filteredTrackings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'Ничего не найдено' : 'Нет трек номеров'}
          </div>
        )}
      </div>

      <AddTrackingDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddTracking}
      />
    </div>
  );
}
