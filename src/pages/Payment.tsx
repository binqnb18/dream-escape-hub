import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  Users,
  MapPin,
  Star,
  ChevronLeft,
  CreditCard,
  Shield,
  Check,
  Smartphone,
  QrCode,
  Building2,
  Loader2,
  Clock,
  Info,
  AlertCircle,
  BadgePercent,
  Gift,
  Timer,
  RefreshCw,
} from "lucide-react";
import Header from "@/components/Header";
import ClientFooter from "@/components/ClientFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PaymentState {
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  hotelRating: number;
  hotelAddress: string;
  roomName: string;
  roomPrice: number;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  adults: number;
  children: number;
  rooms: number;
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    specialRequests?: string;
  };
  totalPrice: number;
  serviceFee: number;
  grandTotal: number;
}

const paymentMethods = [
  {
    id: "momo",
    name: "Ví MoMo",
    icon: Smartphone,
    description: "Thanh toán qua ví điện tử MoMo",
    color: "bg-pink-500",
  },
  {
    id: "vnpay",
    name: "VNPay",
    icon: Building2,
    description: "Thanh toán qua VNPay QR",
    color: "bg-blue-600",
  },
  {
    id: "card",
    name: "Thẻ ngân hàng",
    icon: CreditCard,
    description: "Visa, Mastercard, JCB, American Express",
    color: "bg-gradient-to-r from-blue-500 to-purple-500",
  },
  {
    id: "qr",
    name: "Quét QR",
    icon: QrCode,
    description: "Quét mã QR để thanh toán nhanh",
    color: "bg-green-500",
  },
];

// Countdown Timer Hook with expiry callback
const useCountdown = (initialMinutes: number = 20, onExpire?: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!hasExpired) {
        setHasExpired(true);
        onExpire?.();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasExpired, onExpire]);

  const reset = (minutes: number = initialMinutes) => {
    setTimeLeft(minutes * 60);
    setHasExpired(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    minutes,
    seconds,
    timeLeft,
    hasExpired,
    reset,
    formatted: `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
  };
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("momo");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);

  const handleCountdownExpire = useCallback(() => {
    setShowExpiredDialog(true);
  }, []);

  const countdown = useCountdown(20, handleCountdownExpire);

  const handleExtendTime = () => {
    countdown.reset(10); // Extend 10 more minutes
    setShowExpiredDialog(false);
    toast.success("Đã gia hạn thêm 10 phút!", {
      description: "Vui lòng hoàn tất thanh toán trong thời gian này.",
    });
  };

  const handleGoBack = () => {
    setShowExpiredDialog(false);
    navigate(-1);
  };

  const paymentState = location.state as PaymentState | undefined;

  // Mock data if no state - with discount pricing
  const originalPrice = 7049017; // Original high price
  const discountPercent = 57;
  const ourPrice = Math.round(originalPrice * (1 - discountPercent / 100));

  const booking: PaymentState = paymentState || {
    hotelId: "1",
    hotelName: "Vinpearl Resort & Spa Nha Trang Bay",
    hotelImage: "/placeholder.svg",
    hotelRating: 4.8,
    hotelAddress: "Đảo Hòn Tre, Vĩnh Nguyên, Nha Trang",
    roomName: "Phòng Deluxe Hướng Biển",
    roomPrice: ourPrice,
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    nights: 1,
    adults: 2,
    children: 0,
    rooms: 1,
    guestInfo: {
      firstName: "Nguyễn",
      lastName: "Văn A",
      email: "nguyenvana@email.com",
      phone: "0901234567",
      country: "VN",
    },
    totalPrice: ourPrice,
    serviceFee: Math.round(ourPrice * 0.13), // 5% service + 8% tax
    grandTotal: ourPrice + Math.round(ourPrice * 0.13),
  };

  // Calculate prices
  const taxAndFee = Math.round(booking.roomPrice * 0.13);
  const bookingFee = 0; // Free

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "WELCOME10") {
      const discountAmount = Math.round(booking.roomPrice * 0.1);
      setDiscount(discountAmount);
      toast.success("Áp dụng mã giảm giá thành công!", {
        description: `Giảm ${discountAmount.toLocaleString("vi-VN")}₫`,
      });
    } else if (promoCode) {
      toast.error("Mã giảm giá không hợp lệ");
    }
  };

  const roomPriceAfterCoupon = booking.roomPrice - discount;
  const finalTotal = roomPriceAfterCoupon + taxAndFee + bookingFee;
  const cashbackAmount = Math.round(finalTotal * 0.024); // 2.4% cashback

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const bookingId = `VNT${Date.now().toString().slice(-8)}`;

    navigate("/booking/confirmation", {
      state: {
        booking: {
          bookingId,
          hotelName: booking.hotelName,
          roomName: booking.roomName,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: booking.adults + booking.children,
          nights: booking.nights,
          roomPrice: booking.roomPrice,
          totalPrice: finalTotal,
          guestName: `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`,
          guestEmail: booking.guestInfo.email,
          guestPhone: booking.guestInfo.phone,
          paymentMethod: selectedMethod,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Countdown Timer Banner */}
      <div className="bg-red-50 border-y border-red-200 dark:bg-red-950/30 dark:border-red-900">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">
                Chúng tôi đang giữ giá cho quý khách...
              </span>
            </div>
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Clock className="h-5 w-5" />
              <span className="text-lg font-bold tabular-nums">
                {countdown.formatted}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-muted-foreground">Thông tin khách</span>
            </div>
            <div className="flex-1 mx-4">
              <Progress value={100} className="h-2" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="font-medium">Thanh toán</span>
            </div>
            <div className="flex-1 mx-4">
              <Progress value={50} className="h-2" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full border-2 border-muted flex items-center justify-center text-sm">
                3
              </div>
              <span>Xác nhận</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
          disabled={isProcessing}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Thông tin khách hàng
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                  >
                    Chỉnh sửa
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Họ và tên</p>
                    <p className="font-medium">
                      {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{booking.guestInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium">{booking.guestInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quốc gia</p>
                    <p className="font-medium">
                      {booking.guestInfo.country === "VN"
                        ? "Việt Nam"
                        : booking.guestInfo.country}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Chọn phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedMethod}
                  onValueChange={setSelectedMethod}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <Label
                      key={method.id}
                      htmlFor={method.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div
                        className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center`}
                      >
                        <method.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                      {method.id === "momo" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Phổ biến
                        </Badge>
                      )}
                    </Label>
                  ))}
                </RadioGroup>

                {/* Card Details (shown when card is selected) */}
                {selectedMethod === "card" && (
                  <div className="mt-6 space-y-4 p-4 bg-muted rounded-lg">
                    <div>
                      <Label>Số thẻ</Label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Ngày hết hạn</Label>
                        <Input placeholder="MM/YY" className="mt-1" />
                      </div>
                      <div>
                        <Label>CVV</Label>
                        <Input placeholder="123" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label>Tên chủ thẻ</Label>
                      <Input placeholder="NGUYEN VAN A" className="mt-1" />
                    </div>
                  </div>
                )}

                {/* QR Code Display */}
                {selectedMethod === "qr" && (
                  <div className="mt-6 p-6 bg-muted rounded-lg text-center">
                    <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border">
                      <QrCode className="h-32 w-32 text-foreground" />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                    </p>
                    <p className="mt-2 font-medium text-primary text-lg">
                      {finalTotal.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mã giảm giá</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleApplyPromo}>
                    Áp dụng
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Thử mã: WELCOME10 để giảm 10%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Professional Invoice */}
          <div className="space-y-4">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                {/* Hotel Info */}
                <div className="flex gap-4">
                  <img
                    src={booking.hotelImage}
                    alt={booking.hotelName}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-2 text-sm">
                      {booking.hotelName}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">
                        {booking.hotelRating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{booking.hotelAddress}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Room & Dates */}
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{booking.roomName}</p>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>{format(new Date(booking.checkIn), "dd/MM/yyyy")}</span>
                    <span>→</span>
                    <span>{format(new Date(booking.checkOut), "dd/MM/yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {booking.adults} người lớn
                      {booking.children > 0 && `, ${booking.children} trẻ em`}
                    </span>
                    <span>•</span>
                    <span>{booking.nights} đêm</span>
                  </div>
                </div>

                <Separator />

                {/* Discount Badge */}
                <div className="flex justify-center">
                  <Badge className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 text-sm font-semibold">
                    <BadgePercent className="h-4 w-4 mr-1" />
                    GIẢM {discountPercent}% HÔM NAY
                  </Badge>
                </div>

                {/* Price Breakdown - Professional Style */}
                <div className="space-y-3">
                  {/* Original Price */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Giá gốc ({booking.rooms} phòng x {booking.nights} đêm)
                    </span>
                    <span className="line-through text-muted-foreground">
                      {originalPrice.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>

                  {/* Our Price */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Giá của chúng tôi</span>
                    <span className="text-green-600 font-medium">
                      {booking.roomPrice.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>

                  {/* Coupon Discount */}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Coupon đã sử dụng</span>
                      <span className="text-red-500 font-medium">
                        -{discount.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  )}

                  <Separator />

                  {/* Room Price after discount */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Giá phòng ({booking.rooms} phòng x {booking.nights} đêm)
                    </span>
                    <span className="font-medium">
                      {roomPriceAfterCoupon.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>

                  {/* Tax & Fee */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Thuế và phí</span>
                    <span>{taxAndFee.toLocaleString("vi-VN")} ₫</span>
                  </div>

                  {/* Booking Fee */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí đặt trước</span>
                    <span className="text-green-600 font-semibold">MIỄN PHÍ</span>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">Tổng thanh toán</span>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {finalTotal.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                </div>

                {/* Cashback Box */}
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
                  <div className="flex items-center gap-2 mb-1">
                    <Gift className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      Sau khi hoàn tiền mặt
                      <Info className="h-3 w-3" />
                    </span>
                  </div>
                  <p className="text-xl font-bold text-blue-600">
                    {(finalTotal - cashbackAmount).toLocaleString("vi-VN")} ₫
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Bạn sẽ nhận {cashbackAmount.toLocaleString("vi-VN")} ₫ sau khi trả phòng
                  </p>
                </div>

                {/* Price includes note */}
                <p className="text-xs text-muted-foreground text-center">
                  Giá đã bao gồm: Phí dịch vụ 5%, Thuế 8%
                </p>

                {/* Pay Button */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Thanh toán {finalTotal.toLocaleString("vi-VN")}₫
                    </>
                  )}
                </Button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 py-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                    Được bảo vệ bởi SSL 256-bit encryption
                  </span>
                </div>

                {/* Benefits */}
                <div className="space-y-2 text-sm pt-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-4 w-4" />
                    <span>Xác nhận tức thì</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-4 w-4" />
                    <span>Miễn phí hủy trước 48 giờ</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ClientFooter />

      {/* Countdown Expired Dialog */}
      <AlertDialog open={showExpiredDialog} onOpenChange={setShowExpiredDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                <Timer className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Thời gian giữ giá đã hết!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-2">
              <p>
                Giá phòng có thể thay đổi do nhu cầu cao. Bạn có muốn gia hạn thêm thời gian để hoàn tất thanh toán không?
              </p>
              <p className="text-amber-600 dark:text-amber-400 font-medium">
                Gia hạn thêm 10 phút miễn phí!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel 
              onClick={handleGoBack}
              className="w-full sm:w-auto"
            >
              Quay lại chọn phòng
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleExtendTime}
              className="w-full sm:w-auto gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Gia hạn thêm 10 phút
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Payment;
