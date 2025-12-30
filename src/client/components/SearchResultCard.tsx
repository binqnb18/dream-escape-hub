import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Star, ChevronRight, ChevronLeft, CreditCard, Award, GitCompare, Check, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFavorites } from "@/hooks/use-favorites";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SearchResultCardProps {
  id: number;
  image: string;
  images?: string[];
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
  // Comparison props
  isInComparison?: boolean;
  onToggleComparison?: () => void;
  canAddMore?: boolean;
}

const SearchResultCard = ({
  id,
  image,
  images = [],
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
  isInComparison = false,
  onToggleComparison,
  canAddMore = true,
}: SearchResultCardProps) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const allImages = images.length > 0 ? images : [image];
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
      });
    } else {
      toast.info("Removed from favorites", {
        description: name,
      });
    }
  };

  const handleComparisonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleComparison) {
      onToggleComparison();
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className={cn(
        "bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group",
        isInComparison && "ring-2 ring-primary border-primary"
      )}
      onClick={() => navigate(`/hotel/${id}`)}
    >
      {/* Desktop Layout */}
      <div className="hidden md:flex">
        {/* Image Section */}
        <div className="relative w-64 h-[220px] flex-shrink-0 overflow-hidden bg-muted">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          
          <img
            src={allImages[currentImageIndex]}
            alt={name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          
          {imageError && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs">Image not available</p>
              </div>
            </div>
          )}
          
          {badge && (
            <Badge className="absolute top-3 left-3 bg-teal-500 text-white font-medium text-xs rounded-sm">
              {badge}
            </Badge>
          )}
          
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

          {/* Image Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button 
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleNextImage}
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </>
          )}
          
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
            {currentImageIndex + 1}/{allImages.length > 0 ? allImages.length : 10}
          </div>
        </div>

        {/* Content Section - Desktop */}
        <div className="flex-1 p-4 flex">
          <div className="flex-1 space-y-2">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-primary hover:underline leading-tight">
                {name}
              </h3>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: starRating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            
            <div className="flex items-start gap-1.5 text-sm">
              <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-primary font-medium">{location}</span>
            </div>
            
            {distance && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{distance}</p>
            )}

            {bookedToday && (
              <p className="text-xs text-destructive font-medium">{bookedToday}</p>
            )}

            {features.includes("Agoda Preferred") && (
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Agoda Preferred</span>
              </div>
            )}

            <div className="flex items-start gap-1.5 pt-1">
              <span className="text-lg text-muted-foreground">"</span>
              <p className="text-xs text-muted-foreground italic line-clamp-2">
                {guestReview || "If I was in HCM city again I would be happy to stay here."}
              </p>
            </div>
            
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

            {/* Comparison Button - Desktop */}
            {onToggleComparison && (
              <div className="pt-2">
                <Button
                  variant={isInComparison ? "default" : "outline"}
                  size="sm"
                  onClick={handleComparisonClick}
                  disabled={!isInComparison && !canAddMore}
                  className={cn(
                    "flex items-center gap-2 transition-all",
                    isInComparison 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:border-primary hover:text-primary"
                  )}
                >
                  {isInComparison ? (
                    <>
                      <Check className="h-4 w-4" />
                      Đã thêm so sánh
                    </>
                  ) : (
                    <>
                      <GitCompare className="h-4 w-4" />
                      So sánh
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="w-48 flex flex-col items-end justify-between pl-4 border-l border-border">
            {/* Rating Section - Agoda Style */}
            <div className="text-right space-y-1.5">
              <div className="flex items-center justify-end gap-2">
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{reviewLabel}</p>
                  <p className="text-xs text-muted-foreground">{reviewCount} reviews</p>
                </div>
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-base",
                  rating >= 8 ? "bg-[#388e3c]" : rating >= 7 ? "bg-[#5d9c59]" : rating >= 6 ? "bg-[#7fb77e]" : "bg-[#a8d5ba]"
                )}>
                  {rating}
                </div>
              </div>
              {locationScore && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">{locationScore}</span> Location score
                </p>
              )}
            </div>

            <div className="text-right space-y-1.5">
              {limitedText && (
                <Badge className="bg-[#388e3c] hover:bg-[#2e7d32] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {limitedText}
                </Badge>
              )}

              {couponApplied && (
                <div className="inline-flex items-center gap-1.5 bg-[#fff4e5] border border-[#ffb74d] rounded-full px-2.5 py-1">
                  <span className="w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                  <span className="text-[#e65100] font-semibold text-xs">{couponApplied}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Info className="w-3.5 h-3.5 text-[#e65100] cursor-help flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[220px] p-3">
                        <p className="font-semibold text-sm mb-1">Coupon Applied!</p>
                        <p className="text-xs text-muted-foreground">This discount has been automatically applied to your booking. No code needed.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}

              {oldPrice && discount && (
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm line-through text-muted-foreground">
                    ₫{oldPrice}
                  </span>
                  <span className="bg-destructive/10 text-destructive text-xs font-bold px-1.5 py-0.5 rounded">
                    {discount}
                  </span>
                </div>
              )}

              <p className="text-2xl font-bold text-destructive">
                ₫{newPrice}
              </p>

              <p className="text-[11px] text-muted-foreground">
                {priceNote || "Per night before taxes and fees"}
              </p>

              {perks?.some(p => p.includes("FREE") || p.includes("cancellation")) && (
                <p className="text-xs text-[#388e3c] font-semibold">+ FREE CANCELLATION</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Image Section - Mobile */}
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          
          <img
            src={allImages[currentImageIndex]}
            alt={name}
            className={`w-full h-full object-cover ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          
          {badge && (
            <Badge className="absolute top-3 left-3 bg-teal-500 text-white font-medium text-xs rounded-sm">
              {badge}
            </Badge>
          )}
          
          <button
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isHotelFavorite 
                ? "bg-destructive text-white" 
                : "bg-white/90 text-muted-foreground"
            }`}
            onClick={handleFavoriteClick}
          >
            <Heart className={`w-4 h-4 ${isHotelFavorite ? "fill-current" : ""}`} />
          </button>

          {/* Image Navigation - Mobile */}
          {allImages.length > 1 && (
            <>
              <button 
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-md"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-md"
                onClick={handleNextImage}
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </>
          )}
          
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
            {currentImageIndex + 1}/{allImages.length > 0 ? allImages.length : 10}
          </div>

          {limitedText && (
            <Badge className="absolute bottom-3 right-3 bg-destructive text-destructive-foreground text-[10px] font-bold">
              {limitedText}
            </Badge>
          )}
        </div>

        {/* Content Section - Mobile */}
        <div className="p-3 space-y-2">
          {/* Title & Rating Row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-primary leading-tight line-clamp-2">
                {name}
              </h3>
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: starRating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            {/* Rating Badge - Agoda Style Mobile */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="text-right">
                <p className="text-xs font-semibold text-foreground">{reviewLabel}</p>
                <p className="text-[10px] text-muted-foreground">{reviewCount}</p>
              </div>
              <div className={cn(
                "w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm",
                rating >= 8 ? "bg-[#388e3c]" : rating >= 7 ? "bg-[#5d9c59]" : rating >= 6 ? "bg-[#7fb77e]" : "bg-[#a8d5ba]"
              )}>
                {rating}
              </div>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-start gap-1 text-xs">
            <MapPin className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-primary font-medium line-clamp-1">{location}</span>
          </div>

          {bookedToday && (
            <p className="text-xs text-destructive font-medium">{bookedToday}</p>
          )}

          {features.includes("Agoda Preferred") && (
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3 text-green-600" />
              <span className="text-[10px] text-green-700 font-medium">Agoda Preferred</span>
            </div>
          )}
          
          {/* Perks */}
          {perks && perks.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {perks.slice(0, 2).map((perk, index) => (
                <span
                  key={index}
                  className={`text-[10px] ${
                    perk.includes("FREE") || perk.includes("cancellation") 
                      ? "text-green-600 font-medium" 
                      : "text-muted-foreground"
                  }`}
                >
                  {perk}
                </span>
              ))}
            </div>
          )}

          {/* Price Row */}
          <div className="flex items-end justify-between pt-2 border-t border-border">
            <div className="space-y-1">
              {couponApplied && (
                <div className="inline-flex items-center gap-1 bg-[#fff4e5] border border-[#ffb74d] rounded-full px-2 py-0.5">
                  <span className="w-3 h-3 rounded-full bg-destructive text-white flex items-center justify-center text-[8px] font-bold">1</span>
                  <span className="text-[#e65100] font-semibold text-[10px]">{couponApplied}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Info className="w-3 h-3 text-[#e65100] cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px] p-2">
                        <p className="font-semibold text-xs mb-0.5">Coupon Applied!</p>
                        <p className="text-[10px] text-muted-foreground">Discount automatically applied.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              {oldPrice && discount && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs line-through text-muted-foreground">₫{oldPrice}</span>
                  <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-1 py-0.5 rounded">{discount}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-destructive">₫{newPrice}</p>
              <p className="text-[10px] text-muted-foreground">per night</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
