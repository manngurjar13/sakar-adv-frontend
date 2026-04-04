import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../config/api'

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      // Public endpoint - no authentication required
      const response = await api.get('/portfolio')
      // Map MongoDB _id to id for UI consistency
      const portfolio = (response.data.portfolio || response.data || []).map(item => ({
        ...item,
        id: item._id || item.id
      }))
      return portfolio
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch portfolio')
    }
  }
)

export const createPortfolioItem = createAsyncThunk(
  'portfolio/createPortfolioItem',
  async (portfolioData, { rejectWithValue }) => {
    try {
      const response = await api.post('/portfolio', portfolioData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const item = response.data.portfolioItem || response.data
      return {
        ...item,
        id: item._id || item.id
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create portfolio item')
    }
  }
)

export const updatePortfolioItem = createAsyncThunk(
  'portfolio/updatePortfolioItem',
  async ({ id, portfolioData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/portfolio/${id}`, portfolioData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const item = response.data.portfolioItem || response.data
      return {
        ...item,
        id: item._id || item.id
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update portfolio item')
    }
  }
)

export const deletePortfolioItem = createAsyncThunk(
  'portfolio/deletePortfolioItem',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/portfolio/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete portfolio item')
    }
  }
)

const initialState = {
  portfolio: [],
  loading: false,
  error: null,
  selectedPortfolioItem: null,
}

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedPortfolioItem: (state, action) => {
      state.selectedPortfolioItem = action.payload
    },
    clearSelectedPortfolioItem: (state) => {
      state.selectedPortfolioItem = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false
        state.portfolio = action.payload
        state.error = null
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createPortfolioItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPortfolioItem.fulfilled, (state, action) => {
        state.loading = false
        state.portfolio.push(action.payload)
        state.error = null
      })
      .addCase(createPortfolioItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updatePortfolioItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePortfolioItem.fulfilled, (state, action) => {
        state.loading = false
        const index = state.portfolio.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.portfolio[index] = action.payload
        }
        state.error = null
      })
      .addCase(updatePortfolioItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deletePortfolioItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePortfolioItem.fulfilled, (state, action) => {
        state.loading = false
        state.portfolio = state.portfolio.filter(item => item.id !== action.payload)
        state.error = null
      })
      .addCase(deletePortfolioItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setSelectedPortfolioItem, clearSelectedPortfolioItem } = portfolioSlice.actions
export default portfolioSlice.reducer
