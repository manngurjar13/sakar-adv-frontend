import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  MegaphoneIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { logoutAdmin } from '../../store/slices/authSlice'

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({})

  const navigation = [
    { 
      name: 'Events', 
      icon: CalendarDaysIcon,
      submenu: [
        { name: 'Manage Events', href: '/admin/events' },
        { name: 'Event Banners', href: '/admin/event-banners' },
        { name: 'Upcoming Events', href: '/admin/upcoming-events' }
      ]
    },
    {
      name: 'Services',
      icon: Cog6ToothIcon,
      submenu: [
        { name: 'Manage Services', href: '/admin/services' },
        { name: 'Create New Service', href: '/admin/services/create' }
      ]
    },
    { name: 'Testimonials', href: '/admin/testimonials', icon: ChatBubbleLeftRightIcon },
    { name: 'Portfolio', href: '/admin/portfolio', icon: PhotoIcon },
    { name: 'Contacts', href: '/admin/contacts', icon: UserGroupIcon },
    { name: 'Contact Config', href: '/admin/contact-config', icon: Cog6ToothIcon },
  ]

  const handleLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap()
      navigate('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isCurrentPath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const toggleSubmenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }))
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'flex' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className={`relative flex flex-col w-80 max-w-xs bg-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SA</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">Admin Panel</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                if (item.submenu) {
                  const isExpanded = expandedMenus[item.name]
                  const hasActiveSubmenu = item.submenu.some(subItem => isCurrentPath(subItem.href))
                  
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`${
                          hasActiveSubmenu
                            ? 'bg-blue-100 text-blue-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        } group flex items-center justify-between w-full px-3 py-3 text-base font-medium rounded-md transition-colors min-h-[48px]`}
                      >
                        <div className="flex items-center">
                          <item.icon
                            className={`${
                              hasActiveSubmenu ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                            } mr-4 h-6 w-6`}
                          />
                          {item.name}
                        </div>
                        <ChevronRightIcon
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? 'transform rotate-90' : ''
                          }`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="ml-8 space-y-1">
                          {item.submenu.map((subItem) => {
                            const isCurrent = isCurrentPath(subItem.href)
                            return (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className={`${
                                  isCurrent
                                    ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                              >
                                {subItem.name}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                } else {
                  const isCurrent = isCurrentPath(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isCurrent
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors min-h-[48px]`}
                    >
                      <item.icon
                        className={`${
                          isCurrent ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-4 h-6 w-6`}
                      />
                      {item.name}
                    </Link>
                  )
                }
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <div>
                  <ArrowRightOnRectangleIcon className="inline-block h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Sign out
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 lg:w-72">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SA</span>
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">Admin Panel</span>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => {
                  if (item.submenu) {
                    const isExpanded = expandedMenus[item.name]
                    const hasActiveSubmenu = item.submenu.some(subItem => isCurrentPath(subItem.href))
                    
                    return (
                      <div key={item.name}>
                        <button
                          onClick={() => toggleSubmenu(item.name)}
                          className={`${
                            hasActiveSubmenu
                              ? 'bg-blue-100 text-blue-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          } group flex items-center justify-between w-full px-3 py-3 text-sm font-medium rounded-md transition-colors min-h-[48px]`}
                        >
                          <div className="flex items-center">
                            <item.icon
                              className={`${
                                hasActiveSubmenu ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                              } mr-3 h-6 w-6`}
                            />
                            {item.name}
                          </div>
                          <ChevronRightIcon
                            className={`h-4 w-4 transition-transform ${
                              isExpanded ? 'transform rotate-90' : ''
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="ml-8 space-y-1">
                            {item.submenu.map((subItem) => {
                              const isCurrent = isCurrentPath(subItem.href)
                              return (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className={`${
                                    isCurrent
                                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                                >
                                  {subItem.name}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  } else {
                    const isCurrent = isCurrentPath(item.href)
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${
                          isCurrent
                            ? 'bg-blue-100 text-blue-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors min-h-[48px]`}
                      >
                        <item.icon
                          className={`${
                            isCurrent ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                          } mr-3 h-6 w-6`}
                        />
                        {item.name}
                      </Link>
                    )
                  }
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center">
                  <div>
                    <ArrowRightOnRectangleIcon className="inline-block h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Sign out
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-3 sm:px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-3 sm:px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <span className="text-sm sm:text-base text-gray-700 ml-2 sm:ml-4">Admin Panel</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-2 sm:ml-4 flex items-center md:ml-6">
              {/* Empty space for future use */}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
