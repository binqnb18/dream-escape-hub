import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import ClientFooter from "@/components/ClientFooter";
import HotelGallery from "@/components/hotel-detail/HotelGallery";
import HotelOverview from "@/components/hotel-detail/HotelOverview";
import HotelRooms from "@/components/hotel-detail/HotelRooms";
import HotelLocation from "@/components/hotel-detail/HotelLocation";
import HotelFacilities from "@/components/hotel-detail/HotelFacilities";
import HotelPolicies from "@/components/hotel-detail/HotelPolicies";
import HotelReviews from "@/components/hotel-detail/HotelReviews";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart, Share2, Star } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Tổng quan" },
  { id: "rooms", label: "Phòng nghỉ" },
  { id: "location", label: "Vị trí" },
  { id: "facilities", label: "Cơ sở vật chất" },
  { id: "policies", label: "Chính sách" },
  { id: "reviews", label: "Đánh giá" },
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
          </div>

          {/* Right Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-[140px]">
              <div className="bg-card rounded-xl border shadow-lg p-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    {hotelData.pricePerNight.toLocaleString("vi-VN")}₫
                  </span>
                  <span className="text-muted-foreground">/đêm</span>
                </div>
                
                {hotelData.originalPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground line-through text-sm">
                      {hotelData.originalPrice.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="bg-destructive/10 text-destructive text-xs font-semibold px-2 py-1 rounded">
                      -{hotelData.discount}%
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{hotelData.rating}</span>
                  <span className="text-muted-foreground">
                    ({hotelData.reviewCount.toLocaleString()} đánh giá)
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Nhận phòng</p>
                      <p className="font-medium">24/12/2024</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Trả phòng</p>
                      <p className="font-medium">26/12/2024</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Số khách</p>
                    <p className="font-medium">2 người lớn, 1 phòng</p>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Đặt ngay
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Bạn chưa bị trừ tiền
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
};

export default HotelDetail;
