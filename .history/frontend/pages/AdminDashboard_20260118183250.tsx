import React, { useState } from 'react';
import { PlusCircle, Upload, CheckCircle, AlertCircle, Building2, BedDouble } from 'lucide-react';
import { api } from '../services/api';
import { Hotel } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hotel' | 'room'>('hotel');
  
  // Hotel Form State
  const [hotelForm, setHotelForm] = useState({
    name: '',
    location: '',
    pricePerNight: '',
    imageUrl: '',
    description: ''
  });

  // Room Type Form State
  const [roomForm, setRoomForm] = useState({
    hotelId: '',
    name: '',
    price: '',
    capacity: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newHotel: Hotel = {
      id: '', 
      name: hotelForm.name,
      location: hotelForm.location,
      pricePerNight: Number(hotelForm.pricePerNight),
      imageUrl: hotelForm.imageUrl || 'https://picsum.photos/800/600',
      amenities: ['Wifi', 'Parking', 'Restaurant'],
      description: hotelForm.description
    };

    try {
      await api.addHotel(newHotel);
      setNotification({ type: 'success', message: 'Hotel published successfully!' });
      setHotelForm({ name: '', location: '', pricePerNight: '', imageUrl: '', description: '' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to publish hotel.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newRoomType = {
        hotelId: roomForm.hotelId,
        name: roomForm.name,
        price: Number(roomForm.price),
        capacity: Number(roomForm.capacity),
        description: roomForm.description
    };

    try {
        await api.addRoomType(newRoomType);
        setNotification({ type: 'success', message: 'Room Type added successfully!' });
        setRoomForm({ hotelId: '', name: '', price: '', capacity: '', description: '' });
    } catch (error) {
        setNotification({ type: 'error', message: 'Failed to add room type. Check Hotel ID.' });
    } finally {
        setIsSubmitting(false);
        setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-6 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Manage your property listings and inventory.</p>
        </div>

        {notification && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
            {notification.message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
            <button 
                onClick={() => setActiveTab('hotel')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'hotel' 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
            >
                <Building2 className="w-4 h-4" />
                Add Property
            </button>
            <button 
                onClick={() => setActiveTab('room')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'room' 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
            >
                <BedDouble className="w-4 h-4" />
                Add Room Type
            </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {activeTab === 'hotel' ? (
            <form onSubmit={handleHotelSubmit} className="p-8 space-y-6">
                <div className="pb-4 border-b border-slate-100 mb-6">
                    <h2 className="font-semibold text-xl text-slate-900">New Hotel Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Property Name</label>
                    <input
                    value={hotelForm.name}
                    onChange={e => setHotelForm({...hotelForm, name: e.target.value})}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="e.g. The Grand Budapest"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
                    <input
                    value={hotelForm.location}
                    onChange={e => setHotelForm({...hotelForm, location: e.target.value})}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="City, Country"
                    />
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price / Night</label>
                    <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400">$</span>
                    <input
                        type="number"
                        value={hotelForm.pricePerNight}
                        onChange={e => setHotelForm({...hotelForm, pricePerNight: e.target.value})}
                        required
                        className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        placeholder="0.00"
                    />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image URL</label>
                    <input
                        value={hotelForm.imageUrl}
                        onChange={e => setHotelForm({...hotelForm, imageUrl: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        placeholder="https://..."
                    />
                </div>
                </div>

                <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea
                    value={hotelForm.description}
                    onChange={e => setHotelForm({...hotelForm, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                    placeholder="Describe the property highlights..."
                />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-emerald-900 text-white font-medium rounded-xl hover:bg-emerald-800 transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
                >
                    {isSubmitting ? 'Publishing...' : (
                    <>
                        <PlusCircle className="w-5 h-5" />
                        Publish Property
                    </>
                    )}
                </button>
                </div>
            </form>
          ) : (
            <form onSubmit={handleRoomSubmit} className="p-8 space-y-6">
                <div className="pb-4 border-b border-slate-100 mb-6">
                    <h2 className="font-semibold text-xl text-slate-900">New Room Type</h2>
                    <p className="text-sm text-slate-500">Add a room configuration to an existing hotel.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hotel ID</label>
                    <input
                        value={roomForm.hotelId}
                        onChange={e => setRoomForm({...roomForm, hotelId: e.target.value})}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Paste Hotel ID here..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room Name</label>
                        <input
                            value={roomForm.name}
                            onChange={e => setRoomForm({...roomForm, name: e.target.value})}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            placeholder="e.g. Ocean View Suite"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity (Guests)</label>
                        <input
                            type="number"
                            value={roomForm.capacity}
                            onChange={e => setRoomForm({...roomForm, capacity: e.target.value})}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            placeholder="2"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price / Night</label>
                    <input
                        type="number"
                        value={roomForm.price}
                        onChange={e => setRoomForm({...roomForm, price: e.target.value})}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="150.00"
                    />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-emerald-900 text-white font-medium rounded-xl hover:bg-emerald-800 transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
                    >
                        {isSubmitting ? 'Saving...' : (
                        <>
                            <PlusCircle className="w-5 h-5" />
                            Add Room Type
                        </>
                        )}
                    </button>
                </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};