import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
        <footer className="bg-gray-50 py-12 sm:py-16 rounded-t-2xl sm:rounded-t-3xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="text-center mb-6 sm:mb-8">
              <Link to="/" className="inline-flex items-center space-x-2 sm:space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                    <span className="text-white font-bold text-lg sm:text-xl">S</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Sakar Advertisement</span>
              </Link>
            </div>

            {/* Main Navigation */}
            <div className="text-center mb-6 sm:mb-8">
              <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 text-xs sm:text-sm md:text-base">
                  Home
                </Link>
                <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 text-xs sm:text-sm md:text-base">
                  Products
                </Link>
                <Link to="/services" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 text-xs sm:text-sm md:text-base">
                  Services & Advertising
                </Link>
                <Link to="/portfolio" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 text-xs sm:text-sm md:text-base">
                  Portfolio
                </Link>
                <Link to="/events" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 text-xs sm:text-sm md:text-base">
                  Events
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 text-xs sm:text-sm md:text-base">
                  Contact us
                </Link>
              </nav>
            </div>

            {/* Social Media Icons */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-12">
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="font-bold text-gray-700 hover:text-white text-sm sm:text-base">f</span>
              </a>

              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="text-gray-700 hover:text-white text-sm sm:text-base">📷</span>
              </a>

              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="text-gray-700 hover:text-white text-sm sm:text-base">🌐</span>
              </a>

              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="font-bold text-gray-700 hover:text-white text-sm sm:text-base">X</span>
              </a>

              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="text-gray-700 hover:text-white text-sm sm:text-base">▶️</span>
              </a>

              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="text-gray-700 hover:text-white text-sm sm:text-base">✉️</span>
              </a>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-gray-200 gap-4 sm:gap-0">
              {/* Copyright */}
              <div className="text-gray-600 text-xs sm:text-sm text-center sm:text-left">
                © 2025 Sakar Advertisement. All rights reserved.
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
                <a href="#" className="text-gray-600 hover:text-blue-600 text-xs sm:text-sm font-medium transition duration-200">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-xs sm:text-sm font-medium transition duration-200">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-xs sm:text-sm font-medium transition duration-200">
                  Cookies Settings
                </a>
              </div>
            </div>
      </div>
    </footer>
  )
}

export default Footer
