import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from './supabase'
import type { Database } from '@/types/supabase'

type Package = Database['public']['Tables']['packages']['Row']

interface UserState {
  user: any | null
  loading: boolean
  error: string | null
  packages: Package[]
  setUser: (user: any) => void
  addPackage: (package_: Package) => void
  login: (email: string, password: string) => Promise<any>
  signup: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, phone?: string, telegramId?: string) => Promise<any>
  logout: () => Promise<void>
}

export const useStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      packages: [],

      setUser: (user) => {
        set({ user })
      },

      addPackage: (package_: Package) => {
        set((state) => ({
          packages: [...state.packages, package_]
        }))
      },

      login: async (email: string, password: string) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (error) throw error
          
          // Получаем актуальную сессию
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) throw new Error('Не удалось получить сессию')
          
          // Устанавливаем пользователя
          set({ user: session.user })
          
          return session.user
        } catch (error: any) {
          set({ 
            error: error.message === 'Invalid login credentials'
              ? 'Неверный email или пароль'
              : 'Ошибка при входе в систему'
          })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      signup: async (email: string, password: string) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          })
          if (error) throw error
          set({ user: data.user })
        } catch (error: any) {
          set({ error: 'Ошибка при регистрации' })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      register: async (email: string, password: string, name: string, phone?: string, telegramId?: string) => {
        set({ loading: true, error: null })
        try {
          // Проверяем обязательные поля
          if (!phone) {
            throw new Error('Номер телефона обязателен')
          }

          // Регистрируем нового пользователя
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
                phone: phone
              }
            }
          })

          if (signUpError) throw signUpError
          if (!signUpData.session) {
            throw new Error('Не удалось создать пользователя')
          }

          // Создаем запись пользователя
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([
              {
                telegram_id: Number(telegramId),
                first_name: name,
                phone_number: phone,
                last_seen: new Date().toISOString()
              }
            ])
            .select()
            .single()

          if (insertError) {
            console.error('Error creating user:', insertError)
            // Продолжаем выполнение даже если не удалось создать пользователя
            // Таблица будет создана позже через миграцию
          }

          // Получаем обновленного пользователя
          const { data: { user: updatedUser }, error: userError } = await supabase.auth.getUser()
          if (userError) throw userError

          set({ user: updatedUser })
          return signUpData.session
        } catch (error: any) {
          let errorMessage = error.message
          if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'Неверный пароль'
          } else if (error.message.includes('User already registered')) {
            errorMessage = 'Пользователь с таким email уже существует'
          }
          set({ error: errorMessage })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      logout: async () => {
        set({ loading: true, error: null })
        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error
          
          // Очищаем все данные пользователя
          set({ 
            user: null, 
            packages: [],
            error: null,
            loading: false
          })

          // Очищаем локальное хранилище
          localStorage.removeItem('user-storage')
          
        } catch (error: any) {
          set({ error: 'Ошибка при выходе из системы' })
          throw error
        } finally {
          set({ loading: false })
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
)
