import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '../../store/slices/eventsSlice'
import { getImageUrl } from '../../utils/imageUtils'
import { getEventCategoryLabel, getEventColorClass, slugifyEventTitle } from '../../lib/eventCategories'

const DynamicEventDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { events, loading, error } = useSelector((state) => state.events)

  useEffect(() => {
    if (events.length === 0) {
      dispatch(fetchEvents())
    }
  }, [dispatch, events.length])

  const event = events.find(
    (item) => item._id === slug || item.slug === slug || slugifyEventTitle(item.title || item.name) === slug
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading event: {error}</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Event not found</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  const imageUrl =
    getImageUrl(event.image) ||
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20corporate%20event%20stage%20setup%20with%20dramatic%20lighting%2C%20premium%20venue%2C%20audience%20ambience%2C%20professional%20photography&image_size=landscape_16_9'

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative py-24 sm:py-32 overflow-hidden"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundColor: '#2563eb',
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
                {getEventCategoryLabel(event.category)}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {event.title || event.name}
            </h1>
            <p className="text-blue-100 text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              {event.description}
            </p>
            <div className={`inline-flex items-center rounded-full bg-gradient-to-r ${getEventColorClass(event.category)} px-6 py-3 text-white font-semibold shadow-xl`}>
              {event.date ? new Date(event.date).toLocaleDateString() : 'Date To Be Announced'}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <img
                src={imageUrl}
                alt={event.title || event.name}
                className="w-full h-[420px] object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  Event Overview
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {event.title || event.name}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {event.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-gray-50 p-5 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="text-base font-semibold text-gray-900">{getEventCategoryLabel(event.category)}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-5 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="text-base font-semibold text-gray-900">
                    {event.date ? new Date(event.date).toLocaleDateString() : 'Date To Be Announced'}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Why This Event Matters</h3>
                <p className="text-gray-700 leading-relaxed">
                  Every event is planned to create memorable experiences, premium brand presence, and smooth on-ground execution. This event page is now fully dynamic and driven from the admin panel.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Enquire Now
                </button>
                <button
                  onClick={() => navigate('/events')}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Back to Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DynamicEventDetail
