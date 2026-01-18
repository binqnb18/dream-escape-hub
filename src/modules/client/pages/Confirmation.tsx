import { useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Header from "@/modules/client/components/common/Header";
import ClientFooter from "@/modules/client/components/common/ClientFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Printer,
  Download,
  Home,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface BookingData {
  bookingId: string;
  hotelName: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  nights: number;
  roomPrice: number;
  totalPrice: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
}

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const bookingData = location.state?.booking as BookingData | undefined;
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate mock booking if no data passed
  const booking: BookingData = bookingData || {
    bookingId: `VNT${Date.now().toString().slice(-8)}`,
    hotelName: "Vinpearl Resort & Spa Nha Trang Bay",
    roomName: "Phòng Deluxe Hướng Biển",
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    guests: 2,
    nights: 2,
    roomPrice: 2500000,
    totalPrice: 5000000,
    guestName: "Nguyễn Văn A",
    guestEmail: "nguyenvana@email.com",
    guestPhone: "0901234567",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = printRef.current;
      
      if (!element) {
        throw new Error("Content not found");
      }

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `booking-${booking.bookingId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
      
      toast({
        title: "Tải xuống thành công",
        description: `File booking-${booking.bookingId}.pdf đã được tải xuống.`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Lỗi tải xuống",
        description: "Không thể tạo file PDF. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Printable Content */}
          <div ref={printRef} className="print:p-8 print:bg-white">
            {/* Print Header - Only visible in print */}
            <div className="hidden print:block mb-8 text-center border-b pb-4">
              <h1 className="text-2xl font-bold">VietNam Travel</h1>
              <p className="text-sm text-gray-600">Xác nhận đặt phòng</p>
            </div>

            {/* Success Header */}
            <div className="text-center space-y-4 animate-fade-in print:animate-none">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 print:bg-green-50">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-600">
                Đặt phòng thành công!
              </h1>
              <p className="text-muted-foreground print:text-gray-600">
                Cảm ơn bạn đã đặt phòng. Thông tin xác nhận đã được gửi đến email của bạn.
              </p>
            </div>

            {/* Booking ID Card */}
            <Card className="border-2 border-primary/20 bg-primary/5 mt-8 print:border-gray-300 print:bg-gray-50">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1 print:text-gray-600">Mã đặt phòng</p>
                <p className="text-3xl font-bold text-primary tracking-wider print:text-gray-900">
                  {booking.bookingId}
                </p>
                <p className="text-xs text-muted-foreground mt-2 print:text-gray-600">
                  Vui lòng lưu mã này để check-in tại khách sạn
                </p>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card className="mt-6 print:border-gray-300 print:shadow-none">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-lg font-semibold">Chi tiết đặt phòng</h2>

                {/* Hotel Info */}
                <div className="space-y-2">
                  <h3 className="font-medium text-primary print:text-gray-900">{booking.hotelName}</h3>
                  <p className="text-muted-foreground print:text-gray-600">{booking.roomName}</p>
                </div>

                <Separator className="print:bg-gray-300" />

                {/* Dates & Guests */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5 print:text-gray-700" />
                    <div>
                      <p className="text-sm text-muted-foreground print:text-gray-600">Nhận phòng</p>
                      <p className="font-medium">
                        {format(new Date(booking.checkIn), "EEEE, dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground print:text-gray-600">Từ 14:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5 print:text-gray-700" />
                    <div>
                      <p className="text-sm text-muted-foreground print:text-gray-600">Trả phòng</p>
                      <p className="font-medium">
                        {format(new Date(booking.checkOut), "EEEE, dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground print:text-gray-600">Trước 12:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5 print:text-gray-700" />
                    <div>
                      <p className="text-sm text-muted-foreground print:text-gray-600">Số khách</p>
                      <p className="font-medium">{booking.guests} người lớn</p>
                      <p className="text-sm text-muted-foreground print:text-gray-600">
                        {booking.nights} đêm
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="print:bg-gray-300" />

                {/* Guest Info */}
                <div className="space-y-3">
                  <h3 className="font-medium">Thông tin khách hàng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm print:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground print:text-gray-600" />
                      <span>{booking.guestName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground print:text-gray-600" />
                      <span>{booking.guestEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground print:text-gray-600" />
                      <span>{booking.guestPhone}</span>
                    </div>
                  </div>
                </div>

                <Separator className="print:bg-gray-300" />

                {/* Price Summary */}
                <div className="space-y-3">
                  <h3 className="font-medium">Chi tiết thanh toán</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground print:text-gray-600">
                        {booking.roomName} x {booking.nights} đêm
                      </span>
                      <span>
                        {(booking.roomPrice * booking.nights).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground print:text-gray-600">Thuế & phí dịch vụ</span>
                      <span>Đã bao gồm</span>
                    </div>
                    <Separator className="print:bg-gray-300" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-primary print:text-gray-900">
                        {booking.totalPrice.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Print Footer - Only visible in print */}
            <div className="hidden print:block mt-8 pt-4 border-t text-center text-sm text-gray-600">
              <p>Cảm ơn bạn đã sử dụng dịch vụ của VietNam Travel!</p>
              <p className="mt-1">Hotline hỗ trợ: 1900 1234 | Email: support@vietnamtravel.com</p>
              <p className="mt-2 text-xs">
                Ngày in: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: vi })}
              </p>
            </div>
          </div>

          {/* Actions - Hidden in print */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center print:hidden">
            <Button variant="outline" className="gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              In xác nhận
            </Button>
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isDownloading ? "Đang tải..." : "Tải PDF"}
            </Button>
            <Link to="/bookings">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Calendar className="h-4 w-4" />
                Xem đặt phòng của tôi
              </Button>
            </Link>
          </div>

          {/* Back to Home - Hidden in print */}
          <div className="text-center print:hidden">
            <Link to="/">
              <Button variant="link" className="gap-2">
                <Home className="h-4 w-4" />
                Quay về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <ClientFooter />

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #root {
            visibility: visible;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          header, footer, nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmation;
