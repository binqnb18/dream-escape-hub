import { useNavigate } from "react-router-dom";
import { Heart, X, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFavorites, FavoriteHotel } from "@/hooks/use-favorites";

interface FavoritesListProps {
  trigger?: React.ReactNode;
}

const FavoritesList = ({ trigger }: FavoritesListProps) => {
  const navigate = useNavigate();
  const { favorites, removeFavorite, count } = useFavorites();

  const defaultTrigger = (
    <Button variant="outline" size="icon" className="relative">
      <Heart className="w-4 h-4" />
      {count > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
          {count}
        </Badge>
      )}
    </Button>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-destructive fill-destructive" />
            Saved hotels ({count})
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <Heart className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">No saved hotels yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click the heart icon on hotels you like to save them here
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {favorites.map((hotel) => (
                <FavoriteItem
                  key={hotel.id}
                  hotel={hotel}
                  onRemove={() => removeFavorite(hotel.id)}
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

const FavoriteItem = ({
  hotel,
  onRemove,
  onClick,
}: {
  hotel: FavoriteHotel;
  onRemove: () => void;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {hotel.name}
        </h4>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mt-1">
          {Array.from({ length: hotel.starRating }).map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{hotel.location}</span>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-destructive">₫{hotel.newPrice}</span>
          <Badge variant="secondary" className="text-xs">
            {hotel.rating} ★
          </Badge>
        </div>
      </div>

      {/* Remove Button */}
      <button
        className="self-start p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FavoritesList;
