import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/client/components/Header";
import ClientFooter from "@/client/components/ClientFooter";
import HotelGallery from "@/client/components/hotel-detail/HotelGallery";
import HotelOverview from "@/client/components/hotel-detail/HotelOverview";
import HotelRooms from "@/client/components/hotel-detail/HotelRooms";
import HotelLocation from "@/client/components/hotel-detail/HotelLocation";
import HotelFacilities from "@/client/components/hotel-detail/HotelFacilities";
import HotelPolicies from "@/client/components/hotel-detail/HotelPolicies";
import HotelReviews from "@/client/components/hotel-detail/HotelReviews";
import HotelFAQ from "@/client/components/hotel-detail/HotelFAQ";
import SimilarHotels from "@/client/components/hotel-detail/SimilarHotels";
import BookingForm from "@/client/components/hotel-detail/BookingForm";
import ComparisonFloatingBar from "@/client/components/ComparisonFloatingBar";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { useRoomComparison } from "@/hooks/use-room-comparison";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Tổng quan" },
  { id: "rooms", label: "Phòng nghỉ" },
  { id: "location", label: "Vị trí" },
  { id: "facilities", label: "Cơ sở vật chất" },
  { id: "policies", label: "Chính sách" },
  { id: "reviews", label: "Đánh giá" },
  { id: "faq", label: "FAQ" },
];

// Mock hotel data
const hotelData = {
  id: "1",
  name: "Vinpearl Resort & Spa Nha Trang Bay",
  rating: 4.8,
  reviewCount: 2847,
  starRating: 5,
  address: "Hòn Tre Island, Vinh Nguyen, Nha Trang, Khánh Hòa",
  description: "Vinpearl Resort & Spa Nha Trang Bay là khu nghỉ dưỡng 5 sao sang trọng nằm trên đảo Hòn Tre, mang đến trải nghiệm nghỉ dưỡng đẳng cấp với bãi biển riêng, hồ bơi vô cực và dịch vụ spa cao cấp. Khách sạn có view hướng biển tuyệt đẹp và nhiều tiện ích giải trí.",
  images: [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ],
  pricePerNight: 2500000,
  originalPrice: 4200000,
  discount: 40,
};

const HotelDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const { isFavorite, toggleFavorite } = useFavorites();
  const { rooms: comparisonRooms, removeRoom, clearAll } = useRoomComparison();
  const hotelId = parseInt(id || "1");
  const isFav = isFavorite(hotelId);
  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb & Actions */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/search" className="text-muted-foreground hover:text-primary transition-colors">
                Nha Trang
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {hotelData.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Chia sẻ</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={() => toggleFavorite({
                  id: hotelId,
                  name: hotelData.name,
                  image: hotelData.images[0],
                  location: hotelData.address,
                  newPrice: hotelData.pricePerNight.toLocaleString("vi-VN"),
                  rating: hotelData.rating,
                  starRating: hotelData.starRating,
                })}
              >
                <Heart className={cn("h-4 w-4", isFav && "fill-red-500 text-red-500")} />
                <span className="hidden sm:inline">{isFav ? "Đã lưu" : "Lưu"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Gallery */}
      <HotelGallery images={hotelData.images} hotelName={hotelData.name} />

      {/* Sticky Tab Navigation */}
      <div className="sticky top-[72px] z-40 bg-background border-b shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide py-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative",
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            <section id="overview">
              <HotelOverview hotel={hotelData} />
            </section>
            
            <section id="rooms">
              <HotelRooms />
            </section>
            
            <section id="location">
              <HotelLocation address={hotelData.address} />
            </section>
            
            <section id="facilities">
              <HotelFacilities />
            </section>
            
            <section id="policies">
              <HotelPolicies />
            </section>
            
            <section id="reviews">
              <HotelReviews rating={hotelData.rating} reviewCount={hotelData.reviewCount} />
            </section>

            <section id="faq">
              <HotelFAQ />
            </section>

            <section>
              <SimilarHotels />
            </section>
          </div>

          {/* Right Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-[140px]">
              <BookingForm
                hotelName={hotelData.name}
                pricePerNight={hotelData.pricePerNight}
                originalPrice={hotelData.originalPrice}
                discount={hotelData.discount}
                rating={hotelData.rating}
                reviewCount={hotelData.reviewCount}
              />
            </div>
          </div>
        </div>
      </main>

      <ClientFooter />

      <ComparisonFloatingBar
        rooms={comparisonRooms}
        onRemove={removeRoom}
        onClearAll={clearAll}
      />
    </div>
  );
};

export default HotelDetail;
