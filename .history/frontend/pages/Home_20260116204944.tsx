import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { HotelCard } from '../components/HotelCard';
import { HotelSkeleton } from '../components/HotelSkeleton';
import { api } from '../services/api';
import { Hotel, SearchParams } from '../types';
import { SlidersHorizontal } from 'lucide-react';

export const Home: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentParams, setCurrentParams] = useState<SearchParams>({ 
    location: '', checkIn: '', checkOut: '', guests: 2 
  });

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setCurrentParams(params);
    try {
      const response = await api.searchHotels(params);
      if (response.success) {
        setHotels(response.data);
      } else {
        setHotels([]); // Clear on failure or empty
      }
    } catch (err) {
      console.error(err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Hero onSearch={handleSearch} />
      
      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white/50 backdrop-blur-xl rounded-t-3xl border border-white/50 p-8 min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">
                {loading ? 'Searching...' : `Found ${hotels.length} Properties`}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Highest rated properties based on confidence score.
              </p>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <HotelSkeleton key={i} />)
            ) : hotels.length > 0 ? (
              hotels.map(hotel => (
                <HotelCard 
                  key={hotel.id || Math.random()} 
                  hotel={hotel} 
                  searchCheckIn={currentParams.checkIn}
                  searchCheckOut={currentParams.checkOut}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-slate-400">
                <p>No hotels found. Try searching for a location.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};