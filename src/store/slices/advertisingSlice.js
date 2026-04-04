import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchAdvertising = createAsyncThunk(
  'advertising/fetchAdvertising',
  async (_, { rejectWithValue }) => {
    try {
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      const mockData = [
        {
          id: 1,
          name: 'Outdoor Hoardings Campaign',
          description: 'High-impact outdoor advertising for maximum visibility',
          category: 'outdoor-hoardings',
          price: 15000,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
          features: ['High visibility', 'Weather resistant', 'Custom design', 'Strategic locations']
        },
        {
          id: 2,
          name: 'Billboard Advertising',
          description: 'Premium billboard placements in prime locations',
          category: 'billboard-advertising',
          price: 25000,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500',
          features: ['Prime locations', 'High footfall', 'Premium quality', '24/7 visibility']
        },
        {
          id: 3,
          name: 'Festival Banners',
          description: 'Cultural festival advertising banners and displays',
          category: 'festival-banners',
          price: 8000,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
          features: ['Festival theme', 'Colorful design', 'Cultural relevance', 'Event-specific']
        }
      ]
      return mockData
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch advertising')
    }
  }
)

export const createAdvertising = createAsyncThunk(
  'advertising/createAdvertising',
  async (advertisingData, { rejectWithValue }) => {
    try {
      // Mock data creation
      await new Promise(resolve => setTimeout(resolve, 500))
      const newAdvertising = {
        id: Date.now(), // Simple ID generation
        ...advertisingData,
        createdAt: new Date().toISOString()
      }
      return newAdvertising
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create advertising')
    }
  }
)

export const updateAdvertising = createAsyncThunk(
  'advertising/updateAdvertising',
  async ({ id, advertisingData }, { rejectWithValue }) => {
    try {
      // Mock data update
      await new Promise(resolve => setTimeout(resolve, 500))
      const updatedAdvertising = {
        id,
        ...advertisingData,
        updatedAt: new Date().toISOString()
      }
      return updatedAdvertising
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update advertising')
    }
  }
)

export const deleteAdvertising = createAsyncThunk(
  'advertising/deleteAdvertising',
  async (id, { rejectWithValue }) => {
    try {
      // Mock data deletion
      await new Promise(resolve => setTimeout(resolve, 500))
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete advertising')
    }
  }
)

const initialState = {
  advertising: [],
  loading: false,
  error: null,
  selectedAdvertising: null,
}

const advertisingSlice = createSlice({
  name: 'advertising',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedAdvertising: (state, action) => {
      state.selectedAdvertising = action.payload
    },
    clearSelectedAdvertising: (state) => {
      state.selectedAdvertising = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdvertising.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdvertising.fulfilled, (state, action) => {
        state.loading = false
        state.advertising = action.payload
        state.error = null
      })
      .addCase(fetchAdvertising.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createAdvertising.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createAdvertising.fulfilled, (state, action) => {
        state.loading = false
        state.advertising.push(action.payload)
        state.error = null
      })
      .addCase(createAdvertising.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateAdvertising.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateAdvertising.fulfilled, (state, action) => {
        state.loading = false
        const index = state.advertising.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.advertising[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateAdvertising.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteAdvertising.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteAdvertising.fulfilled, (state, action) => {
        state.loading = false
        state.advertising = state.advertising.filter(item => item.id !== action.payload)
        state.error = null
      })
      .addCase(deleteAdvertising.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setSelectedAdvertising, clearSelectedAdvertising } = advertisingSlice.actions
export default advertisingSlice.reducer
