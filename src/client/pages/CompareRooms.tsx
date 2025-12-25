import { useNavigate } from "react-router-dom";
import Header from "@/client/components/Header";
import ClientFooter from "@/client/components/ClientFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Bed,
  Users,
  Maximize,
  Wifi,
  Wind,
  Coffee,
  Bath,
  Tv,
  Check,
  X,
  Trash2,
  Star,
  MapPin,
} from "lucide-react";
import { useRoomComparison } from "@/hooks/use-room-comparison";
import { toast } from "@/hooks/use-toast";

const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  aircon: Wind,
  breakfast: Coffee,
  bathtub: Bath,
  tv: Tv,
};

const CompareRooms = () => {
  const navigate = useNavigate();
  const { rooms, removeRoom, clearAll } = useRoomComparison();

  if (rooms.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <Bed className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Chưa có phòng để so sánh</h1>
          <p className="text-muted-foreground mb-6">
            Hãy thêm phòng vào danh sách so sánh từ trang chi tiết khách sạn
          </p>
          <Button onClick={() => navigate("/search")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tìm khách sạn
          </Button>
        </main>
        <ClientFooter />
      </div>
    );
  }

  const handleRemove = (roomId: string, hotelId: string) => {
    removeRoom(roomId, hotelId);
    toast({
      title: "Đã xóa phòng",
      description: "Phòng đã được xóa khỏi danh sách so sánh",
    });
  };

  const handleClearAll = () => {
    clearAll();
    toast({
      title: "Đã xóa tất cả",
      description: "Danh sách so sánh đã được xóa",
    });
  };

  // Mock room data for comparison
  const comparisonData = rooms.map((room) => ({
    ...room,
    amenities: ["wifi", "aircon", "tv", "bathtub"],
    hasBreakfast: Math.random() > 0.5,
    hasFreeCancellation: Math.random() > 0.5,
    hasBalcony: Math.random() > 0.5,
    hasKitchen: Math.random() > 0.5,
    hasMinibar: true,
    hasSafe: true,
    rating: (4 + Math.random()).toFixed(1),
    reviews: Math.floor(Math.random() * 500) + 100,
  }));

  const features = [
    { key: "hasBreakfast", label: "Bữa sáng miễn phí" },
    { key: "hasFreeCancellation", label: "Hủy phòng miễn phí" },
    { key: "hasBalcony", label: "Ban công" },
    { key: "hasKitchen", label: "Bếp nhỏ" },
    { key: "hasMinibar", label: "Minibar" },
    { key: "hasSafe", label: "Két an toàn" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/search")}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">So sánh phòng</h1>
            <p className="text-muted-foreground">
              So sánh {rooms.length} phòng đã chọn
            </p>
          </div>
          <Button variant="outline" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa tất cả
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Room Cards */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${rooms.length}, 1fr)` }}>
              {/* Header Row */}
              <div className="p-4" />
              {comparisonData.map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <img
                      src={room.image}
                      alt={room.roomName}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => handleRemove(room.id, room.hotelId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {room.hotelName}
                    </Badge>
                    <h3 className="font-semibold line-clamp-2">{room.roomName}</h3>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span>{room.rating}</span>
                      <span>({room.reviews} đánh giá)</span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Price Row */}
              <div className="p-4 bg-muted/30 rounded-lg flex items-center font-medium">
                Giá/đêm
              </div>
              {comparisonData.map((room) => (
                <Card key={`price-${room.id}`} className="p-4 bg-primary/5">
                  <div className="text-2xl font-bold text-primary">
                    {room.price.toLocaleString("vi-VN")}₫
                  </div>
                </Card>
              ))}

              {/* Size Row */}
              <div className="p-4 bg-muted/30 rounded-lg flex items-center font-medium">
                <Maximize className="h-4 w-4 mr-2" />
                Diện tích
              </div>
              {comparisonData.map((room) => (
                <Card key={`size-${room.id}`} className="p-4">
                  <span>{room.size}m²</span>
                </Card>
              ))}

              {/* Guests Row */}
              <div className="p-4 bg-muted/30 rounded-lg flex items-center font-medium">
                <Users className="h-4 w-4 mr-2" />
                Số khách
              </div>
              {comparisonData.map((room) => (
                <Card key={`guests-${room.id}`} className="p-4">
                  <span>{room.maxGuests} người</span>
                </Card>
              ))}

              {/* Bed Row */}
              <div className="p-4 bg-muted/30 rounded-lg flex items-center font-medium">
                <Bed className="h-4 w-4 mr-2" />
                Loại giường
              </div>
              {comparisonData.map((room) => (
                <Card key={`bed-${room.id}`} className="p-4">
                  <span>{room.bedType}</span>
                </Card>
              ))}

              {/* Features */}
              {features.map((feature) => (
                <>
                  <div key={feature.key} className="p-4 bg-muted/30 rounded-lg flex items-center font-medium">
                    {feature.label}
                  </div>
                  {comparisonData.map((room) => (
                    <Card key={`${feature.key}-${room.id}`} className="p-4 flex items-center justify-center">
                      {(room as any)[feature.key] ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-400" />
                      )}
                    </Card>
                  ))}
                </>
              ))}

              {/* Book Button Row */}
              <div className="p-4" />
              {comparisonData.map((room) => (
                <Card key={`book-${room.id}`} className="p-4">
                  <Button className="w-full" onClick={() => navigate(`/hotel/${room.hotelId}`)}>
                    Đặt phòng
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
};

export default CompareRooms;
