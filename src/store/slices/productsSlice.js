import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createId, ensureArray } from '../../lib/supabaseData'
import { getSupabase } from '../../lib/supabase'
import { deletePublicFile, uploadPublicFile } from '../../lib/supabaseStorage'

const normalizeProduct = (product) => ({
  ...product,
  id: product.id,
  _id: product.id,
  image: product.image || product.image_url || '',
  image_url: product.image || product.image_url || '',
  features: ensureArray(product.features),
})

const buildProductPayload = async ({ id, productData, existingProduct = null }) => {
  let image = productData.image || existingProduct?.image || null

  if (productData.imageFile) {
    if (existingProduct?.image) {
      await deletePublicFile({ bucket: 'products', publicUrl: existingProduct.image })
    }

    image = await uploadPublicFile({
      bucket: 'products',
      file: productData.imageFile,
      recordId: id,
      folder: 'main',
    })
  }

  return {
    id,
    name: productData.name || '',
    description: productData.description || '',
    price: Number(productData.price) || 0,
    category: productData.category || '',
    status: productData.status || 'draft',
    image,
    features: ensureArray(productData.features).map((feature) => String(feature || '')),
  }
}

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message || 'Failed to fetch products')
    }

    return (data || []).map(normalizeProduct)
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch products')
  }
})

export const createProduct = createAsyncThunk('products/createProduct', async (productData, { rejectWithValue }) => {
  try {
    const id = createId()
    const payload = await buildProductPayload({ id, productData })
    const { data, error } = await supabase.from('products').insert(payload).select().single()

    if (error) {
      throw new Error(error.message || 'Failed to create product')
    }

    return normalizeProduct(data)
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to create product')
  }
})

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue, getState }) => {
    try {
      const existingProduct = getState().products.products.find((product) => product.id === id || product._id === id)
      const payload = await buildProductPayload({ id, productData, existingProduct })
      const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single()

      if (error) {
        throw new Error(error.message || 'Failed to update product')
      }

      return normalizeProduct(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update product')
    }
  }
)

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { rejectWithValue, getState }) => {
  try {
    const existingProduct = getState().products.products.find((product) => product.id === id || product._id === id)

    if (existingProduct?.image) {
      await deletePublicFile({ bucket: 'products', publicUrl: existingProduct.image })
    }

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      throw new Error(error.message || 'Failed to delete product')
    }

    return id
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to delete product')
  }
})

const initialState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products.push(action.payload)
        state.error = null
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const index = state.products.findIndex(product => product.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products = state.products.filter(product => product.id !== action.payload)
        state.error = null
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setSelectedProduct, clearSelectedProduct } = productsSlice.actions
export default productsSlice.reducer
