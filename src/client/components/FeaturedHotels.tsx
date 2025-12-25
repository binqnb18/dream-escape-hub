import HotelCard from "./HotelCard";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";
import hotel4 from "@/assets/hotel-4.jpg";
import hotel5 from "@/assets/hotel-5.jpg";

const FeaturedHotels = () => {
  const hotels = [
    {
      image: hotel1,
      name: "Riverside Saigon Hotel",
      location: "TP.HCM",
      price: "₫1.300.000",
      rating: 9.6,
    },
    {
      image: hotel2,
      name: "Old Quarter Boutique",
      location: "Hà Nội",
      price: "₫1.800.000",
      rating: 9.6,
    },
    {
      image: hotel3,
      name: "Sunrise Beach Resort",
      location: "Đà Nẵng",
      price: "₫2.100.000",
      rating: 9.5,
    },
    {
      image: hotel4,
      name: "Highland View Hotel",
      location: "Đà Lạt",
      price: "₫1.300.000",
      rating: 9.5,
    },
    {
      image: hotel5,
      name: "Sea Breeze Villas",
      location: "Phú Quốc",
      price: "₫700.000",
      rating: 9.5,
    },
  ];

  return (
    <section className="w-full px-4 md:px-6 lg:px-12 py-12 md:py-16 bg-muted/30">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8">
        Khách sạn được khách yêu thích
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {hotels.map((hotel, index) => (
          <HotelCard key={index} {...hotel} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedHotels;
