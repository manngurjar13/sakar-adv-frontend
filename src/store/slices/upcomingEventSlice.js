import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../config/api'

// Async thunks for upcoming events
export const fetchUpcomingEvents = createAsyncThunk(
  'upcomingEvents/fetchUpcomingEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/upcoming-events')
      // Map MongoDB _id to id for UI consistency
      const events = (response.data.events || response.data || []).map(event => ({
        ...event,
        id: event._id || event.id
      }))
      return events
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch upcoming events')
    }
  }
)

export const createUpcomingEvent = createAsyncThunk(
  'upcomingEvents/createUpcomingEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post('/upcoming-events', eventData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const event = response.data.event || response.data
      return {
        ...event,
        id: event._id || event.id
      }
    } catch (error) {
      console.error('createUpcomingEvent error:', error)
      return rejectWithValue(error.response?.data?.error || 'Failed to create upcoming event')
    }
  }
)

export const updateUpcomingEvent = createAsyncThunk(
  'upcomingEvents/updateUpcomingEvent',
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/upcoming-events/${id}`, eventData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const event = response.data.event || response.data
      return {
        ...event,
        id: event._id || event.id
      }
    } catch (error) {
      console.error('updateUpcomingEvent error:', error)
      return rejectWithValue(error.response?.data?.error || 'Failed to update upcoming event')
    }
  }
)

export const deleteUpcomingEvent = createAsyncThunk(
  'upcomingEvents/deleteUpcomingEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      await api.delete(`/upcoming-events/${eventId}`)
      return eventId
    } catch (error) {
      console.error('deleteUpcomingEvent error:', error)
      return rejectWithValue(error.response?.data?.error || 'Failed to delete upcoming event')
    }
  }
)

const upcomingEventSlice = createSlice({
  name: 'upcomingEvents',
  initialState: {
    events: [],
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
    // Fetch upcoming events
    builder
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Create upcoming event
    builder
      .addCase(createUpcomingEvent.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createUpcomingEvent.fulfilled, (state, action) => {
        state.creating = false
        state.events.unshift(action.payload)
      })
      .addCase(createUpcomingEvent.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload
      })

    // Update upcoming event
    builder
      .addCase(updateUpcomingEvent.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateUpcomingEvent.fulfilled, (state, action) => {
        state.updating = false
        const index = state.events.findIndex(event => event.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
      })
      .addCase(updateUpcomingEvent.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload
      })

    // Delete upcoming event
    builder
      .addCase(deleteUpcomingEvent.pending, (state) => {
        state.deleting = true
        state.error = null
      })
      .addCase(deleteUpcomingEvent.fulfilled, (state, action) => {
        state.deleting = false
        state.events = state.events.filter(event => event.id !== action.payload)
      })
      .addCase(deleteUpcomingEvent.rejected, (state, action) => {
        state.deleting = false
        state.error = action.payload
      })
  }
})

export const { clearError } = upcomingEventSlice.actions
export default upcomingEventSlice.reducer
