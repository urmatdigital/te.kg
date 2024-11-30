import { supabase } from './supabase'
import { Database } from '@/types/supabase'

type Package = Database['public']['Tables']['packages']['Row']
type User = Database['public']['Tables']['users']['Row']

export const api = {
  packages: {
    async getAll() {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async getByTrackingNumber(trackingNumber: string) {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('tracking_number', trackingNumber)
        .single()
      
      if (error) throw error
      return data
    },

    async create(package_: Omit<Package, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('packages')
        .insert(package_)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, package_: Partial<Package>) {
      const { data, error } = await supabase
        .from('packages')
        .update(package_)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },

  users: {
    async getById(id: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async getByTelegramId(telegramId: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId)
        .single()
      
      if (error) throw error
      return data
    },

    async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, user: Partial<User>) {
      const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  tracking: {
    async getHistory(packageId: string) {
      const { data, error } = await supabase
        .from('package_status_history')
        .select('*')
        .eq('package_id', packageId)
        .order('timestamp', { ascending: false })
      
      if (error) throw error
      return data
    },

    async addEntry(packageId: string, status: string, location?: string, notes?: string) {
      const { data, error } = await supabase
        .from('package_status_history')
        .insert({
          package_id: packageId,
          status,
          location,
          notes,
          timestamp: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  }
}
