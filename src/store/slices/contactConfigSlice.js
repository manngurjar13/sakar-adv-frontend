import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { cloneJson, createId, ensureArray } from '../../lib/supabaseData'
import { supabase } from '../../lib/supabase'

const DEFAULT_ADDRESS = {
  street: '',
  area: '',
  city: '',
  state: '',
  pincode: '',
}

const normalizeItemIds = (items, defaults = {}) => {
  return ensureArray(items).map((item) => ({
    ...defaults,
    ...item,
    id: item.id || createId(),
  }))
}

const normalizeContactConfig = (config) => {
  if (!config) return null

  return {
    id: config.id,
    singleton: config.singleton ?? true,
    address: {
      ...DEFAULT_ADDRESS,
      ...(config.address || {}),
    },
    emails: normalizeItemIds(config.emails, { type: 'Primary', email: '', isActive: true }),
    phoneNumbers: normalizeItemIds(config.phone_numbers || config.phoneNumbers, {
      type: 'Primary',
      number: '',
      isActive: true,
      isDirectCall: false,
    }),
    whatsappNumbers: normalizeItemIds(config.whatsapp_numbers || config.whatsappNumbers, {
      type: 'Business',
      number: '',
      isActive: true,
    }),
    socialMedia: normalizeItemIds(config.social_media || config.socialMedia, {
      platform: '',
      url: '',
      isActive: false,
    }),
  }
}

const serializeContactConfig = (config) => {
  const normalized = normalizeContactConfig(config)

  return {
    id: normalized.id,
    singleton: true,
    address: normalized.address,
    emails: normalized.emails,
    phone_numbers: normalized.phoneNumbers,
    whatsapp_numbers: normalized.whatsappNumbers,
    social_media: normalized.socialMedia,
  }
}

const saveContactConfig = async (config) => {
  const payload = serializeContactConfig(config)
  const { data, error } = await supabase
    .from('contact_config')
    .upsert(payload)
    .select()
    .single()

  if (error) {
    throw new Error(error.message || 'Failed to update contact config')
  }

  return normalizeContactConfig(data)
}

export const fetchContactConfig = createAsyncThunk('contactConfig/fetchContactConfig', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from('contact_config')
      .select('*')
      .eq('singleton', true)
      .single()

    if (error) {
      throw new Error(error.message || 'Failed to fetch contact config')
    }

    return normalizeContactConfig(data)
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch contact config')
  }
})

export const updateContactConfig = createAsyncThunk(
  'contactConfig/updateContactConfig',
  async (configData, { rejectWithValue }) => {
    try {
      return await saveContactConfig(configData)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update contact config')
    }
  }
)

export const addEmail = createAsyncThunk('contactConfig/addEmail', async (emailData, { rejectWithValue, getState }) => {
  try {
    const config = cloneJson(getState().contactConfig.config)
    config.emails = [...ensureArray(config.emails), { id: createId(), isActive: true, ...emailData }]
    return await saveContactConfig(config)
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to add email')
  }
})

export const updateEmail = createAsyncThunk(
  'contactConfig/updateEmail',
  async ({ id, emailData }, { rejectWithValue, getState }) => {
    try {
      const config = cloneJson(getState().contactConfig.config)
      config.emails = ensureArray(config.emails).map((email) => (email.id === id ? { ...email, ...emailData } : email))
      return await saveContactConfig(config)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update email')
    }
  }
)

export const deleteEmail = createAsyncThunk('contactConfig/deleteEmail', async (emailId, { rejectWithValue, getState }) => {
  try {
    const config = cloneJson(getState().contactConfig.config)
    config.emails = ensureArray(config.emails).filter((email) => email.id !== emailId)
    return await saveContactConfig(config)
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to delete email')
  }
})

export const addPhoneNumber = createAsyncThunk(
  'contactConfig/addPhoneNumber',
  async (phoneData, { rejectWithValue, getState }) => {
    try {
      const config = cloneJson(getState().contactConfig.config)
      config.phoneNumbers = [...ensureArray(config.phoneNumbers), { id: createId(), isActive: true, ...phoneData }]
      return await saveContactConfig(config)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add phone number')
    }
  }
)

export const updatePhoneNumber = createAsyncThunk(
  'contactConfig/updatePhoneNumber',
  async ({ id, phoneData }, { rejectWithValue, getState }) => {
    try {
      const config = cloneJson(getState().contactConfig.config)
      config.phoneNumbers = ensureArray(config.phoneNumbers).map((phone) => (phone.id === id ? { ...phone, ...phoneData } : phone))
      return await saveContactConfig(config)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update phone number')
    }
  }
)

export const deletePhoneNumber = createAsyncThunk(
  'contactConfig/deletePhoneNumber',
  async (phoneId, { rejectWithValue, getState }) => {
    try {
      const config = cloneJson(getState().contactConfig.config)
      config.phoneNumbers = ensureArray(config.phoneNumbers).filter((phone) => phone.id !== phoneId)
      return await saveContactConfig(config)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete phone number')
    }
  }
)

export const addWhatsAppNumber = createAsyncThunk(
  'contactConfig/addWhatsAppNumber',
  async (whatsappData, { rejectWithValue, getState }) => {
    try {
      const config = cloneJson(getState().contactConfig.config)
      config.whatsappNumbers = [...ensureArray(config.whatsappNumbers), { id: createId(), isActive: true, ...whatsappData }]
      return await saveContactConfig(config)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add WhatsApp number')
    }
  }
)

export const updateWhatsAppNumber = createAsyncThunk(
  'contactConfig/updateWhatsAppNumber',
  async ({ id, whatsappData }, { rejectWithValue, getState }) => {
    try {
      const config = cloneJson(getState().contactConfig.config)
      config.whatsappNumbers = ensureArray(config.whatsappNumbers).map((whatsapp) =>
        whatsapp.id === id ? { ...whatsapp, ...whatsappData } : whatsapp
      )
      return await saveContactConfig(config)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update WhatsApp number')
    }
  }
)

export const deleteWhatsAppNumber = createAsyncThunk(
  'contactConfig/deleteWhatsAppNumber',
  async (whatsappId, { rejectWithValue, getState }) => {
    try {
      const config = cloneJson(getState().contactConfig.config)
      config.whatsappNumbers = ensureArray(config.whatsappNumbers).filter((whatsapp) => whatsapp.id !== whatsappId)
      return await saveContactConfig(config)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete WhatsApp number')
    }
  }
)

const contactConfigSlice = createSlice({
  name: 'contactConfig',
  initialState: {
    config: null,
    loading: false,
    error: null,
    updating: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateAddress: (state, action) => {
      state.config.address = { ...state.config.address, ...action.payload }
    },
    updateBusinessHours: (state, action) => {
      state.config.businessHours = { ...state.config.businessHours, ...action.payload }
    },
    updateSocialMedia: (state, action) => {
      const { id, url, isActive } = action.payload
      const socialMedia = state.config.socialMedia.find(sm => sm.id === id)
      if (socialMedia) {
        socialMedia.url = url
        socialMedia.isActive = isActive
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch contact config
    builder
      .addCase(fetchContactConfig.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContactConfig.fulfilled, (state, action) => {
        state.loading = false
        state.config = action.payload
      })
      .addCase(fetchContactConfig.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update contact config
    builder
      .addCase(updateContactConfig.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateContactConfig.fulfilled, (state, action) => {
        state.updating = false
        state.config = action.payload
      })
      .addCase(updateContactConfig.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload
      })

    // Email management
    builder
      .addCase(addEmail.fulfilled, (state, action) => {
        state.config = action.payload
      })
      .addCase(updateEmail.fulfilled, (state, action) => {
        state.config = action.payload
      })
      .addCase(deleteEmail.fulfilled, (state, action) => {
        state.config = action.payload
      })

    // Phone number management
    builder
      .addCase(addPhoneNumber.fulfilled, (state, action) => {
        state.config = action.payload
      })
      .addCase(updatePhoneNumber.fulfilled, (state, action) => {
        state.config = action.payload
      })
      .addCase(deletePhoneNumber.fulfilled, (state, action) => {
        state.config = action.payload
      })

    // WhatsApp number management
    builder
      .addCase(addWhatsAppNumber.fulfilled, (state, action) => {
        state.config = action.payload
      })
      .addCase(updateWhatsAppNumber.fulfilled, (state, action) => {
        state.config = action.payload
      })
      .addCase(deleteWhatsAppNumber.fulfilled, (state, action) => {
        state.config = action.payload
      })
  }
})

export const { clearError, updateAddress, updateBusinessHours, updateSocialMedia } = contactConfigSlice.actions
export default contactConfigSlice.reducer
