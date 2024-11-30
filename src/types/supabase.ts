export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          telegram_id: number
          first_name: string
          last_name: string | null
          username: string | null
          photo_url: string | null
          language_code: string | null
          phone_number: string | null
          last_seen: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          telegram_id: number
          first_name: string
          last_name?: string | null
          username?: string | null
          photo_url?: string | null
          language_code?: string | null
          phone_number?: string | null
          last_seen?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telegram_id?: number
          first_name?: string
          last_name?: string | null
          username?: string | null
          photo_url?: string | null
          language_code?: string | null
          phone_number?: string | null
          last_seen?: string
          created_at?: string
          updated_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          user_id: string
          tracking_number: string
          status: string
          sender_name: string
          sender_phone: string
          recipient_name: string
          recipient_phone: string
          origin_address: string
          destination_address: string
          weight: number | null
          dimensions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tracking_number: string
          status: string
          sender_name: string
          sender_phone: string
          recipient_name: string
          recipient_phone: string
          origin_address: string
          destination_address: string
          weight?: number | null
          dimensions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tracking_number?: string
          status?: string
          sender_name?: string
          sender_phone?: string
          recipient_name?: string
          recipient_phone?: string
          origin_address?: string
          destination_address?: string
          weight?: number | null
          dimensions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      package_status_history: {
        Row: {
          id: string
          package_id: string
          status: string
          location: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          status: string
          location?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          status?: string
          location?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
