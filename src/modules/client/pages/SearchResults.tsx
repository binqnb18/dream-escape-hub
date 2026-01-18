import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/modules/client/components/layout/Header";
import SearchFilters from "@/modules/client/components/booking/SearchFilters";
import SearchResultCard from "@/modules/client/components/hotel/SearchResultCard";
import FavoritesList from "@/modules/client/components/hotel/FavoritesList";
import HotelComparisonBar from "@/modules/client/components/hotel/HotelComparisonBar";
import DestinationAutocomplete from "@/modules/client/components/booking/DestinationAutocomplete";
import { useHotelComparison, ComparisonHotel } from "@/hooks/use-hotel-comparison";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Calendar,
  Users,
  ChevronDown,
  Map,
  List,
  RotateCcw,
  Loader2,
  X,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
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
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Hotel comparison
  const { hotels: comparisonHotels, addHotel, removeHotel, clearAll, isInComparison, canAddMore, maxHotels } = useHotelComparison();
  
  // Search bar states
  const [destination, setDestination] = useState("Ho Chi Minh City");
  const [checkInDate, setCheckInDate] = useState<Date>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(new Date(), 1));
  const [guests, setGuests] = useState({ adults: 2, rooms: 1 });

  // Simulate initial loading - reduced time
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && displayCount < mockResults.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + 4, mockResults.length));
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [isLoadingMore, displayCount]);

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

  const sortOptions = [
    { key: "best-match", label: "Phù hợp nhất" },
    { key: "top-reviewed", label: "Đánh giá cao" },
    { key: "lowest-price", label: "Giá thấp nhất" },
    { key: "distance", label: "Khoảng cách" },
    { key: "hot-deals", label: "Hot Deals!" },
  ];

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.budget[0] > 0 || filters.budget[1] < 120000000) count++;
    count += filters.popularFilters.length;
    count += filters.reviewScore.length;
    count += filters.starRating.length;
    count += filters.propertyType.length;
    count += filters.paymentOptions.length;
    count += filters.propertyFacilities.length;
    count += filters.roomAmenities.length;
    return count;
  }, [filters]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    toast.success("Đã xóa tất cả bộ lọc");
  }, []);

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
      {/* Main Header */}
      <Header />

      {/* Sticky Search Bar */}
      <div className="sticky top-16 z-40 bg-primary shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 bg-card rounded-lg overflow-hidden shadow-sm">
            {/* Location Input with Autocomplete */}
            <div className="flex-[2] relative border-r border-border">
              <div className="px-1 py-1">
                <DestinationAutocomplete
                  value={destination}
                  onChange={setDestination}
                  onSelect={(s) => {
                    setDestination(s.name);
                    toast.success(`Đã chọn: ${s.name}`);
                  }}
                />
                <span className="text-xs text-primary ml-9">
                  {filteredAndSortedResults.length.toLocaleString()} chỗ ở
                </span>
              </div>
            </div>

            {/* Check-in Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 h-14 justify-start px-4 text-left font-normal hover:bg-muted/50 rounded-none border-r border-border hidden md:flex"
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
                  className="flex-1 h-14 justify-start px-4 text-left font-normal hover:bg-muted/50 rounded-none border-r border-border hidden md:flex"
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
                  className="flex-1 h-14 justify-between px-4 text-left font-normal hover:bg-muted/50 rounded-none border-r border-border hidden md:flex"
                >
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-foreground">
                        {guests.adults} người lớn
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {guests.rooms} phòng
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 bg-popover" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Người lớn</span>
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
                    <span className="text-sm font-medium">Phòng</span>
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
              className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-none rounded-r-lg"
              onClick={() => toast.success("Đang tìm kiếm...")}
            >
              TÌM KIẾM
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop only */}
          {!isMobile && (
            <aside className="w-72 flex-shrink-0 hidden lg:block">
              <div className="sticky top-44">
                {/* Filter Header with Reset */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground">Bộ lọc</h3>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetFilters}
                      className="text-primary hover:text-primary/80 gap-1.5 h-8"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Xóa tất cả ({activeFiltersCount})
                    </Button>
                  )}
                </div>
                <SearchFilters 
                  filters={filters} 
                  onFiltersChange={setFilters}
                />
              </div>
            </aside>
          )}

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {destination}: {filteredAndSortedResults.length} chỗ nghỉ
                </h1>
                <p className="text-sm text-muted-foreground">
                  Giá/đêm cho 1 phòng, {guests.adults} người lớn
                </p>
              </div>

              {/* View Toggle + Favorites */}
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 px-3 gap-1.5"
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden lg:inline">Danh sách</span>
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setViewMode("map");
                      toast.info("Chế độ bản đồ đang phát triển");
                    }}
                    className="h-8 px-3 gap-1.5"
                  >
                    <Map className="w-4 h-4" />
                    <span className="hidden lg:inline">Bản đồ</span>
                  </Button>
                </div>
                <FavoritesList />
              </div>
            </div>

            {/* Sort Tabs */}
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 flex-1">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sắp xếp:</span>
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
            </div>

            {/* Mobile Filter Button - Bottom Sheet Style */}
            {isMobile && (
              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mb-4 w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Bộ lọc
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl">
                  <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
                    <div className="flex items-center justify-between">
                      <SheetTitle>Bộ lọc</SheetTitle>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleResetFilters}
                          className="text-primary h-8"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                          Xóa tất cả
                        </Button>
                      )}
                    </div>
                  </SheetHeader>
                  <div className="p-4 overflow-y-auto h-[calc(85vh-140px)]">
                    <SearchFilters filters={filters} onFiltersChange={setFilters} />
                  </div>
                  <SheetFooter className="p-4 border-t sticky bottom-0 bg-background">
                    <Button 
                      className="w-full" 
                      onClick={() => setIsFiltersOpen(false)}
                    >
                      Xem {filteredAndSortedResults.length} kết quả
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            )}

            {/* Active Filters Tags */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.reviewScore.map((score) => (
                  <Badge 
                    key={score}
                    variant="secondary" 
                    className="gap-1.5 cursor-pointer hover:bg-destructive/10"
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        reviewScore: prev.reviewScore.filter(s => s !== score)
                      }));
                    }}
                  >
                    {score}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
                {filters.starRating.map((star) => (
                  <Badge 
                    key={star}
                    variant="secondary" 
                    className="gap-1.5 cursor-pointer hover:bg-destructive/10"
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        starRating: prev.starRating.filter(s => s !== star)
                      }));
                    }}
                  >
                    {star}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <SkeletonLoader type="search-card" count={3} />
            )}

            {/* Error State */}
            {error && (
              <ErrorState
                title="Đã xảy ra lỗi"
                message={error}
                onRetry={() => {
                  setError(null);
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 800);
                }}
              />
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredAndSortedResults.length === 0 && (
              <EmptyState
                title="Không tìm thấy chỗ nghỉ"
                message="Không có kết quả phù hợp với tiêu chí tìm kiếm của bạn."
                onAction={handleResetFilters}
              />
            )}

            {/* Results */}
            {!isLoading && !error && filteredAndSortedResults.length > 0 && (
              <>
                <div className="space-y-4 pb-32">
                  {filteredAndSortedResults.slice(0, displayCount).map((result, index) => {
                    const handleToggleComparison = () => {
                      if (isInComparison(result.id)) {
                        removeHotel(result.id);
                        toast.info("Đã xóa khỏi danh sách so sánh", {
                          description: result.name,
                        });
                      } else {
                        if (!canAddMore) {
                          toast.error("Đã đạt giới hạn so sánh", {
                            description: `Bạn chỉ có thể so sánh tối đa ${maxHotels} khách sạn`,
                          });
                          return;
                        }
                        const comparisonHotel: ComparisonHotel = {
                          id: result.id,
                          name: result.name,
                          image: result.image,
                          location: result.location,
                          rating: result.rating,
                          reviewLabel: result.reviewLabel,
                          reviewCount: result.reviewCount,
                          price: result.newPrice,
                          originalPrice: result.oldPrice,
                          discount: result.discount,
                          starRating: result.starRating || 3,
                          locationScore: result.locationScore,
                          features: result.features,
                          perks: result.perks,
                        };
                        addHotel(comparisonHotel);
                        toast.success("Đã thêm vào danh sách so sánh", {
                          description: result.name,
                        });
                      }
                    };

                    return (
                      <ScrollReveal key={result.id} delay={index * 50}>
                        <SearchResultCard 
                          {...result} 
                          isInComparison={isInComparison(result.id)}
                          onToggleComparison={handleToggleComparison}
                          canAddMore={canAddMore}
                        />
                      </ScrollReveal>
                    );
                  })}
                </div>

                {/* Infinite Scroll Trigger */}
                <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                  {isLoadingMore && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang tải thêm...</span>
                    </div>
                  )}
                </div>

                {/* End of Results */}
                {displayCount >= filteredAndSortedResults.length && (
                  <div className="text-center pb-32">
                    <p className="text-sm text-muted-foreground">
                      Hiển thị tất cả {filteredAndSortedResults.length} chỗ nghỉ
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Hotel Comparison Bar */}
      <HotelComparisonBar
        hotels={comparisonHotels}
        onRemove={removeHotel}
        onClearAll={clearAll}
        maxHotels={maxHotels}
      />
    </div>
  );
};

export default SearchResults;
