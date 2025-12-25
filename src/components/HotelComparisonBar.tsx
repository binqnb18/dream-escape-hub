import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, GitCompare, ChevronUp, ChevronDown, Trash2, Star, MapPin } from "lucide-react";
import { ComparisonHotel } from "@/hooks/use-hotel-comparison";
import { cn } from "@/lib/utils";
import HotelComparisonModal from "./HotelComparisonModal";

interface HotelComparisonBarProps {
  hotels: ComparisonHotel[];
  onRemove: (hotelId: number) => void;
  onClearAll: () => void;
  maxHotels: number;
}

const HotelComparisonBar = ({
  hotels,
  onRemove,
  onClearAll,
  maxHotels,
}: HotelComparisonBarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  if (hotels.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-2 border-primary/20 shadow-2xl animate-fade-in">
        {/* Expanded view with hotel cards */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-48" : "max-h-0"
          )}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="flex-shrink-0 bg-muted/50 rounded-xl p-3 min-w-[220px] max-w-[240px] relative group border hover:border-primary/50 transition-colors"
                >
                  <button
                    onClick={() => onRemove(hotel.id)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 transform"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  
                  <div className="flex gap-3">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate text-foreground">
                        {hotel.name}
                      </h4>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: hotel.starRating }).map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded">
                          {hotel.rating}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {hotel.reviewLabel}
                        </span>
                      </div>
                      <p className="text-primary font-bold text-sm mt-1">
                        ₫{hotel.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Empty slots indicator */}
              {Array.from({ length: maxHotels - hotels.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex-shrink-0 border-2 border-dashed border-muted-foreground/30 rounded-xl p-3 min-w-[220px] max-w-[240px] flex items-center justify-center"
                >
                  <div className="text-center text-muted-foreground">
                    <GitCompare className="h-6 w-6 mx-auto mb-1 opacity-50" />
                    <p className="text-xs">Thêm khách sạn</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="container mx-auto px-4 py-3 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
              >
                <div className="relative">
                  <GitCompare className="h-6 w-6 text-primary" />
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {hotels.length}
                  </span>
                </div>
                <span className="font-semibold text-base">
                  So sánh khách sạn
                </span>
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </button>

              <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{hotels.length}</span>
                <span>/</span>
                <span>{maxHotels}</span>
                <span>đã chọn</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Xóa tất cả</span>
              </Button>
            </div>

            <Button
              onClick={() => setShowComparison(true)}
              disabled={hotels.length < 2}
              size="lg"
              className={cn(
                "font-semibold transition-all",
                hotels.length >= 2 
                  ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl" 
                  : "bg-muted text-muted-foreground"
              )}
            >
              <GitCompare className="h-5 w-5 mr-2" />
              {hotels.length < 2 ? (
                <span>Chọn thêm {2 - hotels.length} khách sạn</span>
              ) : (
                <span>So sánh ngay ({hotels.length})</span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {showComparison && (
        <HotelComparisonModal
          hotels={hotels}
          onClose={() => setShowComparison(false)}
        />
      )}
    </>
  );
};

export default HotelComparisonBar;
