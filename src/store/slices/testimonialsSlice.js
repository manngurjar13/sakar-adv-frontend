import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../config/api'

export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetchTestimonials',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/testimonials')
      // Map backend fields -> UI fields (MongoDB uses _id)
      const testimonials = (response.data.testimonials || []).map(t => ({
        ...t,
        id: t._id, // MongoDB _id -> id for UI
        name: t.customerName ?? t.name,
        testimonial: t.description ?? t.testimonial,
      }))
      return testimonials
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch testimonials')
    }
  }
)

export const createTestimonial = createAsyncThunk(
  'testimonials/createTestimonial',
  async (testimonialData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken')
      // Transform UI -> backend payload
      const payload = {
        customerName: testimonialData.customerName ?? testimonialData.name,
        rating: testimonialData.rating,
        description: testimonialData.description ?? testimonialData.testimonial,
      }
      const response = await api.post('/testimonials', payload)
      const t = response.data.testimonial || response.data
      // Normalize for UI (MongoDB uses _id)
      return {
        ...t,
        id: t._id, // MongoDB _id -> id for UI
        name: t.customerName ?? t.name,
        testimonial: t.description ?? t.testimonial,
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create testimonial')
    }
  }
)

export const updateTestimonial = createAsyncThunk(
  'testimonials/updateTestimonial',
  async ({ id, testimonialData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken')
      // Transform UI -> backend payload
      const payload = {
        customerName: testimonialData.customerName ?? testimonialData.name,
        rating: testimonialData.rating,
        description: testimonialData.description ?? testimonialData.testimonial,
      }
      const response = await api.put(`/testimonials/${id}`, payload)
      const t = response.data.testimonial || response.data
      return {
        ...t,
        name: t.customerName ?? t.name,
        testimonial: t.description ?? t.testimonial,
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update testimonial')
    }
  }
)

export const deleteTestimonial = createAsyncThunk(
  'testimonials/deleteTestimonial',
  async (id, { rejectWithValue }) => {
    try {
      console.log('deleteTestimonial thunk called with ID:', id)
      const response = await api.delete(`/testimonials/${id}`)
      console.log('Delete API response:', response)
      return id
    } catch (error) {
      console.error('Delete API error:', error)
      return rejectWithValue(error.response?.data?.error || 'Failed to delete testimonial')
    }
  }
)

const initialState = {
  testimonials: [],
  loading: false,
  error: null,
  selectedTestimonial: null,
}

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedTestimonial: (state, action) => {
      state.selectedTestimonial = action.payload
    },
    clearSelectedTestimonial: (state) => {
      state.selectedTestimonial = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false
        state.testimonials = action.payload
        state.error = null
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createTestimonial.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.loading = false
        state.testimonials.push(action.payload)
        state.error = null
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateTestimonial.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.loading = false
        const index = state.testimonials.findIndex(testimonial => testimonial.id === action.payload.id)
        if (index !== -1) {
          state.testimonials[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteTestimonial.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        console.log('deleteTestimonial.fulfilled reducer called with payload:', action.payload)
        console.log('Current testimonials count:', state.testimonials.length)
        state.loading = false
        state.testimonials = state.testimonials.filter(testimonial => testimonial.id !== action.payload)
        console.log('After filter testimonials count:', state.testimonials.length)
        state.error = null
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setSelectedTestimonial, clearSelectedTestimonial } = testimonialsSlice.actions
export default testimonialsSlice.reducer
