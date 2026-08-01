import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { createProduct, updateProduct, fetchProducts } from '../../store/slices/productsSlice'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ProductForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  
  const { products, loading } = useSelector((state) => state.products)
  const product = products.find((item) => item.id === id || item._id === id)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (isEdit && !product) {
      dispatch(fetchProducts())
    }
  }, [dispatch, isEdit, product])

  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
    category: Yup.string().required('Category is required'),
    status: Yup.string().oneOf(['active', 'inactive', 'draft']).required('Status is required'),
    image: Yup.string().required('Product image is required'),
    features: Yup.array().of(Yup.string()).min(1, 'At least one feature is required'),
  })

  const initialValues = {
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    status: product?.status || 'active',
    image: product?.image || '',
    imageFile: null,
    features: product?.features || [''],
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const productData = {
        name: values.name,
        description: values.description,
        price: values.price,
        category: values.category,
        status: values.status,
        image: values.image || null,
        imageFile: values.imageFile || null,
        features: values.features || [],
      }

      if (isEdit) {
        await dispatch(updateProduct({ id, productData })).unwrap()
        toast.success('Product updated successfully!')
      } else {
        await dispatch(createProduct(productData)).unwrap()
        toast.success('Product created successfully!')
      }
      navigate('/admin/products')
    } catch (error) {
      const errorMessage = error?.message || error || 'An error occurred while saving the product'
      toast.error(errorMessage)
      setFieldError('general', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = async (e, setFieldValue) => {
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
      setUploadingImage(true)
      const previewUrl = URL.createObjectURL(file)
      setFieldValue('image', previewUrl)
      setFieldValue('imageFile', file)
      toast.success('Product image selected')
    } catch (error) {
      toast.error('Failed to select image')
    } finally {
      setUploadingImage(false)
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex items-center">
          <Link to="/admin/products" className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {isEdit ? 'Edit Product' : 'Create New Product'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit ? 'Update product information' : 'Add a new product to your catalog'}
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
                    Product Name *
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                  >
                    <option value="">Select Category</option>
                    <option value="no parking boards">No Parking Boards</option>
                    <option value="roll up banners">Roll-Up Banners</option>
                    <option value="promo tables">Promo Tables</option>
                    <option value="led signage">LED Signage</option>
                    <option value="flex printing">Flex Printing</option>
                    <option value="glow signs">Glow Signs</option>
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Field>
                  {errors.status && touched.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features *
                </label>
                {values.features.map((_, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Field
                      name={`features.${index}`}
                      type="text"
                      className="flex-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
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
                  className="text-green-600 hover:text-green-900 text-sm"
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
                  Product Image *
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <Field
                    id="image"
                    name="image"
                    type="url"
                    className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                    placeholder="https://example.com/image.jpg"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setFieldValue)}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 cursor-pointer"
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload'}
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

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  to="/admin/products"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default ProductForm
