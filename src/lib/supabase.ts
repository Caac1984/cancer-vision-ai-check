
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Model {
  id: string
  name: string
  accuracy: number
  trained_on: string
  samples: number
  status: 'active' | 'archived' | 'training'
  file_path?: string
  created_at: string
  updated_at: string
}

export interface TrainingSession {
  id: string
  model_id: string
  status: 'pending' | 'training' | 'completed' | 'failed'
  progress: number
  started_at: string
  completed_at?: string
  error_message?: string
}
