import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { createAdvertising, updateAdvertising, fetchAdvertising } from '../../store/slices/advertisingSlice'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const AdvertisingForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const advertisingState = useSelector((state) => state.advertising)
  const advertising = advertisingState?.advertising || []
  const loading = advertisingState?.loading || false

  const advertisingItem = isEdit ? advertising.find((item) => item._id === id || item.id === id) : null
  const [uploadingImage, setUploadingImage] = useState(null)

  useEffect(() => {
    if (isEdit && !advertisingItem) {
      dispatch(fetchAdvertising())
    }
  }, [dispatch, isEdit, advertisingItem])

  const validationSchema = Yup.object({
    category: Yup.string().required('Category is required'),
    advertising_name: Yup.object({
      str1: Yup.string().required('First part of advertising name is required'),
      str2: Yup.string().required('Second part of advertising name is required'),
    }),
    description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    image: Yup.string().required('Advertising image is required'),
    feature_heading: Yup.object({
      str1: Yup.string().required('First part of feature heading is required'),
      str2: Yup.string().required('Second part of feature heading is required'),
    }),
    feature_description: Yup.string().required('Feature description is required').min(5, 'Feature description must be at least 5 characters'),
    feature: Yup.array()
      .of(
        Yup.object({
          title: Yup.string().required('Feature title is required'),
          description: Yup.string().required('Feature description is required'),
          image: Yup.string(),
        })
      )
      .min(1, 'At least one feature is required'),
  })

  const initialValues = {
    category: advertisingItem?.category || '',
    advertising_name: {
      str1: advertisingItem?.advertising_name?.str1 || '',
      str2: advertisingItem?.advertising_name?.str2 || '',
    },
    description: advertisingItem?.description || '',
    image: advertisingItem?.image || '',
    imageFile: null,
    feature_heading: {
      str1: advertisingItem?.feature_heading?.str1 || '',
      str2: advertisingItem?.feature_heading?.str2 || '',
    },
    feature_description: advertisingItem?.feature_description || '',
    feature:
      Array.isArray(advertisingItem?.feature) && advertisingItem.feature.length > 0
        ? advertisingItem.feature.map((item) => ({
            id: item.id || '',
            title: item.title || '',
            description: item.description || '',
            image: item.image || '',
            imageFile: null,
          }))
        : [{ title: '', description: '', image: '', imageFile: null }],
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const advertisingData = {
        category: values.category,
        advertising_name: {
          str1: values.advertising_name?.str1 || '',
          str2: values.advertising_name?.str2 || '',
        },
        description: values.description,
        feature_heading: {
          str1: values.feature_heading?.str1 || '',
          str2: values.feature_heading?.str2 || '',
        },
        feature_description: values.feature_description,
        feature: Array.isArray(values.feature)
          ? values.feature.map((item) => ({
              id: item.id || undefined,
              title: item.title || '',
              description: item.description || '',
              image: item.image || null,
              imageFile: item.imageFile || null,
            }))
          : [],
        imageFile: values.imageFile || null,
        image: values.image || null,
      }

      if (isEdit && advertisingItem?._id) {
        await dispatch(updateAdvertising({ id: advertisingItem._id, advertisingData })).unwrap()
        toast.success('Advertising updated successfully!')
      } else {
        await dispatch(createAdvertising(advertisingData)).unwrap()
        toast.success('Advertising created successfully!')
      }

      navigate('/admin/advertising')
    } catch (error) {
      const errorMessage = error?.message || error || 'An error occurred while saving the advertising item'
      toast.error(errorMessage)
      setFieldError('general', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = async (e, fieldName, setFieldValue, values) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed')
      return
    }

    try {
      setUploadingImage(fieldName)
      const previewUrl = URL.createObjectURL(file)

      if (fieldName === 'image') {
        setFieldValue('image', previewUrl)
        setFieldValue('imageFile', file)
        toast.success('Main image selected')
      } else if (fieldName.startsWith('feature-')) {
        const featureIndex = parseInt(fieldName.split('-')[1], 10)
        const updatedFeatures = [...values.feature]
        updatedFeatures[featureIndex] = {
          ...updatedFeatures[featureIndex],
          image: previewUrl,
          imageFile: file,
        }
        setFieldValue('feature', updatedFeatures)
        toast.success(`Feature ${featureIndex + 1} image selected`)
      }
    } catch (error) {
      toast.error('Failed to select image')
    } finally {
      setUploadingImage(null)
    }
  }

  const addFeature = (values, setFieldValue) => {
    setFieldValue('feature', [
      ...(Array.isArray(values.feature) ? values.feature : []),
      { title: '', description: '', image: '', imageFile: null },
    ])
  }

  const removeFeature = (index, values, setFieldValue) => {
    const currentFeatures = Array.isArray(values.feature) ? values.feature : []

    if (currentFeatures.length <= 1) {
      toast.error('At least one feature is required')
      return
    }

    setFieldValue(
      'feature',
      currentFeatures.filter((_, featureIndex) => featureIndex !== index)
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex items-center">
          <Link to="/admin/advertising" className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {isEdit ? 'Edit Advertising' : 'Create New Advertising'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit ? 'Update advertising information' : 'Add a new advertising offering to your catalog'}
            </p>
          </div>
        </div>
      </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
                  >
                    <option value="">Select Category</option>
                    <option value="outdoor hoardings">Outdoor Hoardings</option>
                    <option value="billboard advertising">Billboard Advertising</option>
                    <option value="festival banners">Festival Banners</option>
                    <option value="field activation">Field Activation</option>
                    <option value="btl campaigns">BTL Campaigns</option>
                    <option value="digital advertising">Digital Advertising</option>
                    <option value="print advertising">Print Advertising</option>
                  </Field>
                  {errors.category && touched.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="advertising_name_str1" className="block text-sm font-medium text-gray-700">
                    Advertising Name - Part 1 *
                  </label>
                  <Field
                    id="advertising_name_str1"
                    name="advertising_name.str1"
                    type="text"
                    placeholder="e.g., Outdoor"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
                  />
                  {errors.advertising_name?.str1 && touched.advertising_name?.str1 && (
                    <p className="mt-1 text-sm text-red-600">{errors.advertising_name.str1}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="advertising_name_str2" className="block text-sm font-medium text-gray-700">
                  Advertising Name - Part 2 *
                </label>
                <Field
                  id="advertising_name_str2"
                  name="advertising_name.str2"
                  type="text"
                  placeholder="e.g., Hoardings"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
                />
                {errors.advertising_name?.str2 && touched.advertising_name?.str2 && (
                  <p className="mt-1 text-sm text-red-600">{errors.advertising_name.str2}</p>
                )}
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
                  placeholder="Detailed advertising description"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
                />
                {errors.description && touched.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Advertising Image *
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <Field
                    id="image"
                    name="image"
                    type="url"
                    placeholder="https://example.com/advertising-image.jpg"
                    className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'image', setFieldValue, values)}
                    className="hidden"
                    id="advertising-image-upload"
                  />
                  <label
                    htmlFor="advertising-image-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 cursor-pointer"
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
                      placeholder="e.g., Why Choose"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
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
                      placeholder="e.g., Our Hoardings"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
                    />
                    {errors.feature_heading?.str2 && touched.feature_heading?.str2 && (
                      <p className="mt-1 text-sm text-red-600">{errors.feature_heading.str2}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="feature_description" className="block text-sm font-medium text-gray-700">
                    Feature Description *
                  </label>
                  <Field
                    id="feature_description"
                    name="feature_description"
                    type="text"
                    placeholder="Brief description of features"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
                  />
                  {errors.feature_description &&
                    touched.feature_description &&
                    typeof errors.feature_description === 'string' && (
                      <p className="mt-1 text-sm text-red-600">{errors.feature_description}</p>
                    )}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Features Details *</h3>
                  <button
                    type="button"
                    onClick={() => addFeature(values, setFieldValue)}
                    className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                  >
                    + Add Feature
                  </button>
                </div>

                {values.feature.map((_, index) => (
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Feature Title *</label>
                        <Field
                          name={`feature.${index}.title`}
                          type="text"
                          placeholder="e.g., High Visibility"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
                        />
                        {errors.feature?.[index]?.title &&
                          touched.feature?.[index]?.title &&
                          typeof errors.feature[index].title === 'string' && (
                            <p className="mt-1 text-sm text-red-600">{errors.feature[index].title}</p>
                          )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Feature Description *</label>
                        <Field
                          name={`feature.${index}.description`}
                          type="text"
                          placeholder="e.g., Premium placements for maximum reach"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
                        />
                        {errors.feature?.[index]?.description &&
                          touched.feature?.[index]?.description &&
                          typeof errors.feature[index].description === 'string' && (
                            <p className="mt-1 text-sm text-red-600">{errors.feature[index].description}</p>
                          )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Feature Image</label>
                        <div className="mt-1 flex items-center space-x-4">
                          <Field
                            name={`feature.${index}.image`}
                            type="url"
                            placeholder="https://example.com/feature-image.jpg"
                            className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, `feature-${index}`, setFieldValue, values)}
                            className="hidden"
                            id={`advertising-feature-image-upload-${index}`}
                          />
                          <label
                            htmlFor={`advertising-feature-image-upload-${index}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 cursor-pointer"
                          >
                            {uploadingImage === `feature-${index}` ? 'Uploading...' : 'Upload'}
                          </label>
                        </div>
                        {values.feature[index]?.image && (
                          <div className="mt-2">
                            <img src={values.feature[index].image} alt="Preview" className="h-20 w-20 object-cover rounded" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {errors.feature && touched.feature && typeof errors.feature === 'string' && (
                  <p className="mt-2 text-sm text-red-600">{errors.feature}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  to="/admin/advertising"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Advertising' : 'Create Advertising'}
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
