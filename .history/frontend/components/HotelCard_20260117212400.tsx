import React, { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import { Hotel } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { BookingModal } from './BookingModal';

interface HotelCardProps {
  hotel: Hotel;
  searchCheckIn?: string;
  searchCheckOut?: string;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, searchCheckIn, searchCheckOut }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-64 overflow-hidden">
          <img 
            src={hotel.imageUrl} 
            alt={hotel.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 right-4">
            <ConfidenceBadge score={hotel.confidence?.confidenceScore ?? hotel.confidenceScore ?? 0} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-serif font-semibold text-slate-900 line-clamp-1">{hotel.name}</h3>
            <div className="flex items-center text-amber-400 gap-1 text-xs">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-slate-600 font-medium">4.8</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{hotel.location}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {hotel.amenities && hotel.amenities.slice(0, 3).map((am) => (
              <span key={am} className="text-[10px] uppercase tracking-wider font-medium px-2 py-1 bg-slate-50 text-slate-500 rounded-md">
                {am}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div>
              <span className="text-2xl font-bold text-slate-900">${hotel.pricePerNight}</span>
              <span className="text-xs text-slate-500 ml-1">/ night</span>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors"
            >
              View & Book
            </button>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        hotel={hotel}
        initialCheckIn={searchCheckIn || ''}
        initialCheckOut={searchCheckOut || ''}
      />
    </>
  );
};