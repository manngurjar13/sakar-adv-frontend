import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../config/api'

// Async thunks for services CRUD operations
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/services')
      return response.data.services
    } catch (error) {
      console.error('Fetch services error:', error)
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch services')
    }
  }
)

export const createService = createAsyncThunk(
  'services/createService',
  async (serviceData, { rejectWithValue }) => {
    try {
      // Create FormData for multipart upload
      const formData = new FormData()
      
      // Add basic fields
      formData.append('category', serviceData.category)
      formData.append('description', serviceData.description)
      formData.append('feature_description', serviceData.feature_description)
      
      // Add objects as JSON strings (backend expects this)
      formData.append('service_name', JSON.stringify(serviceData.service_name))
      formData.append('feature_heading', JSON.stringify(serviceData.feature_heading))
      formData.append('feature', JSON.stringify(serviceData.feature))
      
      // Add main image if it's a file
      if (serviceData.imageFile) {
        formData.append('image', serviceData.imageFile)
      }
      
      // Add feature images
      if (serviceData.feature && Array.isArray(serviceData.feature)) {
        serviceData.feature.forEach((feat, index) => {
          if (feat.imageFile) {
            formData.append(`feature-image-${index}`, feat.imageFile)
          }
        })
      }
      
      const response = await api.post('/admin/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data.service
    } catch (error) {
      console.error('Create service error:', error)
      return rejectWithValue(error.response?.data?.error || 'Failed to create service')
    }
  }
)

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, serviceData }, { rejectWithValue }) => {
    try {
      // Create FormData for multipart upload
      const formData = new FormData()
      
      // Add basic fields
      formData.append('category', serviceData.category)
      formData.append('description', serviceData.description)
      formData.append('feature_description', serviceData.feature_description)
      
      // Add objects as JSON strings (backend expects this)
      formData.append('service_name', JSON.stringify(serviceData.service_name))
      formData.append('feature_heading', JSON.stringify(serviceData.feature_heading))
      formData.append('feature', JSON.stringify(serviceData.feature))
      
      // Add main image if it's a file
      if (serviceData.imageFile) {
        formData.append('image', serviceData.imageFile)
      }
      
      // Add feature images
      if (serviceData.feature && Array.isArray(serviceData.feature)) {
        serviceData.feature.forEach((feat, index) => {
          if (feat.imageFile) {
            formData.append(`feature-image-${index}`, feat.imageFile)
          }
        })
      }
      
      const response = await api.put(`/admin/services/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data.service
    } catch (error) {
      console.error('Update service error:', error)
      return rejectWithValue(error.response?.data?.error || 'Failed to update service')
    }
  }
)

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/services/${id}`)
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
        const index = state.services.findIndex(service => service._id === action.payload._id || service.id === action.payload.id)
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
        state.services = state.services.filter(service => service._id !== action.payload && service.id !== action.payload)
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
