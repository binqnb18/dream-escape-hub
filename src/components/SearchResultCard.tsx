import { useNavigate } from "react-router-dom";
import { CheckCircle2, Heart, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LazyImage from "@/components/LazyImage";

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
  propertyOffers,
  perks,
  priceNote,
  appliedText,
  limitedText,
}: SearchResultCardProps) => {
  const navigate = useNavigate();
  
  const getRatingColor = (score: number) => {
    if (score >= 9) return "bg-accent text-accent-foreground";
    if (score >= 8) return "bg-primary text-primary-foreground";
    if (score >= 7) return "bg-blue-500 text-white";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div
      className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/hotel/${id}`)}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-72 h-48 md:h-56 flex-shrink-0">
          <LazyImage src={image} alt={name} className="w-full h-full" />
          {badge && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              {badge}
            </Badge>
          )}
          {limitedText && (
            <Badge className="absolute top-3 right-12 bg-destructive text-destructive-foreground">
              {limitedText}
            </Badge>
          )}
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="absolute bottom-3 left-3 bg-background/80 px-2 py-1 rounded text-xs">
            1/10
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-3">
            {/* Title & Location */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-primary hover:underline">
                  {name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {location}
                </div>
                {distance && <p className="text-xs text-muted-foreground">{distance}</p>}
              </div>
              <div className="flex flex-wrap gap-1">
                {features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Property offers */}
            {propertyOffers && propertyOffers.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">This property offers:</p>
                <div className="flex flex-wrap gap-2">
                  {propertyOffers.map((offer, index) => (
                    <span key={index} className="flex items-center gap-1 text-xs text-accent">
                      <CheckCircle2 className="w-3 h-3" />
                      {offer}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Perks */}
            {perks && perks.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {perks.map((perk, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 text-xs text-green-600"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {perk}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Price & Rating Section */}
          <div className="flex md:flex-col items-end md:items-end justify-between md:justify-start gap-4 md:min-w-[160px]">
            <div className="flex md:flex-col items-center md:items-end gap-2">
              <div
                className={`px-2 py-1 rounded font-bold text-sm ${getRatingColor(rating)}`}
              >
                <p>{rating}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{reviewLabel}</p>
                <p className="text-xs text-muted-foreground">{reviewCount} reviews</p>
              </div>
              {appliedText && (
                <span className="flex items-center gap-1 text-xs text-accent">
                  <Tag className="w-3 h-3" />
                  {appliedText}
                </span>
              )}
            </div>

            <div className="text-right space-y-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  {priceNote || "Per night before taxes and fees"}
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm line-through text-muted-foreground">
                    ₫{oldPrice}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    {discount}
                  </Badge>
                </div>
                <p className="text-xl font-bold text-primary">
                  ₫{newPrice}
                </p>
              </div>
              <Button
                className="w-full"
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
