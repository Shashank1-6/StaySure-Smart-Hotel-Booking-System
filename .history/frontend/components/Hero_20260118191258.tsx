import React, { useState } from 'react';
import { Search, Calendar, MapPin, Users } from 'lucide-react';
import { SearchParams } from '../types';

interface HeroProps {
  onSearch: (params: SearchParams) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ location, checkIn, checkOut, guests });
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1549294413-26f195200c16?w=600&auto=format"
          alt="Luxury Hotel Interior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-lg">
          Find Your Next <br/> <span className="italic text-emerald-200">Extraordinary</span> Escape
        </h1>
        <p className="text-lg text-slate-200 mb-10 max-w-2xl drop-shadow-md">
          Curated collection of the world's most luxurious hotels, rated by our unique reliability AI.
        </p>

        {/* Glassmorphism Search Bar */}
        <form 
          onSubmit={handleSubmit}
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-2 md:p-3 rounded-3xl flex flex-col md:flex-row items-center gap-2 shadow-2xl"
        >
          {/* Location Input */}
          <div className="flex-1 w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-3 transition-colors focus-within:ring-2 focus-within:ring-emerald-500/20">
            <MapPin className="text-slate-400 w-5 h-5 flex-shrink-0" />
            <div className="flex flex-col w-full text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Location</label>
              <input 
                type="text" 
                placeholder="Where are you going?" 
                className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="w-px h-10 bg-white/20 hidden md:block"></div>

          {/* Dates Input */}
          <div className="flex-[1.5] w-full flex gap-2">
            <div className="flex-1 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 transition-colors focus-within:ring-2 focus-within:ring-emerald-500/20">
              <Calendar className="text-slate-400 w-5 h-5 flex-shrink-0" />
              <div className="flex flex-col w-full text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Check-in</label>
                <input 
                  type="date" 
                  className="w-full bg-transparent outline-none text-slate-900 text-sm font-medium p-0"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 transition-colors focus-within:ring-2 focus-within:ring-emerald-500/20">
              <Calendar className="text-slate-400 w-5 h-5 flex-shrink-0" />
              <div className="flex flex-col w-full text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Check-out</label>
                <input 
                  type="date" 
                  className="w-full bg-transparent outline-none text-slate-900 text-sm font-medium p-0"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="w-px h-10 bg-white/20 hidden md:block"></div>

          {/* Guests Input */}
          <div className="flex-0.5 min-w-[140px] w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-3 transition-colors focus-within:ring-2 focus-within:ring-emerald-500/20">
            <Users className="text-slate-400 w-5 h-5 flex-shrink-0" />
            <div className="flex flex-col w-full text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Guests</label>
              <input 
                type="number" 
                min="1" 
                max="10" 
                className="w-full bg-transparent outline-none text-slate-900 text-sm font-medium"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Search Button */}
          <button 
            type="submit"
            className="w-full md:w-auto bg-emerald-900 hover:bg-emerald-800 text-white p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-emerald-900/20 flex items-center justify-center gap-2 group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="md:hidden">Search Hotels</span>
          </button>
        </form>
      </div>
    </div>
  );
};