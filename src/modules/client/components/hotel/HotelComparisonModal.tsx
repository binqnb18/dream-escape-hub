import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Star, 
  MapPin, 
  Check, 
  Trophy,
  ThumbsUp,
  Sparkles
} from "lucide-react";
import { ComparisonHotel } from "@/hooks/use-hotel-comparison";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface HotelComparisonModalProps {
  hotels: ComparisonHotel[];
  onClose: () => void;
}

const HotelComparisonModal = ({ hotels, onClose }: HotelComparisonModalProps) => {
  const navigate = useNavigate();

  // Find best values for highlighting
  const bestRating = Math.max(...hotels.map((h) => h.rating));
  const lowestPrice = Math.min(...hotels.map((h) => parseInt(h.price.replace(/\./g, ""))));
  const bestLocationScore = Math.max(...hotels.map((h) => h.locationScore || 0));

  const handleSelectHotel = (hotelId: number) => {
    onClose();
    navigate(`/hotel/${hotelId}`);
  };

  const getComparisonValue = (value: number, best: number, type: "highest" | "lowest") => {
    if (type === "highest") {
      return value === best;
    }
    return value === best;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm overflow-auto">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-background/95 backdrop-blur-sm py-4 z-10 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-foreground">So sánh khách sạn</h2>
              <p className="text-muted-foreground">
                So sánh {hotels.length} khách sạn đã chọn
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary border-primary gap-1">
              <Trophy className="h-3 w-3" />
              Giá trị tốt nhất được đánh dấu
            </Badge>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${hotels.length}, minmax(280px, 1fr))` }}>
          {hotels.map((hotel) => {
            const priceNum = parseInt(hotel.price.replace(/\./g, ""));
            const isBestRating = hotel.rating === bestRating;
            const isBestPrice = priceNum === lowestPrice;
            const isBestLocation = hotel.locationScore === bestLocationScore;
            
            return (
              <div
                key={hotel.id}
                className={cn(
                  "bg-card rounded-2xl border-2 overflow-hidden transition-all hover:shadow-xl",
                  (isBestRating || isBestPrice) && "border-primary shadow-lg"
                )}
              >
                {/* Best Value Badge */}
                {(isBestRating || isBestPrice) && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold">
                    <Sparkles className="h-4 w-4 inline mr-1" />
                    {isBestRating && isBestPrice ? "Lựa chọn tốt nhất" : isBestRating ? "Đánh giá cao nhất" : "Giá tốt nhất"}
                  </div>
                )}

                {/* Hotel Image */}
                <div className="relative h-48">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  {hotel.discount && (
                    <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-bold">
                      {hotel.discount}
                    </Badge>
                  )}
                </div>

                {/* Hotel Info */}
                <div className="p-5 space-y-4">
                  {/* Name & Stars */}
                  <div>
                    <h3 className="font-bold text-lg text-foreground line-clamp-2 min-h-[3.5rem]">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: hotel.starRating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground line-clamp-2">{hotel.location}</span>
                  </div>

                  {/* Comparison Stats */}
                  <div className="space-y-3 pt-3 border-t">
                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Đánh giá</span>
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full",
                        isBestRating ? "bg-primary/10" : "bg-muted"
                      )}>
                        {isBestRating && <ThumbsUp className="h-3 w-3 text-primary" />}
                        <span className={cn(
                          "font-bold",
                          isBestRating ? "text-primary" : "text-foreground"
                        )}>
                          {hotel.rating}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {hotel.reviewLabel}
                        </span>
                      </div>
                    </div>

                    {/* Reviews */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Lượt đánh giá</span>
                      <span className="font-medium text-foreground">{hotel.reviewCount}</span>
                    </div>

                    {/* Location Score */}
                    {hotel.locationScore && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Điểm vị trí</span>
                        <div className={cn(
                          "flex items-center gap-1 px-2 py-0.5 rounded",
                          isBestLocation ? "bg-primary/10" : "bg-muted"
                        )}>
                          {isBestLocation && <Check className="h-3 w-3 text-primary" />}
                          <span className={cn(
                            "font-medium",
                            isBestLocation ? "text-primary" : "text-foreground"
                          )}>
                            {hotel.locationScore}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Perks */}
                    {hotel.perks && hotel.perks.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        {hotel.perks.slice(0, 3).map((perk, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Check className={cn(
                              "h-4 w-4 flex-shrink-0",
                              perk.toLowerCase().includes("free") || perk.toLowerCase().includes("cancellation")
                                ? "text-green-500"
                                : "text-muted-foreground"
                            )} />
                            <span className={cn(
                              "text-xs",
                              perk.toLowerCase().includes("free") || perk.toLowerCase().includes("cancellation")
                                ? "text-green-600 font-medium"
                                : "text-muted-foreground"
                            )}>
                              {perk}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className={cn(
                    "p-4 rounded-xl -mx-1",
                    isBestPrice ? "bg-primary/10" : "bg-muted/50"
                  )}>
                    {hotel.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        ₫{hotel.originalPrice}
                      </p>
                    )}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className={cn(
                          "text-2xl font-bold",
                          isBestPrice ? "text-primary" : "text-foreground"
                        )}>
                          ₫{hotel.price}
                        </p>
                        <p className="text-xs text-muted-foreground">mỗi đêm</p>
                      </div>
                      {isBestPrice && (
                        <Badge className="bg-primary text-primary-foreground">
                          Giá tốt nhất
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => handleSelectHotel(hotel.id)}
                    className="w-full font-semibold"
                    size="lg"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-8 p-6 bg-muted/30 rounded-2xl border">
          <h3 className="font-semibold text-lg mb-4">Tóm tắt so sánh</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-xl p-4 border">
              <div className="flex items-center gap-2 text-primary mb-2">
                <ThumbsUp className="h-5 w-5" />
                <span className="font-medium">Đánh giá cao nhất</span>
              </div>
              <p className="font-bold text-foreground">
                {hotels.find(h => h.rating === bestRating)?.name}
              </p>
              <p className="text-sm text-muted-foreground">Điểm: {bestRating}</p>
            </div>
            
            <div className="bg-card rounded-xl p-4 border">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium">Giá tốt nhất</span>
              </div>
              <p className="font-bold text-foreground">
                {hotels.find(h => parseInt(h.price.replace(/\./g, "")) === lowestPrice)?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                ₫{hotels.find(h => parseInt(h.price.replace(/\./g, "")) === lowestPrice)?.price}/đêm
              </p>
            </div>
            
            {bestLocationScore > 0 && (
              <div className="bg-card rounded-xl p-4 border">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">Vị trí tốt nhất</span>
                </div>
                <p className="font-bold text-foreground">
                  {hotels.find(h => h.locationScore === bestLocationScore)?.name}
                </p>
                <p className="text-sm text-muted-foreground">Điểm: {bestLocationScore}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelComparisonModal;
