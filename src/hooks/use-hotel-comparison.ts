import { useState, useEffect, useCallback } from "react";

export interface ComparisonHotel {
  id: number;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewLabel: string;
  reviewCount: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  starRating: number;
  locationScore?: number;
  features?: string[];
  perks?: string[];
}

const STORAGE_KEY = "hotel-comparison";
const MAX_HOTELS = 4;

export const useHotelComparison = () => {
  const [hotels, setHotels] = useState<ComparisonHotel[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHotels(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage when hotels change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hotels));
  }, [hotels]);

  const addHotel = useCallback((hotel: ComparisonHotel) => {
    setHotels((prev) => {
      // Check if hotel already exists
      const exists = prev.some((h) => h.id === hotel.id);
      if (exists) return prev;

      // Check max limit
      if (prev.length >= MAX_HOTELS) {
        return prev;
      }

      return [...prev, hotel];
    });
  }, []);

  const removeHotel = useCallback((hotelId: number) => {
    setHotels((prev) => prev.filter((h) => h.id !== hotelId));
  }, []);

  const clearAll = useCallback(() => {
    setHotels([]);
  }, []);

  const isInComparison = useCallback(
    (hotelId: number) => {
      return hotels.some((h) => h.id === hotelId);
    },
    [hotels]
  );

  const canAddMore = hotels.length < MAX_HOTELS;

  return {
    hotels,
    addHotel,
    removeHotel,
    clearAll,
    isInComparison,
    canAddMore,
    maxHotels: MAX_HOTELS,
  };
};
