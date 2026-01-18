import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Client Pages
import Home from "@/modules/client/pages/Home";
import SearchResults from "@/modules/client/pages/SearchResults";
import HotelDetail from "@/modules/client/pages/HotelDetail";
import Booking from "@/modules/client/pages/Booking";
import Payment from "@/modules/client/pages/Payment";
import Confirmation from "@/modules/client/pages/Confirmation";
import MyBookings from "@/modules/client/pages/MyBookings";
import BookingDetail from "@/modules/client/pages/BookingDetail";
import Destinations from "@/modules/client/pages/Destinations";
import DestinationDetail from "@/modules/client/pages/DestinationDetail";
import ClientPromotions from "@/modules/client/pages/ClientPromotions";
import Login from "@/modules/client/pages/Login";
import Signup from "@/modules/client/pages/Signup";
import ForgotPassword from "@/modules/client/pages/ForgotPassword";
import VerifyOtp from "@/modules/client/pages/VerifyOtp";
import Profile from "@/modules/client/pages/Profile";
import Wishlist from "@/modules/client/pages/Wishlist";
import ClientMessages from "@/modules/client/pages/ClientMessages";
import MapSearch from "@/modules/client/pages/MapSearch";
import ClientInvoices from "@/modules/client/pages/ClientInvoices";
import CompareRooms from "@/modules/client/pages/CompareRooms";
import HelpCenter from "@/modules/client/pages/HelpCenter";
import AboutUs from "@/modules/client/pages/AboutUs";
import TermsPrivacy from "@/modules/client/pages/TermsPrivacy";
import WriteReview from "@/modules/client/pages/WriteReview";
import NotificationCenter from "@/modules/client/pages/NotificationCenter";
import BlogDetail from "@/modules/client/pages/BlogDetail";
import AccountSettings from "@/modules/client/pages/AccountSettings";

// Partner Pages
import PartnerLogin from "./partner/pages/PartnerLogin";
import PartnerSignup from "./partner/pages/PartnerSignup";
import PartnerDashboard from "./partner/pages/PartnerDashboard";

// Shared Pages
import NotFound from "./pages/NotFound";

// Components & Providers
import ComparisonFloatingBar from "@/modules/client/components/hotel/ComparisonFloatingBar";
import { useRoomComparison } from "./hooks/use-room-comparison";
import { ThemeProvider } from "./hooks/use-theme";
import { LanguageProvider } from "./hooks/use-language";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const { rooms, removeRoom, clearAll } = useRoomComparison();

  return (
    <>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/payment" element={<Payment />} />
        <Route path="/booking/confirmation" element={<Confirmation />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/booking/:id" element={<BookingDetail />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
        <Route path="/promotions" element={<ClientPromotions />} />
        <Route path="/compare-rooms" element={<CompareRooms />} />
        <Route path="/invoices" element={<ClientInvoices />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/terms" element={<TermsPrivacy />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        
        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-otp" element={<VerifyOtp />} />
        
        {/* User Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/messages" element={<ClientMessages />} />
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/write-review/:bookingId" element={<WriteReview />} />
        <Route path="/map-search" element={<MapSearch />} />
        
        {/* Partner Routes */}
        <Route path="/partner/login" element={<PartnerLogin />} />
        <Route path="/partner/signup" element={<PartnerSignup />} />
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ComparisonFloatingBar
        rooms={rooms}
        onRemove={removeRoom}
        onClearAll={clearAll}
      />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
