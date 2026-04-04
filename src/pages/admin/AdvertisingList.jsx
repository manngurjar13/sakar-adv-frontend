import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { fetchAdvertising, deleteAdvertising, createAdvertising, updateAdvertising } from '../../store/slices/advertisingSlice'

const AdvertisingList = () => {
  const dispatch = useDispatch()
  const { advertising, loading } = useSelector((state) => state.advertising)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingAdvertising, setEditingAdvertising] = useState(null)

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
    name: editingAdvertising?.name || '',
    description: editingAdvertising?.description || '',
    category: editingAdvertising?.category || '',
    price: editingAdvertising?.price || '',
    status: editingAdvertising?.status || 'draft',
    image: editingAdvertising?.image || '',
    features: editingAdvertising?.features || [''],
  }

  useEffect(() => {
    dispatch(fetchAdvertising())
  }, [dispatch])

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAdvertising(id)).unwrap()
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleCreate = () => {
    setEditingAdvertising(null)
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditingAdvertising(item)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingAdvertising(null)
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      if (editingAdvertising) {
        await dispatch(updateAdvertising({ id: editingAdvertising.id, advertisingData: values })).unwrap()
      } else {
        await dispatch(createAdvertising(values)).unwrap()
      }
      handleModalClose()
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

  const filteredAdvertising = advertising.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            Advertising Management
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage your advertising campaigns and solutions
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Advertising
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
            placeholder="Search advertising campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Advertising List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Advertising Campaigns ({filteredAdvertising.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredAdvertising.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No advertising campaigns found. Create your first campaign to get started.
            </div>
          ) : (
            filteredAdvertising.map((item) => (
              <div key={item.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <ChartBarIcon className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </div>
                      <div className="flex items-center mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ₹{item.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.status}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/advertising/${item.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Advertising Campaign</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this advertising campaign? This action cannot be undone.
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
                  {editingAdvertising ? 'Edit Advertising Campaign' : 'Create New Advertising Campaign'}
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

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      {errors.description && touched.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {isSubmitting ? 'Saving...' : editingAdvertising ? 'Update Campaign' : 'Create Campaign'}
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

export default AdvertisingList
