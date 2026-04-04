import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { createAdvertising, updateAdvertising, fetchAdvertising } from '../../store/slices/advertisingSlice'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const AdvertisingForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  
  const { advertising, loading } = useSelector((state) => state.advertising)
  const advertisingItem = advertising.find(a => a.id === parseInt(id))

  useEffect(() => {
    if (isEdit && !advertisingItem) {
      dispatch(fetchAdvertising())
    }
  }, [dispatch, isEdit, advertisingItem])

  const validationSchema = Yup.object({
    name: Yup.string().required('Campaign name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
    status: Yup.string().oneOf(['draft', 'active', 'inactive', 'completed']).required('Status is required'),
    image: Yup.string().url('Must be a valid URL'),
    features: Yup.array().of(Yup.string()).min(1, 'At least one feature is required'),
  })

  const initialValues = {
    name: advertisingItem?.name || '',
    description: advertisingItem?.description || '',
    category: advertisingItem?.category || '',
    price: advertisingItem?.price || '',
    status: advertisingItem?.status || 'draft',
    image: advertisingItem?.image || '',
    features: advertisingItem?.features || [''],
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      if (isEdit) {
        await dispatch(updateAdvertising({ id: parseInt(id), advertisingData: values })).unwrap()
      } else {
        await dispatch(createAdvertising(values)).unwrap()
      }
      navigate('/admin/advertising')
    } catch (error) {
      console.error('Form submission failed:', error)
      setFieldError('general', 'An error occurred while saving the advertising campaign')
    } finally {
      setSubmitting(false)
    }
  }

  const addFeature = (values, setFieldValue) => {
    const newFeatures = [...values.features, '']
    setFieldValue('features', newFeatures)
  }

  const removeFeature = (index, values, setFieldValue) => {
    if (values.features.length > 1) {
      const newFeatures = values.features.filter((_, i) => i !== index)
      setFieldValue('features', newFeatures)
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
          <Link to="/admin/advertising" className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {isEdit ? 'Edit Advertising Campaign' : 'Create New Advertising Campaign'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit ? 'Update advertising campaign information' : 'Add a new advertising campaign'}
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

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Campaign Name *
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
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (₹) *
                  </label>
                  <Field
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.price && touched.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
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
                />
                {errors.description && touched.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <option value="outdoor-hoardings">Outdoor Hoardings</option>
                    <option value="billboard-advertising">Billboard Advertising</option>
                    <option value="festival-banners">Festival Banners</option>
                    <option value="field-activation">Field Activation</option>
                    <option value="btl-campaigns">BTL Campaigns</option>
                    <option value="digital-advertising">Digital Advertising</option>
                    <option value="print-advertising">Print Advertising</option>
                  </Field>
                  {errors.category && touched.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="completed">Completed</option>
                  </Field>
                  {errors.status && touched.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Features *
                </label>
                {values.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Field
                      name={`features.${index}`}
                      type="text"
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter feature"
                    />
                    {values.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index, values, setFieldValue)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFeature(values, setFieldValue)}
                  className="text-blue-600 hover:text-blue-900 text-sm"
                >
                  + Add Feature
                </button>
                {errors.features && touched.features && (
                  <p className="mt-1 text-sm text-red-600">{errors.features}</p>
                )}
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Campaign Image URL
                </label>
                <Field
                  id="image"
                  name="image"
                  type="url"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://example.com/campaign-image.jpg"
                />
                {errors.image && touched.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  to="/admin/advertising"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Campaign' : 'Create Campaign'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AdvertisingForm
