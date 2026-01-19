import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Hero } from '../components/Hero';
import { HotelCard } from '../components/HotelCard';
import { HotelSkeleton } from '../components/HotelSkeleton';
import { api } from '../services/api';
import { Hotel, SearchParams } from '../types';
import { SlidersHorizontal } from 'lucide-react';

type SortBy = 'default' | 'price_asc' | 'price_desc' | 'confidence_desc' | 'confidence_asc';

type PriceRange = '' | '0-2000' | '2000-5000' | '5000-10000' | '10000-20000' | '20000+';

const PRICE_RANGES: { value: PriceRange; label: string }[] = [
  { value: '', label: 'Any' },
  { value: '0-2000', label: '₹0 – 2,000' },
  { value: '2000-5000', label: '₹2,000 – 5,000' },
  { value: '5000-10000', label: '₹5,000 – 10,000' },
  { value: '10000-20000', label: '₹10,000 – 20,000' },
  { value: '20000+', label: '₹20,000+' },
];

const getConfidence = (h: Hotel): number =>
  h.confidence?.confidenceScore ?? h.confidenceScore ?? 0;

const inPriceRange = (price: number, range: PriceRange): boolean => {
  if (!range) return true;
  switch (range) {
    case '0-2000': return price <= 2000;
    case '2000-5000': return price > 2000 && price <= 5000;
    case '5000-10000': return price > 5000 && price <= 10000;
    case '10000-20000': return price > 10000 && price <= 20000;
    case '20000+': return price > 20000;
    default: return true;
  }
};

export const Home: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentParams, setCurrentParams] = useState<SearchParams>({
    location: '', checkIn: '', checkOut: '', guests: 2
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('default');
  const [minConfidence, setMinConfidence] = useState('');
  const [priceRange, setPriceRange] = useState<PriceRange>('');
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setCurrentParams(params);
    try {
      const response = await api.searchHotels(params);
      if (response.success) {
        setHotels(response.data);
      } else {
        setHotels([]);
      }
    } catch (err) {
      console.error(err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedHotels = useMemo(() => {
    const minC = minConfidence === '' ? null : Number(minConfidence);

    let list = hotels.filter((h) => {
      const conf = getConfidence(h);
      if (minC != null && !Number.isNaN(minC) && conf < minC) return false;
      if (!inPriceRange(h.pricePerNight, priceRange)) return false;
      return true;
    });

    if (sortBy !== 'default') {
      list = [...list].sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return a.pricePerNight - b.pricePerNight;
          case 'price_desc':
            return b.pricePerNight - a.pricePerNight;
          case 'confidence_desc':
            return getConfidence(b) - getConfidence(a);
          case 'confidence_asc':
            return getConfidence(a) - getConfidence(b);
          default:
            return 0;
        }
      });
    }
    return list;
  }, [hotels, sortBy, minConfidence, priceRange]);

  const hasActiveFilters = sortBy !== 'default' || minConfidence !== '' || priceRange !== '';

  const resetFilters = () => {
    setSortBy('default');
    setMinConfidence('');
    setPriceRange('');
  };

  return (
    <div className="min-h-screen pb-20">
      <Hero onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white/50 backdrop-blur-xl rounded-t-3xl border border-white/50 p-8 min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">
                {loading ? 'Searching...' : `Found ${filteredAndSortedHotels.length} Properties`}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {hasActiveFilters ? 'Filtered by price and confidence.' : 'Highest rated properties based on confidence score.'}
              </p>
            </div>

            <div className="relative" ref={filtersRef}>
              <button
                type="button"
                onClick={() => setFiltersOpen((o) => !o)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  hasActiveFilters
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>

              {filtersOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-900">Filters</span>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sort by</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortBy)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                      >
                        <option value="default">Default</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="confidence_desc">Confidence: High to Low</option>
                        <option value="confidence_asc">Confidence: Low to High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Min. confidence (0–100)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Any"
                        value={minConfidence}
                        onChange={(e) => setMinConfidence(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Price range</label>
                      <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value as PriceRange)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                      >
                        {PRICE_RANGES.map((r) => (
                          <option key={r.value || 'any'} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <HotelSkeleton key={i} />)
            ) : filteredAndSortedHotels.length > 0 ? (
              filteredAndSortedHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id || (hotel as { _id?: string })._id || Math.random()}
                  hotel={hotel}
                  searchCheckIn={currentParams.checkIn}
                  searchCheckOut={currentParams.checkOut}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-slate-400">
                <p>
                  {hotels.length === 0
                    ? 'No hotels found. Try searching for a location.'
                    : 'No properties match your filters. Try loosening them.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};