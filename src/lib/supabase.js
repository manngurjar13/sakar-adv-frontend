import { createClient } from '@supabase/supabase-js'

const normalizeSupabaseUrl = (url = '') => {
  return url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
}

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''
const isSupabaseConfigMissing = !supabaseUrl || !supabaseAnonKey

if (isSupabaseConfigMissing) {
  console.error(
    'Supabase environment variables are missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your build environment.'
  )
}

export const supabase = isSupabaseConfigMissing
  ? null
  : createClient(supabaseUrl, supabaseAnonKey, {
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
