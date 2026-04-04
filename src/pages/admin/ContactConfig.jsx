import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, FieldArray } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import {
  fetchContactConfig,
  updateContactConfig,
  updateEmail,
  updatePhoneNumber,
  updateWhatsAppNumber,
  updateAddress,
  updateSocialMedia,
  clearError
} from '../../store/slices/contactConfigSlice'
import {
  PencilIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

const ContactConfig = () => {
  const dispatch = useDispatch()
  const { config, loading, error, updating } = useSelector(state => state.contactConfig)
  // Single form layout (no tabs)
  const [editingItem, setEditingItem] = useState(null)
  const [editingType, setEditingType] = useState(null)

  useEffect(() => {
    dispatch(fetchContactConfig())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000)
    }
  }, [error, dispatch])

  const validationSchema = Yup.object({
    emails: Yup.array().of(
      Yup.object({
        email: Yup.string().email('Invalid email').required('Email is required')
      })
    ),
    phoneNumbers: Yup.array().of(
      Yup.object({
        number: Yup.string().required('Phone number is required')
      })
    ),
    whatsappNumbers: Yup.array().of(
      Yup.object({
        number: Yup.string().required('WhatsApp number is required')
      })
    ),
    address: Yup.object({
      street: Yup.string().required('Street is required'),
      area: Yup.string().required('Area is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      pincode: Yup.string().required('Pincode is required')
    })
  })

  const handleSubmit = async (values) => {
    try {
      await dispatch(updateContactConfig(values)).unwrap()
      toast.success('Contact configuration updated successfully!')
    } catch (error) {
      toast.error('Failed to update contact configuration. Please try again.')
    }
  }

  const handleUpdateEmail = (id, emailData) => {
    dispatch(updateEmail({ id, emailData }))
  }

  const handleUpdatePhoneNumber = (id, phoneData) => {
    dispatch(updatePhoneNumber({ id, phoneData }))
  }

  const handleUpdateWhatsAppNumber = (id, whatsappData) => {
    dispatch(updateWhatsAppNumber({ id, whatsappData }))
  }

  // Tabs removed in favor of a single consolidated form

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Contact Configuration Found</h2>
          <p className="text-gray-600">Please check your backend connection or create initial configuration.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Contact Configuration</h1>
        <p className="text-gray-600">Manage your contact information displayed on the website</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Tabs removed */}

      <Formik
        initialValues={config || {
          emails: [],
          phoneNumbers: [],
          whatsappNumbers: [],
          address: {
            street: '',
            area: '',
            city: '',
            state: '',
            pincode: ''
          },
          socialMedia: []
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue }) => (
          <Form>
            {/* Contact Info Section */}
            <div className="space-y-6">

                {/* Email Addresses */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <EnvelopeIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Email Addresses
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {(values.emails || []).map((email, index) => (
                      <div key={email.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {email.type}
                            </span>
                            <span className="text-sm text-gray-900">{email.email}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(email)
                              setEditingType('edit-email')
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <PhoneIcon className="h-5 w-5 mr-2 text-green-600" />
                      Phone Numbers
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {(values.phoneNumbers || []).map((phone, index) => (
                      <div key={phone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {phone.type}
                            </span>
                            <span className="text-sm text-gray-900">{phone.number}</span>
                            {phone.isDirectCall && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Direct Call
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(phone)
                              setEditingType('edit-phone')
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Numbers */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      WhatsApp Numbers
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {(values.whatsappNumbers || []).map((whatsapp, index) => (
                      <div key={whatsapp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {whatsapp.type}
                            </span>
                            <span className="text-sm text-gray-900">{whatsapp.number}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(whatsapp)
                              setEditingType('edit-whatsapp')
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              {/* Address Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Office Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <Field
                      name="address.street"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area
                    </label>
                    <Field
                      name="address.area"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter area"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Field
                      name="address.city"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <Field
                      name="address.state"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <Field
                      name="address.pincode"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Social Media Links</h3>
                <div className="space-y-4">
                  {(values.socialMedia || []).map((social, index) => (
                    <div key={social.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900 capitalize">{social.platform}</span>
                        <Field
                          name={`socialMedia.${index}.url`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter URL"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Modal for editing items */}
      {(editingType === 'edit-email') && (
        <EmailModal
          email={editingItem}
          onSave={handleUpdateEmail}
          onCancel={() => {
            setEditingItem(null)
            setEditingType(null)
          }}
        />
      )}

      {(editingType === 'edit-phone') && (
        <PhoneModal
          phone={editingItem}
          onSave={handleUpdatePhoneNumber}
          onCancel={() => {
            setEditingItem(null)
            setEditingType(null)
          }}
        />
      )}

      {(editingType === 'edit-whatsapp') && (
        <WhatsAppModal
          whatsapp={editingItem}
          onSave={handleUpdateWhatsAppNumber}
          onCancel={() => {
            setEditingItem(null)
            setEditingType(null)
          }}
        />
      )}
    </div>
  )
}


// Email Modal Component
const EmailModal = ({ email, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: email?.type || 'General',
    email: email?.email || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(email.id, formData)
    onCancel()
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Email</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Phone Modal Component
const PhoneModal = ({ phone, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: phone?.type || 'Primary',
    number: phone?.number || '',
    isDirectCall: true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(phone.id, formData)
    onCancel()
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Phone Number</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91 98765 43210"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// WhatsApp Modal Component
const WhatsAppModal = ({ whatsapp, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: whatsapp?.type || 'Business',
    number: whatsapp?.number || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(whatsapp.id, formData)
    onCancel()
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit WhatsApp Number</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91 98765 43210"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactConfig
