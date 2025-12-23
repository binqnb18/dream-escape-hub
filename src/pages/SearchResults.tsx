import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import SearchFilters from "@/components/SearchFilters";
import SearchResultCard from "@/components/SearchResultCard";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  CalendarRange,
  Filter,
  Heart,
  MapPinned,
  Users2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SkeletonLoader from "@/components/SkeletonLoader";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import ScrollReveal from "@/components/ScrollReveal";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SearchFilters as SearchFiltersType } from "@/types/search";
import { defaultFilters } from "@/types/search";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [sortBy, setSortBy] = useState("best-match");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFiltersType>(defaultFilters);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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

  const mockResults = [
    {
      id: 1,
      image: hotel1,
      name: "Riverside Saigon Hotel",
      location: "Quận 1, TP.HCM – Gần phố đi bộ Nguyễn Huệ",
      distance: "Trung tâm · 300 m đến bến Bạch Đằng",
      rating: 8.1,
      reviewCount: "1,248",
      reviewLabel: "Tuyệt vời",
      oldPrice: "2.300.000",
      newPrice: "1.350.000",
      discount: "-41%",
      badge: "Deal hôm nay",
      features: ["VBOOKING Preferred"],
      perks: ["Bao gồm bữa sáng", "Miễn phí hủy", "Không cần trả trước"],
      priceNote: "Đã bao gồm thuế & phí",
      starRating: 5,
      roomType: "Phòng Deluxe Twin - 2 giường đơn",
      nights: 2,
      amenities: ["Free WiFi", "Hồ bơi", "Bãi đậu xe", "Bữa sáng"],
    },
    {
      id: 2,
      image: hotel2,
      name: "Old Quarter Boutique",
      location: "Phố cổ, Hà Nội – Gần Hồ Hoàn Kiếm",
      distance: "Trung tâm · 400 m đến hồ",
      rating: 6.8,
      reviewCount: "896",
      reviewLabel: "Tốt",
      oldPrice: "1.500.000",
      newPrice: "890.000",
      discount: "-41%",
      badge: "Chỉ còn 1 phòng",
      limitedText: "Sắp hết phòng!",
      features: ["VBOOKING Preferred", "Đặt không cần thẻ"],
      perks: ["Giữ phòng, thanh toán sau", "Tự check-in"],
      priceNote: "Giá mỗi đêm, chưa gồm thuế & phí",
      starRating: 3,
      roomType: "Phòng Standard - 1 giường đôi",
      nights: 1,
      amenities: ["Free WiFi", "Điều hòa"],
    },
    {
      id: 3,
      image: hotel3,
      name: "Sunrise Beach Resort",
      location: "Bãi biển Mỹ Khê, Đà Nẵng",
      distance: "Gần biển · 200 m đến bãi tắm",
      rating: 8.8,
      reviewCount: "542",
      reviewLabel: "Tuyệt vời",
      oldPrice: "2.800.000",
      newPrice: "1.690.000",
      discount: "-40%",
      badge: "Đánh giá cao",
      features: ["Free WiFi", "Hồ bơi", "Resort"],
      perks: ["Hoàn hủy miễn phí trước 24h check-in"],
      priceNote: "Đã bao gồm thuế & phí",
      starRating: 4,
      roomType: "Phòng Superior Sea View - View biển",
      nights: 2,
      amenities: ["Free WiFi", "Hồ bơi", "Spa", "Nhà hàng"],
    },
  ];

  const quickFilters = useMemo(
    () => [
      "Miễn phí hủy",
      "Thanh toán tại khách sạn",
      "Bao gồm bữa sáng",
      "5 sao",
      "Phù hợp gia đình",
      "Deal hôm nay",
      "Gần biển",
    ],
    [],
  );

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let results = [...mockResults];

    // Apply text search filter
    if (filters.textSearch.trim()) {
      const searchLower = filters.textSearch.toLowerCase();
      results = results.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchLower) ||
          hotel.location.toLowerCase().includes(searchLower)
      );
    }

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
          const discountA = parseInt(a.discount.replace(/[^0-9]/g, ""));
          const discountB = parseInt(b.discount.replace(/[^0-9]/g, ""));
          return discountB - discountA;
        });
      default:
        return results;
    }
  }, [sortBy, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Search summary */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">
                  TP.HCM • 1.248 chỗ nghỉ
                </h1>
                <p className="text-sm text-muted-foreground">Cập nhật cách đây vài giây</p>
              </div>
              <div className="flex items-center gap-2">
                {isMobile ? (
                  <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Bộ lọc
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] p-0">
                      <SheetHeader className="p-4 border-b">
                        <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                      </SheetHeader>
                      <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
                        <SearchFilters filters={filters} onFiltersChange={setFilters} />
                      </div>
                    </SheetContent>
                  </Sheet>
                ) : (
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Tất cả bộ lọc
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <MapPinned className="w-4 h-4 mr-2" />
                  Xem bản đồ
                </Button>
              </div>
            </div>

            {/* Search criteria display */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-lg border">
              <div className="flex items-center gap-2 pr-3 border-r border-border">
                <MapPinned className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Điểm đến</p>
                  <p className="font-medium text-foreground">TP.HCM</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pr-3 border-r border-border">
                <CalendarRange className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Ngày</p>
                  <p className="font-medium text-foreground">Thứ 6, 26/07 - Chủ nhật, 28/07</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pr-3 border-r border-border">
                <Users2 className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Khách</p>
                  <p className="font-medium text-foreground">2 người lớn · 1 phòng</p>
                </div>
              </div>
              <Button size="sm" className="ml-auto">Cập nhật tìm kiếm</Button>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((item) => (
                <Badge
                  key={item}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-6">
            {/* Filters Sidebar - Desktop only */}
            {!isMobile && (
              <aside className="w-72 flex-shrink-0 hidden lg:block">
                <div className="sticky top-24">
                  <SearchFilters filters={filters} onFiltersChange={setFilters} />
                </div>
              </aside>
            )}

            {/* Results Section */}
            <div className="flex-1">
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-foreground">Kết quả tìm kiếm</h2>
                    <p className="text-sm text-muted-foreground">
                      Hiển thị {filteredAndSortedResults.length} chỗ nghỉ phù hợp
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="best-match">Phù hợp nhất</SelectItem>
                        <SelectItem value="top-reviewed">Đánh giá cao</SelectItem>
                        <SelectItem value="lowest-price">Giá thấp nhất</SelectItem>
                        <SelectItem value="distance">Gần trung tâm</SelectItem>
                        <SelectItem value="hot-deals">Deal hot</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <SkeletonLoader key={i} type="card" />
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
                <ErrorState
                  title="Đã xảy ra lỗi"
                  message={error}
                  onRetry={() => {
                    setError(null);
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 1000);
                  }}
                />
              )}

              {/* Empty State */}
              {!isLoading && !error && filteredAndSortedResults.length === 0 && (
                <EmptyState
                  title="Không tìm thấy chỗ nghỉ"
                  message="Hãy thử điều chỉnh bộ lọc hoặc thay đổi tiêu chí tìm kiếm."
                  onAction={() => setFilters(defaultFilters)}
                />
              )}

              {/* Results */}
              {!isLoading && !error && filteredAndSortedResults.length > 0 && (
                <div className="space-y-4">
                  {filteredAndSortedResults.map((result, index) => (
                    <ScrollReveal key={result.id} delay={index * 100}>
                      <SearchResultCard {...result} />
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
