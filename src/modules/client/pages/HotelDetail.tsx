import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/modules/client/components/common/Header";
import ClientFooter from "@/modules/client/components/common/ClientFooter";
import HotelGallery from "@/modules/client/components/hotel/HotelGallery";
import HotelOverview from "@/modules/client/components/hotel/HotelOverview";
import HotelRooms from "@/modules/client/components/hotel/HotelRooms";
import HotelLocation from "@/modules/client/components/hotel/HotelLocation";
import HotelFacilities from "@/modules/client/components/hotel/HotelFacilities";
import HotelPolicies from "@/modules/client/components/hotel/HotelPolicies";
import HotelReviews from "@/modules/client/components/hotel/HotelReviews";
import HotelFAQ from "@/modules/client/components/hotel/HotelFAQ";
import SimilarHotels from "@/modules/client/components/hotel/SimilarHotels";
import BookingForm from "@/modules/client/components/hotel/BookingForm";
import ComparisonFloatingBar from "@/modules/client/components/hotel/ComparisonFloatingBar";
import ShareModal from "@/modules/client/components/hotel/ShareModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Share2, ChevronRight } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { useRoomComparison } from "@/hooks/use-room-comparison";
import { cn } from "@/lib/utils";
import hotelImage1 from "@/assets/hotel-1.jpg";
import hotelImage2 from "@/assets/hotel-2.jpg";
import hotelImage3 from "@/assets/hotel-3.jpg";
import hotelImage4 from "@/assets/hotel-4.jpg";
import hotelImage5 from "@/assets/hotel-5.jpg";

const tabs = [
  { id: "overview", label: "Tổng quan" },
  { id: "rooms", label: "Phòng nghỉ" },
  { id: "location", label: "Vị trí" },
  { id: "facilities", label: "Tiện ích" },
  { id: "policies", label: "Chính sách" },
  { id: "reviews", label: "Đánh giá" },
  { id: "faq", label: "FAQ" },
];

// Mock hotel data với ảnh thực
const hotelData = {
  id: "1",
  name: "Vinpearl Resort & Spa Nha Trang Bay",
  rating: 4.8,
  reviewCount: 2847,
  starRating: 5,
  address: "Hòn Tre Island, Vinh Nguyen, Nha Trang, Khánh Hòa",
  description: "Vinpearl Resort & Spa Nha Trang Bay là khu nghỉ dưỡng 5 sao sang trọng nằm trên đảo Hòn Tre, mang đến trải nghiệm nghỉ dưỡng đẳng cấp với bãi biển riêng, hồ bơi vô cực và dịch vụ spa cao cấp. Khách sạn có view hướng biển tuyệt đẹp và nhiều tiện ích giải trí.",
  images: [hotelImage1, hotelImage2, hotelImage3, hotelImage4, hotelImage5, hotelImage1],
  pricePerNight: 2500000,
  originalPrice: 4200000,
  discount: 40,
};

const HotelDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { rooms: comparisonRooms, removeRoom, clearAll } = useRoomComparison();
  const hotelId = parseInt(id || "1");
  const isFav = isFavorite(hotelId);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = tabs.map(tab => document.getElementById(tab.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveTab(tabs[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-[400px] w-full rounded-xl mb-6" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb & Actions */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-1 text-sm overflow-x-auto">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
                Trang chủ
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Link to="/destinations" className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
                Điểm đến
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Link to="/search?location=nha-trang" className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
                Nha Trang
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-[300px]">
                {hotelData.name}
              </span>
            </nav>
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 ml-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 hover:bg-primary/10 hover:text-primary"
                onClick={() => setShareModalOpen(true)}
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Chia sẻ</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "gap-2 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950",
                  isFav && "text-red-500"
                )}
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
                <Heart className={cn("h-4 w-4 transition-all", isFav && "fill-red-500 text-red-500 scale-110")} />
                <span className="hidden sm:inline">{isFav ? "Đã lưu" : "Lưu"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Gallery */}
      <HotelGallery images={hotelData.images} hotelName={hotelData.name} />

      {/* Sticky Tab Navigation */}
      <div className="sticky top-[72px] z-40 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide py-1 -mx-4 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 relative rounded-lg",
                  activeTab === tab.id
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full transition-all duration-300" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-10">
            <section id="overview" className="scroll-mt-36">
              <HotelOverview hotel={hotelData} />
            </section>
            
            <section id="rooms" className="scroll-mt-36">
              <HotelRooms hotelId={hotelData.id} hotelName={hotelData.name} />
            </section>
            
            <section id="location" className="scroll-mt-36">
              <HotelLocation address={hotelData.address} />
            </section>
            
            <section id="facilities" className="scroll-mt-36">
              <HotelFacilities />
            </section>
            
            <section id="policies" className="scroll-mt-36">
              <HotelPolicies />
            </section>
            
            <section id="reviews" className="scroll-mt-36">
              <HotelReviews rating={hotelData.rating} reviewCount={hotelData.reviewCount} />
            </section>

            <section id="faq" className="scroll-mt-36">
              <HotelFAQ />
            </section>

            <section className="pt-6 border-t">
              <SimilarHotels />
            </section>
          </div>

          {/* Right Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-[140px] space-y-4">
              <BookingForm
                hotelName={hotelData.name}
                pricePerNight={hotelData.pricePerNight}
                originalPrice={hotelData.originalPrice}
                discount={hotelData.discount}
                rating={hotelData.rating}
                reviewCount={hotelData.reviewCount}
              />
              
              {/* Quick contact info */}
              <div className="bg-muted/30 rounded-xl p-4 text-center text-sm">
                <p className="text-muted-foreground">Cần hỗ trợ đặt phòng?</p>
                <p className="font-semibold text-primary mt-1">1900 1234</p>
              </div>
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

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={hotelData.name}
        description={hotelData.description}
        image={hotelData.images[0]}
      />
    </div>
  );
};

export default HotelDetail;
