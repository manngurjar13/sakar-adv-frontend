import { createClient } from '@supabase/supabase-js'

const normalizeSupabaseUrl = (url = '') => {
  return url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
}

const fallbackSupabaseUrl = 'https://gvlvodrozbyoxbthxwbt.supabase.co'
const fallbackSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2bHZvZHJvemJ5b3hidGh4d2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjU1ODcsImV4cCI6MjEwMDIwMTU4N30.LLxVfqsQpkrUIEr6_vdl2HwD2iCHjBDb7U2I-2CL42E'

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || fallbackSupabaseUrl)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || fallbackSupabaseAnonKey
const isSupabaseEnvMissing = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY

if (isSupabaseEnvMissing) {
  console.warn(
    'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Using fallback credentials for Supabase. Set production env variables to avoid using hardcoded values.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const getSupabase = () => {
  if (!supabase) {
    throw new Error(
      'Supabase client is not initialized. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your production environment.'
    )
  }
  return supabase
}

export { normalizeSupabaseUrl }
