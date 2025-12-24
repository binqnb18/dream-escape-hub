import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import ClientFooter from "@/components/ClientFooter";
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
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

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
  const bookingData = location.state?.booking as BookingData | undefined;

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-green-600">
              Đặt phòng thành công!
            </h1>
            <p className="text-muted-foreground">
              Cảm ơn bạn đã đặt phòng. Thông tin xác nhận đã được gửi đến email của bạn.
            </p>
          </div>

          {/* Booking ID Card */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Mã đặt phòng</p>
              <p className="text-3xl font-bold text-primary tracking-wider">
                {booking.bookingId}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Vui lòng lưu mã này để check-in tại khách sạn
              </p>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold">Chi tiết đặt phòng</h2>

              {/* Hotel Info */}
              <div className="space-y-2">
                <h3 className="font-medium text-primary">{booking.hotelName}</h3>
                <p className="text-muted-foreground">{booking.roomName}</p>
              </div>

              <Separator />

              {/* Dates & Guests */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nhận phòng</p>
                    <p className="font-medium">
                      {format(new Date(booking.checkIn), "EEEE, dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">Từ 14:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Trả phòng</p>
                    <p className="font-medium">
                      {format(new Date(booking.checkOut), "EEEE, dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">Trước 12:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Số khách</p>
                    <p className="font-medium">{booking.guests} người lớn</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.nights} đêm
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Guest Info */}
              <div className="space-y-3">
                <h3 className="font-medium">Thông tin khách hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.guestName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.guestEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.guestPhone}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Price Summary */}
              <div className="space-y-3">
                <h3 className="font-medium">Chi tiết thanh toán</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {booking.roomName} x {booking.nights} đêm
                    </span>
                    <span>
                      {(booking.roomPrice * booking.nights).toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thuế & phí dịch vụ</span>
                    <span>Đã bao gồm</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">
                      {booking.totalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              In xác nhận
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Tải PDF
            </Button>
            <Link to="/bookings">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Calendar className="h-4 w-4" />
                Xem đặt phòng của tôi
              </Button>
            </Link>
          </div>

          {/* Back to Home */}
          <div className="text-center">
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
    </div>
  );
};

export default BookingConfirmation;
