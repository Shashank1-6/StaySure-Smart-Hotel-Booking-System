import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Check, AlertCircle } from 'lucide-react';
import { Hotel, RoomType } from '../types';
import { api } from '../services/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel;
  initialCheckIn: string;
  initialCheckOut: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, onClose, hotel, initialCheckIn, initialCheckOut 
}) => {
  const [step, setStep] = useState<'dates' | 'rooms' | 'confirm' | 'success'>('dates');
  const [dates, setDates] = useState({ checkIn: initialCheckIn, checkOut: initialCheckOut });
  const [availableRooms, setAvailableRooms] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [guestDetails, setGuestDetails] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    if (initialCheckIn && initialCheckOut) {
        setDates({ checkIn: initialCheckIn, checkOut: initialCheckOut });
    }
  }, [initialCheckIn, initialCheckOut]);

  if (!isOpen) return null;

  const checkAvailability = async () => {
    if (!dates.checkIn || !dates.checkOut) {
        setError("Please select dates");
        return;
    }
    setLoading(true);
    setError('');
    try {
      const hotelId = hotel.id || hotel._id;
      const res = await api.checkAvailability(hotelId, dates.checkIn, dates.checkOut);
      if (res.success && res.data.length > 0) {
        setAvailableRooms(res.data);
        setStep('rooms');
      } else {
        setError('No rooms available for these dates.');
      }
    } catch (e) {
      setError('Failed to load availability.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedRoom) return;
    setLoading(true);
    try {
      // Simple booking payload
      const hotelId = hotel.id || hotel._id;

      const payload = {
        hotelId: hotelId,
        roomTypeId: selectedRoom.id||selectedRoom._id,
        checkInDate: dates.checkIn,
        checkOutDate: dates.checkOut,
        userId: "507f1f77bcf86cd799439001", 
      };
      
      const res = await api.createBooking(payload);
      if (res.success) {
        // Assuming backend returns created booking object with an ID
        setBookingId(res.data.id || res.data._id || 'confirmed'); 
        setStep('success');
      } else {
        setError('Booking failed. Please try again.');
      }
    } catch (e) {
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-900">{hotel.name}</h3>
            <p className="text-sm text-slate-500">Book your stay</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4"/> {error}
            </div>
          )}

          {step === 'dates' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Check-in</label>
                  <input 
                    type="date" 
                    className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    value={dates.checkIn}
                    onChange={(e) => setDates({...dates, checkIn: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Check-out</label>
                  <input 
                    type="date" 
                    className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    value={dates.checkOut}
                    onChange={(e) => setDates({...dates, checkOut: e.target.value})}
                  />
                </div>
              </div>
              <button 
                onClick={checkAvailability}
                disabled={loading}
                className="w-full py-3 bg-emerald-900 text-white font-medium rounded-xl hover:bg-emerald-800 transition-colors disabled:opacity-70"
              >
                {loading ? 'Checking...' : 'Check Availability'}
              </button>
            </div>
          )}

          {step === 'rooms' && (
            <div className="space-y-4">
               <h4 className="font-medium text-slate-900">Select a Room</h4>
               <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                 {availableRooms.map(room => {
                   const roomId = (room as { _id?: string })._id || room.id;
                   const isSelected = selectedRoom && ((selectedRoom as { _id?: string })._id || selectedRoom.id) === roomId;
                   return (
                   <div 
                    key={roomId || room.name}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ease-out ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-900/10' 
                        : 'border-slate-200 bg-white hover:border-emerald-200'
                    }`}
                   >
                     <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-slate-900">{room.name}</p>
                        </div>
                        <p className="font-bold text-emerald-700">₹{room.price}</p>
                     </div>
                   </div>
                 );})}
               </div>
               <div className="flex gap-3">
                  <button onClick={() => setStep('dates')} className="px-4 py-3 text-slate-600 font-medium">Back</button>
                  <button 
                    onClick={() => selectedRoom && setStep('confirm')}
                    disabled={!selectedRoom}
                    className="flex-1 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-emerald-800 transition-colors disabled:opacity-50"
                  >
                    Continue
                  </button>
               </div>
            </div>
          )}

          {step === 'confirm' && (
             <div className="space-y-4">
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    <input 
                        type="text" 
                        className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none"
                        value={guestDetails.name}
                        onChange={e => setGuestDetails({...guestDetails, name: e.target.value})}
                        placeholder="John Doe"
                    />
                    <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                    <input 
                        type="email" 
                        className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none"
                        value={guestDetails.email}
                        onChange={e => setGuestDetails({...guestDetails, email: e.target.value})}
                        placeholder="john@example.com"
                    />
                </div>
                <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Room</span>
                        <span className="font-medium">{selectedRoom?.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Dates</span>
                        <span className="font-medium">{dates.checkIn} - {dates.checkOut}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-lg">
                        <span>Total</span>
                        <span>₹{selectedRoom?.price}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('rooms')} className="px-4 py-3 text-slate-600 font-medium">Back</button>
                  <button 
                    onClick={handleBooking}
                    disabled={loading || !guestDetails.name || !guestDetails.email}
                    className="flex-1 py-3 bg-emerald-900 text-white font-medium rounded-xl hover:bg-emerald-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </button>
               </div>
             </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                </div>
                <div>
                    <h4 className="text-xl font-bold text-slate-900">Booking Confirmed!</h4>
                    <p className="text-slate-500 mt-2">Your booking ID is <br/><span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-800 select-all">{bookingId}</span></p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-full py-3 bg-slate-900 text-white font-medium rounded-xl mt-4"
                >
                    Done
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};