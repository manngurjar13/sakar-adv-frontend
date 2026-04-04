import axios from 'axios'

// Determine the API base URL
// Handles mixed content issues (HTTPS frontend -> HTTP backend)
const getBaseURL = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // In production, use relative URL
  // Vercel rewrites will proxy /api/* requests to the backend
  // This avoids mixed content issues (HTTPS frontend -> HTTP backend)
  if (import.meta.env.PROD) {
    return '/api'
  }
  
  // In development, use relative path (Vite proxy will handle it)
  return '/api'
}

// Create axios instance
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminData')
      
      // Only redirect to admin login if user is on an admin route
      // Don't redirect from public routes (like contact page)
      const currentPath = window.location.pathname
      if (currentPath.startsWith('/admin') && !currentPath.includes('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
