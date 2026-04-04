import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { fetchPortfolio, deletePortfolioItem, createPortfolioItem, updatePortfolioItem } from '../../store/slices/portfolioSlice'
import { getImageUrl } from '../../utils/imageUtils'

const PortfolioList = () => {
  const dispatch = useDispatch()
  const { portfolio, loading } = useSelector((state) => state.portfolio)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [viewingItem, setViewingItem] = useState(null)

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    image: Yup.mixed().required('Image is required'),
  })

  const initialValues = {
    title: editingItem?.title || '',
    description: editingItem?.description || '',
    category: editingItem?.category || '',
    image: null,
  }

  useEffect(() => {
    dispatch(fetchPortfolio())
  }, [dispatch])

  const handleDelete = async (id) => {
    try {
      await dispatch(deletePortfolioItem(id)).unwrap()
      toast.success('Portfolio item deleted successfully!')
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Failed to delete portfolio item. Please try again.')
    }
  }

  const handleCreate = () => {
    setEditingItem(null)
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setShowModal(true)
  }

  const handleView = (item) => {
    setViewingItem(item)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  const handleViewClose = () => {
    setViewingItem(null)
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('description', values.description)
      formData.append('category', values.category)
      
      if (values.image) {
        formData.append('image', values.image)
      }

      if (editingItem) {
        console.log('Editing portfolio item:', editingItem)
        console.log('Portfolio item ID:', editingItem.id)
        await dispatch(updatePortfolioItem({ id: editingItem.id, portfolioData: formData })).unwrap()
        toast.success('Portfolio item updated successfully!')
      } else {
        await dispatch(createPortfolioItem(formData)).unwrap()
        toast.success('Portfolio item created successfully!')
      }
      
      handleModalClose()
      resetForm()
    } catch (error) {
      console.error('Form submission failed:', error)
      toast.error(editingItem ? 'Failed to update portfolio item. Please try again.' : 'Failed to create portfolio item. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredPortfolio = portfolio.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Portfolio Management
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage your portfolio showcase and project gallery
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Portfolio Item
        </button>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search portfolio items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Portfolio Items ({filteredPortfolio.length})
          </h3>
        </div>
        
        {filteredPortfolio.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No portfolio items found. Add your first project to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleView(item)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewingItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Portfolio Item Details</h3>
                <button
                  onClick={handleViewClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                  {viewingItem.image ? (
                    <img
                      src={getImageUrl(viewingItem.image)}
                      alt={viewingItem.title}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{viewingItem.title}</h4>
                  <p className="text-gray-600 mb-3">{viewingItem.description}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {viewingItem.category}
                  </span>
                </div>
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
                  {editingItem ? 'Edit Portfolio Item' : 'Create New Portfolio Item'}
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
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title *
                      </label>
                      <Field
                        id="title"
                        name="title"
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter portfolio item title"
                      />
                      {errors.title && touched.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter portfolio item description"
                      />
                      {errors.description && touched.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category *
                      </label>
                      <Field
                        id="category"
                        name="category"
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter category"
                      />
                      {errors.category && touched.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                      )}
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Image *
                      </label>
                      <Field name="image">
                        {({ field, form }) => (
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                const file = event.currentTarget.files[0]
                                form.setFieldValue('image', file)
                              }}
                              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {values.image && (
                              <div className="mt-2">
                                <img
                                  src={URL.createObjectURL(values.image)}
                                  alt="Preview"
                                  className="h-32 w-32 object-cover rounded-lg"
                                />
                              </div>
                            )}
                            {editingItem && editingItem.image && !values.image && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-2">Current image:</p>
                                <img
                                  src={getImageUrl(editingItem.image)}
                                  alt="Current"
                                  className="h-32 w-32 object-cover rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </Field>
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
                        {isSubmitting ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
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
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Portfolio Item</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this portfolio item? This action cannot be undone.
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
    </div>
  )
}

export default PortfolioList
