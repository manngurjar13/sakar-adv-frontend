import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { createPortfolioItem, updatePortfolioItem, fetchPortfolio } from '../../store/slices/portfolioSlice'
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../utils/imageUtils'

const PortfolioForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  
  const { portfolio, loading } = useSelector((state) => state.portfolio)
  const portfolioItem = portfolio.find((item) => item.id === id || item._id === id)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (isEdit && !portfolioItem) {
      dispatch(fetchPortfolio())
    }
  }, [dispatch, isEdit, portfolioItem])

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    image: Yup.mixed().required('Project image is required'),
    status: Yup.string().oneOf(['draft', 'published', 'archived']).required('Status is required'),
  })

  const initialValues = {
    title: portfolioItem?.title || '',
    description: portfolioItem?.description || '',
    category: portfolioItem?.category || 'general',
    image: portfolioItem?.image || '',
    imageFile: null,
    client: portfolioItem?.client || '',
    year: portfolioItem?.year || '',
    status: portfolioItem?.status || 'published',
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('description', values.description)
      formData.append('category', values.category)
      formData.append('status', values.status)
      formData.append('client', values.client || '')
      formData.append('year', values.year || '')

      if (values.imageFile) {
        formData.append('image', values.imageFile)
      }

      if (isEdit) {
        await dispatch(updatePortfolioItem({ id, portfolioData: formData })).unwrap()
        toast.success('Portfolio item updated successfully!')
      } else {
        await dispatch(createPortfolioItem(formData)).unwrap()
        toast.success('Portfolio item created successfully!')
      }
      
      navigate('/admin/portfolio')
    } catch (error) {
      const errorMessage = error?.message || error || 'An error occurred while saving the portfolio item'
      toast.error(errorMessage)
      setFieldError('general', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = async (event, setFieldValue) => {
    const file = event.currentTarget.files?.[0]
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
      setUploadingImage(true)
      const previewUrl = URL.createObjectURL(file)
      setFieldValue('image', previewUrl)
      setFieldValue('imageFile', file)
      toast.success('Project image selected')
    } catch (error) {
      toast.error('Failed to select image')
    } finally {
      setUploadingImage(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form className="p-6 space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Project Title *
                  </label>
                  <Field
                    id="title"
                    name="title"
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    placeholder="e.g., Vehicle Branding Project"
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  >
                    <option value="">Select Category</option>
                    <option value="branding">Branding</option>
                    <option value="advertising">Advertising</option>
                    <option value="events">Events</option>
                    <option value="printing">Printing</option>
                    <option value="design">Design</option>
                    <option value="general">General</option>
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Describe the project, the work delivered, and the final result..."
                />
                {errors.description && touched.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Project Image *
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <Field
                    id="image"
                    name="image"
                    type="url"
                    className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    placeholder="https://example.com/project-image.jpg"
                  />
                  <input
                    id="portfolio-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageUpload(event, setFieldValue)}
                    className="hidden"
                  />
                  <label
                    htmlFor="portfolio-image-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload'}
                  </label>
                </div>
                {errors.image && touched.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              {values.image && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Preview
                  </label>
                  <div className="border border-gray-300 rounded-md p-4">
                    <img
                      src={getImageUrl(values.image)}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                    Client
                  </label>
                  <Field
                    id="client"
                    name="client"
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    placeholder="e.g., Client Name"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <Field
                    id="year"
                    name="year"
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    placeholder="e.g., 2026"
                  />
                </div>

                <div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <Field
                  as="select"
                  id="status"
                  name="status"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </Field>
                {errors.status && touched.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  to="/admin/portfolio"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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
