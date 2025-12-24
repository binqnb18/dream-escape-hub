import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Star, ChevronRight, CreditCard, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";
import { toast } from "sonner";

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
  perks?: string[];
  priceNote?: string;
  limitedText?: string;
  starRating?: number;
  roomType?: string;
  nights?: number;
  amenities?: string[];
  locationScore?: number;
  couponApplied?: string;
  bookedToday?: string;
  guestReview?: string;
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
  starRating = 3,
  locationScore,
  couponApplied,
  bookedToday,
  guestReview,
}: SearchResultCardProps) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const isHotelFavorite = isFavorite(id);
  
  const getRatingColor = (score: number) => {
    if (score >= 8) return "text-primary";
    if (score >= 7) return "text-blue-600";
    return "text-foreground";
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleFavorite({
      id,
      name,
      image,
      location,
      rating,
      newPrice,
      starRating: starRating || 3,
    });
    
    if (!isHotelFavorite) {
      toast.success("Added to favorites", {
        description: name,
        action: {
          label: "View",
          onClick: () => {},
        },
      });
    } else {
      toast.info("Removed from favorites", {
        description: name,
      });
    }
  };

  return (
    <div
      className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => navigate(`/hotel/${id}`)}
    >
      <div className="flex">
        {/* Image Section */}
        <div className="relative w-64 h-[220px] flex-shrink-0 overflow-hidden bg-muted">
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
                <p className="text-xs">Image not available</p>
              </div>
            </div>
          )}
          
          {/* Badge - Top Left */}
          {badge && (
            <Badge className="absolute top-3 left-3 bg-teal-500 text-white font-medium text-xs rounded-sm">
              {badge}
            </Badge>
          )}
          
          {/* Favorite Button */}
          <button
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isHotelFavorite 
                ? "bg-destructive text-white" 
                : "bg-white/90 hover:bg-white text-muted-foreground hover:text-destructive"
            }`}
            onClick={handleFavoriteClick}
          >
            <Heart className={`w-4 h-4 ${isHotelFavorite ? "fill-current" : ""}`} />
          </button>

          {/* Navigation Arrow */}
          <button 
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          {/* Image Counter */}
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
            1/10
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex">
          {/* Left Content - Hotel Info */}
          <div className="flex-1 space-y-2">
            {/* Title & Star Rating */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-primary hover:underline leading-tight">
                  {name}
                </h3>
              </div>
              
              {/* Star Rating */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: starRating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            
            {/* Location */}
            <div className="flex items-start gap-1.5 text-sm">
              <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-primary font-medium">{location}</span>
            </div>
            
            {/* Distance */}
            {distance && (
              <p className="text-xs text-muted-foreground leading-relaxed">{distance}</p>
            )}

            {/* Booked Today */}
            {bookedToday && (
              <p className="text-xs text-destructive font-medium">{bookedToday}</p>
            )}

            {/* Features - Agoda Preferred */}
            {features.includes("Agoda Preferred") && (
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Agoda Preferred</span>
              </div>
            )}

            {/* Guest Review Quote */}
            {guestReview ? (
              <div className="flex items-start gap-1.5 pt-1">
                <span className="text-lg text-muted-foreground">"</span>
                <p className="text-xs text-muted-foreground italic line-clamp-2">
                  {guestReview}
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-1.5 pt-1">
                <span className="text-lg text-muted-foreground">"</span>
                <p className="text-xs text-muted-foreground italic line-clamp-2">
                  "If I was in HCM city again I would be happy to stay here."
                </p>
              </div>
            )}
            
            {/* Perks Row */}
            {perks && perks.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                {perks.map((perk, index) => (
                  <span
                    key={index}
                    className={`flex items-center gap-1.5 text-xs ${
                      perk.includes("FREE") || perk.includes("cancellation") 
                        ? "text-green-600 font-medium" 
                        : "text-muted-foreground"
                    }`}
                  >
                    {perk.includes("credit card") && <CreditCard className="w-3 h-3" />}
                    <span>{perk}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Content - Rating & Price */}
          <div className="w-44 flex flex-col items-end justify-between pl-4 border-l border-border">
            {/* Rating Section */}
            <div className="text-right space-y-1">
              <p className={`text-base font-bold ${getRatingColor(rating)}`}>
                {rating} {reviewLabel}
              </p>
              <p className="text-xs text-muted-foreground">{reviewCount} reviews</p>
              {locationScore && (
                <p className="text-xs text-foreground">
                  <span className="font-semibold">{locationScore}</span> Location score
                </p>
              )}
            </div>

            {/* Price Section */}
            <div className="text-right space-y-1">
              {/* Limited Badge */}
              {limitedText && (
                <Badge className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5">
                  {limitedText}
                </Badge>
              )}

              {/* Coupon Applied */}
              {couponApplied && (
                <div className="flex items-center gap-1 justify-end text-xs">
                  <span className="w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  <span className="text-green-600 font-medium">{couponApplied}</span>
                </div>
              )}

              {/* Old Price with Discount */}
              {oldPrice && discount && (
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm line-through text-muted-foreground decoration-destructive">
                    ₫{oldPrice}
                  </span>
                  <span className="text-xs text-destructive font-bold">
                    {discount}
                  </span>
                </div>
              )}

              {/* New Price */}
              <p className="text-xl font-bold text-destructive">
                ₫{newPrice}
              </p>

              {/* Price Note */}
              <p className="text-[10px] text-muted-foreground">
                {priceNote || "Per night before taxes and fees"}
              </p>

              {/* Free Cancellation highlight */}
              {perks?.some(p => p.includes("FREE") || p.includes("cancellation")) && (
                <p className="text-xs text-green-600 font-medium">+ FREE CANCELLATION</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";

export default SearchResultCard;
