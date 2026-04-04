import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const { isAuthenticated } = useSelector((state) => state.auth)

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
