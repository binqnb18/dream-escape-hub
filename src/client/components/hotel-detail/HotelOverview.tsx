import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Award, Wifi, Car, Coffee, Waves } from "lucide-react";

interface HotelOverviewProps {
  hotel: {
    name: string;
    rating: number;
    reviewCount: number;
    starRating: number;
    address: string;
    description: string;
  };
}

const HotelOverview = ({ hotel }: HotelOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Hotel Title */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="flex">
            {Array.from({ length: hotel.starRating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Award className="h-3 w-3 mr-1" />
            Được yêu thích
          </Badge>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {hotel.name}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded font-bold">
              {hotel.rating}
            </div>
            <div>
              <span className="font-semibold">Tuyệt vời</span>
              <span className="text-muted-foreground ml-1">
                ({hotel.reviewCount.toLocaleString()} đánh giá)
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{hotel.address}</span>
          </div>
        </div>
      </div>

      {/* Quick Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Wifi, label: "WiFi miễn phí" },
          { icon: Car, label: "Đậu xe miễn phí" },
          { icon: Coffee, label: "Bữa sáng" },
          { icon: Waves, label: "Hồ bơi" },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
          >
            <item.icon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Giới thiệu</h2>
        <p className="text-muted-foreground leading-relaxed">
          {hotel.description}
        </p>
      </div>

      {/* Property Highlights */}
      <div className="bg-muted/30 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Điểm nổi bật của chỗ nghỉ
        </h3>
        <ul className="grid md:grid-cols-2 gap-3">
          {[
            "Nằm trong khu vực được đánh giá cao nhất tại Nha Trang",
            "Gần các điểm tham quan nổi tiếng",
            "Phòng rộng rãi, view đẹp",
            "Nhân viên thân thiện, nhiệt tình",
            "Bãi biển riêng tuyệt đẹp",
            "Dịch vụ spa đẳng cấp quốc tế",
          ].map((highlight, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-1">✓</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HotelOverview;
