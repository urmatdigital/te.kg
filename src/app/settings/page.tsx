'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { supabase } from '@/lib/supabase'
import { User, Phone, Mail, Lock, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { user, setUser } = useStore()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.first_name || '',
    phone: user?.user_metadata?.phone_number || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  if (!user) {
    router.replace('/login')
    return null
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: formData.fullName,
          phone_number: formData.phone
        }
      })

      if (error) throw error

      // Обновляем данные в таблице users
      const { error: clientError } = await supabase
        .from('users')
        .update({
          first_name: formData.fullName,
          phone_number: formData.phone
        })
        .eq('id', user.id)

      if (clientError) throw clientError

      setMessage({
        type: 'success',
        text: 'Профиль успешно обновлен'
      })

      // Обновляем пользователя в store
      const { data: { user: updatedUser } } = await supabase.auth.getUser()
      if (updatedUser) setUser(updatedUser)

    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Новые пароли не совпадают'
      })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      })

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'Пароль успешно изменен'
      })

      // Очищаем поля пароля
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))

    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.replace('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Настройки профиля
        </h1>

        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 text-primary mb-6">
            <User className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Личные данные</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="fullName">ФИО</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-50"
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </form>
        </Card>

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 text-primary mb-6">
            <Lock className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Изменить пароль</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Изменение...' : 'Изменить пароль'}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-500">
              <LogOut className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Выйти из аккаунта</h2>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={loading}
            >
              Выйти
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
