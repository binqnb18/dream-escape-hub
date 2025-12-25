import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Users,
  Wifi,
  Wind,
  Tv,
  Bath,
  Coffee,
  Eye,
  Maximize2,
  Check,
  Plus,
  Minus,
  ArrowUpDown,
  Filter,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useRoomComparison, ComparisonRoom } from "@/hooks/use-room-comparison";
import hotelImage1 from "@/assets/hotel-1.jpg";
import hotelImage2 from "@/assets/hotel-2.jpg";
import hotelImage3 from "@/assets/hotel-3.jpg";

type SortOption = "default" | "price-asc" | "price-desc" | "size-asc" | "size-desc" | "guests-desc";

interface Filters {
  priceRange: [number, number];
  minSize: number;
  minGuests: number;
  freeCancellation: boolean;
  breakfast: boolean;
}

const defaultFilters: Filters = {
  priceRange: [0, 15000000],
  minSize: 0,
  minGuests: 1,
  freeCancellation: false,
  breakfast: false,
};

interface Room {
  id: string;
  name: string;
  size: number;
  maxGuests: number;
  bedType: string;
  amenities: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  features: {
    freeCancellation: boolean;
    noPrepayment: boolean;
    breakfast: boolean;
  };
  available: number;
  view?: string;
}

interface HotelRoomsProps {
  hotelId?: string;
  hotelName?: string;
}

const roomsData: Room[] = [
  {
    id: "1",
    name: "Phòng Deluxe Hướng Biển",
    size: 35,
    maxGuests: 2,
    bedType: "1 giường đôi lớn",
    amenities: ["WiFi miễn phí", "Điều hòa", "TV", "Phòng tắm riêng", "Minibar", "View biển"],
    price: 2500000,
    originalPrice: 4200000,
    discount: 40,
    features: {
      freeCancellation: true,
      noPrepayment: true,
      breakfast: true,
    },
    available: 5,
    view: "Hướng biển",
  },
  {
    id: "2",
    name: "Phòng Suite Gia Đình",
    size: 55,
    maxGuests: 4,
    bedType: "2 giường đôi",
    amenities: ["WiFi miễn phí", "Điều hòa", "TV", "Phòng tắm riêng", "Bếp nhỏ", "Phòng khách"],
    price: 4200000,
    originalPrice: 6500000,
    discount: 35,
    features: {
      freeCancellation: true,
      noPrepayment: false,
      breakfast: true,
    },
    available: 2,
    view: "Thành phố",
  },
  {
    id: "3",
    name: "Villa Hồ Bơi Riêng",
    size: 120,
    maxGuests: 6,
    bedType: "3 giường đôi",
    amenities: ["WiFi miễn phí", "Điều hòa", "TV", "Hồ bơi riêng", "Sân vườn", "Bếp đầy đủ"],
    price: 12000000,
    originalPrice: 18000000,
    discount: 33,
    features: {
      freeCancellation: false,
      noPrepayment: false,
      breakfast: true,
    },
    available: 1,
    view: "Hồ bơi & Vườn",
  },
];

const roomImages: Record<string, string> = {
  "1": hotelImage1,
  "2": hotelImage2,
  "3": hotelImage3,
};

const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá: Thấp → Cao" },
  { value: "price-desc", label: "Giá: Cao → Thấp" },
  { value: "size-asc", label: "Diện tích: Nhỏ → Lớn" },
  { value: "size-desc", label: "Diện tích: Lớn → Nhỏ" },
  { value: "guests-desc", label: "Số khách: Nhiều nhất" },
];

const HotelRooms = ({ hotelId = "1", hotelName = "Vinpearl Resort & Spa Nha Trang" }: HotelRoomsProps) => {
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const { addRoom, removeRoom, isInComparison, canAddMore } = useRoomComparison();

  const handleRoomSelect = (roomId: string, count: string) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomId]: parseInt(count),
    }));
  };

  const handleToggleComparison = (room: Room) => {
    if (isInComparison(room.id, hotelId)) {
      removeRoom(room.id, hotelId);
      toast({
        title: "Đã xóa khỏi so sánh",
        description: `${room.name} đã được xóa khỏi danh sách so sánh`,
      });
    } else {
      if (!canAddMore) {
        toast({
          title: "Giới hạn so sánh",
          description: "Bạn chỉ có thể so sánh tối đa 4 phòng",
          variant: "destructive",
        });
        return;
      }
      
      const comparisonRoom: ComparisonRoom = {
        id: room.id,
        hotelId,
        hotelName,
        roomName: room.name,
        price: room.price,
        originalPrice: room.originalPrice,
        size: room.size,
        maxGuests: room.maxGuests,
        bedType: room.bedType,
        view: room.view,
        amenities: room.amenities,
        features: room.features,
        image: roomImages[room.id],
      };
      
      addRoom(comparisonRoom);
      toast({
        title: "Đã thêm vào so sánh",
        description: `${room.name} đã được thêm vào danh sách so sánh`,
      });
    }
  };

  const filteredAndSortedRooms = useMemo(() => {
    let result = [...roomsData];

    // Apply filters
    result = result.filter((room) => {
      if (room.price < filters.priceRange[0] || room.price > filters.priceRange[1]) return false;
      if (room.size < filters.minSize) return false;
      if (room.maxGuests < filters.minGuests) return false;
      if (filters.freeCancellation && !room.features.freeCancellation) return false;
      if (filters.breakfast && !room.features.breakfast) return false;
      return true;
    });

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "size-asc":
        result.sort((a, b) => a.size - b.size);
        break;
      case "size-desc":
        result.sort((a, b) => b.size - a.size);
        break;
      case "guests-desc":
        result.sort((a, b) => b.maxGuests - a.maxGuests);
        break;
      default:
        break;
    }

    return result;
  }, [sortBy, filters]);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSortBy("default");
  };

  const hasActiveFilters = 
    filters.priceRange[0] !== defaultFilters.priceRange[0] ||
    filters.priceRange[1] !== defaultFilters.priceRange[1] ||
    filters.minSize !== defaultFilters.minSize ||
    filters.minGuests !== defaultFilters.minGuests ||
    filters.freeCancellation !== defaultFilters.freeCancellation ||
    filters.breakfast !== defaultFilters.breakfast;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Phòng nghỉ có sẵn</h2>
        <Badge variant="outline" className="text-primary border-primary">
          Đảm bảo giá tốt nhất
        </Badge>
      </div>

      {/* Date/Guest selector bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ngày:</span>
          <span className="font-medium">24/12 - 26/12/2024</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Khách:</span>
          <span className="font-medium">2 người lớn, 1 phòng</span>
        </div>
        <Button variant="outline" size="sm" className="ml-auto">
          Thay đổi
        </Button>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Bộ lọc
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              !
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa bộ lọc
          </Button>
        )}

        <div className="ml-auto text-sm text-muted-foreground">
          {filteredAndSortedRooms.length} phòng
        </div>
      </div>

      {/* Filters Panel */}
      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <CollapsibleContent>
          <div className="p-4 bg-muted/30 rounded-lg border space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Khoảng giá</label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                  max={15000000}
                  min={0}
                  step={500000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{filters.priceRange[0].toLocaleString("vi-VN")}₫</span>
                  <span>{filters.priceRange[1].toLocaleString("vi-VN")}₫</span>
                </div>
              </div>

              {/* Min Size */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Diện tích tối thiểu</label>
                <Select
                  value={filters.minSize.toString()}
                  onValueChange={(value) => setFilters({ ...filters, minSize: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Tất cả</SelectItem>
                    <SelectItem value="30">≥ 30 m²</SelectItem>
                    <SelectItem value="50">≥ 50 m²</SelectItem>
                    <SelectItem value="80">≥ 80 m²</SelectItem>
                    <SelectItem value="100">≥ 100 m²</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min Guests */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Số khách tối thiểu</label>
                <Select
                  value={filters.minGuests.toString()}
                  onValueChange={(value) => setFilters({ ...filters, minGuests: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+ người</SelectItem>
                    <SelectItem value="2">2+ người</SelectItem>
                    <SelectItem value="3">3+ người</SelectItem>
                    <SelectItem value="4">4+ người</SelectItem>
                    <SelectItem value="5">5+ người</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Tiện ích</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.freeCancellation}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, freeCancellation: checked as boolean })
                      }
                    />
                    <span className="text-sm">Hủy miễn phí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.breakfast}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, breakfast: checked as boolean })
                      }
                    />
                    <span className="text-sm">Bao gồm bữa sáng</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Rooms Table */}
      <div className="border rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-primary text-primary-foreground text-sm font-medium">
          <div className="col-span-4">Loại phòng</div>
          <div className="col-span-2 text-center">Số khách</div>
          <div className="col-span-2 text-center">Giá / đêm</div>
          <div className="col-span-2">Bao gồm</div>
          <div className="col-span-2 text-center">Chọn</div>
        </div>

        {/* No results */}
        {filteredAndSortedRooms.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Không tìm thấy phòng phù hợp với bộ lọc của bạn.</p>
            <Button variant="link" onClick={resetFilters} className="mt-2">
              Xóa bộ lọc
            </Button>
          </div>
        )}

        {/* Room Rows */}
        {filteredAndSortedRooms.map((room, index) => {
          const inComparison = isInComparison(room.id, hotelId);
          return (
            <div
              key={room.id}
              className={cn(
                "grid md:grid-cols-12 gap-4 p-4 border-b last:border-b-0",
                index % 2 === 1 && "bg-muted/20"
              )}
            >
              {/* Room Type */}
              <div className="md:col-span-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-primary hover:underline cursor-pointer">
                      {room.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{room.bedType}</p>
                  </div>
                  <Button
                    variant={inComparison ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleComparison(room)}
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      inComparison && "bg-primary"
                    )}
                  >
                    {inComparison ? (
                      <>
                        <Minus className="h-3 w-3" />
                        Đã thêm
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3" />
                        So sánh
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                    <Maximize2 className="h-3 w-3" /> {room.size} m²
                  </span>
                  <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                    <Wifi className="h-3 w-3" /> WiFi
                  </span>
                  <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                    <Wind className="h-3 w-3" /> Điều hòa
                  </span>
                  <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                    <Tv className="h-3 w-3" /> TV
                  </span>
                  <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                    <Bath className="h-3 w-3" /> Phòng tắm
                  </span>
                  <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                    <Eye className="h-3 w-3" /> View
                  </span>
                </div>

                <div className="text-xs text-muted-foreground">
                  {room.amenities.slice(0, 4).map((amenity, i) => (
                    <span key={i}>
                      <Check className="h-3 w-3 inline text-green-600 mr-1" />
                      {amenity}
                      {i < 3 && " · "}
                    </span>
                  ))}
                </div>
              </div>

              {/* Number of guests */}
              <div className="md:col-span-2 flex md:justify-center items-start md:items-center">
                <div className="flex items-center gap-1">
                  {Array.from({ length: room.maxGuests }).map((_, i) => (
                    <Users key={i} className="h-4 w-4 text-muted-foreground" />
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="md:col-span-2 flex flex-col md:items-center justify-center">
                {room.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {room.originalPrice.toLocaleString("vi-VN")}₫
                  </span>
                )}
                <span className="text-lg font-bold text-primary">
                  {room.price.toLocaleString("vi-VN")}₫
                </span>
                <span className="text-xs text-muted-foreground">Đã bao gồm thuế & phí</span>
                {room.discount && (
                  <Badge variant="destructive" className="mt-1 text-xs">
                    -{room.discount}%
                  </Badge>
                )}
              </div>

              {/* Features */}
              <div className="md:col-span-2 space-y-1 text-sm">
                {room.features.freeCancellation && (
                  <p className="flex items-center gap-1 text-green-600">
                    <Check className="h-4 w-4" /> Hủy miễn phí
                  </p>
                )}
                {room.features.noPrepayment && (
                  <p className="flex items-center gap-1 text-green-600">
                    <Check className="h-4 w-4" /> Không cần trả trước
                  </p>
                )}
                {room.features.breakfast && (
                  <p className="flex items-center gap-1 text-green-600">
                    <Coffee className="h-4 w-4" /> Bữa sáng
                  </p>
                )}
              </div>

              {/* Select & Book */}
              <div className="md:col-span-2 flex flex-col items-stretch md:items-center justify-center gap-2">
                <Select onValueChange={(value) => handleRoomSelect(room.id, value)}>
                  <SelectTrigger className="w-full md:w-20">
                    <SelectValue placeholder="0" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: room.available + 1 }).map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" className="w-full">
                  Đặt ngay
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Chỉ còn {room.available} phòng!
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotelRooms;
