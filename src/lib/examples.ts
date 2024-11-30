import { adminApi } from './supabaseAdmin'

// Примеры использования админ API

async function userManagementExamples() {
  // Создание нового пользователя
  const newUser = await adminApi.users.createUser({
    telegram_id: 123456789,
    first_name: 'John',
    last_name: 'Doe',
    username: 'john_doe',
    last_seen: new Date().toISOString()
  })

  // Обновление пользователя
  await adminApi.users.updateUser(newUser.id, {
    phone_number: '+996555123456'
  })

  // Получение всех пользователей
  const allUsers = await adminApi.users.getAllUsers()
}

async function packageManagementExamples() {
  // Создание новой посылки
  const newPackage = await adminApi.packages.createPackage({
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    tracking_number: 'TLP123456',
    status: 'registered',
    sender_name: 'John Doe',
    sender_phone: '+996555123456',
    recipient_name: 'Jane Smith',
    recipient_phone: '+996700987654',
    origin_address: 'Бишкек, ул. Чуй 123',
    destination_address: 'Ош, ул. Ленина 456',
    weight: 2.5,
    dimensions: '30x20x10'
  })

  // Создаем запись в истории с местоположением
  await adminApi.tracking.addTrackingEntry({
    package_id: newPackage.id,
    status: 'registered',
    location: 'Бишкек'
  })

  // Обновление статуса посылки
  await adminApi.packages.updatePackage(newPackage.id, {
    status: 'in_transit'
  })

  // Добавляем новую запись в историю
  await adminApi.tracking.addTrackingEntry({
    package_id: newPackage.id,
    status: 'in_transit',
    location: 'Ош'
  })

  // Получение истории посылки
  const trackingHistory = await adminApi.tracking.getPackageHistory(newPackage.id)
}

async function storageExamples() {
  // Создание нового бакета
  await adminApi.storage.createBucket('documents', true)

  // Загрузка файла
  const file = new File(['Hello, World!'], 'test.txt', { type: 'text/plain' })
  await adminApi.storage.uploadFile('documents', 'test.txt', file)

  // Получение списка файлов
  const files = await adminApi.storage.listFiles('documents')
}

async function databaseManagementExamples() {
  // Создание новой таблицы
  await adminApi.database.createTable('custom_table', {
    id: 'uuid PRIMARY KEY DEFAULT uuid_generate_v4()',
    name: 'text NOT NULL',
    created_at: 'timestamp with time zone DEFAULT CURRENT_TIMESTAMP'
  })

  // Изменение таблицы
  await adminApi.database.alterTable(
    'custom_table',
    'ADD COLUMN description text'
  )
}
