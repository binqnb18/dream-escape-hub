import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Client Pages
import Home from "./client/pages/Home";
import SearchResults from "./client/pages/SearchResults";
import HotelDetail from "./client/pages/HotelDetail";
import Booking from "./client/pages/Booking";
import Payment from "./client/pages/Payment";
import Confirmation from "./client/pages/Confirmation";
import MyBookings from "./client/pages/MyBookings";
import BookingDetail from "./client/pages/BookingDetail";
import Destinations from "./client/pages/Destinations";
import DestinationDetail from "./client/pages/DestinationDetail";
import ClientPromotions from "./client/pages/ClientPromotions";
import Login from "./client/pages/Login";
import Signup from "./client/pages/Signup";
import ForgotPassword from "./client/pages/ForgotPassword";
import VerifyOtp from "./client/pages/VerifyOtp";
import Profile from "./client/pages/Profile";
import Wishlist from "./client/pages/Wishlist";
import ClientMessages from "./client/pages/ClientMessages";
import MapSearch from "./client/pages/MapSearch";
import ClientInvoices from "./client/pages/ClientInvoices";
import CompareRooms from "./client/pages/CompareRooms";
import HelpCenter from "./client/pages/HelpCenter";
import AboutUs from "./client/pages/AboutUs";
import TermsPrivacy from "./client/pages/TermsPrivacy";
import WriteReview from "./client/pages/WriteReview";
import NotificationCenter from "./client/pages/NotificationCenter";
import BlogDetail from "./client/pages/BlogDetail";
import AccountSettings from "./client/pages/AccountSettings";

// Partner Pages
import PartnerLogin from "./partner/pages/PartnerLogin";
import PartnerSignup from "./partner/pages/PartnerSignup";
import PartnerDashboard from "./partner/pages/PartnerDashboard";

// Shared Pages
import NotFound from "./pages/NotFound";

// Components & Providers
import ComparisonFloatingBar from "./client/components/ComparisonFloatingBar";
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
