'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui-new/dialog';
import { Input } from '../ui-new/input';
import { Button } from '../ui-new/button';
import { Label } from '../ui-new/label';
import { Textarea } from '../ui-new/textarea';

interface AddTrackingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { trackingNumber: string; description: string }) => void;
}

export function AddTrackingDialog({ isOpen, onClose, onSubmit }: AddTrackingDialogProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ trackingNumber, description });
    setTrackingNumber('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить трек-номер</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trackingNumber">Трек номер</Label>
            <Input
              id="trackingNumber"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Введите трек номер"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Добавьте описание (опционально)"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">
              Добавить
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
