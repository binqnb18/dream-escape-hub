import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import PopularDestinations from "@/components/PopularDestinations";
import HowItWorks from "@/components/HowItWorks";
import AccommodationPromotions from "@/components/AccommodationPromotions";
import FeaturedHotels from "@/components/FeaturedHotels";
import BlogSection from "@/components/BlogSection";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import ClientFooter from "@/components/ClientFooter";
import StickySearchBar from "@/components/StickySearchBar";

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
        
        {/* 3. Popular Destinations - Inspire & Suggest Locations */}
        <PopularDestinations />
        
        {/* 4. Featured Hotels - Showcase Best Products */}
        <FeaturedHotels />
        
        {/* 5. Accommodation Promotions - Incentivize Booking */}
        <AccommodationPromotions />
        
        {/* 6. Testimonials - Social Proof */}
        <Testimonials />
        
        {/* 7. How It Works - Explain Process */}
        <HowItWorks />
        
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
