import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createId, ensureArray } from '../../lib/supabaseData'
import { getSupabase } from '../../lib/supabase'
import { deletePublicFile, uploadPublicFile } from '../../lib/supabaseStorage'

const normalizeAdvertising = (advertising) => {
  const featureList = ensureArray(advertising.feature || advertising.features).map((feature, index) => ({
    id: feature.id || feature._id || `${advertising.id}-feature-${index}`,
    title: feature.title || '',
    description: feature.description || '',
    image: feature.image || '',
  }))

  return {
    ...advertising,
    id: advertising.id,
    _id: advertising.id,
    image: advertising.image || advertising.image_url || '',
    image_url: advertising.image || advertising.image_url || '',
    advertising_name: advertising.advertising_name || { str1: '', str2: '' },
    feature_heading: advertising.feature_heading || { str1: '', str2: '' },
    feature_description: advertising.feature_description || '',
    feature: featureList,
    features: featureList,
  }
}

const buildFeaturePayload = async ({ advertisingId, feature = [] }) => {
  return Promise.all(
    ensureArray(feature).map(async (item, index) => {
      let image = item.image || null

      if (item.imageFile) {
        if (image) {
          await deletePublicFile({ bucket: 'advertising', publicUrl: image })
        }

        image = await uploadPublicFile({
          bucket: 'advertising',
          file: item.imageFile,
          recordId: advertisingId,
          folder: `features/${index + 1}`,
        })
      }

      return {
        id: item.id || createId(),
        title: item.title || '',
        description: item.description || '',
        image,
      }
    })
  )
}

const buildAdvertisingPayload = async ({ id, advertisingData, existingAdvertising = null }) => {
  let image = advertisingData.image || existingAdvertising?.image || null

  if (advertisingData.imageFile) {
    if (existingAdvertising?.image) {
      await deletePublicFile({ bucket: 'advertising', publicUrl: existingAdvertising.image })
    }

    image = await uploadPublicFile({
      bucket: 'advertising',
      file: advertisingData.imageFile,
      recordId: id,
      folder: 'main',
    })
  }

  const feature = await buildFeaturePayload({
    advertisingId: id,
    feature: advertisingData.feature,
  })

  return {
    id,
    category: advertisingData.category,
    advertising_name: advertisingData.advertising_name || { str1: '', str2: '' },
    description: advertisingData.description || '',
    image,
    feature_heading: advertisingData.feature_heading || { str1: '', str2: '' },
    feature_description: advertisingData.feature_description || '',
    feature,
  }
}

export const fetchAdvertising = createAsyncThunk('advertising/fetchAdvertising', async (_, { rejectWithValue }) => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('advertising')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message || 'Failed to fetch advertising')
    }

    return (data || []).map(normalizeAdvertising)
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch advertising')
  }
})

export const createAdvertising = createAsyncThunk(
  'advertising/createAdvertising',
  async (advertisingData, { rejectWithValue }) => {
    try {
      const id = createId()
      const payload = await buildAdvertisingPayload({ id, advertisingData })
      const { data, error } = await supabase.from('advertising').insert(payload).select().single()

      if (error) {
        throw new Error(error.message || 'Failed to create advertising')
      }

      return normalizeAdvertising(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create advertising')
    }
  }
)

export const updateAdvertising = createAsyncThunk(
  'advertising/updateAdvertising',
  async ({ id, advertisingData }, { rejectWithValue, getState }) => {
    try {
      const existingAdvertising = getState().advertising.advertising.find((item) => item.id === id || item._id === id)
      const payload = await buildAdvertisingPayload({ id, advertisingData, existingAdvertising })
      const { data, error } = await supabase.from('advertising').update(payload).eq('id', id).select().single()

      if (error) {
        throw new Error(error.message || 'Failed to update advertising')
      }

      return normalizeAdvertising(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update advertising')
    }
  }
)

export const deleteAdvertising = createAsyncThunk(
  'advertising/deleteAdvertising',
  async (id, { rejectWithValue, getState }) => {
    try {
      const existingAdvertising = getState().advertising.advertising.find((item) => item.id === id || item._id === id)

      if (existingAdvertising?.image) {
        await deletePublicFile({ bucket: 'advertising', publicUrl: existingAdvertising.image })
      }

      for (const feature of ensureArray(existingAdvertising?.feature)) {
        if (feature.image) {
          await deletePublicFile({ bucket: 'advertising', publicUrl: feature.image })
        }
      }

      const { error } = await supabase.from('advertising').delete().eq('id', id)

      if (error) {
        throw new Error(error.message || 'Failed to delete advertising')
      }

      return id
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete advertising')
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
