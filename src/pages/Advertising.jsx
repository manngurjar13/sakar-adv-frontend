import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdvertising } from '../store/slices/advertisingSlice'
import { getImageUrl } from '../utils/imageUtils'

const Advertising = () => {
  const dispatch = useDispatch()
  const { advertising, loading, error } = useSelector((state) => state.advertising)

  useEffect(() => {
    dispatch(fetchAdvertising())
  }, [dispatch])

  const getAdvertisingLink = (item) => {
    const slug = item.advertising_name?.str1?.toLowerCase().replace(/\s+/g, '-') || item._id
    return `/advertising/${slug}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading advertising...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Advertising Solutions
              </h1>
              <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
                Comprehensive advertising campaigns and solutions to maximize your brand reach and impact
              </p>
            </div>
          </div>
        </section>
        <section className="py-16 text-center">
          <p className="text-red-600 text-lg">Error loading advertising. Please try again later.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Advertising Solutions
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
              Comprehensive advertising campaigns and solutions to maximize your brand reach and impact
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Campaign
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Advertising Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create and manage the full advertising catalog dynamically from the admin panel
            </p>
          </div>

          {advertising && advertising.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advertising.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img
                      src={
                        getImageUrl(item.image || item.image_url) ||
                        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                      }
                      alt={item.advertising_name?.str1 || 'Advertising'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-bold mb-2">
                        {item.advertising_name?.str1 || 'Advertising'}
                      </h3>
                      {item.advertising_name?.str2 && (
                        <p className="text-white text-sm opacity-90">
                          {item.advertising_name.str2}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      {item.description || 'Professional advertising solutions tailored to your brand.'}
                    </p>
                    {(item.feature || item.features)?.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {(item.feature || item.features).slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature.title || `Feature ${index + 1}`}
                          </li>
                        ))}
                        {(item.feature || item.features).length > 3 && (
                          <li className="text-sm text-purple-600 font-semibold">
                            + {(item.feature || item.features).length - 3} more features
                          </li>
                        )}
                      </ul>
                    )}
                    <Link
                      to={getAdvertisingLink(item)}
                      className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No advertising items available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Launch Your Campaign?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let us help you create impactful advertising campaigns that deliver results
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
              Get Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Advertising
