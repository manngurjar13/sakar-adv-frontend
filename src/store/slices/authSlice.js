import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../config/api'

// Async thunk for admin login
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('Attempting login with:', { email, password })
      const response = await api.post('/auth/login', {
        email,
        password
      })
      
      console.log('Login response:', response.data)
      const { token, admin } = response.data
      
      // Store token and admin data in localStorage
      localStorage.setItem('adminToken', token)
      localStorage.setItem('adminData', JSON.stringify(admin))
      
      return { token, admin }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed'
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for admin logout
export const logoutAdmin = createAsyncThunk(
  'auth/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken')
      
      // Call logout API if token exists
      if (token) {
        await api.post('/auth/logout', {})
      }
      
      // Clear localStorage
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminData')
      return true
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminData')
      return rejectWithValue('Logout failed')
    }
  }
)

// Async thunk for checking auth status from localStorage
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken')
      const adminData = localStorage.getItem('adminData')
      
      if (token && adminData) {
        return { token, admin: JSON.parse(adminData) }
      }
      return null
    } catch (error) {
      return rejectWithValue('Auth check failed')
    }
  }
)

const initialState = {
  isAuthenticated: false,
  admin: null,
  token: null,
  loading: false,
  error: null,
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
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.admin = null
        state.token = null
        state.error = action.payload
      })
      // Logout cases
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isAuthenticated = false
        state.admin = null
        state.token = null
        state.error = null
      })
      // Check auth status cases
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
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
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
