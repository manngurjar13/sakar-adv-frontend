import React from "react";

const NewspaperInsertion = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Same Structure & Colors */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="bg-white/20 text-white px-6 py-3 rounded-full text-lg font-semibold backdrop-blur-sm flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                Newspaper Insertion
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Direct-to-Home
              <span className="block text-orange-300">Pamphlet Marketing</span>
            </h1>
            <p className="text-blue-100 text-xl mb-10 leading-relaxed max-w-3xl mx-auto">
              Deliver your brand message directly into the hands of your target
              audience with strategic newspaper pamphlet insertions.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - Same Structure & Colors */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Pamphlet Insertion
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Services
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Highly targeted and cost-effective offline marketing to reach
              specific societies and residential blocks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Precise Targeting */}
            <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
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
                    d="M9 20l-5.447-2.724A2 2 0 013 15.482V6.518a2 2 0 011.553-1.943l7-1.4a2 2 0 011.894 0l7 1.4A2 2 0 0121 6.518v8.964a2 2 0 01-1.553 1.943L15 20m-6 0l6-3m-6 3v-7.5M15 20v-7.5m-3-9v7.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Hyper-Local Targeting
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Choose specific pin codes or even individual housing societies
                to distribute your promotional flyers.
              </p>
            </div>

            {/* High Tangibility */}
            <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
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
                    d="M7 7h10M7 11h10M7 15h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                High Tangibility
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Unlike digital ads, physical pamphlets stay in homes, increasing
                the chances of being read and saved.
              </p>
            </div>

            {/* Guaranteed Reach */}
            <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Direct-to-Household
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your advertisement is delivered along with the daily morning
                news, reaching people when they are most attentive.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewspaperInsertion;
