import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Header from "@/modules/client/components/layout/Header";
import ClientFooter from "@/modules/client/components/layout/ClientFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
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
  Copy,
  Check,
  Share2,
  MessageCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BookingData {
  bookingId: string;
  hotelName: string;
  hotelAddress?: string;
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
  const isMobile = useIsMobile();
  const bookingData = location.state?.booking as BookingData | undefined;
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate mock booking if no data passed
  const booking: BookingData = bookingData || {
    bookingId: `VNT${Date.now().toString().slice(-8)}`,
    hotelName: "Vinpearl Resort & Spa Nha Trang Bay",
    hotelAddress: "Đảo Hòn Tre, Vĩnh Nguyên, Nha Trang",
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
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyBookingId = async () => {
    try {
      await navigator.clipboard.writeText(booking.bookingId);
      setCopied(true);
      toast({
        title: "Đã sao chép!",
        description: `Mã đặt phòng ${booking.bookingId} đã được sao chép.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể sao chép mã đặt phòng.",
        variant: "destructive",
      });
    }
  };

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

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Xác nhận đặt phòng - ${booking.bookingId}`);
    const body = encodeURIComponent(
      `Thông tin đặt phòng:\n\n` +
      `Mã đặt phòng: ${booking.bookingId}\n` +
      `Khách sạn: ${booking.hotelName}\n` +
      `Phòng: ${booking.roomName}\n` +
      `Check-in: ${format(new Date(booking.checkIn), "dd/MM/yyyy", { locale: vi })}\n` +
      `Check-out: ${format(new Date(booking.checkOut), "dd/MM/yyyy", { locale: vi })}\n` +
      `Tổng tiền: ${booking.totalPrice.toLocaleString("vi-VN")}₫`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareMessage = () => {
    const text = encodeURIComponent(
      `✅ Đã đặt phòng thành công!\n\n` +
      `🏨 ${booking.hotelName}\n` +
      `🛏️ ${booking.roomName}\n` +
      `📅 ${format(new Date(booking.checkIn), "dd/MM")} - ${format(new Date(booking.checkOut), "dd/MM/yyyy")}\n` +
      `💰 ${booking.totalPrice.toLocaleString("vi-VN")}₫\n\n` +
      `Mã đặt phòng: ${booking.bookingId}`
    );
    
    // Try native share first
    if (navigator.share) {
      navigator.share({
        title: "Xác nhận đặt phòng",
        text: decodeURIComponent(text),
      }).catch(() => {});
    } else {
      // Fallback to SMS on mobile
      window.open(`sms:?body=${text}`);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Progress bar skeleton */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-20 hidden sm:block" />
                </div>
              ))}
            </div>
            
            {/* Success header skeleton */}
            <div className="text-center space-y-4">
              <Skeleton className="w-20 h-20 rounded-full mx-auto" />
              <Skeleton className="h-8 w-64 mx-auto" />
              <Skeleton className="h-4 w-96 mx-auto" />
            </div>
            
            {/* Booking ID skeleton */}
            <Card>
              <CardContent className="p-6 text-center">
                <Skeleton className="h-4 w-24 mx-auto mb-2" />
                <Skeleton className="h-10 w-48 mx-auto" />
              </CardContent>
            </Card>
            
            {/* Details skeleton */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-px w-full" />
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Progress Bar - Step 3/3 Complete */}
          <div className="print:hidden">
            <div className="flex items-center justify-between mb-2">
              {/* Step 1 - Complete */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium">
                  <Check className="h-4 w-4" />
                </div>
                <span className="font-medium text-green-600 hidden sm:inline text-sm">Thông tin</span>
              </div>
              
              <div className="flex-1 mx-2 sm:mx-4">
                <div className="h-2 bg-green-500 rounded-full" />
              </div>
              
              {/* Step 2 - Complete */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium">
                  <Check className="h-4 w-4" />
                </div>
                <span className="font-medium text-green-600 hidden sm:inline text-sm">Thanh toán</span>
              </div>
              
              <div className="flex-1 mx-2 sm:mx-4">
                <div className="h-2 bg-green-500 rounded-full" />
              </div>
              
              {/* Step 3 - Current/Complete */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium animate-pulse shadow-lg shadow-green-500/30">
                  <Check className="h-4 w-4" />
                </div>
                <span className="font-medium text-green-600 hidden sm:inline text-sm">Xác nhận</span>
              </div>
            </div>
            <p className="text-center text-sm text-green-600 font-medium mt-3">
              ✓ Hoàn thành 3/3 bước
            </p>
          </div>

          {/* Printable Content */}
          <div ref={printRef} className="print:p-8 print:bg-white">
            {/* Print Header - Only visible in print */}
            <div className="hidden print:block mb-8 text-center border-b pb-4">
              <h1 className="text-2xl font-bold">VietNam Travel</h1>
              <p className="text-sm text-gray-600">Xác nhận đặt phòng</p>
            </div>

            {/* Success Header */}
            <div className="text-center space-y-4 animate-fade-in print:animate-none">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 print:bg-green-50 relative">
                <CheckCircle className="h-10 w-10" />
                {/* Pulse rings */}
                <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-20" />
                <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-pulse" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-600">
                Đặt phòng thành công!
              </h1>
              <p className="text-muted-foreground print:text-gray-600">
                Cảm ơn bạn đã đặt phòng. Thông tin xác nhận đã được gửi đến email của bạn.
              </p>
            </div>

            {/* Booking ID Card with Copy Button */}
            <Card className="border-2 border-primary/20 bg-primary/5 mt-8 print:border-gray-300 print:bg-gray-50">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1 print:text-gray-600">Mã đặt phòng</p>
                <div className="flex items-center justify-center gap-3">
                  <p className="text-3xl font-bold text-primary tracking-wider print:text-gray-900">
                    {booking.bookingId}
                  </p>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 print:hidden transition-all"
                    onClick={handleCopyBookingId}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
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
                  {booking.hotelAddress && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.hotelAddress}</span>
                    </div>
                  )}
                </div>

                <Separator className="print:bg-gray-300" />

                {/* Timeline Visual for Check-in/Check-out */}
                <div className="relative">
                  <h3 className="font-medium mb-4">Lịch trình</h3>
                  <div className="flex items-stretch">
                    {/* Check-in */}
                    <div className="flex-1 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground print:text-gray-600">Nhận phòng</p>
                          <p className="font-bold text-lg">
                            {format(new Date(booking.checkIn), "dd/MM", { locale: vi })}
                          </p>
                          <p className="text-sm">
                            {format(new Date(booking.checkIn), "EEEE", { locale: vi })}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>Từ 14:00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline connector */}
                    <div className="flex-1 flex flex-col items-center justify-center px-2">
                      <div className="flex items-center w-full">
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-green-400 to-primary" />
                        <div className="mx-2 px-3 py-1 rounded-full bg-muted text-xs font-medium">
                          {booking.nights} đêm
                        </div>
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-primary to-green-400" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
                    </div>
                    
                    {/* Check-out */}
                    <div className="flex-1 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground print:text-gray-600">Trả phòng</p>
                          <p className="font-bold text-lg">
                            {format(new Date(booking.checkOut), "dd/MM", { locale: vi })}
                          </p>
                          <p className="text-sm">
                            {format(new Date(booking.checkOut), "EEEE", { locale: vi })}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>Trước 12:00</span>
                          </div>
                        </div>
                      </div>
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
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground print:text-gray-600" />
                      <span>{booking.guests} khách</span>
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
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      <span>Đã thanh toán</span>
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

          {/* Desktop Actions - Hidden in print and mobile */}
          <div className="hidden lg:flex flex-col sm:flex-row gap-3 justify-center print:hidden">
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
            
            {/* Share Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Chia sẻ
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleShareEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi qua Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareMessage}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Gửi tin nhắn
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/bookings">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Calendar className="h-4 w-4" />
                Xem đặt phòng của tôi
              </Button>
            </Link>
          </div>

          {/* Back to Home - Hidden in print and mobile */}
          <div className="text-center print:hidden hidden lg:block">
            <Link to="/">
              <Button variant="link" className="gap-2">
                <Home className="h-4 w-4" />
                Quay về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      {/* Mobile Sticky Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg lg:hidden z-50 print:hidden">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 gap-1"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            PDF
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                Chia sẻ
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShareEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareMessage}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Tin nhắn
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link to="/" className="flex-1">
            <Button className="w-full gap-1" size="sm">
              <Home className="h-4 w-4" />
              Trang chủ
            </Button>
          </Link>
        </div>
      </div>

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
