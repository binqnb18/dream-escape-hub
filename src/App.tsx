import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import HotelDetail from "./pages/HotelDetail";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import BookingConfirmation from "./pages/BookingConfirmation";
import Bookings from "./pages/Bookings";
import Destinations from "./pages/Destinations";
import Promotions from "./pages/Promotions";
import BookingDetail from "./pages/BookingDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Messages from "./pages/Messages";
import MapSearch from "./pages/MapSearch";
import ComparisonFloatingBar from "./components/ComparisonFloatingBar";
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
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/payment" element={<Payment />} />
        <Route path="/booking/confirmation" element={<BookingConfirmation />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/booking/:id" element={<BookingDetail />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-otp" element={<VerifyOtp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/map-search" element={<MapSearch />} />
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
