import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabase'

const normalizeContact = (contact) => ({
  ...contact,
  id: contact.id,
  _id: contact.id,
  services: Array.isArray(contact.services) ? contact.services : [],
  isRead: Boolean(contact.is_read),
  is_read: Boolean(contact.is_read),
  createdAt: contact.created_at,
})

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message || 'Failed to fetch contacts')
      }

      return (data || []).map(normalizeContact)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch contacts')
    }
  }
)

export const markContactAsRead = createAsyncThunk(
  'contacts/markContactAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to mark contact as read')
      }

      return normalizeContact(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark contact as read')
    }
  }
)

export const updateContactStatus = createAsyncThunk(
  'contacts/updateContactStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to update contact status')
      }

      return normalizeContact(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update contact status')
    }
  }
)

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id)

      if (error) {
        throw new Error(error.message || 'Failed to delete contact')
      }

      return id
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete contact')
    }
  }
)

const initialState = {
  contacts: [],
  loading: false,
  error: null,
  selectedContact: null,
}

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedContact: (state, action) => {
      state.selectedContact = action.payload
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false
        state.contacts = action.payload
        state.error = null
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(markContactAsRead.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(markContactAsRead.fulfilled, (state, action) => {
        state.loading = false
        const index = state.contacts.findIndex(contact => contact.id === action.payload.id)
        if (index !== -1) {
          state.contacts[index] = action.payload
        }
        state.error = null
      })
      .addCase(markContactAsRead.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateContactStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.contacts.findIndex(contact => contact.id === action.payload.id)
        if (index !== -1) {
          state.contacts[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateContactStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteContact.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false
        state.contacts = state.contacts.filter(contact => contact.id !== action.payload)
        state.error = null
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setSelectedContact, clearSelectedContact } = contactsSlice.actions
export default contactsSlice.reducer
