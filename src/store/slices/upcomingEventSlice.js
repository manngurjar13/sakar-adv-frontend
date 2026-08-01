import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createId, getFileFromFormData, getStringFromFormData } from '../../lib/supabaseData'
import { supabase } from '../../lib/supabase'
import { deletePublicFile, uploadPublicFile } from '../../lib/supabaseStorage'

const normalizeUpcomingEvent = (event) => ({
  ...event,
  id: event.id,
  _id: event.id,
  image: event.image || '',
  createdAt: event.created_at,
})

const buildUpcomingEventPayload = async ({ id, eventData, existingEvent = null }) => {
  let image = existingEvent?.image || null
  const nextFile = getFileFromFormData(eventData, 'image')

  if (nextFile) {
    if (existingEvent?.image) {
      await deletePublicFile({ bucket: 'upcoming-events', publicUrl: existingEvent.image })
    }

    image = await uploadPublicFile({
      bucket: 'upcoming-events',
      file: nextFile,
      recordId: id,
      folder: 'cover',
    })
  }

  return {
    id,
    title: getStringFromFormData(eventData, 'title'),
    date: getStringFromFormData(eventData, 'date') || null,
    location: getStringFromFormData(eventData, 'location'),
    description: getStringFromFormData(eventData, 'description'),
    image,
  }
}

// Async thunks for upcoming events
export const fetchUpcomingEvents = createAsyncThunk(
  'upcomingEvents/fetchUpcomingEvents',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('upcoming_events')
        .select('*')
        .order('date', { ascending: true, nullsFirst: false })

      if (error) {
        throw new Error(error.message || 'Failed to fetch upcoming events')
      }

      return (data || []).map(normalizeUpcomingEvent)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch upcoming events')
    }
  }
)

export const createUpcomingEvent = createAsyncThunk(
  'upcomingEvents/createUpcomingEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const id = createId()
      const payload = await buildUpcomingEventPayload({ id, eventData })
      const { data, error } = await supabase.from('upcoming_events').insert(payload).select().single()

      if (error) {
        throw new Error(error.message || 'Failed to create upcoming event')
      }

      return normalizeUpcomingEvent(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create upcoming event')
    }
  }
)

export const updateUpcomingEvent = createAsyncThunk(
  'upcomingEvents/updateUpcomingEvent',
  async ({ id, eventData }, { rejectWithValue, getState }) => {
    try {
      const existingEvent = getState().upcomingEvents.events.find((event) => event.id === id)
      const payload = await buildUpcomingEventPayload({ id, eventData, existingEvent })
      const { data, error } = await supabase
        .from('upcoming_events')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to update upcoming event')
      }

      return normalizeUpcomingEvent(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update upcoming event')
    }
  }
)

export const deleteUpcomingEvent = createAsyncThunk(
  'upcomingEvents/deleteUpcomingEvent',
  async (eventId, { rejectWithValue, getState }) => {
    try {
      const existingEvent = getState().upcomingEvents.events.find((event) => event.id === eventId)
      if (existingEvent?.image) {
        await deletePublicFile({ bucket: 'upcoming-events', publicUrl: existingEvent.image })
      }

      const { error } = await supabase.from('upcoming_events').delete().eq('id', eventId)

      if (error) {
        throw new Error(error.message || 'Failed to delete upcoming event')
      }

      return eventId
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete upcoming event')
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
