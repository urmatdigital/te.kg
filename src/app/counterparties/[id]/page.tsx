'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Counterparty, getCounterparty, updateCounterparty } from '@/lib/moysklad';
import { CounterpartyCard } from '@/components/counterparty/CounterpartyCard';
import { CounterpartyForm } from '@/components/counterparty/CounterpartyForm';
import { Button } from '@/components/ui/Button';
import { Loader2, Edit, ArrowLeft, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CounterpartyPageProps {
  params: {
    id: string;
  };
}

export default function CounterpartyPage({ params }: CounterpartyPageProps) {
  const router = useRouter();
  const [counterparty, setCounterparty] = useState<Counterparty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCounterparty = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCounterparty(params.id);
        setCounterparty(data);
      } catch (err) {
        setError('Не удалось загрузить информацию о контрагенте');
        console.error('Error fetching counterparty:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounterparty();
  }, [params.id]);

  const handleUpdateCounterparty = async (data: Partial<Counterparty>) => {
    if (!counterparty?.id) return;

    try {
      setIsSubmitting(true);
      const updatedCounterparty = await updateCounterparty(counterparty.id, data);
      setCounterparty(updatedCounterparty);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating counterparty:', err);
      setError('Не удалось обновить данные контрагента');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCounterparty = async () => {
    if (!counterparty?.id) return;

    try {
      const response = await fetch(`/api/moysklad/counterparties/${counterparty.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete counterparty');
      }

      router.push('/counterparties');
    } catch (err) {
      console.error('Error deleting counterparty:', err);
      setError('Не удалось удалить контрагента');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !counterparty) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
            {error || 'Контрагент не найден'}
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push('/counterparties')}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/counterparties')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>

          <div className="flex gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Редактирование контрагента</DialogTitle>
                </DialogHeader>
                <CounterpartyForm
                  initialData={counterparty}
                  onSubmit={handleUpdateCounterparty}
                  isLoading={isSubmitting}
                />
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Вы уверены, что хотите удалить этого контрагента?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие невозможно отменить. Контрагент будет удален
                    безвозвратно.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteCounterparty}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <CounterpartyCard counterparty={counterparty} />
      </div>
    </div>
  );
}
