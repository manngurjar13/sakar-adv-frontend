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
  MagnifyingGlassIcon,
  StarIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { fetchTestimonials, deleteTestimonial, createTestimonial, updateTestimonial } from '../../store/slices/testimonialsSlice'

const TestimonialsList = () => {
  const dispatch = useDispatch()
  const { testimonials, loading } = useSelector((state) => state.testimonials)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [viewingTestimonial, setViewingTestimonial] = useState(null)

  const validationSchema = Yup.object({
    customerName: Yup.string().required('Customer name is required'),
    description: Yup.string().required('Testimonial text is required').min(10, 'Testimonial must be at least 10 characters'),
    rating: Yup.number().required('Rating is required').min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  })

  const initialValues = {
    customerName: editingTestimonial?.name || editingTestimonial?.customerName || '',
    description: editingTestimonial?.testimonial || editingTestimonial?.description || '',
    rating: editingTestimonial?.rating || 5,
  }

  useEffect(() => {
    dispatch(fetchTestimonials())
  }, [dispatch])

  const handleDelete = async (id) => {
    try {
      console.log('Attempting to delete testimonial with ID:', id)
      await dispatch(deleteTestimonial(id)).unwrap()
      console.log('Delete successful')
      toast.success('Testimonial deleted successfully!')
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Failed to delete testimonial. Please try again.')
    }
  }

  const handleCreate = () => {
    setEditingTestimonial(null)
    setShowModal(true)
  }

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial)
    setShowModal(true)
  }

  const handleView = (testimonial) => {
    setViewingTestimonial(testimonial)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingTestimonial(null)
  }

  const handleViewClose = () => {
    setViewingTestimonial(null)
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      if (editingTestimonial) {
        console.log('Editing testimonial:', editingTestimonial)
        console.log('Testimonial ID:', editingTestimonial.id)
        await dispatch(updateTestimonial({ id: editingTestimonial.id, testimonialData: values })).unwrap()
        toast.success('Testimonial updated successfully!')
      } else {
        await dispatch(createTestimonial(values)).unwrap()
        toast.success('Testimonial created successfully!')
      }
      handleModalClose()
    } catch (error) {
      console.error('Form submission failed:', error)
      toast.error(editingTestimonial ? 'Failed to update testimonial. Please try again.' : 'Failed to create testimonial. Please try again.')
      setFieldError('general', 'An error occurred while saving the testimonial')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredTestimonials = testimonials.filter((testimonial) =>
    (testimonial.name || testimonial.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (testimonial.testimonial || testimonial.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ))
  }

  const renderStarInput = (rating, onRatingChange) => {
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Testimonials Management
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage customer testimonials and reviews
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Testimonial
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Testimonials List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Testimonials ({filteredTestimonials.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTestimonials.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No testimonials found. Add your first testimonial to get started.
            </div>
          ) : (
            filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {(testimonial.name || testimonial.customerName).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-medium text-gray-900">
                        {testimonial.name || testimonial.customerName}
                      </div>
                      <div className="flex items-center mt-2">
                        {renderStars(testimonial.rating)}
                        <span className="ml-2 text-sm text-gray-500">
                          ({testimonial.rating}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-6">
                    <div className="flex-1 max-w-md">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        "{testimonial.testimonial || testimonial.description}"
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(testimonial)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          console.log('Delete button clicked for testimonial:', testimonial)
                          console.log('Testimonial ID:', testimonial.id)
                          setDeleteConfirm(testimonial.id)
                        }}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewingTestimonial && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Testimonial Details</h3>
                <button
                  onClick={handleViewClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-600">
                      {(viewingTestimonial.name || viewingTestimonial.customerName).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{viewingTestimonial.name || viewingTestimonial.customerName}</h4>
                    <div className="flex items-center mt-1">
                      {renderStars(viewingTestimonial.rating)}
                      <span className="ml-2 text-sm text-gray-500">
                        ({viewingTestimonial.rating}/5)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 italic">
                    "{viewingTestimonial.testimonial || viewingTestimonial.description}"
                  </p>
                </div>
              </div>
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
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Testimonial</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this testimonial? This action cannot be undone.
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
                </h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                  <Form className="space-y-6">
                    {errors.general && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-sm text-red-600">{errors.general}</p>
                      </div>
                    )}

                    {/* Customer Information */}
                    <div>
                      <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                        Customer Name *
                      </label>
                      <Field
                        id="customerName"
                        name="customerName"
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., John Doe"
                      />
                      {errors.customerName && touched.customerName && (
                        <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
                      )}
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating *
                      </label>
                      <div className="flex items-center space-x-1">
                        {renderStarInput(values.rating, (rating) => setFieldValue('rating', rating))}
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
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Testimonial Text *
                      </label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={4}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter the customer testimonial..."
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        {values.description.length} characters (minimum 10)
                      </p>
                      {errors.description && touched.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
                      <div className="bg-white rounded-md p-4 border">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium text-gray-900">{values.customerName || 'Customer Name'}</div>
                          </div>
                          <div className="flex items-center">
                            {renderStars(values.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 italic">
                          "{values.description || 'Testimonial text will appear here...'}"
                        </p>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleModalClose}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Saving...' : editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestimonialsList
