import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabase'

const localAuthCleanup = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminData')
}

const getAdminProfile = async (user) => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id, email')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message || 'Failed to verify admin access')
  }

  if (!data) {
    throw new Error('You do not have admin access yet. Add this user to public.admin_users in Supabase.')
  }

  return {
    id: user.id,
    email: user.email || data.email,
  }
}

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message || 'Login failed')
      }

      const session = data.session
      const user = data.user

      if (!session || !user) {
        throw new Error('Login failed')
      }

      const admin = await getAdminProfile(user)
      localAuthCleanup()

      return {
        token: session.access_token,
        admin,
      }
    } catch (error) {
      await supabase.auth.signOut()
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const logoutAdmin = createAsyncThunk(
  'auth/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut()
      localAuthCleanup()

      if (error) {
        throw new Error(error.message || 'Logout failed')
      }

      return true
    } catch (error) {
      localAuthCleanup()
      return rejectWithValue(error.message || 'Logout failed')
    }
  }
)

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw new Error(error.message || 'Auth check failed')
      }

      const session = data.session
      if (!session?.user) {
        localAuthCleanup()
        return null
      }

      const admin = await getAdminProfile(session.user)

      return {
        token: session.access_token,
        admin,
      }
    } catch (error) {
      localAuthCleanup()
      return rejectWithValue(error.message || 'Auth check failed')
    }
  }
)

const initialState = {
  isAuthenticated: false,
  admin: null,
  token: null,
  loading: false,
  error: null,
  initialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.admin = action.payload.admin
        state.token = action.payload.token
        state.error = null
        state.initialized = true
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.admin = null
        state.token = null
        state.error = action.payload
        state.initialized = true
      })
      // Logout cases
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isAuthenticated = false
        state.admin = null
        state.token = null
        state.error = null
        state.initialized = true
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true
      })
      // Check auth status cases
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.isAuthenticated = true
          state.admin = action.payload.admin
          state.token = action.payload.token
        } else {
          state.isAuthenticated = false
          state.admin = null
          state.token = null
        }
        state.initialized = true
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.admin = null
        state.token = null
        state.error = action.payload
        state.initialized = true
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
