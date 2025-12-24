import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Language = "vi" | "en";

interface Translations {
  [key: string]: {
    vi: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  "nav.home": { vi: "Trang chủ", en: "Home" },
  "nav.hotels": { vi: "Khách sạn", en: "Hotels" },
  "nav.deals": { vi: "Ưu đãi", en: "Deals" },
  "nav.about": { vi: "Về chúng tôi", en: "About Us" },
  "nav.contact": { vi: "Liên hệ", en: "Contact" },
  "nav.login": { vi: "Đăng nhập", en: "Login" },
  "nav.register": { vi: "Đăng ký", en: "Register" },
  
  // Search
  "search.destination": { vi: "Điểm đến", en: "Destination" },
  "search.checkIn": { vi: "Nhận phòng", en: "Check-in" },
  "search.checkOut": { vi: "Trả phòng", en: "Check-out" },
  "search.guests": { vi: "Số khách", en: "Guests" },
  "search.rooms": { vi: "Số phòng", en: "Rooms" },
  "search.search": { vi: "Tìm kiếm", en: "Search" },
  "search.adults": { vi: "Người lớn", en: "Adults" },
  "search.children": { vi: "Trẻ em", en: "Children" },
  
  // Hotel Detail
  "hotel.overview": { vi: "Tổng quan", en: "Overview" },
  "hotel.rooms": { vi: "Phòng nghỉ", en: "Rooms" },
  "hotel.location": { vi: "Vị trí", en: "Location" },
  "hotel.facilities": { vi: "Cơ sở vật chất", en: "Facilities" },
  "hotel.policies": { vi: "Chính sách", en: "Policies" },
  "hotel.reviews": { vi: "Đánh giá", en: "Reviews" },
  "hotel.availableRooms": { vi: "Phòng nghỉ có sẵn", en: "Available Rooms" },
  "hotel.priceGuarantee": { vi: "Đảm bảo giá tốt nhất", en: "Best Price Guarantee" },
  "hotel.perNight": { vi: "/ đêm", en: "/ night" },
  "hotel.bookNow": { vi: "Đặt ngay", en: "Book Now" },
  "hotel.freeCancellation": { vi: "Hủy miễn phí", en: "Free Cancellation" },
  "hotel.breakfast": { vi: "Bữa sáng", en: "Breakfast" },
  "hotel.similarHotels": { vi: "Khách sạn tương tự", en: "Similar Hotels" },
  "hotel.faq": { vi: "Câu hỏi thường gặp", en: "FAQ" },
  
  // Booking
  "booking.confirmation": { vi: "Xác nhận đặt phòng", en: "Booking Confirmation" },
  "booking.success": { vi: "Đặt phòng thành công!", en: "Booking Successful!" },
  "booking.id": { vi: "Mã đặt phòng", en: "Booking ID" },
  "booking.details": { vi: "Chi tiết đặt phòng", en: "Booking Details" },
  "booking.guestInfo": { vi: "Thông tin khách hàng", en: "Guest Information" },
  "booking.payment": { vi: "Chi tiết thanh toán", en: "Payment Details" },
  "booking.total": { vi: "Tổng cộng", en: "Total" },
  "booking.myBookings": { vi: "Đặt phòng của tôi", en: "My Bookings" },
  "booking.upcoming": { vi: "Sắp tới", en: "Upcoming" },
  "booking.completed": { vi: "Hoàn thành", en: "Completed" },
  "booking.cancelled": { vi: "Đã hủy", en: "Cancelled" },
  
  // Common
  "common.viewAll": { vi: "Xem tất cả", en: "View All" },
  "common.share": { vi: "Chia sẻ", en: "Share" },
  "common.save": { vi: "Lưu", en: "Save" },
  "common.saved": { vi: "Đã lưu", en: "Saved" },
  "common.print": { vi: "In", en: "Print" },
  "common.download": { vi: "Tải xuống", en: "Download" },
  "common.backHome": { vi: "Quay về trang chủ", en: "Back to Home" },
  "common.loading": { vi: "Đang tải...", en: "Loading..." },
  "common.error": { vi: "Có lỗi xảy ra", en: "An error occurred" },
  "common.noResults": { vi: "Không có kết quả", en: "No results" },
  
  // Footer
  "footer.about": { vi: "Về chúng tôi", en: "About Us" },
  "footer.support": { vi: "Hỗ trợ", en: "Support" },
  "footer.partners": { vi: "Đối tác", en: "Partners" },
  "footer.legal": { vi: "Pháp lý", en: "Legal" },
  "footer.privacy": { vi: "Chính sách bảo mật", en: "Privacy Policy" },
  "footer.terms": { vi: "Điều khoản sử dụng", en: "Terms of Service" },
  "footer.copyright": { vi: "Bản quyền", en: "Copyright" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("language") as Language;
      if (stored) return stored;
    }
    return "vi";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const translation = translations[key];
      if (!translation) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
      return translation[language];
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
