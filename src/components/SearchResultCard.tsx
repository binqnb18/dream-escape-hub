import { useNavigate } from "react-router-dom";
import { CheckCircle2, Heart, MapPin, Star, Wifi, Car, Coffee, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface SearchResultCardProps {
  id: number;
  image: string;
  name: string;
  location: string;
  distance?: string;
  rating: number;
  reviewCount: string;
  reviewLabel: string;
  oldPrice: string;
  newPrice: string;
  discount: string;
  badge?: string;
  features: string[];
  propertyOffers?: string[];
  perks?: string[];
  priceNote?: string;
  appliedText?: string;
  limitedText?: string;
  starRating?: number;
  roomType?: string;
  nights?: number;
  amenities?: string[];
}

const SearchResultCard = ({
  id,
  image,
  name,
  location,
  distance,
  rating,
  reviewCount,
  reviewLabel,
  oldPrice,
  newPrice,
  discount,
  badge,
  features,
  perks,
  priceNote,
  limitedText,
  starRating = 4,
  roomType,
  nights = 1,
  amenities,
}: SearchResultCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const getRatingBgColor = (score: number) => {
    if (score >= 9) return "bg-emerald-500";
    if (score >= 8) return "bg-primary";
    if (score >= 7) return "bg-blue-500";
    return "bg-muted";
  };

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes("wifi")) return <Wifi className="w-3.5 h-3.5" />;
    if (lower.includes("parking") || lower.includes("car")) return <Car className="w-3.5 h-3.5" />;
    if (lower.includes("breakfast") || lower.includes("coffee")) return <Coffee className="w-3.5 h-3.5" />;
    if (lower.includes("pool") || lower.includes("bơi")) return <Waves className="w-3.5 h-3.5" />;
    return null;
  };

  return (
    <div
      className="bg-card rounded-xl border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => navigate(`/hotel/${id}`)}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="relative w-full sm:w-64 md:w-72 h-52 sm:h-auto sm:min-h-[200px] flex-shrink-0 overflow-hidden bg-muted">
          {/* Placeholder while loading */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          
          {/* Image */}
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          
          {/* Error fallback */}
          {imageError && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs">Không tải được ảnh</p>
              </div>
            </div>
          )}
          
          {/* Badge - Top Left */}
          {badge && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-medium shadow-md">
              {badge}
            </Badge>
          )}
          
          {/* Limited Badge */}
          {limitedText && (
            <Badge className="absolute top-11 left-3 bg-destructive text-destructive-foreground text-xs">
              {limitedText}
            </Badge>
          )}
          
          {/* Favorite Button */}
          <button
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
              isFavorite 
                ? "bg-destructive text-white" 
                : "bg-white/90 hover:bg-white text-muted-foreground hover:text-destructive"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          
          {/* Image Counter */}
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
            1/10
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left Content */}
            <div className="flex-1 space-y-2">
              {/* Title & Star Rating */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-primary hover:underline leading-tight">
                    {name}
                  </h3>
                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: starRating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                {/* Features badges */}
                <div className="flex flex-wrap gap-1.5">
                  {features.slice(0, 3).map((feature, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs font-medium whitespace-nowrap border-primary/30 text-primary bg-primary/5"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Location */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                <span className="line-clamp-1">{location}</span>
              </div>
              
              {/* Distance */}
              {distance && (
                <p className="text-xs text-muted-foreground">{distance}</p>
              )}

              {/* Room Type */}
              {roomType && (
                <p className="text-sm font-medium text-foreground">{roomType}</p>
              )}

              {/* Amenities */}
              {amenities && amenities.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {amenities.slice(0, 4).map((amenity, index) => (
                    <span key={index} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </span>
                  ))}
                </div>
              )}
              
              {/* Perks Row */}
              {perks && perks.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2">
                  {perks.map((perk, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1.5 text-sm text-green-600 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>{perk}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right Content - Rating & Price */}
            <div className="flex sm:flex-col items-end justify-between gap-3 lg:min-w-[160px] lg:border-l lg:border-border lg:pl-4">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{reviewLabel}</p>
                  <p className="text-xs text-muted-foreground">{reviewCount} đánh giá</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRatingBgColor(rating)} text-white font-bold shadow-md`}
                >
                  {rating}
                </div>
              </div>

              {/* Price Section */}
              <div className="text-right space-y-1">
                <p className="text-xs text-muted-foreground">
                  {nights > 1 ? `${nights} đêm · ` : ""}{priceNote || "Đã bao gồm thuế & phí"}
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm line-through text-muted-foreground">
                    đ{oldPrice}
                  </span>
                  <Badge className="bg-destructive text-destructive-foreground text-xs font-bold px-1.5 py-0.5">
                    {discount}
                  </Badge>
                </div>
                <p className="text-xl font-bold text-destructive">
                  đ{newPrice}
                </p>
              </div>
              
              {/* CTA Button */}
              <Button
                className="w-full sm:w-auto px-6 font-semibold"
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/hotel/${id}`);
                }}
              >
                Xem phòng trống
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
