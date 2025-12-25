import Header from "@/client/components/Header";
import HeroSection from "@/client/components/HeroSection";
import TrustBadges from "@/client/components/TrustBadges";
import PopularDestinations from "@/client/components/PopularDestinations";
import HowItWorks from "@/client/components/HowItWorks";
import AccommodationPromotions from "@/client/components/AccommodationPromotions";
import FeaturedHotels from "@/client/components/FeaturedHotels";
import BlogSection from "@/client/components/BlogSection";
import Testimonials from "@/client/components/Testimonials";
import Newsletter from "@/client/components/Newsletter";
import ClientFooter from "@/client/components/ClientFooter";
import StickySearchBar from "@/client/components/StickySearchBar";

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
