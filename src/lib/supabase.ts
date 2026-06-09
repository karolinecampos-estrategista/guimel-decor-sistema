import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface LeadRow {
  id: string
  nome: string
  telefone: string
  cidade: string | null
  produto: string
  ambiente: string | null
  medidas: string | null
  origem: string | null
  status: string
  created_at: string
}
