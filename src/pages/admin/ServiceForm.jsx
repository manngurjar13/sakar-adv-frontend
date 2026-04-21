import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { createService, updateService, fetchServices } from '../../store/slices/servicesSlice'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ServiceForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  
  const servicesState = useSelector((state) => state.services)
  const services = servicesState?.services || []
  const loading = servicesState?.loading || false
  
  const service = isEdit ? services.find(s => s._id === id || s.id === parseInt(id)) : null
  const [uploadingImage, setUploadingImage] = useState(null)

  useEffect(() => {
    if (isEdit && !service) {
      dispatch(fetchServices())
    }
  }, [dispatch, isEdit, service])

  const validationSchema = Yup.object({
    category: Yup.string()
      .required('Category is required'),
    service_name: Yup.object({
      str1: Yup.string().required('First part of service name is required'),
      str2: Yup.string().required('Second part of service name is required'),
    }),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    image: Yup.string()
      .required('Service image is required'),
    feature_heading: Yup.object({
      str1: Yup.string().required('First part of feature heading is required'),
      str2: Yup.string().required('Second part of feature heading is required'),
    }),
    feature_description: Yup.string()
      .required('Feature description is required')
      .min(5, 'Feature description must be at least 5 characters'),
    feature: Yup.array()
      .of(Yup.object({
        title: Yup.string().required('Feature title is required'),
        description: Yup.string().required('Feature description is required'),
        image: Yup.string(),
      }))
      .min(1, 'At least one feature is required'),
  })

  const initialValues = {
    category: service?.category || '',
    service_name: {
      str1: service?.service_name?.str1 || '',
      str2: service?.service_name?.str2 || ''
    },
    description: service?.description || '',
    image: service?.image || '',
    imageFile: null,
    feature_heading: {
      str1: service?.feature_heading?.str1 || '',
      str2: service?.feature_heading?.str2 || ''
    },
    feature_description: service?.feature_description || '',
    feature: (service?.feature && Array.isArray(service.feature) && service.feature.length > 0)
      ? service.feature.map(f => ({
        title: f.title || '',
        description: f.description || '',
        image: f.image || '',
        imageFile: null
      }))
      : [{ title: '', description: '', image: '', imageFile: null }],
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // Build the service data
      const serviceData = {
        category: values.category,
        service_name: {
          str1: values.service_name?.str1 || '',
          str2: values.service_name?.str2 || ''
        },
        description: values.description,
        feature_heading: {
          str1: values.feature_heading?.str1 || '',
          str2: values.feature_heading?.str2 || ''
        },
        feature_description: values.feature_description,
        feature: (values.feature && Array.isArray(values.feature))
          ? values.feature.map(f => ({
            title: f.title || '',
            description: f.description || '',
            image: f.image || null,
            imageFile: f.imageFile || null
          }))
          : [],
        imageFile: values.imageFile || null
      }

      if (isEdit && service?._id) {
        await dispatch(updateService({ id: service._id, serviceData })).unwrap()
        toast.success('Service updated successfully!')
      } else {
        await dispatch(createService(serviceData)).unwrap()
        toast.success('Service created successfully!')
      }
      navigate('/admin/services')
    } catch (error) {
      console.error('Form submission failed:', error)
      const errorMessage = error?.message || error || 'An error occurred while saving the service'
      toast.error(errorMessage)
      setFieldError('general', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = async (e, fieldName, index = null, setFieldValue, values) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file size (5MB max, matching backend)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed')
      return
    }

    try {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file)

      if (fieldName === 'image') {
        // Store both the file and preview URL
        setFieldValue('image', previewUrl)
        setFieldValue('imageFile', file)
        toast.success('Main image selected')
      } else if (fieldName.startsWith('feature-')) {
        // Extract feature index
        const featureIndex = parseInt(fieldName.split('-')[1])
        if (values && values.feature) {
          const updatedFeatures = [...values.feature]
          updatedFeatures[featureIndex] = {
            ...updatedFeatures[featureIndex],
            image: previewUrl,
            imageFile: file
          }
          setFieldValue('feature', updatedFeatures)
          toast.success(`Feature ${featureIndex + 1} image selected`)
        }
      }
    } catch (error) {
      console.error('Image selection error:', error)
      toast.error('Failed to select image')
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
          <Link
            to="/admin/services"
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {isEdit ? 'Edit Service' : 'Create New Service'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit ? 'Update service information' : 'Add a new service to your offerings'}
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
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                  >
                    <option value="">Select Category</option>
                    <option value="vehicle branding">Vehicle Branding</option>
                    <option value="auto rickshaw">Auto Rickshaw</option>
                    <option value="e-rickshaw">E-Rickshaw</option>
                    <option value="bus advertising">Bus Advertising</option>
                    <option value="mobile van">Mobile Van</option>
                    <option value="wall painting">Wall Painting</option>
                  </Field>
                  {errors.category && touched.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Service Name - Part 1 */}
                <div>
                  <label htmlFor="service_name_str1" className="block text-sm font-medium text-gray-700">
                    Service Name - Part 1 *
                  </label>
                  <Field
                    id="service_name_str1"
                    name="service_name.str1"
                    type="text"
                    placeholder="e.g., Vehicle"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                  />
                  {errors.service_name?.str1 && touched.service_name?.str1 && (
                    <p className="mt-1 text-sm text-red-600">{errors.service_name.str1}</p>
                  )}
                </div>
              </div>

              {/* Service Name - Part 2 */}
              <div>
                <label htmlFor="service_name_str2" className="block text-sm font-medium text-gray-700">
                  Service Name - Part 2 *
                </label>
                <Field
                  id="service_name_str2"
                  name="service_name.str2"
                  type="text"
                  placeholder="e.g., Branding"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                />
                {errors.service_name?.str2 && touched.service_name?.str2 && (
                  <p className="mt-1 text-sm text-red-600">{errors.service_name.str2}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Detailed service description"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                />
                {errors.description && touched.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Service Image */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Service Image *
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <Field
                    id="image"
                    name="image"
                    type="url"
                    placeholder="https://example.com/image.jpg (from ImageKit)"
                    className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image', null, setFieldValue, values)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    {uploadingImage === 'image' ? 'Uploading...' : 'Upload'}
                  </label>
                </div>
                {values.image && (
                  <div className="mt-2">
                    <img src={values.image} alt="Preview" className="h-32 w-32 object-cover rounded" />
                  </div>
                )}
                {errors.image && touched.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              {/* Feature Heading */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Section</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="feature_heading_str1" className="block text-sm font-medium text-gray-700">
                      Feature Heading - Part 1 *
                    </label>
                    <Field
                      id="feature_heading_str1"
                      name="feature_heading.str1"
                      type="text"
                      placeholder="e.g., Vehicle"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    />
                    {errors.feature_heading?.str1 && touched.feature_heading?.str1 && (
                      <p className="mt-1 text-sm text-red-600">{errors.feature_heading.str1}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="feature_heading_str2" className="block text-sm font-medium text-gray-700">
                      Feature Heading - Part 2 *
                    </label>
                    <Field
                      id="feature_heading_str2"
                      name="feature_heading.str2"
                      type="text"
                      placeholder="e.g., Branding"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    />
                    {errors.feature_heading?.str2 && touched.feature_heading?.str2 && (
                      <p className="mt-1 text-sm text-red-600">{errors.feature_heading.str2}</p>
                    )}
                  </div>
                </div>

                {/* Feature Description */}
                <div>
                  <label htmlFor="feature_description" className="block text-sm font-medium text-gray-700">
                    Feature Description *
                  </label>
                  <Field
                    id="feature_description"
                    name="feature_description"
                    type="text"
                    placeholder="Brief description of features"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                  />
                  {errors.feature_description && touched.feature_description && typeof errors.feature_description === 'string' && (
                    <p className="mt-1 text-sm text-red-600">{errors.feature_description}</p>
                  )}
                </div>
              </div>

              {/* Features Array */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Features Details *</h3>
                  <button
                    type="button"
                    onClick={() => addFeature(values, setFieldValue)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    + Add Feature
                  </button>
                </div>

                {values.feature.map((feat, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">Feature {index + 1}</h4>
                      {values.feature.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index, values, setFieldValue)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Feature Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Feature Title *
                        </label>
                        <Field
                          name={`feature.${index}.title`}
                          type="text"
                          placeholder="e.g., Clear Image"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        />
                        {errors.feature?.[index]?.title && touched.feature?.[index]?.title && typeof errors.feature[index].title === 'string' && (
                          <p className="mt-1 text-sm text-red-600">{errors.feature[index].title}</p>
                        )}
                      </div>

                      {/* Feature Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Feature Description *
                        </label>
                        <Field
                          name={`feature.${index}.description`}
                          type="text"
                          placeholder="e.g., hello description"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        />
                        {errors.feature?.[index]?.description && touched.feature?.[index]?.description && typeof errors.feature[index].description === 'string' && (
                          <p className="mt-1 text-sm text-red-600">{errors.feature[index].description}</p>
                        )}
                      </div>

                      {/* Feature Image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Feature Image
                        </label>
                        <div className="mt-1 flex items-center space-x-4">
                          <Field
                            name={`feature.${index}.image`}
                            type="url"
                            placeholder="https://example.com/image.jpg (from ImageKit)"
                            className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, `feature-${index}`, index, setFieldValue, values)}
                            className="hidden"
                            id={`feature-image-upload-${index}`}
                          />
                          <label
                            htmlFor={`feature-image-upload-${index}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                          >
                            {uploadingImage === `feature-${index}` ? 'Uploading...' : 'Upload'}
                          </label>
                        </div>
                        {values.feature[index]?.image && (
                          <div className="mt-2">
                            <img src={values.feature[index].image} alt="Preview" className="h-20 w-20 object-cover rounded" />
                          </div>
                        )}
                        {errors.feature?.[index]?.image && touched.feature?.[index]?.image && typeof errors.feature[index].image === 'string' && (
                          <p className="mt-1 text-sm text-red-600">{errors.feature[index].image}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {errors.feature && touched.feature && typeof errors.feature === 'string' && (
                  <p className="mt-2 text-sm text-red-600">{errors.feature}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  to="/admin/services"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default ServiceForm
