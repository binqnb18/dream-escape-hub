export interface SearchFilters {
  budget: [number, number];
  textSearch: string;
  popularFilters: string[];
  reviewScore: string[];
  starRating: string[];
  propertyType: string[];
  neighborhood: string[];
  paymentOptions: string[];
  propertyFacilities: string[];
  roomAmenities: string[];
}

export interface SearchParams {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
}

export const defaultFilters: SearchFilters = {
  budget: [0, 4000000],
  textSearch: "",
  popularFilters: [],
  reviewScore: [],
  starRating: [],
  propertyType: [],
  neighborhood: [],
  paymentOptions: [],
  propertyFacilities: [],
  roomAmenities: [],
};
