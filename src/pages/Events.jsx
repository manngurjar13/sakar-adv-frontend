import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import EventCard from '../components/EventCard'
import { fetchEvents } from '../store/slices/eventsSlice'
import { fetchEventBanners } from '../store/slices/eventBannerSlice'
import { fetchUpcomingEvents } from '../store/slices/upcomingEventSlice'
import { getImageUrl } from '../utils/imageUtils'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const Events = () => {
  const dispatch = useDispatch()
  const { events, loading: eventsLoading, error: eventsError } = useSelector(state => state.events)
  const { banners, loading: bannersLoading } = useSelector(state => state.eventBanners)
  const { events: upcomingEvents, loading: upcomingLoading } = useSelector(state => state.upcomingEvents)
  
  const [selectedCategory, setSelectedCategory] = useState('Corporate Events');
  const categoryScrollRef = React.useRef(null);

  // Fallback data in case API fails
  const fallbackBanners = [
    {
      id: '1',
      cardText: 'Amazing Events Await You',
      bannerImage: '/images/banners/event-banner-1.jpg'
    },
    {
      id: '2', 
      cardText: 'Create Memorable Experiences',
      bannerImage: '/images/banners/event-banner-2.jpg'
    }
  ];

  const fallbackUpcomingEvents = [
    {
      id: '1',
      title: 'Spring Festival 2024',
      date: '2024-04-15',
      location: 'Central Park',
      image: '/images/events/spring-festival.jpg',
      description: 'Join us for an amazing spring festival with music, food, and fun activities.'
    },
    {
      id: '2',
      title: 'Tech Conference 2024',
      date: '2024-05-20',
      location: 'Convention Center',
      image: '/images/events/tech-conference.jpg',
      description: 'Latest technology trends and networking opportunities for professionals.'
    }
  ];

  const fallbackEvents = [
    {
      id: '1',
      name: 'Corporate Annual Meeting',
      category: 'Corporate Events',
      description: 'Annual corporate meeting with keynote speakers and networking opportunities.',
      image: '/images/events/corporate-meeting.jpg',
      date: '2024-02-15'
    },
    {
      id: '2',
      name: 'Birthday Celebration',
      category: 'Birthday Decor',
      description: 'Beautiful birthday decoration with balloons, banners, and party favors.',
      image: '/images/events/birthday-party.jpg',
      date: '2024-02-20'
    },
    {
      id: '3',
      name: 'Wedding Reception',
      category: 'Wedding Decor',
      description: 'Elegant wedding reception with stunning decorations and floral arrangements.',
      image: '/images/events/wedding-reception.jpg',
      date: '2024-02-25'
    },
    {
      id: '4',
      name: 'Social Gathering',
      category: 'Social Events',
      description: 'Community social gathering with food, music, and entertainment.',
      image: '/images/events/social-gathering.jpg',
      date: '2024-03-01'
    },
    {
      id: '5',
      name: 'Office Party',
      category: 'Office Decor',
      description: 'Office celebration with professional decorations and team building activities.',
      image: '/images/events/office-party.jpg',
      date: '2024-03-05'
    },
    {
      id: '6',
      name: 'ATL Workshop',
      category: 'ATL Activities',
      description: 'Interactive ATL workshop with hands-on learning and practical exercises.',
      image: '/images/events/atl-workshop.jpg',
      date: '2024-03-10'
    },
    {
      id: '7',
      name: 'BTL Campaign Launch',
      category: 'BTL Activities',
      description: 'Below-the-line marketing campaign launch event with product demonstrations.',
      image: '/images/events/btl-campaign.jpg',
      date: '2024-03-15'
    },
    {
      id: '8',
      name: 'Lunch Networking',
      category: 'Lunch Event',
      description: 'Professional networking lunch with industry leaders and business opportunities.',
      image: '/images/events/lunch-networking.jpg',
      date: '2024-03-20'
    }
  ];

  useEffect(() => {
    // Fetch all data when component mounts
    dispatch(fetchEvents())
    dispatch(fetchEventBanners())
    dispatch(fetchUpcomingEvents())
  }, [dispatch])

  // Use API data if available, otherwise use fallback data
  const displayEvents = events.length > 0 ? events : fallbackEvents;
  const displayBanners = banners.length > 0 ? banners : fallbackBanners;
  const displayUpcomingEvents = upcomingEvents.length > 0 ? upcomingEvents : fallbackUpcomingEvents;
  
  // Filter events by category
  const filteredEvents = displayEvents.filter(event => event.category === selectedCategory);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300; // Scroll by 300px
      const currentScroll = categoryScrollRef.current.scrollLeft;
      
      if (direction === 'left') {
        categoryScrollRef.current.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: 'smooth'
        });
      } else {
        categoryScrollRef.current.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Banner Section */}
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
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url('${getImageUrl(banner.bannerImage)}')`
                    }}
                  >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  </div>

                  {/* Geometric Shapes */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Top Left Stripes */}
                    <div className="absolute top-8 left-8 w-16 h-32 opacity-30">
                      <div className="w-full h-2 bg-white mb-2"></div>
                      <div className="w-full h-2 bg-white mb-2"></div>
                      <div className="w-full h-2 bg-white mb-2"></div>
                      <div className="w-full h-2 bg-white mb-2"></div>
                    </div>
                    
                    {/* Red Triangle */}
                    <div className="absolute top-20 left-1/4 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-red-500 opacity-60"></div>
                    
                    {/* Blue Triangle */}
                    <div className="absolute top-40 left-1/3 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-l-transparent border-r-transparent border-b-blue-500 opacity-60"></div>
                    
                    {/* Orange Slash */}
                    <div className="absolute top-32 right-1/4 w-32 h-4 bg-orange-500 transform rotate-45 opacity-60"></div>
                    
                    {/* Purple Triangle Bottom */}
                    <div className="absolute bottom-20 left-1/2 w-0 h-0 border-l-[60px] border-r-[60px] border-t-[100px] border-l-transparent border-r-transparent border-t-purple-500 opacity-60"></div>
                    
                    {/* Dotted Pattern */}
                    <div className="absolute top-20 right-8 w-24 h-24 opacity-30">
                      <div className="grid grid-cols-4 gap-2 h-full">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Main Banner Card - Left Side */}
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

        {/* Navigation Buttons - Bottom Corners on Mobile, Sides on Desktop */}
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

        {/* Pagination */}
        <div className="swiper-pagination-banner absolute bottom-8 left-1/2 -translate-x-1/2 z-20"></div>
      </section>

      {/* Event Categories Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">Explore Events by Category</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              We cover a versatile categories of events. Browse by categories to find the perfect event you are looking for.
            </p>
            
            {/* Decorative Elements - Top Right */}
            <div className="absolute top-0 right-0 opacity-20">
              <div className="relative">
                {/* Red Triangle */}
                <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-l-transparent border-r-transparent border-b-red-500"></div>
                {/* Orange Triangle */}
                <div className="absolute top-0 left-4 w-0 h-0 border-l-[25px] border-r-[25px] border-b-[40px] border-l-transparent border-r-transparent border-b-orange-500"></div>
                {/* Purple Triangle */}
                <div className="absolute top-2 right-0 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-purple-500"></div>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="relative mb-12 sm:mb-16">
            {/* Scroll Buttons */}
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

            {/* Category Buttons */}
            <div ref={categoryScrollRef} className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {/* Corporate Events */}
              <button 
                onClick={() => setSelectedCategory('Corporate Events')}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl flex items-center space-x-2 sm:space-x-3 transition-all duration-300 group ${
                  selectedCategory === 'Corporate Events' 
                    ? 'bg-blue-100 border-2 border-blue-200' 
                    : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className={`font-semibold text-sm sm:text-base ${selectedCategory === 'Corporate Events' ? 'text-blue-700' : 'text-gray-700'}`}>Corporate Events</span>
              </button>

              {/* Social Events */}
              <button 
                onClick={() => setSelectedCategory('Social Events')}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl flex items-center space-x-2 sm:space-x-3 transition-all duration-300 group ${
                  selectedCategory === 'Social Events' 
                    ? 'bg-orange-100 border-2 border-orange-200' 
                    : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className={`font-semibold text-sm sm:text-base ${selectedCategory === 'Social Events' ? 'text-orange-700' : 'text-gray-700'}`}>Social Events</span>
              </button>

              {/* Birthday Decor */}
              <button 
                onClick={() => setSelectedCategory('Birthday Decor')}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl flex items-center space-x-2 sm:space-x-3 transition-all duration-300 group ${
                  selectedCategory === 'Birthday Decor' 
                    ? 'bg-purple-100 border-2 border-purple-200' 
                    : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <span className={`font-semibold text-sm sm:text-base ${selectedCategory === 'Birthday Decor' ? 'text-purple-700' : 'text-gray-700'}`}>Birthday Decor</span>
              </button>

              {/* ATL Activities */}
              <button 
                onClick={() => setSelectedCategory('ATL Activities')}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl flex items-center space-x-2 sm:space-x-3 transition-all duration-300 group ${
                  selectedCategory === 'ATL Activities' 
                    ? 'bg-green-100 border-2 border-green-200' 
                    : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className={`font-semibold text-sm sm:text-base ${selectedCategory === 'ATL Activities' ? 'text-green-700' : 'text-gray-700'}`}>ATL Activities</span>
              </button>

              {/* BTL Activities */}
              <button 
                onClick={() => setSelectedCategory('BTL Activities')}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl flex items-center space-x-2 sm:space-x-3 transition-all duration-300 group ${
                  selectedCategory === 'BTL Activities' 
                    ? 'bg-red-100 border-2 border-red-200' 
                    : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className={`font-semibold text-sm sm:text-base ${selectedCategory === 'BTL Activities' ? 'text-red-700' : 'text-gray-700'}`}>BTL Activities</span>
              </button>

              {/* Wedding Decor */}
              <button 
                onClick={() => setSelectedCategory('Wedding Decor')}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl flex items-center space-x-2 sm:space-x-3 transition-all duration-300 group ${
                  selectedCategory === 'Wedding Decor' 
                    ? 'bg-pink-100 border-2 border-pink-200' 
                    : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className={`font-semibold text-sm sm:text-base ${selectedCategory === 'Wedding Decor' ? 'text-pink-700' : 'text-gray-700'}`}>Wedding Decor</span>
              </button>

              {/* Office Decor */}
              <button 
                onClick={() => setSelectedCategory('Office Decor')}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl flex items-center space-x-2 sm:space-x-3 transition-all duration-300 group ${
                  selectedCategory === 'Office Decor' 
                    ? 'bg-indigo-100 border-2 border-indigo-200' 
                    : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className={`font-semibold text-sm sm:text-base ${selectedCategory === 'Office Decor' ? 'text-indigo-700' : 'text-gray-700'}`}>Office Decor</span>
              </button>

              {/* Lunch Event */}
              <button 
                onClick={() => setSelectedCategory('Lunch Event')}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl flex items-center space-x-2 sm:space-x-3 transition-all duration-300 group ${
                  selectedCategory === 'Lunch Event' 
                    ? 'bg-yellow-100 border-2 border-yellow-200' 
                    : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <span className={`font-semibold text-sm sm:text-base ${selectedCategory === 'Lunch Event' ? 'text-yellow-700' : 'text-gray-700'}`}>Lunch Event</span>
              </button>
            </div>
          </div>

          {/* Event Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {eventsLoading ? (
              // Loading state
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
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={{
                    ...event,
                    title: event.name || event.title,
                    image: getImageUrl(event.image),
                    date: event.date || new Date().toLocaleDateString(),
                    color: "from-blue-500 to-blue-600"
                  }} 
                  onClick={() => {
                    // Handle event card click - you can add navigation or modal opening here
                    console.log('Event clicked:', event.name || event.title)
                  }}
                />
              ))
            ) : (
              /* Empty State */
              <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3 sm:mb-4">No Events Found</h3>
                <p className="text-gray-500 text-center max-w-md mb-6 sm:mb-8 text-sm sm:text-base">
                  We're working on adding amazing {selectedCategory.toLowerCase()} events. Check back soon for exciting new events in this category!
                </p>
                <button 
                  onClick={() => setSelectedCategory('Corporate Events')}
                  className="bg-gray-100 text-gray-700 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
                >
                  View Other Categories
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-16 h-16 sm:w-32 sm:h-32 bg-blue-600 rounded-full"></div>
          <div className="absolute top-32 right-20 w-12 h-12 sm:w-24 sm:h-24 bg-blue-400 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-16 sm:h-16 bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-10 h-10 sm:w-20 sm:h-20 bg-blue-300 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <span className="bg-blue-600 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                UPCOMING EVENTS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Discover Our Latest Events</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See our upcoming event list and get registered which ones you find best for you. Join us for memorable experiences and networking opportunities.
            </p>
          </div>

          {/* Upcoming Events Slider */}
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
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
                className="upcoming-events-swiper"
              >
                {displayUpcomingEvents.map((event) => (
                  <SwiperSlide key={event.id}>
                    <div className="relative group cursor-pointer transform hover:scale-105 transition-all duration-500">
                      <div 
                        className="w-full h-64 sm:h-80 bg-cover bg-center rounded-2xl shadow-2xl border-2 border-white"
                        style={{
                          backgroundImage: `url('${getImageUrl(event.image)}')`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl"></div>
                        
                        {/* Content */}
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

                {/* Navigation Buttons */}
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

                {/* Pagination */}
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
                  We're working on adding exciting upcoming events. Check back soon for new announcements!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our Achievements Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Circles */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100/30 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-200/40 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-300/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-20 h-20 bg-blue-400/25 rounded-full animate-pulse"></div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-20 left-1/2 w-8 h-8 bg-blue-200/30 transform rotate-45"></div>
          <div className="absolute bottom-40 right-20 w-6 h-6 bg-blue-300/25 transform rotate-45"></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            {/* Left Side - Text Content */}
            <div className="text-gray-900">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="text-blue-600 text-lg sm:text-xl md:text-2xl font-cursive font-semibold">
                  🏆 Our Achievements
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                Celebrating Our 
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"> Success</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg">
                Sakar Advertisement has empowered many big heads to turn their event dreams into reality. With an intuitive interface, collaborative tools, and seamless planning features, we've redefined event creation.
              </p>
              
              {/* Stats Summary */}
              <div className="flex flex-col sm:flex-row items-center justify-between sm:space-x-4 lg:space-x-8 mt-6 sm:mt-8 space-y-4 sm:space-y-0">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600">500+</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">Events Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600">50+</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600">5+</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Right Side - Achievement Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {/* Box 1 - Blue */}
              <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-blue-400 relative transform hover:scale-105 transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">150+</div>
                  <div className="text-xs sm:text-sm md:text-base font-bold text-blue-700 uppercase tracking-wider">SUCCESSFUL EVENTS</div>
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-blue-300 rounded-full opacity-40 animate-bounce"></div>
                <div className="absolute top-2 left-2 w-3 h-3 bg-blue-500/20 rounded-full"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-blue-600/30 rounded-full"></div>
              </div>

              {/* Box 2 - Blue */}
              <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-blue-500 relative transform hover:scale-105 transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">25+</div>
                  <div className="text-xs sm:text-sm md:text-base font-bold text-blue-700 uppercase tracking-wider">TRUSTED CLIENTS</div>
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-blue-400 rounded-full opacity-40 animate-bounce"></div>
                <div className="absolute top-2 left-2 w-3 h-3 bg-blue-600/20 rounded-full"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-blue-700/30 rounded-full"></div>
              </div>

              {/* Box 3 - Blue */}
              <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-blue-600 relative transform hover:scale-105 transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
                  <div className="text-xs sm:text-sm md:text-base font-bold text-blue-700 uppercase tracking-wider">POSITIVE FEEDBACK</div>
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-blue-500 rounded-full opacity-40 animate-bounce"></div>
                <div className="absolute top-2 left-2 w-3 h-3 bg-blue-700/20 rounded-full"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-blue-800/30 rounded-full"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Custom CSS for Banner Swiper */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        .banner-swiper .swiper-slide {
          height: 70vh;
        }

        .swiper-button-prev-banner:after,
        .swiper-button-next-banner:after {
          display: none;
        }

        .swiper-pagination-banner .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          width: 12px;
          height: 12px;
          margin: 0 6px;
        }

        .swiper-pagination-banner .swiper-pagination-bullet-active {
          background: #3B82F6;
          transform: scale(1.2);
        }

        .banner-swiper {
          --swiper-navigation-color: #ffffff;
          --swiper-pagination-color: #3B82F6;
        }

        .font-cursive {
          font-family: 'Dancing Script', cursive;
          font-weight: 600;
        }

        .font-elegant {
          font-family: 'Playfair Display', serif;
          font-style: italic;
        }

        .font-modern {
          font-family: 'Poppins', sans-serif;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

            .line-clamp-3 {
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .upcoming-events-swiper .swiper-slide {
              height: auto;
            }

            .swiper-button-prev-upcoming:after,
            .swiper-button-next-upcoming:after {
              display: none;
            }

            .swiper-pagination-upcoming .swiper-pagination-bullet {
              background: rgba(59, 130, 246, 0.3);
              opacity: 1;
              width: 12px;
              height: 12px;
              margin: 0 6px;
            }

            .swiper-pagination-upcoming .swiper-pagination-bullet-active {
              background: #2563eb;
              transform: scale(1.2);
            }

            .upcoming-events-swiper {
              --swiper-navigation-color: #ffffff;
              --swiper-pagination-color: #2563eb;
            }
          `}</style>
    </div>
  )
}

export default Events
