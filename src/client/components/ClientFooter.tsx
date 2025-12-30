import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ClientFooter = () => {
  const footerLinks = {
    support: {
      title: "Hỗ trợ",
      links: [
        { label: "Quản lý đặt phòng", href: "/bookings" },
        { label: "Trung tâm trợ giúp", href: "/help" },
        { label: "Hóa đơn của tôi", href: "/invoices" },
        { label: "Liên hệ hỗ trợ", href: "/messages" },
      ],
    },
    discover: {
      title: "Khám phá VBOOKING",
      links: [
        { label: "Ưu đãi hiện hành", href: "/promotions", underline: true },
        { label: "Tìm khách sạn", href: "/search" },
        { label: "Điểm đến phổ biến", href: "/destinations" },
        { label: "Tìm trên bản đồ", href: "/map-search" },
      ],
    },
    terms: {
      title: "Điều khoản & chính sách",
      links: [
        { label: "Chính sách bảo mật", href: "/terms" },
        { label: "Điều khoản sử dụng", href: "/terms" },
        { label: "Chính sách hủy phòng", href: "/terms" },
        { label: "Quy định thanh toán", href: "/terms" },
      ],
    },
    partners: {
      title: "Đối tác khách sạn",
      links: [
        { label: "Trở thành đối tác", href: "/partner/signup" },
        { label: "Đăng nhập đối tác", href: "/partner/login" },
        { label: "Hỗ trợ đối tác", href: "/help" },
      ],
    },
    about: {
      title: "Về VBOOKING",
      links: [
        { label: "Giới thiệu", href: "/about" },
        { label: "Cách hoạt động", href: "/about" },
        { label: "Blog du lịch", href: "/blog/1" },
        { label: "Liên hệ", href: "/help" },
      ],
    },
  };

  return (
    <footer className="w-full bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-8">
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="space-y-3">
              <h3 className="font-semibold text-foreground text-sm">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.href}
                      className={`text-sm text-muted-foreground hover:text-foreground transition-colors ${
                        link.underline ? "underline" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Currency Selector */}
        <div className="mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-2">
            {/* Vietnam Flag */}
            <div className="relative w-5 h-5 flex-shrink-0">
              <div className="absolute inset-0 bg-red-600 rounded-sm"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-yellow-400" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
              </div>
            </div>
            <Select defaultValue="vnd">
              <SelectTrigger className="w-auto h-auto text-sm border-0 bg-transparent p-0 hover:bg-transparent shadow-none focus:ring-0">
                <SelectValue className="text-sm text-foreground" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vnd">VND</SelectItem>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
                <SelectItem value="gbp">GBP</SelectItem>
                <SelectItem value="jpy">JPY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Copyright */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            VBOOKING là nền tảng đặt phòng khách sạn trực tuyến giúp bạn tìm và đặt chỗ nghỉ phù hợp tại Việt Nam và
            trên toàn thế giới.
          </p>
          <p className="text-sm text-muted-foreground">
            Bản quyền © 2025 VBOOKING. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ClientFooter;
