'use client';

import { Counterparty } from '@/lib/moysklad';
import { Card } from '@/components/ui/Card';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Tag,
  User,
  Calendar,
} from 'lucide-react';

interface CounterpartyCardProps {
  counterparty: Counterparty;
}

export function CounterpartyCard({ counterparty }: CounterpartyCardProps) {
  const getFullName = () => {
    if (counterparty.companyType === 'legal') {
      return counterparty.legalTitle || counterparty.name;
    }
    return [
      counterparty.legalLastName,
      counterparty.legalFirstName,
      counterparty.legalMiddleName,
    ]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Основная информация */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {counterparty.name}
          </h3>
          {counterparty.legalTitle && (
            <p className="text-sm text-gray-500">{counterparty.legalTitle}</p>
          )}
        </div>

        {/* Контактная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {counterparty.phone && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Phone className="w-4 h-4" />
              <span>{counterparty.phone}</span>
            </div>
          )}
          {counterparty.email && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Mail className="w-4 h-4" />
              <a
                href={`mailto:${counterparty.email}`}
                className="hover:text-blue-500"
              >
                {counterparty.email}
              </a>
            </div>
          )}
        </div>

        {/* Адреса */}
        {(counterparty.actualAddress || counterparty.legalAddress) && (
          <div className="space-y-3">
            {counterparty.actualAddress && (
              <div className="flex items-start space-x-2 text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-sm text-gray-500">
                    Фактический адрес:
                  </span>
                  <p>{counterparty.actualAddress}</p>
                </div>
              </div>
            )}
            {counterparty.legalAddress && (
              <div className="flex items-start space-x-2 text-gray-600 dark:text-gray-300">
                <Building2 className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-sm text-gray-500">
                    Юридический адрес:
                  </span>
                  <p>{counterparty.legalAddress}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Реквизиты */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {counterparty.inn && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <FileText className="w-4 h-4" />
              <span>
                <span className="text-gray-500">ИНН:</span> {counterparty.inn}
              </span>
            </div>
          )}
          {counterparty.kpp && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <FileText className="w-4 h-4" />
              <span>
                <span className="text-gray-500">КПП:</span> {counterparty.kpp}
              </span>
            </div>
          )}
          {counterparty.ogrn && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <FileText className="w-4 h-4" />
              <span>
                <span className="text-gray-500">ОГРН:</span> {counterparty.ogrn}
              </span>
            </div>
          )}
          {counterparty.ogrnip && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <FileText className="w-4 h-4" />
              <span>
                <span className="text-gray-500">ОГРНИП:</span>{' '}
                {counterparty.ogrnip}
              </span>
            </div>
          )}
        </div>

        {/* Контактные лица */}
        {counterparty.contactpersons && counterparty.contactpersons.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Контактные лица
            </h4>
            <div className="space-y-2">
              {counterparty.contactpersons.map((contact, index) => (
                <div
                  key={contact.id || index}
                  className="flex items-start space-x-2 text-gray-600 dark:text-gray-300"
                >
                  <User className="w-4 h-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    {contact.position && (
                      <p className="text-sm text-gray-500">{contact.position}</p>
                    )}
                    {(contact.phone || contact.email) && (
                      <div className="text-sm space-y-1">
                        {contact.phone && <p>📞 {contact.phone}</p>}
                        {contact.email && (
                          <p>
                            ✉️{' '}
                            <a
                              href={`mailto:${contact.email}`}
                              className="hover:text-blue-500"
                            >
                              {contact.email}
                            </a>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Теги */}
        {counterparty.tags && counterparty.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {counterparty.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Дополнительная информация */}
        {counterparty.description && (
          <p className="text-gray-600 dark:text-gray-300">
            {counterparty.description}
          </p>
        )}

        {/* Дата создания */}
        {counterparty.created && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              Создан:{' '}
              {new Date(counterparty.created).toLocaleDateString('ru-RU')}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
