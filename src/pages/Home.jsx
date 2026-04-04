import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Testimonials from "../components/Testimonials";
import { fetchTestimonials } from "../store/slices/testimonialsSlice";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Banner1 from "../../public/banner1.jpg";
import Banner2 from "../../public/banner2.jpg";
import Banner3 from "../../public/banner3.jpg";
import Banner4 from "../../public/banner4.jpg";

const Home = () => {
  const dispatch = useDispatch();
  const { testimonials, loading } = useSelector((state) => state.testimonials);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="w-full banner-swiper"
        >
          <SwiperSlide>
            <div className="w-full h-[45vw] min-h-[220px] max-h-[85vh]">
              <img
                src={Banner1}
                className="w-full h-full object-cover object-center block"
                alt="Banner 1"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="w-full h-[45vw] min-h-[220px] max-h-[85vh]">
              <img
                src={Banner2}
                className="w-full h-full object-cover object-center block"
                alt="Banner 2"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="w-full h-[45vw] min-h-[220px] max-h-[85vh]">
              <img
                src={Banner3}
                className="w-full h-full object-cover object-center block"
                alt="Banner 3"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="w-full h-[45vw] min-h-[220px] max-h-[85vh]">
              <img
                src={Banner4}
                className="w-full h-full object-cover object-center block"
                alt="Banner 4"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Services, Products & Advertising Showcase */}
      <section className="py-16 sm:py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                Our Services
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Complete Advertising Solutions
              <span className="block text-blue-600">Under One Roof</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
              From mobile advertising to outdoor displays, we provide
              comprehensive solutions to make your brand visible everywhere.
            </p>
          </div>

          {/* Main Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16">
            {/* Services Card */}
            <div className="group relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 sm:p-10 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2 border-transparent hover:border-blue-200">
                {/* Icon */}
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-6 0v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2h4a2 2 0 012 2z"
                    />
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Services
                </h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Professional vehicle branding and mobile advertising solutions
                  that turn every vehicle into a moving billboard.
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-sm sm:text-base text-gray-700">
                    <svg
                      className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Vehicle Branding
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-700">
                    <svg
                      className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Auto Rickshaw Ads
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-700">
                    <svg
                      className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Bus Advertising
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-700">
                    <svg
                      className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Mobile Van Ads
                  </li>
                </ul>

                {/* CTA Button */}
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Explore Services
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Products Card */}
            <div className="group relative">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 sm:p-10 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2 border-transparent hover:border-orange-200">
                {/* Icon */}
                <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Products
                </h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  High-quality promotional products and signage solutions
                  designed to maximize your brand visibility.
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-sm sm:text-base text-gray-700">
                    <svg
                      className="w-4 h-4 text-orange-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    No Parking Boards
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-700">
                    <svg
                      className="w-4 h-4 text-orange-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Roll-Up Banners
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-700">
                    <svg
                      className="w-4 h-4 text-orange-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    LED Signage
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-700">
                    <svg
                      className="w-4 h-4 text-orange-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Glow Signs
                  </li>
                </ul>

                {/* CTA Button */}
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  View Products
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Advertising Card */}
            <div className="group relative">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 sm:p-10 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2 border-transparent hover:border-green-200">
                {/* Icon */}
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Advertising
                </h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Strategic outdoor advertising campaigns that capture attention
                  and drive results across prime locations.
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-sm sm:text-base text-gray-700">
                    <svg
                      className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Outdoor Hoardings
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-700">
                    <svg
                      className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Billboard Advertising
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-700">
                    <svg
                      className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Festival Banners
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-700">
                    <svg
                      className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    BTL Campaigns
                  </li>
                </ul>

                {/* CTA Button */}
                <Link
                  to="/advertising"
                  className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Explore Advertising
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="text-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 sm:p-12 border-2 border-gray-100">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Amplify Your Brand?
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-2xl mx-auto">
              Let's discuss your advertising needs and create a custom solution
              that delivers results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started Today
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-xl transition-all duration-300"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Only show if we have testimonials from API */}
      <Testimonials />
    </div>
  );
};

export default Home;
