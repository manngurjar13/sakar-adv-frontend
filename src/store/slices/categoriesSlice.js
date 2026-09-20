import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createId } from '../../lib/supabaseData'
import { getSupabase } from '../../lib/supabase'
import { CATEGORY_TABLE_BY_TYPE, DEFAULT_EVENT_COLOR, slugifyCategory } from '../../lib/categories'

const normalizeCategory = (category) => ({
  ...category,
  id: category.id,
  _id: category.id,
  entity_type: category.entity_type,
  name: category.name || '',
  slug: category.slug || '',
  color_class: category.color_class || DEFAULT_EVENT_COLOR,
  sort_order: Number(category.sort_order || 0),
  is_active: category.is_active !== false,
})

const buildCategoryPayload = (categoryData, id) => {
  const entityType = categoryData.entity_type
  const slug = categoryData.slug || slugifyCategory(categoryData.name, entityType)

  return {
    id,
    entity_type: entityType,
    name: String(categoryData.name || '').trim(),
    slug,
    color_class: entityType === 'event' ? categoryData.color_class || DEFAULT_EVENT_COLOR : null,
    sort_order: Number(categoryData.sort_order || 0),
    is_active: categoryData.is_active !== false,
  }
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('entity_type', { ascending: true })
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })

      if (error) {
        throw new Error(error.message || 'Failed to fetch categories')
      }

      return (data || []).map(normalizeCategory)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories')
    }
  }
)

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const supabase = getSupabase()
      const payload = buildCategoryPayload(categoryData, createId())
      const { data, error } = await supabase.from('categories').insert(payload).select().single()

      if (error) {
        if (String(error.message || '').toLowerCase().includes('duplicate')) {
          throw new Error('A category with this name already exists for this type.')
        }
        throw new Error(error.message || 'Failed to create category')
      }

      return normalizeCategory(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create category')
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }, { rejectWithValue, getState }) => {
    try {
      const supabase = getSupabase()
      const existing = getState().categories.categories.find((item) => item.id === id)
      const payload = buildCategoryPayload(
        {
          ...categoryData,
          slug: existing?.slug,
          entity_type: existing?.entity_type || categoryData.entity_type,
        },
        id
      )

      const { data, error } = await supabase
        .from('categories')
        .update({
          name: payload.name,
          color_class: payload.color_class,
          sort_order: payload.sort_order,
          is_active: payload.is_active,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to update category')
      }

      return normalizeCategory(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update category')
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue, getState }) => {
    try {
      const supabase = getSupabase()
      const existing = getState().categories.categories.find((item) => item.id === id)

      if (!existing) {
        throw new Error('Category not found')
      }

      const tableName = CATEGORY_TABLE_BY_TYPE[existing.entity_type]
      if (tableName) {
        const { count, error: usageError } = await supabase
          .from(tableName)
          .select('id', { count: 'exact', head: true })
          .eq('category', existing.slug)

        if (usageError) {
          throw new Error(usageError.message || 'Failed to check category usage')
        }

        if (count > 0) {
          throw new Error(
            `Cannot delete this category because ${count} ${existing.entity_type} record(s) still use it.`
          )
        }
      }

      const { error } = await supabase.from('categories').delete().eq('id', id)

      if (error) {
        throw new Error(error.message || 'Failed to delete category')
      }

      return id
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete category')
    }
  }
)

const initialState = {
  categories: [],
  loading: false,
  error: null,
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
        state.error = null
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createCategory.pending, (state) => {
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload)
        state.error = null
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateCategory.pending, (state) => {
        state.error = null
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((category) => category.id === action.payload.id)
        if (index !== -1) {
          state.categories[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(deleteCategory.pending, (state) => {
        state.error = null
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((category) => category.id !== action.payload)
        state.error = null
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearCategoryError } = categoriesSlice.actions
export default categoriesSlice.reducer
