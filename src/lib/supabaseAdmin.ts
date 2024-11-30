import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!supabaseServiceKey) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY')
}

// Create a custom type that extends Database with our custom functions
interface CustomDatabase extends Omit<Database, 'public'> {
  public: {
    Tables: Database['public']['Tables']
    Views: Database['public']['Views']
    Functions: {
      create_table: {
        Args: {
          table_name: string
          column_definitions: string
        }
        Returns: {
          success: boolean
        }
      }
      alter_table: {
        Args: {
          table_name: string
          alter_operation: string
        }
        Returns: {
          success: boolean
        }
      }
      drop_table: {
        Args: {
          table_name: string
        }
        Returns: {
          success: boolean
        }
      }
      create_index: {
        Args: {
          table_name: string
          index_name: string
          column_name: string
        }
        Returns: {
          success: boolean
        }
      }
      drop_index: {
        Args: {
          table_name: string
          index_name: string
        }
        Returns: {
          success: boolean
        }
      }
      grant_access: {
        Args: {
          table_name: string
          role_name: string
          permission: string
        }
        Returns: {
          success: boolean
        }
      }
      revoke_access: {
        Args: {
          table_name: string
          role_name: string
          permission: string
        }
        Returns: {
          success: boolean
        }
      }
    }
    Enums: Database['public']['Enums']
  }
}

// Create Supabase admin client
export const supabaseAdmin = createClient<CustomDatabase>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public'
    }
  }
)

// Database management functions
export const database = {
  async createTable(tableName: string, columns: Record<string, string>) {
    try {
      const columnDefinitions = Object.entries(columns)
        .map(([name, type]) => `${name} ${type}`)
        .join(', ')

      const { error } = await supabaseAdmin.rpc('create_table', {
        table_name: tableName,
        column_definitions: columnDefinitions
      })

      if (error) throw error
      console.log(`Table ${tableName} created successfully`)
    } catch (error) {
      console.error('Error creating table:', error)
      throw error
    }
  },

  async alterTable(tableName: string, operation: string) {
    try {
      const { error } = await supabaseAdmin.rpc('alter_table', {
        table_name: tableName,
        alter_operation: operation
      })

      if (error) throw error
      console.log(`Table ${tableName} altered successfully`)
    } catch (error) {
      console.error('Error altering table:', error)
      throw error
    }
  },

  async dropTable(tableName: string) {
    try {
      const { error } = await supabaseAdmin.rpc('drop_table', {
        table_name: tableName
      })

      if (error) throw error
      console.log(`Table ${tableName} dropped successfully`)
    } catch (error) {
      console.error('Error dropping table:', error)
      throw error
    }
  },

  async createIndex(tableName: string, indexName: string, columnName: string) {
    try {
      const { error } = await supabaseAdmin.rpc('create_index', {
        table_name: tableName,
        index_name: indexName,
        column_name: columnName
      })

      if (error) throw error
      console.log(`Index ${indexName} created successfully on ${tableName}.${columnName}`)
    } catch (error) {
      console.error('Error creating index:', error)
      throw error
    }
  },

  async dropIndex(tableName: string, indexName: string) {
    try {
      const { error } = await supabaseAdmin.rpc('drop_index', {
        table_name: tableName,
        index_name: indexName
      })

      if (error) throw error
      console.log(`Index ${indexName} dropped successfully from ${tableName}`)
    } catch (error) {
      console.error('Error dropping index:', error)
      throw error
    }
  },

  async grantAccess(tableName: string, roleName: string, permission: string) {
    try {
      const { error } = await supabaseAdmin.rpc('grant_access', {
        table_name: tableName,
        role_name: roleName,
        permission
      })

      if (error) throw error
      console.log(`${permission} permission granted to ${roleName} on ${tableName}`)
    } catch (error) {
      console.error('Error granting access:', error)
      throw error
    }
  },

  async revokeAccess(tableName: string, roleName: string, permission: string) {
    try {
      const { error } = await supabaseAdmin.rpc('revoke_access', {
        table_name: tableName,
        role_name: roleName,
        permission
      })

      if (error) throw error
      console.log(`${permission} permission revoked from ${roleName} on ${tableName}`)
    } catch (error) {
      console.error('Error revoking access:', error)
      throw error
    }
  }
}

// Утилиты для работы с хранилищем S3
const s3Config = {
  accessKeyId: '5d02a30e03423dbe23aa33ac588b9906',
  secretAccessKey: '3cdc6ccf97b7c82decc9d87a48a96dcc65a4bc8bd73bfe06ba440d62b128d331',
  region: 'eu-central-1',
  endpoint: 'https://eacpkbrvpxhejgwyziwd.supabase.co/storage/v1/s3'
}

// Расширенное API для управления данными
export const adminApi = {
  // Управление пользователями
  users: {
    async createUser(userData: {
      telegram_id: number
      first_name: string
      last_name?: string | null
      username?: string | null
      photo_url?: string | null
      language_code?: string | null
      phone_number?: string | null
      last_seen?: string
    }) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert(userData)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async updateUser(userId: string, userData: Partial<Database['public']['Tables']['users']['Update']>) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async deleteUser(userId: string) {
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', userId)
      
      if (error) throw error
    },

    async getAllUsers() {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  },

  // Управление посылками
  packages: {
    async createPackage(packageData: {
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
    }) {
      const { data, error } = await supabaseAdmin
        .from('packages')
        .insert(packageData)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async updatePackage(packageId: string, packageData: Partial<Database['public']['Tables']['packages']['Update']>) {
      const { data, error } = await supabaseAdmin
        .from('packages')
        .update(packageData)
        .eq('id', packageId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async deletePackage(packageId: string) {
      const { error } = await supabaseAdmin
        .from('packages')
        .delete()
        .eq('id', packageId)
      
      if (error) throw error
    },

    async getAllPackages() {
      const { data, error } = await supabaseAdmin
        .from('packages')
        .select('*, users(*)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async getPackagesByUser(userId: string) {
      const { data, error } = await supabaseAdmin
        .from('packages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  },

  // Управление историей отслеживания
  tracking: {
    async addTrackingEntry(trackingData: {
      package_id: string
      status: string
      location?: string
      notes?: string
    }) {
      const { data, error } = await supabaseAdmin
        .from('package_status_history')
        .insert({
          ...trackingData,
          created_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async getPackageHistory(packageId: string) {
      const { data, error } = await supabaseAdmin
        .from('package_status_history')
        .select('*')
        .eq('package_id', packageId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async deleteTrackingEntry(entryId: string) {
      const { error } = await supabaseAdmin
        .from('package_status_history')
        .delete()
        .eq('id', entryId)
      
      if (error) throw error
    }
  },

  // Управление базой данных
  database: database,

  // Управление хранилищем
  storage: {
    async uploadFile(bucket: string, path: string, file: File) {
      const { data, error } = await supabaseAdmin
        .storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error
      return data
    },

    async deleteFile(bucket: string, path: string) {
      const { error } = await supabaseAdmin
        .storage
        .from(bucket)
        .remove([path])

      if (error) throw error
    },

    async listFiles(bucket: string, path?: string) {
      const { data, error } = await supabaseAdmin
        .storage
        .from(bucket)
        .list(path)

      if (error) throw error
      return data
    },

    async createBucket(bucketName: string, isPublic: boolean = false) {
      const { data, error } = await supabaseAdmin
        .storage
        .createBucket(bucketName, {
          public: isPublic,
          fileSizeLimit: 52428800 // 50MB
        })

      if (error) throw error
      return data
    },

    async deleteBucket(bucketName: string) {
      const { error } = await supabaseAdmin
        .storage
        .deleteBucket(bucketName)

      if (error) throw error
    }
  }
}
