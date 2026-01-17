import React, { useState } from 'react';
import { Search, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const ManageBooking: React.FC = () => {
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;
    
    setLoading(true);
    try {
      await api.cancelBooking(bookingId);
      setNotification({ type: 'success', message: 'Booking cancelled successfully.' });
      setBookingId('');
    } catch (error) {
      setNotification({ type: 'error', message: 'Could not find or cancel booking. Check ID.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 px-6">
       <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-slate-900">Manage Booking</h1>
            <p className="text-slate-500 mt-2">Enter your booking ID to cancel your reservation.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-white">
            <form onSubmit={handleCancel} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Booking Reference</label>
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            value={bookingId}
                            onChange={(e) => setBookingId(e.target.value)}
                            placeholder="e.g. 64234..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        />
                    </div>
                </div>
                <button 
                    type="submit"
                    disabled={loading || !bookingId}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {loading ? 'Processing...' : (
                        <>
                            <XCircle className="w-5 h-5" />
                            Cancel Booking
                        </>
                    )}
                </button>
            </form>

            {notification && (
                <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${
                    notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
                }`}>
                    {notification.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
                    <p className="text-sm font-medium">{notification.message}</p>
                </div>
            )}
          </div>
       </div>
    </div>
  );
};