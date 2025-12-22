import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PopularDestinations from "@/components/PopularDestinations";
import AccommodationPromotions from "@/components/AccommodationPromotions";
import FeaturedHotels from "@/components/FeaturedHotels";
import Newsletter from "@/components/Newsletter";
import ClientFooter from "@/components/ClientFooter";
import StickySearchBar from "@/components/StickySearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <StickySearchBar />
      <main>
        <HeroSection />
        <PopularDestinations />
        <AccommodationPromotions />
        <FeaturedHotels />
        <Newsletter />
      </main>
      <ClientFooter />
    </div>
  );
};

export default Index;
