import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, createTransform, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authSlice from './slices/authSlice'
import productsSlice from './slices/productsSlice'
import eventsSlice from './slices/eventsSlice'
import testimonialsSlice from './slices/testimonialsSlice'
import portfolioSlice from './slices/portfolioSlice'
import contactsSlice from './slices/contactsSlice'
import contactConfigSlice from './slices/contactConfigSlice'
import eventBannerSlice from './slices/eventBannerSlice'
import upcomingEventSlice from './slices/upcomingEventSlice'
import servicesSlice from './slices/servicesSlice'
import advertisingSlice from './slices/advertisingSlice'
import categoriesSlice from './slices/categoriesSlice'

const authPersistTransform = createTransform(
  (inboundState) => ({
    isAuthenticated: inboundState.isAuthenticated,
    admin: inboundState.admin,
    token: inboundState.token,
  }),
  (outboundState) => ({
    isAuthenticated: outboundState.isAuthenticated || false,
    admin: outboundState.admin || null,
    token: outboundState.token || null,
    loading: false,
    error: null,
    initialized: false,
    currentCheckId: null,
  }),
  { whitelist: ['auth'] }
)

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  transforms: [authPersistTransform],
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
  services: servicesSlice,
  advertising: advertisingSlice,
  categories: categoriesSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
export default store
