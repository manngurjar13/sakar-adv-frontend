import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import {
  fetchUpcomingEvents,
  createUpcomingEvent,
  updateUpcomingEvent,
  deleteUpcomingEvent,
  clearError
} from '../../store/slices/upcomingEventSlice'
import { getImageUrl } from '../../utils/imageUtils'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
    EyeIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

// Format date to yyyy-mm-dd for date input controls
const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const UpcomingEventList = () => {
  const dispatch = useDispatch()
  const { events, loading, error, creating, updating, deleting } = useSelector(state => state.upcomingEvents)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [viewingItem, setViewingItem] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const itemsPerPage = 6

  useEffect(() => {
    dispatch(fetchUpcomingEvents())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000)
    }
  }, [error, dispatch])

  const getValidationSchema = (isEdit) => Yup.object({
    title: Yup.string().required('Title is required'),
    date: Yup.string().required('Date is required'),
    location: Yup.string().required('Location is required'),
    image: isEdit ? Yup.mixed().nullable() : Yup.mixed().required('Image is required'),
    description: Yup.string().required('Description is required')
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('date', values.date)
      formData.append('location', values.location)
      formData.append('description', values.description)
      
      if (values.image && typeof values.image === 'object' && values.image.name) {
        formData.append('image', values.image)
      }

      // Dispatch thunks which use the centralized API instance
      if (editingEvent) {
        await dispatch(updateUpcomingEvent({ id: editingEvent.id, eventData: formData })).unwrap()
        toast.success('Upcoming event updated successfully!')
      } else {
        await dispatch(createUpcomingEvent(formData)).unwrap()
        toast.success('Upcoming event created successfully!')
      }
      
      setShowModal(false)
      setEditingEvent(null)
      resetForm()
    } catch (error) {
      console.error('Error saving event:', error)
      toast.error(editingEvent ? 'Failed to update upcoming event. Please try again.' : 'Failed to create upcoming event. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setShowModal(true)
  }

  const handleDelete = (event) => {
    setEventToDelete(event)
    setShowDeleteAlert(true)
  }

  const confirmDelete = async () => {
    if (eventToDelete) {
      try {
        await dispatch(deleteUpcomingEvent(eventToDelete.id)).unwrap()
        toast.success('Upcoming event deleted successfully!')
        setShowDeleteAlert(false)
        setEventToDelete(null)
      } catch (error) {
        toast.error('Failed to delete upcoming event. Please try again.')
      }
    }
  }

  const cancelDelete = () => {
    setShowDeleteAlert(false)
    setEventToDelete(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingEvent(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // No search filtering; show all events
  const filteredEvents = events

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage)

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h1>
            <p className="text-gray-600">Manage upcoming events and their details</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Event
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Search removed */}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <img
                src={getImageUrl(event.image)}
                alt={event.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2 text-red-500" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewingItem(event)}
                    className="p-1 text-gray-400 hover:text-gray-700"
                    title="View"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event)}
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEvents.length)} of {filteredEvents.length} events
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
        <EventModal
          event={editingEvent}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          validationSchema={getValidationSchema(!!editingEvent)}
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Event</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete "<span className="font-medium">{eventToDelete?.title}</span>"? This action cannot be undone.
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
      {viewingItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">View Event</h3>
                <button
                  onClick={() => setViewingItem(null)}
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
                    src={getImageUrl(viewingItem.image)}
                    alt={viewingItem.title}
                    className="w-full h-64 object-cover rounded"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/800x300?text=No+Image' }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Title</p>
                    <p className="text-gray-900 font-medium">{viewingItem.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-900 font-medium">{formatDate(viewingItem.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900 font-medium">{viewingItem.location}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-900">{viewingItem.description}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setViewingItem(null)}
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

// Event Modal Component
const EventModal = ({ event, onSubmit, onClose, validationSchema, isSubmitting }) => {
  const initialValues = event ? {
    title: event.title,
    date: formatDateForInput(event.date),
    location: event.location,
    image: event.image,
    description: event.description
  } : {
    title: '',
    date: '',
    location: '',
    image: '',
    description: ''
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {event ? 'Edit Event' : 'Add New Event'}
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
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <Field
                    name="title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                  {errors.title && touched.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <Field
                      type="date"
                      name="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.date && touched.date && (
                      <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <Field
                      name="location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter event location"
                    />
                    {errors.location && touched.location && (
                      <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Image *
                  </label>
                  <Field name="image">
                    {({ field, form }) => (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            form.setFieldValue('image', file);
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
                        {form.errors.image && form.touched.image && (
                          <p className="mt-1 text-sm text-red-600">{form.errors.image}</p>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event description"
                  />
                  {errors.description && touched.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
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
                    {isSubmitting ? 'Saving...' : (event ? 'Update' : 'Create')}
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

export default UpcomingEventList
