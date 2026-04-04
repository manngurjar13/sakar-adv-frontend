import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import {
  fetchEventBanners,
  createEventBanner,
  updateEventBanner,
  deleteEventBanner,
  clearError
} from '../../store/slices/eventBannerSlice'
import { getImageUrl } from '../../utils/imageUtils'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

// Shared validation schema factory for create/edit
const getValidationSchema = (isEdit) => Yup.object({
  bannerImage: isEdit ? Yup.mixed().nullable() : Yup.mixed().required('Banner image is required'),
  cardText: Yup.string().required('Main text is required')
})

const EventBannerList = () => {
  const dispatch = useDispatch()
  const { banners, loading, error, creating, updating, deleting } = useSelector(state => state.eventBanners)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [viewingBanner, setViewingBanner] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState(null)
  const itemsPerPage = 6

  useEffect(() => {
    dispatch(fetchEventBanners())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000)
    }
  }, [error, dispatch])

  // Validation handled via top-level getValidationSchema

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData()
      // API expects bannerText
      formData.append('bannerText', values.cardText)
      
      if (values.bannerImage) {
        // API expects backgroundImage
        formData.append('backgroundImage', values.bannerImage)
      }

      // Dispatch thunks with FormData
      if (editingBanner) {
        await dispatch(updateEventBanner({ id: editingBanner.id, bannerData: formData })).unwrap()
        toast.success('Event banner updated successfully!')
      } else {
        await dispatch(createEventBanner(formData)).unwrap()
        toast.success('Event banner created successfully!')
      }
      
      setShowModal(false)
      setEditingBanner(null)
      resetForm()
    } catch (error) {
      console.error('Error saving banner:', error)
      toast.error(editingBanner ? 'Failed to update event banner. Please try again.' : 'Failed to create event banner. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setShowModal(true)
  }

  const handleDelete = (banner) => {
    setBannerToDelete(banner)
    setShowDeleteAlert(true)
  }

  const confirmDelete = async () => {
    if (bannerToDelete) {
      try {
        await dispatch(deleteEventBanner(bannerToDelete.id)).unwrap()
        toast.success('Event banner deleted successfully!')
        setShowDeleteAlert(false)
        setBannerToDelete(null)
      } catch (error) {
        toast.error('Failed to delete event banner. Please try again.')
      }
    }
  }

  const cancelDelete = () => {
    setShowDeleteAlert(false)
    setBannerToDelete(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingBanner(null)
  }


  // Pagination
  const totalPages = Math.ceil(banners.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBanners = banners.slice(startIndex, startIndex + itemsPerPage)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Event Banners</h1>
            <p className="text-gray-600">Manage banners for event carousel and cards</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Banner
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}


      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedBanners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <img
                src={getImageUrl(banner.bannerImage)}
                alt={banner.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'
                }}
              />
            </div>
            <div className="p-4">
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-blue-800 text-sm font-medium">{banner.cardText}</p>
              </div>
              <div className="flex items-center justify-end">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewingBanner(banner)}
                    className="p-1 text-gray-400 hover:text-gray-700"
                    title="View"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, banners.length)} of {banners.length} banners
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm border rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <BannerModal
          banner={editingBanner}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          isSubmitting={creating || updating}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteAlert && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Banner</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete "<span className="font-medium">{bannerToDelete?.title}</span>"? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingBanner && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">View Banner</h3>
                <button
                  onClick={() => setViewingBanner(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="w-full">
                  <img
                    src={getImageUrl(viewingBanner.bannerImage)}
                    alt="Banner"
                    className="w-full h-64 object-cover rounded"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/800x300?text=No+Image' }}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Text</p>
                  <p className="text-gray-900">{viewingBanner.cardText}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setViewingBanner(null)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Banner Modal Component
const BannerModal = ({ banner, onSubmit, onClose, isSubmitting }) => {
  const initialValues = banner ? {
    bannerImage: banner.bannerImage,
    cardText: banner.cardText
  } : {
    bannerImage: null,
    cardText: ''
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {banner ? 'Edit Banner' : 'Add New Banner'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={getValidationSchema(!!banner)}
            onSubmit={onSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Image *
                  </label>
                  <Field name="bannerImage">
                    {({ field, form }) => (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            form.setFieldValue('bannerImage', file);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {field.value && typeof field.value === 'object' && field.value.name ? (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              Selected: {field.value.name}
                            </p>
                            <div className="mt-1">
                              <img
                                src={URL.createObjectURL(field.value)}
                                alt="Preview"
                                className="w-32 h-20 object-cover rounded border"
                              />
                            </div>
                          </div>
                        ) : field.value && typeof field.value === 'string' ? (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              Current image:
                            </p>
                            <div className="mt-1">
                              <img
                                src={getImageUrl(field.value)}
                                alt="Current"
                                className="w-32 h-20 object-cover rounded border"
                              />
                            </div>
                          </div>
                        ) : null}
                        {form.errors.bannerImage && form.touched.bannerImage && (
                          <p className="mt-1 text-sm text-red-600">{form.errors.bannerImage}</p>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Main Text *
                  </label>
                  <Field
                    as="textarea"
                    name="cardText"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter main text for the banner"
                  />
                  {errors.cardText && touched.cardText && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardText}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : (banner ? 'Update' : 'Create')}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default EventBannerList
