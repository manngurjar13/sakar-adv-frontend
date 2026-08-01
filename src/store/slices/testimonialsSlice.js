import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createId } from '../../lib/supabaseData'
import { supabase } from '../../lib/supabase'

const normalizeTestimonial = (testimonial) => ({
  ...testimonial,
  id: testimonial.id,
  _id: testimonial.id,
  customerName: testimonial.customer_name || testimonial.customerName || testimonial.name || '',
  customer_name: testimonial.customer_name || testimonial.customerName || testimonial.name || '',
  name: testimonial.customer_name || testimonial.customerName || testimonial.name || '',
  description: testimonial.description || testimonial.testimonial || '',
  testimonial: testimonial.description || testimonial.testimonial || '',
})

const buildTestimonialPayload = (testimonialData, id) => ({
  id,
  customer_name: testimonialData.customerName ?? testimonialData.customer_name ?? testimonialData.name ?? '',
  company: testimonialData.company || null,
  rating: Number(testimonialData.rating || 0),
  description: testimonialData.description ?? testimonialData.testimonial ?? '',
  status: testimonialData.status || 'published',
})

export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetchTestimonials',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message || 'Failed to fetch testimonials')
      }

      return (data || []).map(normalizeTestimonial)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch testimonials')
    }
  }
)

export const createTestimonial = createAsyncThunk(
  'testimonials/createTestimonial',
  async (testimonialData, { rejectWithValue }) => {
    try {
      const payload = buildTestimonialPayload(testimonialData, createId())
      const { data, error } = await supabase.from('testimonials').insert(payload).select().single()

      if (error) {
        throw new Error(error.message || 'Failed to create testimonial')
      }

      return normalizeTestimonial(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create testimonial')
    }
  }
)

export const updateTestimonial = createAsyncThunk(
  'testimonials/updateTestimonial',
  async ({ id, testimonialData }, { rejectWithValue }) => {
    try {
      const payload = buildTestimonialPayload(testimonialData, id)
      const { data, error } = await supabase
        .from('testimonials')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to update testimonial')
      }

      return normalizeTestimonial(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update testimonial')
    }
  }
)

export const deleteTestimonial = createAsyncThunk(
  'testimonials/deleteTestimonial',
  async (id, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id)

      if (error) {
        throw new Error(error.message || 'Failed to delete testimonial')
      }

      return id
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete testimonial')
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
        state.loading = false
        state.testimonials = state.testimonials.filter(testimonial => testimonial.id !== action.payload)
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
