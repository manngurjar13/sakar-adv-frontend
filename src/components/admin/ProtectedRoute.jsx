import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { checkAuthStatus } from '../../store/slices/authSlice'

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated, initialized, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!initialized) {
      dispatch(checkAuthStatus())
    }
  }, [dispatch, initialized])

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Only protect admin routes - this component should only be used for admin routes
  // If user is not authenticated and trying to access a protected admin route, redirect to login
  if (!isAuthenticated) {
    // Only redirect if we're actually on an admin route (should always be true since this is only used for admin routes)
    // But add extra safety check to prevent redirecting from public routes
    const isAdminRoute = location.pathname.startsWith('/admin')
    if (isAdminRoute && !location.pathname.includes('/admin/login')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />
    }
  }

  return children
}

export default ProtectedRoute
