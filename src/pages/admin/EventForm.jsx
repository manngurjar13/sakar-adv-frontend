import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { createEvent, updateEvent, fetchEvents } from '../../store/slices/eventsSlice'
import { getImageUrl } from '../../utils/imageUtils'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { EVENT_CATEGORY_OPTIONS, normalizeEventCategory } from '../../lib/eventCategories'

const EventForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  
  const { events, loading } = useSelector((state) => state.events)
  const event = events.find((item) => item.id === id || item._id === id)

  useEffect(() => {
    if (isEdit && !event) {
      dispatch(fetchEvents())
    }
  }, [dispatch, isEdit, event])

  const validationSchema = Yup.object({
    name: Yup.string().required('Event name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    date: Yup.date().required('Event date is required'),
    backgroundImage: isEdit ? Yup.mixed().nullable() : Yup.mixed().required('Background image is required'),
  })

  const initialValues = {
    name: event?.name || '',
    description: event?.description || '',
    category: event?.category || 'corporate',
    date: event?.date || '',
    backgroundImage: event?.backgroundImage || null,
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const formData = new FormData()
      formData.append('title', values.name)
      formData.append('description', values.description)
      formData.append('category', normalizeEventCategory(values.category))
      formData.append('date', values.date)
      
      if (values.backgroundImage) {
        formData.append('image', values.backgroundImage)
      }

      if (isEdit) {
        await dispatch(updateEvent({ id, eventData: formData })).unwrap()
        toast.success('Event updated successfully!')
      } else {
        await dispatch(createEvent(formData)).unwrap()
        toast.success('Event created successfully!')
      }
      
      navigate('/admin/events')
    } catch (error) {
      console.error('Form submission failed:', error)
      toast.error(isEdit ? 'Failed to update event. Please try again.' : 'Failed to create event. Please try again.')
      setFieldError('general', 'An error occurred while saving the event')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex items-center">
          <Link to="/admin/events" className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {isEdit ? 'Edit Event' : 'Create New Event'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit ? 'Update event information' : 'Add a new event to your calendar'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="p-6 space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}


              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter event title"
                  />
                  {errors.name && touched.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Category</option>
                    {EVENT_CATEGORY_OPTIONS.map((category) => (
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter event description"
                />
                {errors.description && touched.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Date and Background Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date *
                  </label>
                  <Field
                    id="date"
                    name="date"
                    type="date"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.date && touched.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="backgroundImage" className="block text-sm font-medium text-gray-700">
                    Background Image *
                  </label>
                  <Field name="backgroundImage">
                    {({ field, form }) => (
                      <div>
                        <input
                          id="backgroundImage"
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            form.setFieldValue('backgroundImage', file);
                          }}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                        {form.errors.backgroundImage && form.touched.backgroundImage && (
                          <p className="mt-1 text-sm text-red-600">{form.errors.backgroundImage}</p>
                        )}
                      </div>
                    )}
                  </Field>
                </div>
              </div>




              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  to="/admin/events"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default EventForm
