import React from 'react'
import { Link } from 'react-router-dom'

const Products = () => {
  const products = [
    {
      id: 1,
      title: "No Parking Boards",
      description: "High-quality no parking boards designed for clear visibility and durability. Perfect for property management and security purposes.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/products/no-parking-boards",
      features: ["Weather-resistant", "Clear visibility", "Durable materials", "Custom designs"]
    },
    {
      id: 2,
      title: "Roll Up Banners",
      description: "Professional roll-up banners for events, exhibitions, and promotional activities. Easy to transport and set up anywhere.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/products/roll-up-banners",
      features: ["Portable design", "Easy setup", "High-quality printing", "Professional appearance"]
    },
    {
      id: 3,
      title: "Promo Tables",
      description: "Custom promotional tables perfect for events, trade shows, and marketing campaigns. Durable and eye-catching designs.",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/products/promo-tables",
      features: ["Event-ready", "Custom branding", "Sturdy construction", "Professional finish"]
    },
    {
      id: 4,
      title: "LED Signage",
      description: "Modern LED signage solutions for maximum visibility day and night. Energy-efficient and eye-catching displays.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/products/led-signage",
      features: ["Energy efficient", "24/7 visibility", "Custom messages", "Weather resistant"]
    },
    {
      id: 5,
      title: "Flex Printing",
      description: "High-quality flex printing services for banners, hoardings, and large format displays. Vibrant colors and sharp details.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-0.3&auto=format&fit=crop&w=800&q=80",
      link: "/products/flex-printing",
      features: ["Vibrant colors", "Large format", "Weather resistant", "Sharp details"]
    },
    {
      id: 6,
      title: "Glow Signs",
      description: "Illuminated glow signs that make your business stand out. Perfect for night visibility and attracting customers.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/products/glow-signs",
      features: ["Night visibility", "Eye-catching design", "Energy efficient", "Custom shapes"]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Our Products
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
              High-quality advertising products and signage solutions for all your business needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                View Catalog
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Product Range
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From signage to promotional materials, we offer comprehensive advertising products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-2">{product.title}</h3>
                </div>
              </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={product.link}
                    className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Need Custom Products?
            </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We can create custom advertising products tailored to your specific requirements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              Get Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Products
