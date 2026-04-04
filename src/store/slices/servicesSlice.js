import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunks for services CRUD operations
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 500))
      const mockData = [
        {
          id: 1,
          name: 'Vehicle Branding',
          description: 'Professional vehicle branding services for maximum brand visibility',
          category: 'vehicle-branding',
          price: 12000,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
          features: ['High-quality vinyl', 'Weather resistant', 'Professional installation', 'Mobile advertising']
        },
        {
          id: 2,
          name: 'Auto Rickshaw Advertising',
          description: 'Effective auto rickshaw advertising for local market reach',
          category: 'auto-rickshaw',
          price: 5000,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
          features: ['Local reach', 'Cost effective', 'High visibility', 'Targeted audience']
        }
      ]
      return mockData
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services')
    }
  }
)

export const createService = createAsyncThunk(
  'services/createService',
  async (serviceData, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newService = {
        id: Date.now(),
        ...serviceData,
        createdAt: new Date().toISOString()
      }
      return newService
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create service')
    }
  }
)

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, serviceData }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const updatedService = {
        id,
        ...serviceData,
        updatedAt: new Date().toISOString()
      }
      return updatedService
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service')
    }
  }
)

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete service')
    }
  }
)

const initialState = {
  services: [],
  loading: false,
  error: null,
  selectedService: null,
}

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedService: (state, action) => {
      state.selectedService = action.payload
    },
    clearSelectedService: (state) => {
      state.selectedService = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false
        state.services = action.payload
        state.error = null
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create service
      .addCase(createService.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false
        state.services.push(action.payload)
        state.error = null
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update service
      .addCase(updateService.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false
        const index = state.services.findIndex(service => service.id === action.payload.id)
        if (index !== -1) {
          state.services[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false
        state.services = state.services.filter(service => service.id !== action.payload)
        state.error = null
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setSelectedService, clearSelectedService } = servicesSlice.actions
export default servicesSlice.reducer
