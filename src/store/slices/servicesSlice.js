import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createId, ensureArray } from '../../lib/supabaseData'
import { getSupabase } from '../../lib/supabase'
import { deletePublicFile, uploadPublicFile } from '../../lib/supabaseStorage'

const normalizeService = (service) => {
  const featureList = ensureArray(service.feature || service.features).map((feature, index) => ({
    id: feature.id || feature._id || `${service.id}-feature-${index}`,
    title: feature.title || '',
    description: feature.description || '',
    image: feature.image || '',
  }))

  return {
    ...service,
    id: service.id,
    _id: service.id,
    image: service.image || service.image_url || '',
    image_url: service.image || service.image_url || '',
    feature: featureList,
    features: featureList,
  }
}

const buildFeaturePayload = async ({ serviceId, feature = [] }) => {
  return Promise.all(
    ensureArray(feature).map(async (item, index) => {
      let image = item.image || null

      if (item.imageFile) {
        if (image) {
          await deletePublicFile({ bucket: 'services', publicUrl: image })
        }

        image = await uploadPublicFile({
          bucket: 'services',
          file: item.imageFile,
          recordId: serviceId,
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

const buildServicePayload = async ({ id, serviceData, existingService = null }) => {
  let image = serviceData.image || existingService?.image || null

  if (serviceData.imageFile) {
    if (existingService?.image) {
      await deletePublicFile({ bucket: 'services', publicUrl: existingService.image })
    }

    image = await uploadPublicFile({
      bucket: 'services',
      file: serviceData.imageFile,
      recordId: id,
      folder: 'main',
    })
  }

  const feature = await buildFeaturePayload({
    serviceId: id,
    feature: serviceData.feature,
  })

  return {
    id,
    category: serviceData.category,
    service_name: serviceData.service_name || { str1: '', str2: '' },
    description: serviceData.description || '',
    image,
    feature_heading: serviceData.feature_heading || { str1: '', str2: '' },
    feature_description: serviceData.feature_description || '',
    feature,
  }
}

export const fetchServices = createAsyncThunk('services/fetchServices', async (_, { rejectWithValue }) => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message || 'Failed to fetch services')
    }

    return (data || []).map(normalizeService)
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch services')
  }
})

export const createService = createAsyncThunk('services/createService', async (serviceData, { rejectWithValue }) => {
  try {
    const id = createId()
    const payload = await buildServicePayload({ id, serviceData })
    const { data, error } = await supabase.from('services').insert(payload).select().single()

    if (error) {
      throw new Error(error.message || 'Failed to create service')
    }

    return normalizeService(data)
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to create service')
  }
})

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, serviceData }, { rejectWithValue, getState }) => {
    try {
      const existingService = getState().services.services.find((service) => service.id === id || service._id === id)
      const payload = await buildServicePayload({ id, serviceData, existingService })
      const { data, error } = await supabase.from('services').update(payload).eq('id', id).select().single()

      if (error) {
        throw new Error(error.message || 'Failed to update service')
      }

      return normalizeService(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update service')
    }
  }
)

export const deleteService = createAsyncThunk('services/deleteService', async (id, { rejectWithValue, getState }) => {
  try {
    const existingService = getState().services.services.find((service) => service.id === id || service._id === id)

    if (existingService?.image) {
      await deletePublicFile({ bucket: 'services', publicUrl: existingService.image })
    }

    for (const feature of ensureArray(existingService?.feature)) {
      if (feature.image) {
        await deletePublicFile({ bucket: 'services', publicUrl: feature.image })
      }
    }

    const { error } = await supabase.from('services').delete().eq('id', id)

    if (error) {
      throw new Error(error.message || 'Failed to delete service')
    }

    return id
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to delete service')
  }
})

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
