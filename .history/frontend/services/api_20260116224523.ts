import axios from 'axios';
import { Hotel, RoomType, ApiResponse, SearchParams, BookingRequest } from '../types';

const API_BASE_URL = 'http://localhost:5000';

// 1. Create a single Axios instance
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add Request Interceptor for Admin Authorization
client.interceptors.request.use((config) => {
  // Check if the request URL includes '/admin/'
  if (config.url && config.url.includes('/admin/')) {
    config.headers['x-role'] = 'ADMIN';
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper to standardise error responses to match our ApiResponse interface
const handleAxiosError = (error: any): ApiResponse<any> => {
  console.error("API Error:", error);
  const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
  return {
    success: false,
    data: [],
    message,
  };
};

export const api = {
  // GET: /search/hotels?location=${location}
  searchHotels: async (params: SearchParams): Promise<ApiResponse<Hotel[]>> => {
    try {
      if (!params.location) {
        return { success: true, data: [] };
      }

      // Axios handles query params via the `params` object
      const response = await client.get('/search/hotels', {
        params: {
          location: params.location,
          checkIn: params.checkIn || undefined,
          checkOut: params.checkOut || undefined,
          guests: params.guests || undefined,
        },
      });

      // Handle backend returning { data: [...] } or just [...]
      const data = response.data;
      const hotels = Array.isArray(data) ? data : (data.data || []);
      
      return { success: true, data: hotels };
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  // GET: /availability/rooms?hotelId=...
  checkAvailability: async (hotelId: string, checkIn: string, checkOut: string): Promise<ApiResponse<RoomType[]>> => {
    try {
      const response = await client.get('/availability/rooms', {
        params: {
          hotelId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
        },
      });

      const data = response.data;
      const rooms = Array.isArray(data) ? data : (data.data || []);
      
      return { success: true, data: rooms };
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  // POST: /bookings
  createBooking: async (booking: BookingRequest): Promise<ApiResponse<any>> => {
    try {
      const response = await client.post('/bookings', booking);
      return { success: true, data: response.data };
    } catch (error) {
      // Re-throw so the UI can handle specific loading/error states if needed, 
      // or simply return the formatted error. 
      // Based on previous code, we might want to throw to trigger the .catch in the UI component.
      throw new Error(error.response?.data?.message || 'Booking failed');
    }
  },

  // PATCH: /bookings/:bookingId/cancel
  cancelBooking: async (bookingId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await client.patch(`/bookings/${bookingId}/cancel`);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('Cancellation failed');
    }
  },

  // POST: /admin/hotels
  // Interceptor will automatically add x-role: ADMIN
  addHotel: async (hotel: Hotel): Promise<ApiResponse<Hotel>> => {
    try {
      const response = await client.post('/admin/hotels', hotel);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('Failed to add hotel');
    }
  },

  // POST: /admin/room-types
  // Interceptor will automatically add x-role: ADMIN
  addRoomType: async (roomType: Partial<RoomType>): Promise<ApiResponse<RoomType>> => {
    try {
      const response = await client.post('/admin/room-types', roomType);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('Failed to add room type');
    }
  }
};