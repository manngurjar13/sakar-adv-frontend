import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import EventCard from '../components/EventCard'
import { fetchEvents } from '../store/slices/eventsSlice'
import { fetchEventBanners } from '../store/slices/eventBannerSlice'
import { fetchUpcomingEvents } from '../store/slices/upcomingEventSlice'
import { getImageUrl } from '../utils/imageUtils'
import { getEventCategoryLabel, getEventColorClass, slugifyEventTitle } from '../lib/eventCategories'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const Events = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const categoryScrollRef = useRef(null)
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state) => state.events)
  const { banners, loading: bannersLoading } = useSelector((state) => state.eventBanners)
  const { events: upcomingEvents, loading: upcomingLoading } = useSelector((state) => state.upcomingEvents)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    dispatch(fetchEvents())
    dispatch(fetchEventBanners())
    dispatch(fetchUpcomingEvents())
  }, [dispatch])

  const displayEvents = useMemo(
    () => (events || []).filter((event) => Boolean(event.title || event.name)),
    [events]
  )
  const displayBanners = banners || []
  const displayUpcomingEvents = upcomingEvents || []

  const eventCategories = useMemo(() => {
    const categories = Array.from(new Set(displayEvents.map((event) => event.category).filter(Boolean)))
    return categories.map((category) => ({
      value: category,
      label: getEventCategoryLabel(category),
      colorClass: getEventColorClass(category),
    }))
  }, [displayEvents])

  useEffect(() => {
    if (!selectedCategory && eventCategories.length > 0) {
      setSelectedCategory(eventCategories[0].value)
    }
    if (selectedCategory && !eventCategories.find((item) => item.value === selectedCategory) && eventCategories.length > 0) {
      setSelectedCategory(eventCategories[0].value)
    }
  }, [eventCategories, selectedCategory])

  const filteredEvents = selectedCategory
    ? displayEvents.filter((event) => event.category === selectedCategory)
    : displayEvents

  const scrollCategories = (direction) => {
    if (!categoryScrollRef.current) return

    const scrollAmount = 300
    const currentScroll = categoryScrollRef.current.scrollLeft

    categoryScrollRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next-banner',
            prevEl: '.swiper-button-prev-banner',
          }}
          pagination={{
            el: '.swiper-pagination-banner',
            clickable: true,
          }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          loop={displayBanners.length > 1}
          className="banner-swiper h-full"
        >
          {bannersLoading ? (
            <SwiperSlide>
              <div className="relative h-[60vh] sm:h-[70vh] bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading banners...</p>
                </div>
              </div>
            </SwiperSlide>
          ) : displayBanners.length > 0 ? (
            displayBanners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="relative h-[60vh] sm:h-[70vh]">
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={getImageUrl(banner.bannerImage)}
                      alt={banner.cardText || 'Event banner'}
                      className="h-full w-full object-cover object-center scale-125 blur-2xl"
                    />
                  </div>
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={getImageUrl(banner.bannerImage)}
                      alt={banner.cardText || 'Event banner'}
                      className="h-full w-full object-cover object-center scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/55"></div>

                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-8 left-8 w-16 h-32 opacity-30">
                      <div className="w-full h-2 bg-white mb-2"></div>
                      <div className="w-full h-2 bg-white mb-2"></div>
                      <div className="w-full h-2 bg-white mb-2"></div>
                      <div className="w-full h-2 bg-white mb-2"></div>
                    </div>
                    <div className="absolute top-20 left-1/4 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-red-500 opacity-60"></div>
                    <div className="absolute top-40 left-1/3 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-l-transparent border-r-transparent border-b-blue-500 opacity-60"></div>
                    <div className="absolute top-32 right-1/4 w-32 h-4 bg-orange-500 transform rotate-45 opacity-60"></div>
                  </div>

                  <div className="relative z-10 flex items-center h-full px-4">
                    <div className="max-w-2xl ml-4 sm:ml-8 lg:ml-16 xl:ml-32">
                      <div className="bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/30">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                          <span className="font-elegant">{banner.cardText || 'Event Banner'}</span>
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="relative h-[60vh] sm:h-[70vh] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Our Events</h1>
                  <p className="text-xl text-blue-100">Discover amazing events and experiences</p>
                </div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>

        <button className="swiper-button-prev-banner absolute left-4 bottom-4 sm:left-4 sm:bottom-6 md:left-6 md:bottom-8 lg:left-8 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto z-30 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-2xl text-gray-800 hover:bg-yellow-300 hover:text-gray-900 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/80 hover:border-yellow-400">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-7 lg:h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="swiper-button-next-banner absolute right-4 bottom-4 sm:right-4 sm:bottom-6 md:right-6 md:bottom-8 lg:right-8 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto z-30 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-2xl text-gray-800 hover:bg-yellow-300 hover:text-gray-900 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/80 hover:border-yellow-400">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-7 lg:h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="swiper-pagination-banner absolute bottom-8 left-1/2 -translate-x-1/2 z-20"></div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Explore Events by Category
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              Browse all live events created from the admin panel and explore them by category.
            </p>
          </div>

          {eventCategories.length > 0 && (
            <div className="relative mb-12 sm:mb-16">
              <button
                onClick={() => scrollCategories('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 z-10 shadow-lg"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollCategories('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-all duration-300 z-10 shadow-lg"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div ref={categoryScrollRef} className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {eventCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 group ${
                      selectedCategory === category.value
                        ? 'bg-blue-100 border-2 border-blue-200'
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${category.colorClass} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8m12 0a8 8 0 11-16 0 8 8 0 0116 0z" />
                      </svg>
                    </div>
                    <span className={`font-semibold text-sm sm:text-base ${selectedCategory === category.value ? 'text-blue-700' : 'text-gray-700'}`}>
                      {category.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {eventsLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : eventsError ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M5.455 19h13.09c1.054 0 1.72-1.14 1.197-2l-6.545-10.8c-.527-.87-1.867-.87-2.394 0L4.258 17c-.523.86.143 2 1.197 2z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3 sm:mb-4">Unable To Load Events</h3>
                <p className="text-gray-500 text-center max-w-md text-sm sm:text-base">
                  Please try again later.
                </p>
              </div>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={{
                    ...event,
                    title: event.name || event.title,
                    image: getImageUrl(event.image),
                    date: event.date ? new Date(event.date).toLocaleDateString() : 'TBA',
                    color: getEventColorClass(event.category),
                  }}
                  onClick={() => navigate(`/events/${event.slug || slugifyEventTitle(event.title || event.name)}`)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3 sm:mb-4">No Events Found</h3>
                <p className="text-gray-500 text-center max-w-md mb-6 sm:mb-8 text-sm sm:text-base">
                  We do not have any live events in this category yet. Add events from the admin panel and they will appear here automatically.
                </p>
                <button
                  onClick={() => setSelectedCategory(eventCategories[0]?.value || '')}
                  className="bg-gray-100 text-gray-700 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
                >
                  View Other Categories
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-16 h-16 sm:w-32 sm:h-32 bg-blue-600 rounded-full"></div>
          <div className="absolute top-32 right-20 w-12 h-12 sm:w-24 sm:h-24 bg-blue-400 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-16 sm:h-16 bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-10 h-10 sm:w-20 sm:h-20 bg-blue-300 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <span className="bg-blue-600 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                UPCOMING EVENTS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Discover Our Latest Events</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              All upcoming events are now loaded dynamically from the admin panel.
            </p>
          </div>

          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50">
            {upcomingLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading upcoming events...</p>
              </div>
            ) : displayUpcomingEvents.length > 0 ? (
              <Swiper
                key="upcoming-events-slider"
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={{
                  nextEl: '.swiper-button-next-upcoming',
                  prevEl: '.swiper-button-prev-upcoming',
                }}
                pagination={{
                  el: '.swiper-pagination-upcoming',
                  clickable: true,
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop={displayUpcomingEvents.length > 1}
                breakpoints={{
                  640: { slidesPerView: 1, spaceBetween: 20 },
                  768: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 30 },
                }}
                className="upcoming-events-swiper"
              >
                {displayUpcomingEvents.map((event) => (
                  <SwiperSlide key={event.id}>
                    <div className="relative group cursor-pointer transform hover:scale-105 transition-all duration-500">
                      <div
                        className="w-full h-64 sm:h-80 bg-cover bg-center rounded-2xl shadow-2xl border-2 border-white"
                        style={{
                          backgroundImage: `url('${getImageUrl(event.image)}')`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-white font-bold text-xl mb-3">{event.title}</h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-white/90 text-sm">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}
                            </div>
                            <div className="flex items-center text-white/90 text-sm">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {event.location || 'Location TBA'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}

                <div className="swiper-button-prev-upcoming absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 hover:shadow-2xl transition-all duration-300 z-50 cursor-pointer pointer-events-auto transform hover:scale-110">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <div className="swiper-button-next-upcoming absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 hover:shadow-2xl transition-all duration-300 z-50 cursor-pointer pointer-events-auto transform hover:scale-110">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="swiper-pagination-upcoming flex justify-center mt-8"></div>
              </Swiper>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">No Upcoming Events</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Add upcoming events from the admin panel and they will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100/30 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-200/40 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-300/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-20 h-20 bg-blue-400/25 rounded-full animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            <div className="text-gray-900">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="text-blue-600 text-lg sm:text-xl md:text-2xl font-cursive font-semibold">
                  Our Achievements
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                Celebrating Our
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"> Success</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg">
                The events page is now driven by live content from the admin panel, so every banner, event card, and upcoming event can be updated without code changes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-between sm:space-x-4 lg:space-x-8 mt-6 sm:mt-8 space-y-4 sm:space-y-0">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600">{displayEvents.length}+</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">Events Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600">{displayUpcomingEvents.length}+</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">Upcoming Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600">{eventCategories.length}+</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">Categories Live</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-blue-400 relative transform hover:scale-105 transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">{displayBanners.length || 1}</div>
                  <div className="text-xs sm:text-sm md:text-base font-bold text-blue-700 uppercase tracking-wider">ACTIVE BANNERS</div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-blue-500 relative transform hover:scale-105 transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">{filteredEvents.length}</div>
                  <div className="text-xs sm:text-sm md:text-base font-bold text-blue-700 uppercase tracking-wider">VISIBLE EVENTS</div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-blue-600 relative transform hover:scale-105 transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">{displayEvents.length > 0 ? '100%' : '0%'}</div>
                  <div className="text-xs sm:text-sm md:text-base font-bold text-blue-700 uppercase tracking-wider">LIVE CONTENT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Poppins:wght@300;400;500;600;700&display=swap');

        .banner-swiper .swiper-slide {
          height: 70vh;
        }

        .swiper-button-prev-banner:after,
        .swiper-button-next-banner:after,
        .swiper-button-prev-upcoming:after,
        .swiper-button-next-upcoming:after {
          display: none;
        }

        .swiper-pagination-banner .swiper-pagination-bullet,
        .swiper-pagination-upcoming .swiper-pagination-bullet {
          opacity: 1;
          width: 12px;
          height: 12px;
          margin: 0 6px;
        }

        .swiper-pagination-banner .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
        }

        .swiper-pagination-upcoming .swiper-pagination-bullet {
          background: rgba(59, 130, 246, 0.3);
        }

        .swiper-pagination-banner .swiper-pagination-bullet-active,
        .swiper-pagination-upcoming .swiper-pagination-bullet-active {
          transform: scale(1.2);
        }

        .swiper-pagination-banner .swiper-pagination-bullet-active {
          background: #3b82f6;
        }

        .swiper-pagination-upcoming .swiper-pagination-bullet-active {
          background: #2563eb;
        }

        .font-cursive {
          font-family: 'Dancing Script', cursive;
          font-weight: 600;
        }

        .font-elegant {
          font-family: 'Playfair Display', serif;
          font-style: italic;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default Events
