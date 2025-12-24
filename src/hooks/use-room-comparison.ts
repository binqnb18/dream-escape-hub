import { useState, useEffect, useCallback } from "react";

export interface ComparisonRoom {
  id: string;
  hotelId: string;
  hotelName: string;
  roomName: string;
  price: number;
  originalPrice?: number;
  size: number;
  maxGuests: number;
  bedType: string;
  view?: string;
  amenities: string[];
  features: {
    freeCancellation: boolean;
    noPrepayment: boolean;
    breakfast: boolean;
  };
  image?: string;
}

const STORAGE_KEY = "room-comparison";
const MAX_ROOMS = 4;

export const useRoomComparison = () => {
  const [rooms, setRooms] = useState<ComparisonRoom[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRooms(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage when rooms change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  }, [rooms]);

  const addRoom = useCallback((room: ComparisonRoom) => {
    setRooms((prev) => {
      // Check if room already exists
      const exists = prev.some(
        (r) => r.id === room.id && r.hotelId === room.hotelId
      );
      if (exists) return prev;

      // Check max limit
      if (prev.length >= MAX_ROOMS) {
        return prev;
      }

      return [...prev, room];
    });
  }, []);

  const removeRoom = useCallback((roomId: string, hotelId: string) => {
    setRooms((prev) =>
      prev.filter((r) => !(r.id === roomId && r.hotelId === hotelId))
    );
  }, []);

  const clearAll = useCallback(() => {
    setRooms([]);
  }, []);

  const isInComparison = useCallback(
    (roomId: string, hotelId: string) => {
      return rooms.some((r) => r.id === roomId && r.hotelId === hotelId);
    },
    [rooms]
  );

  const canAddMore = rooms.length < MAX_ROOMS;

  return {
    rooms,
    addRoom,
    removeRoom,
    clearAll,
    isInComparison,
    canAddMore,
    maxRooms: MAX_ROOMS,
  };
};
