import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../config/api'

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/events')
      // Normalize fields and map MongoDB _id to id for UI consistency
      const events = (response.data.events || response.data || []).map(event => ({
        ...event,
        id: event._id || event.id,
        name: event.title || event.name || '',
        image: event.image || event.backgroundImage || ''
      }))
      return events
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch events')
    }
  }
)

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await api.post('/events', eventData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      const event = response.data.event || response.data
      return {
        ...event,
        id: event._id || event.id,
        name: event.title || event.name || '',
        image: event.image || event.backgroundImage || ''
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create event')
    }
  }
)

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await api.put(`/events/${id}`, eventData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      const event = response.data.event || response.data
      return {
        ...event,
        id: event._id || event.id,
        name: event.title || event.name || '',
        image: event.image || event.backgroundImage || ''
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update event')
    }
  }
)

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken')
      await api.delete(`/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete event')
    }
  }
)

const initialState = {
  events: [],
  loading: false,
  error: null,
  selectedEvent: null,
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
        state.error = null
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events.push(action.payload)
        state.error = null
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false
        const index = state.events.findIndex(event => event.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events = state.events.filter(event => event.id !== action.payload)
        state.error = null
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setSelectedEvent, clearSelectedEvent } = eventsSlice.actions
export default eventsSlice.reducer
