import Header from "@/modules/client/components/common/Header";
import HeroSection from "@/modules/client/components/home/HeroSection";
import TrustBadges from "@/modules/client/components/common/TrustBadges";
import PopularDestinations from "@/modules/client/components/home/PopularDestinations";
import HowItWorks from "@/modules/client/components/home/HowItWorks";
import AccommodationPromotions from "@/modules/client/components/home/AccommodationPromotions";
import FeaturedHotels from "@/modules/client/components/home/FeaturedHotels";
import BlogSection from "@/modules/client/components/home/BlogSection";
import Testimonials from "@/modules/client/components/common/Testimonials";
import Newsletter from "@/modules/client/components/common/Newsletter";
import ClientFooter from "@/modules/client/components/common/ClientFooter";
import StickySearchBar from "@/modules/client/components/booking/StickySearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <StickySearchBar />
      <main>
        {/* 1. Hero Section - First Impression & Main Search */}
        <HeroSection />
        
        {/* 2. Trust Badges - Build Trust Immediately */}
        <TrustBadges />
        
        {/* 3. How It Works - Explain Process Early */}
        <HowItWorks />
        
        {/* 4. Popular Destinations - Inspire & Suggest Locations */}
        <PopularDestinations />
        
        {/* 5. Featured Hotels - Showcase Best Products */}
        <FeaturedHotels />
        
        {/* 6. Testimonials - Social Proof After Hotels */}
        <Testimonials />
        
        {/* 7. Accommodation Promotions - Incentivize Booking */}
        <AccommodationPromotions />
        
        {/* 8. Blog Section - SEO & Engagement */}
        <BlogSection />
        
        {/* 9. Newsletter - Capture Leads */}
        <Newsletter />
      </main>
      <ClientFooter />
    </div>
  );
};

export default Index;
