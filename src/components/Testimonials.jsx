import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { fetchTestimonials } from '../store/slices/testimonialsSlice'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const Testimonials = () => {
  const dispatch = useDispatch()
  const { testimonials, loading } = useSelector((state) => state.testimonials)

  useEffect(() => {
    dispatch(fetchTestimonials())
  }, [dispatch])

  // Use API data directly since Home component handles conditional rendering
  const displayTestimonials = testimonials

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            What they say about us
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Eemper rutrum sesed condimentum elit consequat quis. Curabitur fringilla vulputatin auctor vehicula sit amet.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading testimonials...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                aria-label="Previous testimonial"
                className="testimonials-swiper-button-prev shrink-0 w-10 h-10 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="min-w-0 flex-1">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={24}
                  slidesPerView={1}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 24,
                    },
                    1024: {
                      slidesPerView: 4,
                      spaceBetween: 24,
                    },
                  }}
                  navigation={{
                    nextEl: '.testimonials-swiper-button-next',
                    prevEl: '.testimonials-swiper-button-prev',
                  }}
                  pagination={{
                    el: '.testimonials-swiper-pagination',
                    clickable: true,
                  }}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                  }}
                  loop={displayTestimonials.length > 1}
                  className="testimonials-swiper"
                >
                  {displayTestimonials.map((testimonial) => (
                    <SwiperSlide key={testimonial.id}>
                      <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-blue-200">
                        <div className="mb-4">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                            {testimonial.name || testimonial.customerName}
                          </h3>
                        </div>

                        <div className="flex items-center mb-4">
                          {renderStars(testimonial.rating)}
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">
                          {testimonial.text || testimonial.testimonial || testimonial.description}
                        </p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <button
                type="button"
                aria-label="Next testimonial"
                className="testimonials-swiper-button-next shrink-0 w-10 h-10 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          <div className="testimonials-swiper-pagination flex justify-center mt-8"></div>
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          .testimonials-swiper .swiper-pagination-bullet {
            background: #d1d5db;
            opacity: 1;
            width: 10px;
            height: 10px;
            margin: 0 6px;
            transition: all 0.3s ease;
          }
          
          .testimonials-swiper .swiper-pagination-bullet-active {
            background: #3b82f6;
            transform: scale(1.2);
          }
        `}</style>
      </div>
    </section>
  )
}

export default Testimonials