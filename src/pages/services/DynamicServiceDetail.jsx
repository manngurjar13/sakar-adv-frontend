import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchServices } from '../../store/slices/servicesSlice'

const DynamicServiceDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { services, loading, error } = useSelector((state) => state.services)
  
  useEffect(() => {
    if (services.length === 0) {
      dispatch(fetchServices())
    }
  }, [dispatch, services.length])

  // Find service by slug or id
  const service = services.find(
    (s) => 
      s._id === slug || 
      s.service_name?.str1?.toLowerCase().replace(/\s+/g, '-') === slug ||
      s.service_name?.str1?.toLowerCase().replace(/\s+/g, '_') === slug
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading service: {error}</p>
          <button
            onClick={() => navigate('/services')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Services
          </button>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Service not found</p>
          <button
            onClick={() => navigate('/services')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Services
          </button>
        </div>
      </div>
    )
  }

  const serviceTitle = service.service_name?.str1 || 'Service'
  const serviceSubtitle = service.service_name?.str2 || ''
  const description = service.description || ''
  const categoryName = service.category || 'Service'
  // Handle image - it could be a string or nested object
  const imageUrl = (typeof service.image === 'string' ? service.image : service.image?.url) || 'https://images.unsplash.com/photo-1553531088-d5b11e10e979?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  
  // Debug: log the image URL
  console.log('Service Imageeee:', service.image)
  console.log('Final Image URLllll:', imageUrl)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <section 
        className="relative py-24 sm:py-32 overflow-hidden"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundColor: '#1e40af',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="bg-white/20 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold backdrop-blur-sm flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {categoryName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              {serviceTitle}
              {serviceSubtitle && <span className="block text-orange-300">{serviceSubtitle}</span>}
            </h1>
            <p className="text-blue-100 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {service.features && service.features.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Our
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"> {serviceTitle}</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Professional service delivery that brings maximum impact and value to your business.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.features.map((feature, index) => (
                <div 
                  key={index}
                  className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.feature_heading?.str1 || `Feature ${index + 1}`}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.feature_heading?.str2 || 'Professional service with quality assurance'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Service Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get the most out of our professional services with proven results and dedication.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { title: 'Professional Quality', description: 'High-quality service delivery with attention to detail' },
              { title: 'Cost Effective', description: 'Competitive pricing without compromising quality' },
              { title: 'Fast Turnaround', description: 'Quick execution while maintaining excellence' },
              { title: 'Custom Solutions', description: 'Tailored services to meet your specific needs' }
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-600">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your needs and get a customized solution for your {serviceTitle} requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
            <button 
              onClick={() => navigate('/services')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Back to Services
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DynamicServiceDetail
