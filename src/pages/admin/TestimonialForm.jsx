import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { createTestimonial, updateTestimonial, fetchTestimonials } from '../../store/slices/testimonialsSlice'
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline'

const TestimonialForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  
  const { testimonials, loading } = useSelector((state) => state.testimonials)
  const testimonial = testimonials.find(t => t.id === parseInt(id))

  useEffect(() => {
    if (isEdit && !testimonial) {
      dispatch(fetchTestimonials())
    }
  }, [dispatch, isEdit, testimonial])

  const validationSchema = Yup.object({
    name: Yup.string().required('Customer name is required'),
    company: Yup.string().required('Company name is required'),
    testimonial: Yup.string().required('Testimonial text is required').min(10, 'Testimonial must be at least 10 characters'),
    rating: Yup.number().required('Rating is required').min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    status: Yup.string().oneOf(['draft', 'published', 'archived']).required('Status is required'),
  })

  const initialValues = {
    name: testimonial?.name || '',
    company: testimonial?.company || '',
    testimonial: testimonial?.testimonial || '',
    rating: testimonial?.rating || 5,
    status: testimonial?.status || 'draft',
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      if (isEdit) {
        await dispatch(updateTestimonial({ id: parseInt(id), testimonialData: values })).unwrap()
      } else {
        await dispatch(createTestimonial(values)).unwrap()
      }
      navigate('/admin/testimonials')
    } catch (error) {
      console.error('Form submission failed:', error)
      setFieldError('general', 'An error occurred while saving the testimonial')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating, onRatingChange) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onRatingChange(i + 1)}
        className={`h-6 w-6 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        } hover:text-yellow-400 transition-colors`}
      >
        <StarIcon fill={i < rating ? 'currentColor' : 'none'} />
      </button>
    ))
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
          <Link to="/admin/testimonials" className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {isEdit ? 'Edit Testimonial' : 'Create New Testimonial'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit ? 'Update testimonial information' : 'Add a new customer testimonial'}
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
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form className="p-6 space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Customer Name *
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., John Doe"
                  />
                  {errors.name && touched.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company *
                  </label>
                  <Field
                    id="company"
                    name="company"
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., ABC Corporation"
                  />
                  {errors.company && touched.company && (
                    <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars(values.rating, (rating) => setFieldValue('rating', rating))}
                  <span className="ml-2 text-sm text-gray-500">
                    ({values.rating}/5)
                  </span>
                </div>
                {errors.rating && touched.rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                )}
              </div>

              {/* Testimonial Text */}
              <div>
                <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700">
                  Testimonial Text *
                </label>
                <Field
                  as="textarea"
                  id="testimonial"
                  name="testimonial"
                  rows={6}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter the customer testimonial..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  {values.testimonial.length} characters (minimum 10)
                </p>
                {errors.testimonial && touched.testimonial && (
                  <p className="mt-1 text-sm text-red-600">{errors.testimonial}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <Field
                  as="select"
                  id="status"
                  name="status"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </Field>
                {errors.status && touched.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
                <div className="bg-white rounded-md p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{values.name || 'Customer Name'}</div>
                      <div className="text-sm text-gray-500">{values.company || 'Company Name'}</div>
                    </div>
                    <div className="flex items-center">
                      {renderStars(values.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 italic">
                    "{values.testimonial || 'Testimonial text will appear here...'}"
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  to="/admin/testimonials"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Testimonial' : 'Create Testimonial'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default TestimonialForm
