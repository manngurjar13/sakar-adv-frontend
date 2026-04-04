import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPortfolio } from '../store/slices/portfolioSlice'
import { getImageUrl } from '../utils/imageUtils'

const Portfolio = () => {
  const dispatch = useDispatch()
  const { portfolio, loading } = useSelector(state => state.portfolio)

  // Fallback portfolio items in case API fails
  const fallbackPortfolioItems = [
    {
      id: 1,
      title: "Brand Identity Design",
      category: "Design",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Complete brand identity package for a tech startup including logo design, brand guidelines, and marketing materials.",
      client: "TechCorp Solutions",
      year: "2024"
    },
    {
      id: 2,
      title: "Digital Marketing Campaign",
      category: "Advertising",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Multi-platform digital marketing strategy and execution that increased brand awareness by 300%.",
      client: "E-Commerce Plus",
      year: "2024"
    },
    {
      id: 3,
      title: "Corporate Event",
      category: "Events",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Annual corporate conference with 500+ attendees featuring keynote speakers and networking sessions.",
      client: "Global Industries",
      year: "2023"
    },
    {
      id: 4,
      title: "Social Media Strategy",
      category: "Digital",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Comprehensive social media strategy and content creation that grew followers by 500% in 6 months.",
      client: "Fashion Forward",
      year: "2024"
    },
    {
      id: 5,
      title: "Product Launch Event",
      category: "Events",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Innovative product launch event with interactive experiences and live demonstrations.",
      client: "InnovateTech",
      year: "2023"
    },
    {
      id: 6,
      title: "Website Design",
      category: "Design",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Modern, responsive website design and development with seamless user experience.",
      client: "Creative Studio",
      year: "2024"
    },
    {
      id: 7,
      title: "Outdoor Advertising",
      category: "Advertising",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Strategic outdoor advertising campaign across major highways and city centers.",
      client: "City Motors",
      year: "2023"
    },
    {
      id: 8,
      title: "Mobile App Design",
      category: "Digital",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "User-centered mobile application design with intuitive interface and smooth interactions.",
      client: "HealthTech Solutions",
      year: "2024"
    },
    {
      id: 9,
      title: "Wedding Event Planning",
      category: "Events",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Luxury wedding event planning with custom decorations and seamless coordination.",
      client: "Royal Weddings",
      year: "2023"
    }
  ]

  useEffect(() => {
    dispatch(fetchPortfolio())
  }, [dispatch])

  // Use API data if available, otherwise use fallback data
  const portfolioItems = portfolio.length > 0 ? portfolio : fallbackPortfolioItems

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border border-white/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white/20 rounded-full animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-20 h-20 border border-white/20 rounded-full animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="bg-white/20 text-white px-6 py-3 rounded-full text-lg font-semibold backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Our Portfolio
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Creative Excellence
              <span className="block text-orange-300">In Every Project</span>
            </h1>
            <p className="text-blue-100 text-xl mb-10 leading-relaxed max-w-3xl mx-auto">
              Explore our diverse range of creative projects and successful campaigns that have transformed brands and delivered exceptional results.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Our Work
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Browse Our
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"> Work Portfolio</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              From brand identity design to digital marketing campaigns, discover the projects that showcase our creative expertise.
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {loading ? (
              // Loading state
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 sm:h-56 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : portfolioItems.length > 0 ? (
              portfolioItems.map((item) => (
                <div key={item.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.title}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Badge */}
                    {item.category && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {item.category}
                        </span>
                      </div>
                    )}

                    {/* Year Badge */}
                    {item.year && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {item.year}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
                      {item.description}
                    </p>
                    
                    {/* Client Info */}
                    {item.client && (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">{item.client}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Empty state
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">No Portfolio Items</h3>
                <p className="text-gray-500 text-center max-w-md">
                  We're working on adding amazing portfolio items. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}

export default Portfolio
