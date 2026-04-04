import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import productsSlice from './slices/productsSlice'
import eventsSlice from './slices/eventsSlice'
import testimonialsSlice from './slices/testimonialsSlice'
import portfolioSlice from './slices/portfolioSlice'
import contactsSlice from './slices/contactsSlice'
import contactConfigSlice from './slices/contactConfigSlice'
import eventBannerSlice from './slices/eventBannerSlice'
import upcomingEventSlice from './slices/upcomingEventSlice'

// Persist configuration for auth slice only
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Only persist auth slice
}

const rootReducer = combineReducers({
  auth: authSlice,
  products: productsSlice,
  events: eventsSlice,
  testimonials: testimonialsSlice,
  portfolio: portfolioSlice,
  contacts: contactsSlice,
  contactConfig: contactConfigSlice,
  eventBanners: eventBannerSlice,
  upcomingEvents: upcomingEventSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)
export default store
