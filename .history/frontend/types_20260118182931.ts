export interface Hotel {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  pricePerNight: number;
  confidenceScore?: number; // 0-100 (legacy, kept for backward compatibility)
  confidence?: {
    confidenceScore: number;
    riskLabel: 'LOW' | 'MEDIUM' | 'HIGH';
    breakdown?: any;
  };
  amenities: string[];
  description?: string;
}

export interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  capacity: number;
  price: number;
  description?: string;
  availableCount?: number; // Optional, for availability response
}

export interface SearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface BookingRequest {
  hotelId: string;
  roomTypeId: string;
  checkInDate: string;
  checkOutDate: string;
  userId: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}