import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../config/api'

// Async thunks for event banners
export const fetchEventBanners = createAsyncThunk(
  'eventBanners/fetchEventBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/event-banners')
      // Map MongoDB _id to id for UI consistency
      const banners = (response.data.banners || response.data || []).map(banner => ({
        ...banner,
        id: banner._id || banner.id,
        cardText: banner.bannerText || banner.cardText,
        bannerImage: banner.bannerImage || banner.backgroundImage || banner.image || ''
      }))
      return banners
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch event banners')
    }
  }
)

export const createEventBanner = createAsyncThunk(
  'eventBanners/createEventBanner',
  async (bannerData, { rejectWithValue }) => {
    try {
      const response = await api.post('/event-banners', bannerData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const banner = response.data.banner || response.data
      return {
        ...banner,
        id: banner._id || banner.id,
        cardText: banner.bannerText || banner.cardText,
        bannerImage: banner.bannerImage || banner.backgroundImage || banner.image || ''
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create event banner')
    }
  }
)

export const updateEventBanner = createAsyncThunk(
  'eventBanners/updateEventBanner',
  async ({ id, bannerData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/event-banners/${id}`, bannerData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const banner = response.data.banner || response.data
      return {
        ...banner,
        id: banner._id || banner.id,
        cardText: banner.bannerText || banner.cardText,
        bannerImage: banner.bannerImage || banner.backgroundImage || banner.image || ''
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update event banner')
    }
  }
)

export const deleteEventBanner = createAsyncThunk(
  'eventBanners/deleteEventBanner',
  async (bannerId, { rejectWithValue }) => {
    try {
      await api.delete(`/event-banners/${bannerId}`)
      return bannerId
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete event banner')
    }
  }
)

const eventBannerSlice = createSlice({
  name: 'eventBanners',
  initialState: {
    banners: [],
    loading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch event banners
    builder
      .addCase(fetchEventBanners.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventBanners.fulfilled, (state, action) => {
        state.loading = false
        // Normalize API response to match UI expectations
        state.banners = action.payload.map(banner => ({
          ...banner,
          cardText: banner.bannerText || banner.cardText
        }))
      })
      .addCase(fetchEventBanners.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Create event banner
    builder
      .addCase(createEventBanner.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createEventBanner.fulfilled, (state, action) => {
        state.creating = false
        const newBanner = {
          ...action.payload,
          cardText: action.payload.bannerText || action.payload.cardText
        }
        state.banners.unshift(newBanner)
      })
      .addCase(createEventBanner.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload
      })

    // Update event banner
    builder
      .addCase(updateEventBanner.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateEventBanner.fulfilled, (state, action) => {
        state.updating = false
        const updatedBanner = {
          ...action.payload,
          cardText: action.payload.bannerText || action.payload.cardText
        }
        const index = state.banners.findIndex(banner => banner.id === action.payload.id)
        if (index !== -1) {
          state.banners[index] = updatedBanner
        }
      })
      .addCase(updateEventBanner.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload
      })

    // Delete event banner
    builder
      .addCase(deleteEventBanner.pending, (state) => {
        state.deleting = true
        state.error = null
      })
      .addCase(deleteEventBanner.fulfilled, (state, action) => {
        state.deleting = false
        state.banners = state.banners.filter(banner => banner.id !== action.payload)
      })
      .addCase(deleteEventBanner.rejected, (state, action) => {
        state.deleting = false
        state.error = action.payload
      })
  }
})

export const { clearError } = eventBannerSlice.actions
export default eventBannerSlice.reducer
