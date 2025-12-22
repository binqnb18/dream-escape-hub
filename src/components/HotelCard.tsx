import { Heart, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HotelCardProps {
  image: string;
  name: string;
  location: string;
  price: string;
  rating: number;
}

const HotelCard = ({ image, name, location, price, rating }: HotelCardProps) => {
  return (
    <div className="group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border transition-all hover:shadow-elevated">
      <div className="relative h-[240px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
        />
        <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground font-semibold shadow-lg">
          {rating}
        </Badge>
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-card-foreground mb-1 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{location}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">từ </span>
            <span className="text-lg font-bold text-foreground">{price}</span>
            <span className="text-sm text-muted-foreground">/đêm</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
