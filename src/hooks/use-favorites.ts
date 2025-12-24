import { useState, useEffect, useCallback } from "react";

export interface FavoriteHotel {
  id: number;
  name: string;
  image: string;
  location: string;
  rating: number;
  newPrice: string;
  starRating: number;
}

const FAVORITES_KEY = "vbooking_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteHotel[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((hotel: FavoriteHotel) => {
    setFavorites((prev) => {
      if (prev.some((h) => h.id === hotel.id)) return prev;
      return [...prev, hotel];
    });
  }, []);

  const removeFavorite = useCallback((hotelId: number) => {
    setFavorites((prev) => prev.filter((h) => h.id !== hotelId));
  }, []);

  const toggleFavorite = useCallback((hotel: FavoriteHotel) => {
    setFavorites((prev) => {
      if (prev.some((h) => h.id === hotel.id)) {
        return prev.filter((h) => h.id !== hotel.id);
      }
      return [...prev, hotel];
    });
  }, []);

  const isFavorite = useCallback(
    (hotelId: number) => favorites.some((h) => h.id === hotelId),
    [favorites]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    count: favorites.length,
  };
};
