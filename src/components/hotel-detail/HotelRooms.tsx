import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
}

const rooms: Room[] = [
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
  },
];

const HotelRooms = () => {
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>({});

  const handleRoomSelect = (roomId: string, count: string) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomId]: parseInt(count),
    }));
  };

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

        {/* Room Rows */}
        {rooms.map((room, index) => (
          <div
            key={room.id}
            className={cn(
              "grid md:grid-cols-12 gap-4 p-4 border-b last:border-b-0",
              index % 2 === 1 && "bg-muted/20"
            )}
          >
            {/* Room Type */}
            <div className="md:col-span-4 space-y-3">
              <h3 className="font-semibold text-primary hover:underline cursor-pointer">
                {room.name}
              </h3>
              <p className="text-sm text-muted-foreground">{room.bedType}</p>
              
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
        ))}
      </div>
    </div>
  );
};

export default HotelRooms;
