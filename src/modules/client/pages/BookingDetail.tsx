import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/modules/client/components/layout/Header";
import ClientFooter from "@/modules/client/components/layout/ClientFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Phone,
  Mail,
  FileText,
  Download,
  Printer,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CreditCard,
  Building2,
  Bed,
  Star,
  Shield,
  Info,
  Copy,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import hotelImage1 from "@/assets/hotel-1.jpg";
import hotelImage2 from "@/assets/hotel-2.jpg";

interface BookingDetail {
  id: string;
  hotelName: string;
  hotelImage: string;
  hotelAddress: string;
  hotelPhone: string;
  hotelEmail: string;
  hotelRating: number;
  roomName: string;
  roomSize: number;
  roomAmenities: string[];
  location: string;
  checkIn: Date;
  checkOut: Date;
  checkInTime: string;
  checkOutTime: string;
  guests: number;
  adults: number;
  children: number;
  nights: number;
  roomPrice: number;
  roomCount: number;
  serviceFee: number;
  tax: number;
  discount: number;
  totalPrice: number;
  status: "upcoming" | "completed" | "cancelled";
  paymentStatus: "paid" | "pending" | "refunded";
  paymentMethod: string;
  createdAt: Date;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
}

// Mock data - would come from API
const mockBookingDetails: Record<string, BookingDetail> = {
  "VNT12345678": {
    id: "VNT12345678",
    hotelName: "Vinpearl Resort & Spa Nha Trang Bay",
    hotelImage: hotelImage1,
    hotelAddress: "Đảo Hòn Tre, Vĩnh Nguyên, Nha Trang, Khánh Hòa",
    hotelPhone: "+84 258 359 8888",
    hotelEmail: "reservation@vinpearl.com",
    hotelRating: 4.8,
    roomName: "Phòng Deluxe Hướng Biển",
    roomSize: 45,
    roomAmenities: ["Wifi miễn phí", "Điều hòa", "Minibar", "Bồn tắm", "Ban công hướng biển"],
    location: "Nha Trang, Khánh Hòa",
    checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    checkInTime: "14:00",
    checkOutTime: "12:00",
    guests: 2,
    adults: 2,
    children: 0,
    nights: 2,
    roomPrice: 2200000,
    roomCount: 1,
    serviceFee: 220000,
    tax: 440000,
    discount: 0,
    totalPrice: 5060000,
    status: "upcoming",
    paymentStatus: "paid",
    paymentMethod: "Thẻ tín dụng Visa ****4242",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    guestName: "Nguyễn Văn An",
    guestEmail: "nguyenvanan@email.com",
    guestPhone: "+84 912 345 678",
    specialRequests: "Phòng tầng cao, xa thang máy",
  },
  "VNT87654321": {
    id: "VNT87654321",
    hotelName: "Fusion Resort Nha Trang",
    hotelImage: hotelImage2,
    hotelAddress: "Lô D10, Bắc Bán Đảo Cam Ranh, Cam Lâm, Khánh Hòa",
    hotelPhone: "+84 258 398 9999",
    hotelEmail: "info@fusionresort.com",
    hotelRating: 4.9,
    roomName: "Ocean View Suite",
    roomSize: 65,
    roomAmenities: ["Wifi miễn phí", "Spa miễn phí", "Hồ bơi riêng", "Bếp nhỏ", "Phòng khách"],
    location: "Cam Ranh, Khánh Hòa",
    checkIn: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    checkInTime: "14:00",
    checkOutTime: "12:00",
    guests: 2,
    adults: 2,
    children: 0,
    nights: 2,
    roomPrice: 2800000,
    roomCount: 1,
    serviceFee: 280000,
    tax: 560000,
    discount: 500000,
    totalPrice: 5940000,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "MoMo",
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    guestName: "Trần Thị Bình",
    guestEmail: "tranthibinh@email.com",
    guestPhone: "+84 987 654 321",
  },
};

const statusConfig = {
  upcoming: {
    label: "Sắp tới",
    variant: "default" as const,
    icon: Clock,
    color: "text-blue-600 bg-blue-50",
  },
  completed: {
    label: "Hoàn thành",
    variant: "secondary" as const,
    icon: CheckCircle,
    color: "text-green-600 bg-green-50",
  },
  cancelled: {
    label: "Đã hủy",
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-red-600 bg-red-50",
  },
};

const paymentStatusConfig = {
  paid: { label: "Đã thanh toán", color: "text-green-600 bg-green-50" },
  pending: { label: "Chờ thanh toán", color: "text-amber-600 bg-amber-50" },
  refunded: { label: "Đã hoàn tiền", color: "text-blue-600 bg-blue-50" },
};

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const booking = id ? mockBookingDetails[id] : null;

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy đặt phòng</h1>
          <p className="text-muted-foreground mb-6">
            Mã đặt phòng không tồn tại hoặc đã bị xóa
          </p>
          <Button onClick={() => navigate("/bookings")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </main>
        <ClientFooter />
      </div>
    );
  }

  const statusInfo = statusConfig[booking.status];
  const StatusIcon = statusInfo.icon;
  const paymentInfo = paymentStatusConfig[booking.paymentStatus];

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    toast({ title: "Đã sao chép mã đặt phòng" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadInvoice = () => {
    toast({
      title: "Đang tải hóa đơn",
      description: "Hóa đơn PDF sẽ được tải xuống trong giây lát",
    });
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleCancelBooking = async () => {
    setCancelling(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCancelling(false);
    setShowCancelDialog(false);
    toast({
      title: "Đã hủy đặt phòng",
      description: "Yêu cầu hoàn tiền sẽ được xử lý trong 7-14 ngày làm việc",
    });
    navigate("/bookings");
  };

  // Calculate refund based on cancellation timing
  const getRefundPolicy = () => {
    const hoursUntilCheckIn = (booking.checkIn.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilCheckIn > 72) return { percent: 100, amount: booking.totalPrice };
    if (hoursUntilCheckIn > 48) return { percent: 70, amount: booking.totalPrice * 0.7 };
    if (hoursUntilCheckIn > 24) return { percent: 50, amount: booking.totalPrice * 0.5 };
    return { percent: 0, amount: 0 };
  };

  const refundPolicy = getRefundPolicy();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Back button & Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/bookings")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">Chi tiết đặt phòng</h1>
                <Badge className={statusInfo.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Mã đặt phòng:</span>
                <code className="font-mono font-semibold text-primary">{booking.id}</code>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyBookingId}>
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
                <Download className="h-4 w-4 mr-2" />
                Tải hóa đơn
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
                <Printer className="h-4 w-4 mr-2" />
                In
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel & Room Info */}
            <Card>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-72 h-48 md:h-auto relative">
                    <img
                      src={booking.hotelImage}
                      alt={booking.hotelName}
                      className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                    />
                  </div>
                  <div className="flex-1 p-5 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="font-semibold">{booking.hotelRating}</span>
                      </div>
                      <h2 className="text-xl font-bold">{booking.hotelName}</h2>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        {booking.hotelAddress}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Bed className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">{booking.roomName}</p>
                          <p className="text-sm text-muted-foreground">{booking.roomSize}m² • {booking.roomCount} phòng</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">{booking.guests} khách</p>
                          <p className="text-sm text-muted-foreground">{booking.adults} người lớn, {booking.children} trẻ em</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {booking.roomAmenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Check-in/out Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Thông tin lưu trú
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Nhận phòng</p>
                    <p className="text-lg font-bold">
                      {format(booking.checkIn, "dd/MM/yyyy", { locale: vi })}
                    </p>
                    <p className="text-sm text-primary font-medium">Từ {booking.checkInTime}</p>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg border-2 border-dashed border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Thời gian lưu trú</p>
                    <p className="text-2xl font-bold text-primary">{booking.nights}</p>
                    <p className="text-sm text-muted-foreground">đêm</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Trả phòng</p>
                    <p className="text-lg font-bold">
                      {format(booking.checkOut, "dd/MM/yyyy", { locale: vi })}
                    </p>
                    <p className="text-sm text-primary font-medium">Trước {booking.checkOutTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Họ và tên</p>
                    <p className="font-medium">{booking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{booking.guestEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium">{booking.guestPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày đặt</p>
                    <p className="font-medium">
                      {format(booking.createdAt, "dd/MM/yyyy HH:mm", { locale: vi })}
                    </p>
                  </div>
                </div>
                {booking.specialRequests && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Yêu cầu đặc biệt</p>
                    <p className="text-sm bg-muted/50 p-3 rounded-lg">{booking.specialRequests}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hotel Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Liên hệ khách sạn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Điện thoại</p>
                      <p className="font-medium">{booking.hotelPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{booking.hotelEmail}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Chi tiết thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <Badge className={paymentInfo.color}>{paymentInfo.label}</Badge>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {booking.roomPrice.toLocaleString("vi-VN")}₫ x {booking.nights} đêm x {booking.roomCount} phòng
                    </span>
                    <span>{(booking.roomPrice * booking.nights * booking.roomCount).toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thuế VAT (10%)</span>
                    <span>{booking.tax.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí dịch vụ (5%)</span>
                    <span>{booking.serviceFee.toLocaleString("vi-VN")}₫</span>
                  </div>
                  {booking.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span>-{booking.discount.toLocaleString("vi-VN")}₫</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{booking.totalPrice.toLocaleString("vi-VN")}₫</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <CreditCard className="h-4 w-4" />
                  <span>{booking.paymentMethod}</span>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Chính sách hủy phòng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Hủy trước 72h: Hoàn 100%</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <span>Hủy trước 48-72h: Hoàn 70%</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                  <span>Hủy trước 24-48h: Hoàn 50%</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <span>Hủy trong 24h: Không hoàn tiền</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {booking.status === "upcoming" && (
              <Card className="border-destructive/20">
                <CardContent className="p-4">
                  <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <XCircle className="h-4 w-4 mr-2" />
                        Hủy đặt phòng
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận hủy đặt phòng</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4">
                          <p>Bạn có chắc chắn muốn hủy đặt phòng này?</p>
                          
                          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Mã đặt phòng:</span>
                              <span className="font-mono font-medium">{booking.id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Khách sạn:</span>
                              <span className="font-medium">{booking.hotelName}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-sm">
                              <span>Tổng tiền đã thanh toán:</span>
                              <span className="font-medium">{booking.totalPrice.toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Số tiền hoàn lại ({refundPolicy.percent}%):</span>
                              <span className="font-bold">{refundPolicy.amount.toLocaleString("vi-VN")}₫</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Shield className="h-4 w-4 mt-0.5" />
                            <span>Tiền hoàn sẽ được chuyển về phương thức thanh toán ban đầu trong 7-14 ngày làm việc.</span>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Quay lại</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancelBooking}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={cancelling}
                        >
                          {cancelling ? "Đang xử lý..." : "Xác nhận hủy"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            )}

            {/* Support */}
            <Card className="bg-muted/30">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="font-medium mb-1">Cần hỗ trợ?</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Đội ngũ hỗ trợ 24/7 sẵn sàng giúp đỡ bạn
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  1900 1234
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
};

export default BookingDetail;
