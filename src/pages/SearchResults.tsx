import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SearchFilters from "@/components/SearchFilters";
import SearchResultCard from "@/components/SearchResultCard";
import FavoritesList from "@/components/FavoritesList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Filter,
  Search,
  Calendar,
  Users,
  ChevronDown,
  Heart,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SkeletonLoader from "@/components/SkeletonLoader";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import ScrollReveal from "@/components/ScrollReveal";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SearchFilters as SearchFiltersType } from "@/types/search";
import { defaultFilters } from "@/types/search";
import { format, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sortBy, setSortBy] = useState("best-match");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFiltersType>(defaultFilters);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Search bar states
  const [destination, setDestination] = useState("Ho Chi Minh City");
  const [checkInDate, setCheckInDate] = useState<Date>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(new Date(), 1));
  const [guests, setGuests] = useState({ adults: 2, rooms: 1 });

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Sync sortBy with URL
  useEffect(() => {
    const urlSort = searchParams.get("sort");
    if (urlSort) {
      setSortBy(urlSort);
    }
  }, [searchParams]);

  // Update URL when sort changes
  useEffect(() => {
    if (sortBy !== "best-match") {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("sort", sortBy);
        return newParams;
      });
    } else {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete("sort");
        return newParams;
      });
    }
  }, [sortBy, setSearchParams]);

  const getDayName = (date: Date) => {
    return format(date, "EEEE", { locale: vi });
  };

  const mockResults = [
    {
      id: 1,
      image: hotel1,
      images: [hotel1, hotel2, hotel3],
      name: "Vilion Central Hotel",
      location: "District 1, Ho Chi Minh City - City center",
      distance: "2.3 km from Saigon Railway Station • 353 m from Ben Thanh Market",
      rating: 6.9,
      reviewCount: "2,560",
      reviewLabel: "Good",
      oldPrice: "4.487.011",
      newPrice: "1.291.984",
      discount: "-71%",
      badge: "Newly renovated",
      limitedText: "ONLY 3 LEFT",
      features: ["Agoda Preferred"],
      perks: ["Book without a credit card", "+ FREE CANCELLATION"],
      priceNote: "Per night before taxes and fees",
      starRating: 3,
      locationScore: 8.1,
      couponApplied: "₫ 34890 applied",
    },
    {
      id: 2,
      image: hotel2,
      images: [hotel2, hotel1, hotel3],
      name: "New Star Inn Boutique",
      location: "District 3, Ho Chi Minh City - 32 m to center",
      distance: "1.7 km from Saigon Railway Station • 572 m from War Remnants Museum",
      rating: 7.4,
      reviewCount: "811",
      reviewLabel: "Very good",
      oldPrice: "",
      newPrice: "546.708",
      discount: "",
      limitedText: "ONLY 1 LEFT",
      features: ["Agoda Preferred"],
      perks: ["Book without a credit card"],
      priceNote: "Per night before taxes and fees",
      starRating: 2,
      locationScore: 8.1,
      bookedToday: "Booked 13 times today",
    },
    {
      id: 3,
      image: hotel3,
      images: [hotel3, hotel1, hotel2],
      name: "Anh Duy Hotel",
      location: "District 1, Ho Chi Minh City - City center",
      distance: "3.2 km from Saigon Railway Station • 303 m from Bitexco Financial Tower",
      rating: 7.2,
      reviewCount: "1,230",
      reviewLabel: "Very good",
      oldPrice: "890.000",
      newPrice: "650.000",
      discount: "-27%",
      features: ["Agoda Preferred"],
      perks: ["Free cancellation", "Pay at the hotel"],
      priceNote: "Per night before taxes and fees",
      starRating: 2,
      locationScore: 7.8,
    },
    {
      id: 4,
      image: hotel1,
      images: [hotel1, hotel3],
      name: "Liberty Central Saigon",
      location: "District 1, Ho Chi Minh City - City center",
      distance: "500 m from Ben Thanh Market • 1.2 km from Opera House",
      rating: 8.5,
      reviewCount: "3,420",
      reviewLabel: "Excellent",
      oldPrice: "2.500.000",
      newPrice: "1.750.000",
      discount: "-30%",
      badge: "Best Seller",
      features: ["Agoda Preferred"],
      perks: ["Free cancellation", "Breakfast included"],
      priceNote: "Per night before taxes and fees",
      starRating: 4,
      locationScore: 9.0,
    },
    {
      id: 5,
      image: hotel2,
      images: [hotel2, hotel3],
      name: "Rex Hotel Saigon",
      location: "District 1, Ho Chi Minh City - City center",
      distance: "200 m from Nguyen Hue Walking Street • 800 m from Notre Dame Cathedral",
      rating: 8.8,
      reviewCount: "5,120",
      reviewLabel: "Excellent",
      oldPrice: "3.200.000",
      newPrice: "2.400.000",
      discount: "-25%",
      badge: "Top Rated",
      features: ["Agoda Preferred"],
      perks: ["Free cancellation", "Pool access", "Spa included"],
      priceNote: "Per night before taxes and fees",
      starRating: 5,
      locationScore: 9.5,
    },
    {
      id: 6,
      image: hotel3,
      images: [hotel3, hotel1],
      name: "Silverland Yen Hotel",
      location: "District 1, Ho Chi Minh City - City center",
      distance: "1.5 km from Saigon Railway Station • 400 m from Ben Thanh Market",
      rating: 7.8,
      reviewCount: "1,890",
      reviewLabel: "Very good",
      oldPrice: "1.200.000",
      newPrice: "890.000",
      discount: "-26%",
      features: ["Agoda Preferred"],
      perks: ["Book without a credit card", "Free cancellation"],
      priceNote: "Per night before taxes and fees",
      starRating: 3,
      locationScore: 8.3,
      bookedToday: "Booked 8 times today",
    },
  ];

  const TOTAL_RESULTS = 8157;

  const sortOptions = [
    { key: "best-match", label: "Best match" },
    { key: "top-reviewed", label: "Top reviewed" },
    { key: "lowest-price", label: "Lowest price first" },
    { key: "distance", label: "Distance" },
    { key: "hot-deals", label: "Hot Deals!" },
  ];

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let results = [...mockResults];

    // Apply budget filter
    results = results.filter((hotel) => {
      const price = parseInt(hotel.newPrice.replace(/\./g, ""));
      return price >= filters.budget[0] && price <= filters.budget[1];
    });

    // Apply rating filter
    if (filters.reviewScore.length > 0) {
      const minRatings = filters.reviewScore.map((score) => {
        if (score.includes("9+")) return 9;
        if (score.includes("8+")) return 8;
        if (score.includes("7+")) return 7;
        if (score.includes("6+")) return 6;
        return 0;
      });
      const minRating = Math.max(...minRatings);
      results = results.filter((hotel) => hotel.rating >= minRating);
    }

    // Sort results
    switch (sortBy) {
      case "top-reviewed":
        return results.sort((a, b) => b.rating - a.rating);
      case "lowest-price":
        return results.sort((a, b) => {
          const priceA = parseInt(a.newPrice.replace(/\./g, ""));
          const priceB = parseInt(b.newPrice.replace(/\./g, ""));
          return priceA - priceB;
        });
      case "distance":
        return results.sort((a, b) => a.name.localeCompare(b.name));
      case "hot-deals":
        return results.sort((a, b) => {
          const discountA = parseInt(a.discount.replace(/[^0-9]/g, "") || "0");
          const discountB = parseInt(b.discount.replace(/[^0-9]/g, "") || "0");
          return discountB - discountA;
        });
      default:
        return results;
    }
  }, [sortBy, filters]);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-50 bg-primary shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 bg-card rounded-md overflow-hidden">
            {/* Location Input */}
            <div className="flex-[2] relative border-r border-border">
              <div className="relative px-3 py-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination or hotel"
                  className="pl-7 h-10 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <span className="text-xs text-primary">8,157 choices</span>
              </div>
            </div>

            {/* Check-in Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 h-14 justify-start px-4 text-left font-normal hover:bg-muted/50 rounded-none border-r border-border"
                >
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">
                      {format(checkInDate, "d MMM yyyy", { locale: vi })}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {getDayName(checkInDate)}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkInDate}
                  onSelect={(date) => date && setCheckInDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {/* Check-out Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 h-14 justify-start px-4 text-left font-normal hover:bg-muted/50 rounded-none border-r border-border"
                >
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">
                      {format(checkOutDate, "d MMM yyyy", { locale: vi })}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {getDayName(checkOutDate)}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkOutDate}
                  onSelect={(date) => date && setCheckOutDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {/* Guests */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 h-14 justify-between px-4 text-left font-normal hover:bg-muted/50 rounded-none border-r border-border"
                >
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-foreground">
                        {guests.adults} adults
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {guests.rooms} room
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 bg-popover" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Adults</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setGuests(g => ({ ...g, adults: Math.max(1, g.adults - 1) }))}
                      >
                        -
                      </Button>
                      <span className="w-6 text-center">{guests.adults}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setGuests(g => ({ ...g, adults: Math.min(10, g.adults + 1) }))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rooms</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setGuests(g => ({ ...g, rooms: Math.max(1, g.rooms - 1) }))}
                      >
                        -
                      </Button>
                      <span className="w-6 text-center">{guests.rooms}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setGuests(g => ({ ...g, rooms: Math.min(5, g.rooms + 1) }))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Search Button */}
            <Button
              className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-none"
            >
              SEARCH
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop only */}
          {!isMobile && (
            <aside className="w-72 flex-shrink-0 hidden lg:block">
              <div className="sticky top-28">
                <SearchFilters filters={filters} onFiltersChange={setFilters} />
              </div>
            </aside>
          )}

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4">
              <h1 className="text-xl font-bold text-foreground">
                {destination}: {TOTAL_RESULTS.toLocaleString()} properties found
              </h1>
              <p className="text-sm text-muted-foreground">
                Prices shown are per night for 1 room, {guests.adults} adult{guests.adults > 1 ? 's' : ''}
              </p>
            </div>

            {/* Sort Tabs */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sort by</span>
                {sortOptions.map((option) => (
                  <Button
                    key={option.key}
                    variant={sortBy === option.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy(option.key)}
                    className={`whitespace-nowrap ${
                      sortBy === option.key 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-card hover:bg-muted"
                    } ${option.key === "hot-deals" ? "text-destructive border-destructive hover:bg-destructive/10" : ""}`}
                  >
                    {option.label}
                    {(option.key === "top-reviewed" || option.key === "distance") && (
                      <ChevronDown className="w-3 h-3 ml-1" />
                    )}
                  </Button>
                ))}
              </div>
              
              {/* Favorites Button */}
              <FavoritesList />
            </div>

            {/* Mobile Filter Button */}
            {isMobile && (
              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="mb-4">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>Search Filters</SheetTitle>
                  </SheetHeader>
                  <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
                    <SearchFilters filters={filters} onFiltersChange={setFilters} />
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Loading State */}
            {isLoading && (
              <SkeletonLoader type="search-card" count={3} />
            )}

            {/* Error State */}
            {error && (
              <ErrorState
                title="An error occurred"
                message={error}
                onRetry={() => {
                  setError(null);
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 1500);
                }}
              />
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredAndSortedResults.length === 0 && (
              <EmptyState
                title="No properties found"
                message="We couldn't find any properties matching your search criteria."
                onAction={() => setFilters(defaultFilters)}
              />
            )}

            {/* Results */}
            {!isLoading && !error && filteredAndSortedResults.length > 0 && (
              <>
                <div className="space-y-4">
                  {filteredAndSortedResults.slice(0, displayCount).map((result, index) => (
                    <ScrollReveal key={result.id} delay={index * 80}>
                      <SearchResultCard {...result} />
                    </ScrollReveal>
                  ))}
                </div>

                {/* Load More / Pagination */}
                {displayCount < filteredAndSortedResults.length && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Showing {Math.min(displayCount, filteredAndSortedResults.length)} of {filteredAndSortedResults.length} properties
                    </p>
                    <Button
                      variant="outline"
                      size="lg"
                      className="min-w-[200px]"
                      disabled={isLoadingMore}
                      onClick={() => {
                        setIsLoadingMore(true);
                        setTimeout(() => {
                          setDisplayCount((prev) => prev + 6);
                          setIsLoadingMore(false);
                        }, 800);
                      }}
                    >
                      {isLoadingMore ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Loading...
                        </>
                      ) : (
                        `Show more properties`
                      )}
                    </Button>
                  </div>
                )}

                {displayCount >= filteredAndSortedResults.length && filteredAndSortedResults.length > 0 && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Showing all {filteredAndSortedResults.length} properties
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
