import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../../store/slices/categoriesSlice'
import {
  CATEGORY_ENTITY_TYPES,
  DEFAULT_EVENT_COLOR,
  EVENT_COLOR_OPTIONS,
  getEntityTypeLabel,
  selectByType,
  slugifyCategory,
} from '../../lib/categories'

const CategoriesList = () => {
  const dispatch = useDispatch()
  const { categories, loading } = useSelector((state) => state.categories)
  const [typeFilter, setTypeFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const filteredCategories = useMemo(() => {
    if (typeFilter === 'all') {
      return CATEGORY_ENTITY_TYPES.flatMap((type) => selectByType(categories, type.value))
    }
    return selectByType(categories, typeFilter)
  }, [categories, typeFilter])

  const validationSchema = Yup.object({
    entity_type: Yup.string().required('Type is required'),
    name: Yup.string().required('Category name is required'),
    color_class: Yup.string().when('entity_type', {
      is: 'event',
      then: (schema) => schema.required('Color is required for event categories'),
      otherwise: (schema) => schema.nullable(),
    }),
  })

  const handleModalClose = () => {
    setShowModal(false)
    setEditingCategory(null)
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setShowModal(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const categoryData = {
        entity_type: values.entity_type,
        name: values.name.trim(),
        slug: editingCategory?.slug || slugifyCategory(values.name, values.entity_type),
        color_class: values.entity_type === 'event' ? values.color_class : null,
        sort_order: Number(values.sort_order || 0),
        is_active: values.is_active,
      }

      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.id, categoryData })).unwrap()
        toast.success('Category updated successfully!')
      } else {
        await dispatch(createCategory(categoryData)).unwrap()
        toast.success('Category created successfully!')
      }
      handleModalClose()
    } catch (error) {
      const message = error?.message || error || 'Failed to save category'
      toast.error(message)
      setFieldError('general', message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCategory(id)).unwrap()
      toast.success('Category deleted successfully!')
      setDeleteConfirm(null)
    } catch (error) {
      toast.error(error?.message || error || 'Failed to delete category')
    }
  }

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create categories for products, services, advertising, and events. Forms and public pages use these names.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            typeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          All
        </button>
        {CATEGORY_ENTITY_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setTypeFilter(type.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              typeFilter === type.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No categories yet. Create one to use it in admin forms.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {getEntityTypeLabel(category.entity_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {category.entity_type === 'event' && (
                          <span className={`inline-block h-4 w-4 rounded bg-gradient-to-r ${category.color_class}`} />
                        )}
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(category)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5 inline" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(category)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button type="button" onClick={handleModalClose} className="text-gray-400 hover:text-gray-600">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>

            <Formik
              initialValues={{
                entity_type: editingCategory?.entity_type || (typeFilter !== 'all' ? typeFilter : 'product'),
                name: editingCategory?.name || '',
                color_class: editingCategory?.color_class || DEFAULT_EVENT_COLOR,
                sort_order: editingCategory?.sort_order || 0,
                is_active: editingCategory?.is_active !== false,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-4">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <Field
                      as="select"
                      name="entity_type"
                      disabled={Boolean(editingCategory)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    >
                      {CATEGORY_ENTITY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Field>
                    {errors.entity_type && touched.entity_type && (
                      <p className="mt-1 text-sm text-red-600">{errors.entity_type}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <Field
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Category name"
                    />
                    {errors.name && touched.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Saved as: {editingCategory?.slug || slugifyCategory(values.name, values.entity_type) || '—'}
                    </p>
                  </div>

                  {values.entity_type === 'event' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                      <Field
                        as="select"
                        name="color_class"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        {EVENT_COLOR_OPTIONS.map((color) => (
                          <option key={color.value} value={color.value}>
                            {color.label}
                          </option>
                        ))}
                      </Field>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      id="is_active"
                      type="checkbox"
                      checked={values.is_active}
                      onChange={(event) => setFieldValue('is_active', event.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                      Active (shown in create forms)
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Category</h3>
            <p className="text-sm text-gray-600 mb-4">
              Delete “{deleteConfirm.name}”? This is blocked if any {deleteConfirm.entity_type} still uses it.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoriesList
