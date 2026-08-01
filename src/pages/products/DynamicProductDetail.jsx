import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../../store/slices/productsSlice'
import { getImageUrl } from '../../utils/imageUtils'

const DynamicProductDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.products)

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts())
    }
  }, [dispatch, products.length])

  const product = products.find(
    (item) =>
      item._id === slug ||
      item.name?.toLowerCase().replace(/\s+/g, '-') === slug ||
      item.name?.toLowerCase().replace(/\s+/g, '_') === slug
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading product: {error}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const imageUrl =
    getImageUrl(product.image) ||
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative py-24 sm:py-32 overflow-hidden"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundColor: '#15803d',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/55"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="bg-white/20 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold backdrop-blur-sm">
                {product.category || 'Product'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              {product.name}
            </h1>
            <p className="text-green-100 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto">
              {product.description}
            </p>
            <div className="inline-flex items-center rounded-full bg-white/15 px-6 py-3 text-lg font-semibold text-white backdrop-blur-sm">
              Rs {Number(product.price || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </section>

      {(product.features || []).length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Product Features
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Key highlights that make this product useful, durable, and effective for your business.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(product.features || []).map((feature, index) => (
                <div key={`${feature}-${index}`} className="bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 p-8 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-base font-medium text-gray-800">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Interested In This Product?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us to get pricing, customization details, and the right product recommendation for your requirement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
            <button
              onClick={() => navigate('/products')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DynamicProductDetail
