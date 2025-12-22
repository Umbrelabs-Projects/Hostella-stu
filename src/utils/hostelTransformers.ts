// Hostel transformation utilities to convert backend format to frontend format

export interface BackendHostelImage {
  id: string;
  url: string;
  hostelId: string;
}

export interface BackendHostel {
  id: string;
  name: string;
  location: string | null;
  campus: string | null;
  description: string | null;
  facilities: string[];
  images: BackendHostelImage[];
  rooms?: Array<{
    id: string;
    price: number;
    status: string;
  }>;
  totalRooms?: number;
  createdAt: string;
}

// FrontendHostel matches the Hostel type from @/types/api
import { Hostel } from '@/types/api';
export type FrontendHostel = Hostel;

/**
 * Transform backend hostel to frontend format
 */
export function transformHostel(backendHostel: BackendHostel): FrontendHostel {
  // Extract image URLs
  const imageUrls = backendHostel.images?.map(img => img.url) || [];
  const image = imageUrls[0] || null;
  const images = imageUrls;

  // Calculate available rooms
  const availableRooms = backendHostel.rooms?.filter(
    room => room.status === 'AVAILABLE' || room.status === 'PARTIALLY_AVAILABLE'
  ).length || 0;

  // Calculate price range
  const prices = backendHostel.rooms?.map(room => room.price).filter(p => p > 0) || [];
  const priceRange = prices.length > 0
    ? { min: Math.min(...prices), max: Math.max(...prices) }
    : { min: 0, max: 0 };

  // Calculate rating (default to 0 - can be enhanced with testimonials API)
  const rating = 0;

  return {
    id: backendHostel.id,
    name: backendHostel.name,
    location: backendHostel.location,
    campus: backendHostel.campus,
    rating,
    description: backendHostel.description || '',
    image,
    images,
    amenities: backendHostel.facilities || [], // Map facilities to amenities
    priceRange,
    availableRooms,
    totalRooms: backendHostel.totalRooms || backendHostel.rooms?.length || 0,
    createdAt: backendHostel.createdAt,
  };
}

/**
 * Transform list hostels response
 */
export function transformListHostelsResponse(backendResponse: {
  success: boolean;
  data: {
    hostels: BackendHostel[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}) {
  return {
    success: backendResponse.success,
    data: backendResponse.data.hostels.map(transformHostel),
    pagination: {
      page: backendResponse.data.pagination.page,
      limit: backendResponse.data.pagination.limit,
      total: backendResponse.data.pagination.total,
      totalPages: backendResponse.data.pagination.pages,
    },
  };
}

/**
 * Check if response needs transformation (has nested structure)
 */
export function needsTransformation(response: unknown): response is {
  success: boolean;
  data: {
    hostels: BackendHostel[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
} {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    typeof (response as { data: unknown }).data === 'object' &&
    (response as { data: { hostels?: unknown } }).data !== null &&
    'hostels' in (response as { data: { hostels?: unknown } }).data
  );
}

/**
 * Transform single hostel response
 */
export function transformHostelResponse(backendResponse: {
  success: boolean;
  data: {
    hostel: BackendHostel;
  };
}) {
  return {
    success: backendResponse.success,
    data: transformHostel(backendResponse.data.hostel),
  };
}
