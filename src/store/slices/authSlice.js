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

const isAborted = (action) =>
  Boolean(action.meta?.aborted) || action.error?.name === 'AbortError'

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return rejectWithValue(error.message || 'Login failed')
    }

    const session = data.session
    const user = data.user

    if (!session || !user) {
      return rejectWithValue('Login failed')
    }

    try {
      const admin = await getAdminProfile(user)
      localAuthCleanup()

      return {
        token: session.access_token,
        admin,
      }
    } catch (profileError) {
      await supabase.auth.signOut()
      localAuthCleanup()
      return rejectWithValue(profileError.message || 'Login failed')
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
  async (_, { rejectWithValue, signal }) => {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (signal.aborted) {
        return rejectWithValue('aborted')
      }

      if (error) {
        throw new Error(error.message || 'Auth check failed')
      }

      const session = data.session
      if (!session?.user) {
        localAuthCleanup()
        return null
      }

      const admin = await getAdminProfile(session.user)

      if (signal.aborted) {
        return rejectWithValue('aborted')
      }

      return {
        token: session.access_token,
        admin,
      }
    } catch (error) {
      localAuthCleanup()
      try {
        await supabase.auth.signOut()
      } catch {
        // Session cleanup is best-effort during an auth check failure.
      }
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
  currentCheckId: null,
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
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true
        state.error = null
        // Ignore any in-flight session check so it cannot wipe a successful login.
        state.currentCheckId = null
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
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isAuthenticated = false
        state.admin = null
        state.token = null
        state.error = null
        state.loading = false
        state.initialized = true
        state.currentCheckId = null
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.isAuthenticated = false
        state.admin = null
        state.token = null
        state.loading = false
        state.initialized = true
        state.currentCheckId = null
      })
      .addCase(checkAuthStatus.pending, (state, action) => {
        state.loading = true
        state.currentCheckId = action.meta.requestId
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.currentCheckId) {
          return
        }

        state.loading = false
        state.currentCheckId = null
        state.initialized = true
        state.error = null

        if (action.payload) {
          state.isAuthenticated = true
          state.admin = action.payload.admin
          state.token = action.payload.token
        } else {
          state.isAuthenticated = false
          state.admin = null
          state.token = null
        }
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        if (isAborted(action) || action.payload === 'aborted') {
          if (action.meta.requestId === state.currentCheckId) {
            state.loading = false
            state.currentCheckId = null
          }
          return
        }

        if (action.meta.requestId !== state.currentCheckId) {
          return
        }

        state.loading = false
        state.isAuthenticated = false
        state.admin = null
        state.token = null
        state.error = null
        state.initialized = true
        state.currentCheckId = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
