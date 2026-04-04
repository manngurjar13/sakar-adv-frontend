import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import { fetchEvents, deleteEvent, createEvent, updateEvent } from '../../store/slices/eventsSlice'
import { getImageUrl } from '../../utils/imageUtils'

const EventsList = () => {
  const dispatch = useDispatch()
  const { events, loading } = useSelector((state) => state.events)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [viewingEvent, setViewingEvent] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEvent(id)).unwrap()
      toast.success('Event deleted successfully!')
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Failed to delete event. Please try again.')
    }
  }

  // Categories extracted from Events page
  const categories = [
    { value: 'normal', label: 'Normal Event' },
    { value: 'corporate', label: 'Corporate Event' },
    { value: 'social', label: 'Social Event' },
    { value: 'cultural', label: 'Cultural Event' },
    { value: 'birthday', label: 'Birthday Event' },
    { value: 'wedding', label: 'Wedding Event' },
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'festival', label: 'Festival' }
  ]

  const getValidationSchema = (isEdit) => Yup.object({
    name: Yup.string().required('Event title is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    date: Yup.date().required('Event date is required'),
    backgroundImage: isEdit ? Yup.mixed().nullable() : Yup.mixed().required('Background image is required'),
  })

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('title', values.name)
      formData.append('description', values.description)
      formData.append('category', values.category)
      formData.append('date', values.date)
      
      if (values.backgroundImage) {
        formData.append('image', values.backgroundImage)
      }

      if (editingEvent) {
        // Update existing event
        await dispatch(updateEvent({ id: editingEvent.id, eventData: formData })).unwrap()
        toast.success('Event updated successfully!')
        setEditingEvent(null)
      } else {
        // Create new event
        await dispatch(createEvent(formData)).unwrap()
        toast.success('Event created successfully!')
        setShowModal(false)
      }
      
      resetForm()
    } catch (error) {
      console.error('Form submission failed:', error)
      toast.error(editingEvent ? 'Failed to update event. Please try again.' : 'Failed to create event. Please try again.')
      setFieldError('general', 'An error occurred while saving the event')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingEvent(null)
  }

  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    const d = new Date(dateString)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Events Management
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage events and event categories
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Event
          </button>
        </div>
      </div>


      {/* Events Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Events ({events.length})
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            A list of all events in your system
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {events.length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-500">
              No events found. Create your first event to get started.
            </li>
          ) : (
            events.map((event) => (
              <li key={event.id}>
                <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        event.type === 'upcoming' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <CalendarDaysIcon className={`h-6 w-6 ${
                          event.type === 'upcoming' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {event.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.description}
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-400">
                          {event.date ? new Date(event.date).toLocaleDateString() : 'No date set'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.type === 'upcoming' 
                            ? 'bg-green-100 text-green-800'
                            : event.type === 'corporate'
                            ? 'bg-blue-100 text-blue-800'
                            : event.type === 'cultural'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setViewingEvent(event)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        title="View"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(event.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Add/Edit Event Modal */}
      {(showModal || editingEvent) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <Formik
                initialValues={{
                  name: editingEvent?.name || '',
                  description: editingEvent?.description || '',
                  category: editingEvent?.category || '',
                  date: formatDateForInput(editingEvent?.date) || '',
                  backgroundImage: null
                }}
                validationSchema={getValidationSchema(!!editingEvent)}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-4">
                    {errors.general && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-sm text-red-600">{errors.general}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title *
                        </label>
                        <Field
                          name="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter event title"
                        />
                        {errors.name && touched.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <Field
                          as="select"
                          name="category"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </Field>
                        {errors.category && touched.category && (
                          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                        )}
                      </div>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date *
                        </label>
                        <Field
                          name="date"
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.date && touched.date && (
                          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Background Image {editingEvent ? '(Optional)' : '*'}
                        </label>
                        <Field name="backgroundImage">
                          {({ field, form }) => (
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                  const file = event.currentTarget.files[0];
                                  form.setFieldValue('backgroundImage', file);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {field.value && (
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
                              )}
                              {editingEvent && editingEvent.image && !field.value && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-600">Current image:</p>
                                  <div className="mt-1">
                                    <img
                                      src={getImageUrl(editingEvent.image)}
                                      alt="Current"
                                      className="w-32 h-20 object-cover rounded border"
                                    />
                                  </div>
                                </div>
                              )}
                              {form.errors.backgroundImage && form.touched.backgroundImage && (
                                <p className="mt-1 text-sm text-red-600">{form.errors.backgroundImage}</p>
                              )}
                            </div>
                          )}
                        </Field>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleModalClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (editingEvent ? 'Updating...' : 'Creating...') : (editingEvent ? 'Update Event' : 'Create Event')}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Event</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this event? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">View Event</h3>
                <button
                  onClick={() => setViewingEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                {editingEvent?.image || viewingEvent?.image ? (
                  <div className="w-full">
                    <img
                      src={getImageUrl((viewingEvent && viewingEvent.image) || (editingEvent && editingEvent.image))}
                      alt={viewingEvent?.name || ''}
                      className="w-full h-64 object-cover rounded"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/800x300?text=No+Image' }}
                    />
                  </div>
                ) : null}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Title</p>
                    <p className="text-gray-900 font-medium">{viewingEvent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="text-gray-900 font-medium">{viewingEvent.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-900 font-medium">{viewingEvent.date ? new Date(viewingEvent.date).toLocaleDateString() : 'No date set'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-900">{viewingEvent.description}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setViewingEvent(null)}
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

export default EventsList
