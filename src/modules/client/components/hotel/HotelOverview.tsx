import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Award, Wifi, Car, Coffee, Waves, Utensils, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

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

const getRatingLabel = (rating: number) => {
  if (rating >= 4.5) return "Tuyệt vời";
  if (rating >= 4.0) return "Rất tốt";
  if (rating >= 3.5) return "Tốt";
  return "Khá";
};

const HotelOverview = ({ hotel }: HotelOverviewProps) => {
  const quickHighlights = [
    { icon: Wifi, label: "WiFi miễn phí", available: true },
    { icon: Car, label: "Đậu xe miễn phí", available: true },
    { icon: Coffee, label: "Bữa sáng", available: true },
    { icon: Waves, label: "Hồ bơi", available: true },
    { icon: Utensils, label: "Nhà hàng", available: true },
    { icon: Dumbbell, label: "Gym", available: true },
  ];

  const propertyHighlights = [
    "Nằm trong khu vực được đánh giá cao nhất tại Nha Trang",
    "Gần các điểm tham quan nổi tiếng",
    "Phòng rộng rãi, view đẹp",
    "Nhân viên thân thiện, nhiệt tình",
    "Bãi biển riêng tuyệt đẹp",
    "Dịch vụ spa đẳng cấp quốc tế",
  ];

  return (
    <div className="space-y-6">
      {/* Hotel Title */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex">
            {Array.from({ length: hotel.starRating }).map((_, i) => (
              <Star 
                key={i} 
                className="h-4 w-4 fill-amber-400 text-amber-400 drop-shadow-sm" 
              />
            ))}
          </div>
          <Badge 
            variant="secondary" 
            className="bg-primary/10 text-primary border-primary/20 font-medium"
          >
            <Award className="h-3 w-3 mr-1" />
            Được yêu thích
          </Badge>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          {hotel.name}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground px-2.5 py-1.5 rounded-lg font-bold text-base shadow-sm">
              {hotel.rating}
            </div>
            <div>
              <span className="font-semibold text-foreground">{getRatingLabel(hotel.rating)}</span>
              <span className="text-muted-foreground ml-1">
                ({hotel.reviewCount.toLocaleString()} đánh giá)
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="hover:text-primary cursor-pointer transition-colors">
              {hotel.address}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {quickHighlights.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200",
              "bg-muted/50 hover:bg-primary/5 hover:shadow-sm cursor-default",
              "border border-transparent hover:border-primary/10"
            )}
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          Giới thiệu
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {hotel.description}
        </p>
      </div>

      {/* Property Highlights */}
      <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-5 space-y-4 border border-border/50">
        <h3 className="font-semibold flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Award className="h-5 w-5 text-primary" />
          </div>
          Điểm nổi bật của chỗ nghỉ
        </h3>
        <ul className="grid md:grid-cols-2 gap-3">
          {propertyHighlights.map((highlight, index) => (
            <li 
              key={index} 
              className="flex items-start gap-2.5 text-sm group"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 group-hover:bg-primary/20 transition-colors">
                <svg 
                  className="w-3 h-3 text-primary" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </span>
              <span className="text-foreground/90">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HotelOverview;
