import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createId, getFileFromFormData, getStringFromFormData } from '../../lib/supabaseData'
import { supabase } from '../../lib/supabase'
import { deletePublicFile, uploadPublicFile } from '../../lib/supabaseStorage'
import { getEventCategoryLabel, normalizeEventCategory, slugifyEventTitle } from '../../lib/eventCategories'

const normalizeEvent = (event) => ({
  ...event,
  id: event.id,
  _id: event.id,
  title: event.title || event.name || '',
  name: event.title || event.name || '',
  image: event.image || event.backgroundImage || '',
  backgroundImage: event.image || event.backgroundImage || '',
  category: normalizeEventCategory(event.category || event.type || 'normal'),
  categoryLabel: getEventCategoryLabel(event.category || event.type || 'normal'),
  type: normalizeEventCategory(event.category || event.type || 'normal'),
  slug: slugifyEventTitle(event.title || event.name || 'event'),
})

const buildEventPayload = async ({ id, eventData, existingEvent = null }) => {
  let image = existingEvent?.image || null
  const nextFile = getFileFromFormData(eventData, 'image')

  if (nextFile) {
    if (existingEvent?.image) {
      await deletePublicFile({ bucket: 'events', publicUrl: existingEvent.image })
    }

    image = await uploadPublicFile({
      bucket: 'events',
      file: nextFile,
      recordId: id,
      folder: 'cover',
    })
  }

  return {
    id,
    title: getStringFromFormData(eventData, 'title'),
    description: getStringFromFormData(eventData, 'description'),
    category: normalizeEventCategory(getStringFromFormData(eventData, 'category') || 'normal'),
    date: getStringFromFormData(eventData, 'date') || null,
    image,
  }
}

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false, nullsFirst: false })

      if (error) {
        throw new Error(error.message || 'Failed to fetch events')
      }

      return (data || []).map(normalizeEvent)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch events')
    }
  }
)

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const id = createId()
      const payload = await buildEventPayload({ id, eventData })
      const { data, error } = await supabase.from('events').insert(payload).select().single()

      if (error) {
        throw new Error(error.message || 'Failed to create event')
      }

      return normalizeEvent(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create event')
    }
  }
)

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, eventData }, { rejectWithValue, getState }) => {
    try {
      const existingEvent = getState().events.events.find((event) => event.id === id)
      const payload = await buildEventPayload({ id, eventData, existingEvent })
      const { data, error } = await supabase.from('events').update(payload).eq('id', id).select().single()

      if (error) {
        throw new Error(error.message || 'Failed to update event')
      }

      return normalizeEvent(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update event')
    }
  }
)

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue, getState }) => {
    try {
      const existingEvent = getState().events.events.find((event) => event.id === id)
      if (existingEvent?.image) {
        await deletePublicFile({ bucket: 'events', publicUrl: existingEvent.image })
      }

      const { error } = await supabase.from('events').delete().eq('id', id)

      if (error) {
        throw new Error(error.message || 'Failed to delete event')
      }

      return id
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete event')
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
