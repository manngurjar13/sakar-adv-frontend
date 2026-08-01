import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createId, getFileFromFormData, getStringFromFormData } from '../../lib/supabaseData'
import { supabase } from '../../lib/supabase'
import { deletePublicFile, uploadPublicFile } from '../../lib/supabaseStorage'

const normalizePortfolioItem = (item) => ({
  ...item,
  id: item.id,
  _id: item.id,
  image: item.image || '',
  createdAt: item.created_at,
})

const buildPortfolioPayload = async ({ id, portfolioData, existingItem = null }) => {
  let image = existingItem?.image || null
  const nextFile = getFileFromFormData(portfolioData, 'image')

  if (nextFile) {
    if (existingItem?.image) {
      await deletePublicFile({ bucket: 'portfolio', publicUrl: existingItem.image })
    }

    image = await uploadPublicFile({
      bucket: 'portfolio',
      file: nextFile,
      recordId: id,
      folder: 'cover',
    })
  }

  return {
    id,
    title: getStringFromFormData(portfolioData, 'title'),
    description: getStringFromFormData(portfolioData, 'description'),
    category: getStringFromFormData(portfolioData, 'category'),
    status: getStringFromFormData(portfolioData, 'status') || 'published',
    client: getStringFromFormData(portfolioData, 'client') || null,
    year: getStringFromFormData(portfolioData, 'year') || null,
    image,
  }
}

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message || 'Failed to fetch portfolio')
      }

      return (data || []).map(normalizePortfolioItem)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch portfolio')
    }
  }
)

export const createPortfolioItem = createAsyncThunk(
  'portfolio/createPortfolioItem',
  async (portfolioData, { rejectWithValue }) => {
    try {
      const id = createId()
      const payload = await buildPortfolioPayload({ id, portfolioData })
      const { data, error } = await supabase.from('portfolio_items').insert(payload).select().single()

      if (error) {
        throw new Error(error.message || 'Failed to create portfolio item')
      }

      return normalizePortfolioItem(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create portfolio item')
    }
  }
)

export const updatePortfolioItem = createAsyncThunk(
  'portfolio/updatePortfolioItem',
  async ({ id, portfolioData }, { rejectWithValue, getState }) => {
    try {
      const existingItem = getState().portfolio.portfolio.find((item) => item.id === id)
      const payload = await buildPortfolioPayload({ id, portfolioData, existingItem })
      const { data, error } = await supabase
        .from('portfolio_items')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to update portfolio item')
      }

      return normalizePortfolioItem(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update portfolio item')
    }
  }
)

export const deletePortfolioItem = createAsyncThunk(
  'portfolio/deletePortfolioItem',
  async (id, { rejectWithValue, getState }) => {
    try {
      const existingItem = getState().portfolio.portfolio.find((item) => item.id === id)
      if (existingItem?.image) {
        await deletePublicFile({ bucket: 'portfolio', publicUrl: existingItem.image })
      }

      const { error } = await supabase.from('portfolio_items').delete().eq('id', id)

      if (error) {
        throw new Error(error.message || 'Failed to delete portfolio item')
      }

      return id
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete portfolio item')
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
