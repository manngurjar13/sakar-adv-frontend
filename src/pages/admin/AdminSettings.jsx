import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  KeyIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'seo', name: 'SEO Settings', icon: GlobeAltIcon },
  ]

  const profileValidationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    bio: Yup.string().max(500, 'Bio must be less than 500 characters'),
  })

  const securityValidationSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your password'),
  })

  const seoValidationSchema = Yup.object({
    siteTitle: Yup.string().required('Site title is required'),
    siteDescription: Yup.string().required('Site description is required'),
    siteKeywords: Yup.string().required('Keywords are required'),
    googleAnalytics: Yup.string(),
    facebookPixel: Yup.string(),
  })

  const handleProfileSubmit = (values) => {
    console.log('Profile update:', values)
    // Implement profile update logic
  }

  const handleSecuritySubmit = (values) => {
    console.log('Security update:', values)
    // Implement password change logic
  }

  const handleSeoSubmit = (values) => {
    console.log('SEO update:', values)
    // Implement SEO settings update logic
  }

  const renderProfileTab = () => (
    <Formik
      initialValues={{
        name: 'Admin User',
        email: 'admin@sakaradvertisement.com',
        phone: '+91 9876543210',
        bio: 'Administrator of Sakar Advertisement',
      }}
      validationSchema={profileValidationSchema}
      onSubmit={handleProfileSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.name && touched.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Field
              id="phone"
              name="phone"
              type="tel"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.phone && touched.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <Field
              as="textarea"
              id="bio"
              name="bio"
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.bio && touched.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Profile
          </button>
        </Form>
      )}
    </Formik>
  )

  const renderSecurityTab = () => (
    <Formik
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }}
      validationSchema={securityValidationSchema}
      onSubmit={handleSecuritySubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <Field
              id="currentPassword"
              name="currentPassword"
              type="password"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.currentPassword && touched.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
            )}
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <Field
              id="newPassword"
              name="newPassword"
              type="password"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.newPassword && touched.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <Field
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <KeyIcon className="h-4 w-4 mr-2" />
            Change Password
          </button>
        </Form>
      )}
    </Formik>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">New Contact Queries</p>
              <p className="text-sm text-gray-500">Get notified when someone submits a contact form</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Event Bookings</p>
              <p className="text-sm text-gray-500">Get notified when someone books an event</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">System Updates</p>
              <p className="text-sm text-gray-500">Get notified about system maintenance and updates</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  )

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Timezone</label>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option>Asia/Kolkata</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Format</label>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSeoTab = () => (
    <Formik
      initialValues={{
        siteTitle: 'Sakar Advertisement - Outdoor Advertising Solutions',
        siteDescription: 'Professional outdoor advertising and branding solutions in Indore. Vehicle branding, billboard advertising, events management and more.',
        siteKeywords: 'outdoor advertising, vehicle branding, billboard advertising, indore, branding solutions',
        googleAnalytics: '',
        facebookPixel: '',
      }}
      validationSchema={seoValidationSchema}
      onSubmit={handleSeoSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-6">
          <div>
            <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700">
              Site Title
            </label>
            <Field
              id="siteTitle"
              name="siteTitle"
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.siteTitle && touched.siteTitle && (
              <p className="mt-1 text-sm text-red-600">{errors.siteTitle}</p>
            )}
          </div>
          <div>
            <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
              Site Description
            </label>
            <Field
              as="textarea"
              id="siteDescription"
              name="siteDescription"
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.siteDescription && touched.siteDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.siteDescription}</p>
            )}
          </div>
          <div>
            <label htmlFor="siteKeywords" className="block text-sm font-medium text-gray-700">
              Keywords
            </label>
            <Field
              id="siteKeywords"
              name="siteKeywords"
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.siteKeywords && touched.siteKeywords && (
              <p className="mt-1 text-sm text-red-600">{errors.siteKeywords}</p>
            )}
          </div>
          <div>
            <label htmlFor="googleAnalytics" className="block text-sm font-medium text-gray-700">
              Google Analytics ID
            </label>
            <Field
              id="googleAnalytics"
              name="googleAnalytics"
              type="text"
              placeholder="G-XXXXXXXXXX"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="facebookPixel" className="block text-sm font-medium text-gray-700">
              Facebook Pixel ID
            </label>
            <Field
              id="facebookPixel"
              name="facebookPixel"
              type="text"
              placeholder="123456789012345"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <GlobeAltIcon className="h-4 w-4 mr-2" />
            Update SEO Settings
          </button>
        </Form>
      )}
    </Formik>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab()
      case 'security':
        return renderSecurityTab()
      case 'notifications':
        return renderNotificationsTab()
      case 'general':
        return renderGeneralTab()
      case 'seo':
        return renderSeoTab()
      default:
        return renderProfileTab()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Settings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
