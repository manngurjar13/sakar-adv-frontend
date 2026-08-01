import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createId, getFileFromFormData, getStringFromFormData } from '../../lib/supabaseData'
import { supabase } from '../../lib/supabase'
import { deletePublicFile, uploadPublicFile } from '../../lib/supabaseStorage'

const normalizeBanner = (banner) => ({
  ...banner,
  id: banner.id,
  _id: banner.id,
  bannerText: banner.banner_text || banner.bannerText || banner.cardText || '',
  cardText: banner.banner_text || banner.bannerText || banner.cardText || '',
  bannerImage: banner.image || banner.bannerImage || banner.backgroundImage || '',
  image: banner.image || banner.bannerImage || banner.backgroundImage || '',
})

const buildBannerPayload = async ({ id, bannerData, existingBanner = null }) => {
  let image = existingBanner?.bannerImage || existingBanner?.image || null
  const nextFile = getFileFromFormData(bannerData, 'backgroundImage') || getFileFromFormData(bannerData, 'bannerImage')

  if (nextFile) {
    if (image) {
      await deletePublicFile({ bucket: 'event-banners', publicUrl: image })
    }

    image = await uploadPublicFile({
      bucket: 'event-banners',
      file: nextFile,
      recordId: id,
      folder: 'background',
    })
  }

  return {
    id,
    banner_text: getStringFromFormData(bannerData, 'bannerText') || getStringFromFormData(bannerData, 'cardText'),
    image,
  }
}

// Async thunks for event banners
export const fetchEventBanners = createAsyncThunk(
  'eventBanners/fetchEventBanners',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('event_banners')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message || 'Failed to fetch event banners')
      }

      return (data || []).map(normalizeBanner)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch event banners')
    }
  }
)

export const createEventBanner = createAsyncThunk(
  'eventBanners/createEventBanner',
  async (bannerData, { rejectWithValue }) => {
    try {
      const id = createId()
      const payload = await buildBannerPayload({ id, bannerData })
      const { data, error } = await supabase.from('event_banners').insert(payload).select().single()

      if (error) {
        throw new Error(error.message || 'Failed to create event banner')
      }

      return normalizeBanner(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create event banner')
    }
  }
)

export const updateEventBanner = createAsyncThunk(
  'eventBanners/updateEventBanner',
  async ({ id, bannerData }, { rejectWithValue, getState }) => {
    try {
      const existingBanner = getState().eventBanners.banners.find((banner) => banner.id === id)
      const payload = await buildBannerPayload({ id, bannerData, existingBanner })
      const { data, error } = await supabase
        .from('event_banners')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to update event banner')
      }

      return normalizeBanner(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update event banner')
    }
  }
)

export const deleteEventBanner = createAsyncThunk(
  'eventBanners/deleteEventBanner',
  async (bannerId, { rejectWithValue, getState }) => {
    try {
      const existingBanner = getState().eventBanners.banners.find((banner) => banner.id === bannerId)
      if (existingBanner?.bannerImage) {
        await deletePublicFile({ bucket: 'event-banners', publicUrl: existingBanner.bannerImage })
      }

      const { error } = await supabase.from('event_banners').delete().eq('id', bannerId)

      if (error) {
        throw new Error(error.message || 'Failed to delete event banner')
      }

      return bannerId
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete event banner')
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
        state.banners = action.payload
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
        state.banners.unshift(action.payload)
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
        const index = state.banners.findIndex(banner => banner.id === action.payload.id)
        if (index !== -1) {
          state.banners[index] = action.payload
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
