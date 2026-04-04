import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../config/api'

// Async thunks for contact configuration
export const fetchContactConfig = createAsyncThunk(
  'contactConfig/fetchContactConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contact-config')
      return response.data.config
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch contact config')
    }
  }
)

export const updateContactConfig = createAsyncThunk(
  'contactConfig/updateContactConfig',
  async (configData, { rejectWithValue }) => {
    try {
      const response = await api.put('/contact-config', configData)
      return response.data.config
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update contact config')
    }
  }
)

// Email management (real endpoints)
export const addEmail = createAsyncThunk(
  'contactConfig/addEmail',
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await api.post('/contact-config/emails', emailData)
      return response.data.email
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add email')
    }
  }
)

export const updateEmail = createAsyncThunk(
  'contactConfig/updateEmail',
  async ({ id, emailData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contact-config/emails/${id}`, emailData)
      return { id, emailData: response.data.email }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update email')
    }
  }
)

export const deleteEmail = createAsyncThunk(
  'contactConfig/deleteEmail',
  async (emailId, { rejectWithValue }) => {
    try {
      await api.delete(`/contact-config/emails/${emailId}`)
      return emailId
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete email')
    }
  }
)

// Phone number management
export const addPhoneNumber = createAsyncThunk(
  'contactConfig/addPhoneNumber',
  async (phoneData, { rejectWithValue }) => {
    try {
      const response = await api.post('/contact-config/phones', phoneData)
      return response.data.phone
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add phone number')
    }
  }
)

export const updatePhoneNumber = createAsyncThunk(
  'contactConfig/updatePhoneNumber',
  async ({ id, phoneData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contact-config/phones/${id}`, phoneData)
      return { id, phoneData: response.data.phone }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update phone number')
    }
  }
)

export const deletePhoneNumber = createAsyncThunk(
  'contactConfig/deletePhoneNumber',
  async (phoneId, { rejectWithValue }) => {
    try {
      await api.delete(`/contact-config/phones/${phoneId}`)
      return phoneId
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete phone number')
    }
  }
)

// WhatsApp number management
export const addWhatsAppNumber = createAsyncThunk(
  'contactConfig/addWhatsAppNumber',
  async (whatsappData, { rejectWithValue }) => {
    try {
      const response = await api.post('/contact-config/whatsapps', whatsappData)
      return response.data.whatsapp
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add WhatsApp number')
    }
  }
)

export const updateWhatsAppNumber = createAsyncThunk(
  'contactConfig/updateWhatsAppNumber',
  async ({ id, whatsappData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contact-config/whatsapps/${id}`, whatsappData)
      return { id, whatsappData: response.data.whatsapp }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update WhatsApp number')
    }
  }
)

export const deleteWhatsAppNumber = createAsyncThunk(
  'contactConfig/deleteWhatsAppNumber',
  async (whatsappId, { rejectWithValue }) => {
    try {
      await api.delete(`/contact-config/whatsapps/${whatsappId}`)
      return whatsappId
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete WhatsApp number')
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
        state.config.emails.push(action.payload)
      })
      .addCase(updateEmail.fulfilled, (state, action) => {
        const { id, emailData } = action.payload
        const emailIndex = state.config.emails.findIndex(email => email.id === id)
        if (emailIndex !== -1) {
          state.config.emails[emailIndex] = { ...state.config.emails[emailIndex], ...emailData }
        }
      })
      .addCase(deleteEmail.fulfilled, (state, action) => {
        state.config.emails = state.config.emails.filter(email => email.id !== action.payload)
      })

    // Phone number management
    builder
      .addCase(addPhoneNumber.fulfilled, (state, action) => {
        state.config.phoneNumbers.push(action.payload)
      })
      .addCase(updatePhoneNumber.fulfilled, (state, action) => {
        const { id, phoneData } = action.payload
        const phoneIndex = state.config.phoneNumbers.findIndex(phone => phone.id === id)
        if (phoneIndex !== -1) {
          state.config.phoneNumbers[phoneIndex] = { ...state.config.phoneNumbers[phoneIndex], ...phoneData }
        }
      })
      .addCase(deletePhoneNumber.fulfilled, (state, action) => {
        state.config.phoneNumbers = state.config.phoneNumbers.filter(phone => phone.id !== action.payload)
      })

    // WhatsApp number management
    builder
      .addCase(addWhatsAppNumber.fulfilled, (state, action) => {
        state.config.whatsappNumbers.push(action.payload)
      })
      .addCase(updateWhatsAppNumber.fulfilled, (state, action) => {
        const { id, whatsappData } = action.payload
        const whatsappIndex = state.config.whatsappNumbers.findIndex(whatsapp => whatsapp.id === id)
        if (whatsappIndex !== -1) {
          state.config.whatsappNumbers[whatsappIndex] = { ...state.config.whatsappNumbers[whatsappIndex], ...whatsappData }
        }
      })
      .addCase(deleteWhatsAppNumber.fulfilled, (state, action) => {
        state.config.whatsappNumbers = state.config.whatsappNumbers.filter(whatsapp => whatsapp.id !== action.payload)
      })
  }
})

export const { clearError, updateAddress, updateBusinessHours, updateSocialMedia } = contactConfigSlice.actions
export default contactConfigSlice.reducer
