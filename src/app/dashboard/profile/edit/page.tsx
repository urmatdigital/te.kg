'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileFormData {
  full_name: string
  phone: string
}

export default function EditProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    phone: '',
  })

  const router = useRouter()
  const user = useStore((state) => state.user)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !user) return

    const fetchClientData = async () => {
      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('first_name, last_name, phone_number')
          .eq('id', user.id)
          .maybeSingle()

        if (error) {
          console.error('Error fetching user data:', error)
          return
        }

        if (userData) {
          setFormData({
            full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
            phone: userData.phone_number || '',
          })
        }
      } catch (error) {
        console.error('Error in fetchClientData:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClientData()
  }, [mounted, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: formData.full_name.split(' ')[0],
          last_name: formData.full_name.split(' ').slice(1).join(' '),
          phone_number: formData.phone,
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Профиль успешно обновлен')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Ошибка при обновлении профиля')
    } finally {
      setSaving(false)
    }
  }

  if (!mounted || !user) return null

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <h1 className="text-2xl font-semibold">Редактирование профиля</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">ФИО</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Введите ваше полное имя"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+996 (XXX) XX-XX-XX"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={saving}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                'Сохранение...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
