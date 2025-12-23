import { useNavigate } from "react-router-dom";
import { CheckCircle2, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LazyImage from "@/components/LazyImage";
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
}: SearchResultCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const getRatingBgColor = (score: number) => {
    if (score >= 9) return "bg-primary";
    if (score >= 8) return "bg-primary";
    if (score >= 7) return "bg-blue-500";
    return "bg-muted";
  };

  return (
    <div
      className="bg-card rounded-xl border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => navigate(`/hotel/${id}`)}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="relative w-full sm:w-64 md:w-72 h-52 sm:h-48 flex-shrink-0 overflow-hidden">
          <LazyImage 
            src={image} 
            alt={name} 
            className="w-full h-full group-hover:scale-105 transition-transform duration-500" 
          />
          
          {/* Badge - Top Left */}
          {badge && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-medium shadow-md">
              {badge}
            </Badge>
          )}
          
          {/* Limited Badge - Below main badge */}
          {limitedText && (
            <Badge className="absolute top-11 left-3 bg-destructive text-destructive-foreground text-xs">
              {limitedText}
            </Badge>
          )}
          
          {/* Favorite Button - Top Right */}
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
          
          {/* Image Counter - Bottom Left */}
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
            1/10
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex flex-col lg:flex-row gap-4 h-full">
            {/* Left Content */}
            <div className="flex-1 space-y-2">
              {/* Title Row */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-primary hover:underline leading-tight">
                  {name}
                </h3>
                {/* Features badges */}
                <div className="hidden md:flex flex-wrap gap-1.5 flex-shrink-0">
                  {features.slice(0, 2).map((feature, index) => (
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
                <p className="text-xs text-muted-foreground pl-5">{distance}</p>
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
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 lg:min-w-[140px] lg:border-l lg:border-border lg:pl-4">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-foreground">{reviewLabel}</p>
                  <p className="text-xs text-muted-foreground">{reviewCount} reviews</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRatingBgColor(rating)} text-white font-bold shadow-md`}
                >
                  {rating}
                </div>
              </div>
              
              {/* Mobile rating text */}
              <div className="sm:hidden text-left">
                <p className="text-sm font-semibold text-foreground">{reviewLabel}</p>
                <p className="text-xs text-muted-foreground">{reviewCount} reviews</p>
              </div>

              {/* Price Section */}
              <div className="text-right space-y-1">
                <p className="text-xs text-muted-foreground">
                  {priceNote || "Đã bao gồm thuế & phí"}
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
