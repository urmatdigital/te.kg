'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Counterparty, searchCounterparties } from '@/lib/moysklad';
import { CounterpartyCard } from '@/components/counterparty/CounterpartyCard';
import { CounterpartyForm } from '@/components/counterparty/CounterpartyForm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Plus, Loader2 } from 'lucide-react';

export default function CounterpartiesPage() {
  const router = useRouter();
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCounterparties = async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchCounterparties({
        search,
        limit: 100,
      });
      setCounterparties(response.rows);
    } catch (err) {
      setError('Не удалось загрузить список контрагентов');
      console.error('Error fetching counterparties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounterparties();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCounterparties(searchQuery);
  };

  const handleCreateCounterparty = async (data: Partial<Counterparty>) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/moysklad/counterparties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create counterparty');
      }

      setIsDialogOpen(false);
      fetchCounterparties();
    } catch (err) {
      console.error('Error creating counterparty:', err);
      setError('Не удалось создать контрагента');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Контрагенты
          </h1>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить контрагента
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Новый контрагент</DialogTitle>
              </DialogHeader>
              <CounterpartyForm
                onSubmit={handleCreateCounterparty}
                isLoading={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Поиск */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Поиск по имени, email, телефону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Найти
            </Button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : counterparties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counterparties.map((counterparty) => (
              <CounterpartyCard
                key={counterparty.id}
                counterparty={counterparty}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            {searchQuery
              ? 'По вашему запросу ничего не найдено'
              : 'Список контрагентов пуст'}
          </div>
        )}
      </div>
    </div>
  );
}
