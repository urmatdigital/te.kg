'use client';

import { useState } from 'react';
import { Counterparty, CompanyType } from '@/lib/moysklad';
import { Input } from '@/components/ui-new/input';
import { Button } from '@/components/ui-new/button';
import { Select } from '@/components/ui-new/select';
import { Textarea } from '@/components/ui-new/textarea';
import { Label } from '@/components/ui-new/label';

interface CounterpartyFormProps {
  initialData?: Partial<Counterparty>;
  onSubmit: (data: Partial<Counterparty>) => Promise<void>;
  isLoading?: boolean;
}

export function CounterpartyForm({
  initialData,
  onSubmit,
  isLoading = false,
}: CounterpartyFormProps) {
  const [formData, setFormData] = useState<Partial<Counterparty>>(
    initialData || {
      companyType: 'legal',
      archived: false,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Тип контрагента */}
      <div className="space-y-2">
        <Label htmlFor="companyType">Тип контрагента</Label>
        <Select
          id="companyType"
          name="companyType"
          value={formData.companyType}
          onChange={(e) => handleChange(e)}
          options={[
            { value: 'legal', label: 'Юридическое лицо' },
            { value: 'entrepreneur', label: 'Индивидуальный предприниматель' },
            { value: 'individual', label: 'Физическое лицо' }
          ]}
        />
      </div>

      {/* Основная информация */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Наименование</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
        </div>

        {formData.companyType === 'legal' ? (
          <div>
            <Label htmlFor="legalTitle">Полное наименование</Label>
            <Input
              id="legalTitle"
              name="legalTitle"
              value={formData.legalTitle || ''}
              onChange={handleChange}
            />
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="legalLastName">Фамилия</Label>
              <Input
                id="legalLastName"
                name="legalLastName"
                value={formData.legalLastName || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="legalFirstName">Имя</Label>
              <Input
                id="legalFirstName"
                name="legalFirstName"
                value={formData.legalFirstName || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="legalMiddleName">Отчество</Label>
              <Input
                id="legalMiddleName"
                name="legalMiddleName"
                value={formData.legalMiddleName || ''}
                onChange={handleChange}
              />
            </div>
          </>
        )}
      </div>

      {/* Контактная информация */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            type="tel"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            type="email"
          />
        </div>
      </div>

      {/* Адреса */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="actualAddress">Фактический адрес</Label>
          <Input
            id="actualAddress"
            name="actualAddress"
            value={formData.actualAddress || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="legalAddress">Юридический адрес</Label>
          <Input
            id="legalAddress"
            name="legalAddress"
            value={formData.legalAddress || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Реквизиты */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="inn">ИНН</Label>
          <Input
            id="inn"
            name="inn"
            value={formData.inn || ''}
            onChange={handleChange}
          />
        </div>
        {formData.companyType === 'legal' && (
          <div>
            <Label htmlFor="kpp">КПП</Label>
            <Input
              id="kpp"
              name="kpp"
              value={formData.kpp || ''}
              onChange={handleChange}
            />
          </div>
        )}
        {formData.companyType === 'legal' && (
          <div>
            <Label htmlFor="ogrn">ОГРН</Label>
            <Input
              id="ogrn"
              name="ogrn"
              value={formData.ogrn || ''}
              onChange={handleChange}
            />
          </div>
        )}
        {formData.companyType === 'entrepreneur' && (
          <div>
            <Label htmlFor="ogrnip">ОГРНИП</Label>
            <Input
              id="ogrnip"
              name="ogrnip"
              value={formData.ogrnip || ''}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      {/* Дополнительная информация */}
      <div>
        <Label htmlFor="description">Комментарий</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Сохранение...' : 'Сохранить'}
      </Button>
    </form>
  );
}
