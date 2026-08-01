import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdvertising } from '../../store/slices/advertisingSlice'
import { getImageUrl } from '../../utils/imageUtils'

const featureCardVariants = {
  hidden: {
    opacity: 0,
    y: 32,
  },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: index * 0.12,
      ease: 'easeOut',
    },
  }),
}

const DynamicAdvertisingDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { advertising, loading, error } = useSelector((state) => state.advertising)

  useEffect(() => {
    if (advertising.length === 0) {
      dispatch(fetchAdvertising())
    }
  }, [dispatch, advertising.length])

  const advertisingItem = advertising.find(
    (item) =>
      item._id === slug ||
      item.advertising_name?.str1?.toLowerCase().replace(/\s+/g, '-') === slug ||
      item.advertising_name?.str1?.toLowerCase().replace(/\s+/g, '_') === slug
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading advertising details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading advertising: {error}</p>
          <button
            onClick={() => navigate('/advertising')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Back to Advertising
          </button>
        </div>
      </div>
    )
  }

  if (!advertisingItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Advertising item not found</p>
          <button
            onClick={() => navigate('/advertising')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Back to Advertising
          </button>
        </div>
      </div>
    )
  }

  const advertisingTitle = advertisingItem.advertising_name?.str1 || 'Advertising'
  const advertisingSubtitle = advertisingItem.advertising_name?.str2 || ''
  const description = advertisingItem.description || ''
  const categoryName = advertisingItem.category || 'Advertising'
  const featureList = advertisingItem.feature || advertisingItem.features || []
  const featureTitle1 = advertisingItem.feature_heading?.str1 || 'Why Choose'
  const featureTitle2 = advertisingItem.feature_heading?.str2 || advertisingTitle
  const featureDescription =
    advertisingItem.feature_description ||
    'Powerful advertising solutions designed to maximize visibility, engagement, and campaign recall.'
  const imageUrl =
    getImageUrl(advertisingItem.image) ||
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative py-24 sm:py-32 overflow-hidden"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundColor: '#7c3aed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/55"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="bg-white/20 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold backdrop-blur-sm flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1 0v14m8-7H4" />
                </svg>
                {categoryName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              {advertisingTitle}
              {advertisingSubtitle && <span className="block text-fuchsia-200">{advertisingSubtitle}</span>}
            </h1>
            <p className="text-purple-100 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        </div>
      </section>

      {featureList.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {featureTitle1}
                <span className="bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent"> {featureTitle2}</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {featureDescription}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureList.map((feature, index) => (
                <motion.div
                  key={feature.id || feature._id || index}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={featureCardVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative min-h-[320px] overflow-hidden rounded-3xl shadow-xl"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: feature.image
                        ? `url(${getImageUrl(feature.image)})`
                        : 'linear-gradient(135deg, rgba(147,51,234,0.95), rgba(88,28,135,0.92))',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent transition-all duration-500 group-hover:from-slate-950/65" />

                  <div className="relative z-10 flex h-full flex-col justify-end p-8">
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                      className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur-md"
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>

                    <div className="max-w-sm rounded-2xl border border-white/10 bg-slate-950/30 p-5 shadow-xl backdrop-blur-md">
                      <h3 className="mb-4 text-2xl font-bold text-white drop-shadow-sm">
                        {feature.title || `Feature ${index + 1}`}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/85">
                        {feature.description || 'Premium campaign support with attention-grabbing delivery.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Campaign Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Designed to keep your brand visible, memorable, and high-converting across every touchpoint.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { title: 'Maximum Visibility', description: 'Prominent placements and clear creative execution for stronger awareness.' },
              { title: 'Targeted Reach', description: 'Campaign formats tailored for the audiences and locations that matter most.' },
              { title: 'Premium Presentation', description: 'High-quality visuals and finishes that strengthen brand perception.' },
              { title: 'Flexible Execution', description: 'Adaptable campaign structures for launches, activations, and long-term visibility.' },
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-purple-600">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Launch This Campaign?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us to plan, price, and execute your {advertisingTitle} campaign with the right creative and placement mix.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
            <button
              onClick={() => navigate('/advertising')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Back to Advertising
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DynamicAdvertisingDetail
