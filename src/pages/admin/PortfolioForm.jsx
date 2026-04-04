import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { createPortfolioItem, updatePortfolioItem, fetchPortfolio } from '../../store/slices/portfolioSlice'
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline'

const PortfolioForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  
  const { portfolio, loading } = useSelector((state) => state.portfolio)
  const portfolioItem = portfolio.find(p => p.id === parseInt(id))

  useEffect(() => {
    if (isEdit && !portfolioItem) {
      dispatch(fetchPortfolio())
    }
  }, [dispatch, isEdit, portfolioItem])

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    image: Yup.mixed().required('Image is required'),
    status: Yup.string().oneOf(['draft', 'published', 'archived']).required('Status is required'),
  })

  const initialValues = {
    title: portfolioItem?.title || '',
    description: portfolioItem?.description || '',
    category: portfolioItem?.category || '',
    image: portfolioItem?.image || null,
    status: portfolioItem?.status || 'draft',
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('description', values.description)
      formData.append('category', values.category)
      formData.append('status', values.status)
      
      if (values.image) {
        formData.append('image', values.image)
      }

      // Send to backend API
      const url = isEdit ? `/api/portfolio/${id}` : '/api/portfolio'
      const method = isEdit ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method: method,
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to save portfolio item')
      }

      const savedItem = await response.json()
      
      // Update Redux store
      if (isEdit) {
        await dispatch(updatePortfolioItem({ id: parseInt(id), portfolioData: savedItem })).unwrap()
      } else {
        await dispatch(createPortfolioItem(savedItem)).unwrap()
      }
      
      navigate('/admin/portfolio')
    } catch (error) {
      console.error('Form submission failed:', error)
      setFieldError('general', 'An error occurred while saving the portfolio item')
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
          <Link to="/admin/portfolio" className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {isEdit ? 'Edit Portfolio Item' : 'Create New Portfolio Item'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit ? 'Update portfolio item information' : 'Add a new project to your portfolio'}
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
          {({ values, errors, touched, isSubmitting }) => (
            <Form className="p-6 space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Project Title *
                  </label>
                  <Field
                    id="title"
                    name="title"
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Corporate Event Setup"
                  />
                  {errors.title && touched.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
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
                    <option value="corporate-events">Corporate Events</option>
                    <option value="social-events">Social Events</option>
                    <option value="wedding-decor">Wedding Decor</option>
                    <option value="birthday-decor">Birthday Decor</option>
                    <option value="office-decor">Office Decor</option>
                    <option value="vehicle-branding">Vehicle Branding</option>
                    <option value="advertising">Advertising</option>
                    <option value="other">Other</option>
                  </Field>
                  {errors.category && touched.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Project Description *
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe the project details, challenges, and results..."
                />
                {errors.description && touched.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Project Image *
                </label>
                <Field name="image">
                  {({ field, form }) => (
                    <div>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          form.setFieldValue('image', file);
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
                              src={field.value}
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

              {/* Image Preview */}
              {values.image && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Preview
                  </label>
                  <div className="border border-gray-300 rounded-md p-4">
                    <img
                      src={values.image}
                      alt="Preview"
                      className="max-w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className="hidden h-48 bg-gray-200 rounded-md items-center justify-center">
                      <div className="text-center">
                        <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Invalid image URL</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  to="/admin/portfolio"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Portfolio Item' : 'Create Portfolio Item'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default PortfolioForm
