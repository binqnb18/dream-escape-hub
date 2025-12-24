import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import hotelImage1 from "@/assets/hotel-1.jpg";
import hotelImage2 from "@/assets/hotel-2.jpg";
import hotelImage3 from "@/assets/hotel-3.jpg";
import hotelImage4 from "@/assets/hotel-4.jpg";

interface SimilarHotel {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  discount?: number;
}

const similarHotels: SimilarHotel[] = [
  {
    id: "2",
    name: "Fusion Resort Nha Trang",
    image: hotelImage1,
    location: "Nha Trang, Khánh Hòa",
    rating: 4.7,
    reviewCount: 1523,
    price: 3200000,
    originalPrice: 4800000,
    discount: 33,
  },
  {
    id: "3",
    name: "Mia Resort Nha Trang",
    image: hotelImage2,
    location: "Cam Ranh, Khánh Hòa",
    rating: 4.6,
    reviewCount: 987,
    price: 2800000,
    originalPrice: 3500000,
    discount: 20,
  },
  {
    id: "4",
    name: "Amiana Resort Nha Trang",
    image: hotelImage3,
    location: "Nha Trang, Khánh Hòa",
    rating: 4.8,
    reviewCount: 2156,
    price: 3500000,
    originalPrice: 5000000,
    discount: 30,
  },
  {
    id: "5",
    name: "Evason Ana Mandara",
    image: hotelImage4,
    location: "Nha Trang, Khánh Hòa",
    rating: 4.5,
    reviewCount: 1876,
    price: 2900000,
    originalPrice: 4200000,
    discount: 31,
  },
];

const SimilarHotels = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Khách sạn tương tự</h2>
        <Link to="/search" className="text-primary hover:underline text-sm">
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {similarHotels.map((hotel) => (
          <Link key={hotel.id} to={`/hotel/${hotel.id}`}>
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {hotel.discount && (
                  <Badge
                    variant="destructive"
                    className="absolute top-2 left-2"
                  >
                    -{hotel.discount}%
                  </Badge>
                )}
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {hotel.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">{hotel.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{hotel.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({hotel.reviewCount} đánh giá)
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-primary font-bold">
                    {hotel.price.toLocaleString("vi-VN")}₫
                  </span>
                  {hotel.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {hotel.originalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarHotels;
