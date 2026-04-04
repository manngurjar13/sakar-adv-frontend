import React from 'react'
import { getImageUrl } from '../utils/imageUtils'

const EventCard = ({ event, onClick }) => {
  if (event.special) {
    return (
      /* Special Card Design */
      <div 
        onClick={onClick}
        className="relative group cursor-pointer transform hover:scale-105 transition-all duration-500"
      >
        <div className="w-full h-96 bg-gradient-to-br from-blue-800 via-blue-900 to-purple-900 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          
          <div className="relative z-10">
            <div className={`bg-gradient-to-r ${event.color} text-white px-4 py-2 rounded-xl font-bold text-sm inline-block shadow-lg mb-4`}>
              {event.date}
            </div>
            <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-3">DUITS PRESENTS</h3>
          </div>
          
          <div className="relative z-10">
            <h4 className="text-white font-bold text-xl sm:text-2xl md:text-3xl mb-3">{event.title}</h4>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">{event.description}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    /* Regular Card Design */
    <div 
      onClick={onClick}
      className="relative group cursor-pointer transform hover:scale-105 transition-all duration-500"
    >
      <div 
        className="w-full h-96 bg-cover bg-center rounded-3xl shadow-2xl"
        style={{
          backgroundImage: `url('${getImageUrl(event.image)}')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-3xl"></div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className={`bg-gradient-to-r ${event.color} text-white px-4 py-2 rounded-xl font-bold text-sm inline-block mb-4 shadow-lg`}>
            {event.date}
          </div>
          <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-3 leading-tight">{event.title}</h3>
          <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3">{event.description}</p>
        </div>
      </div>
    </div>
  )
}

export default EventCard
