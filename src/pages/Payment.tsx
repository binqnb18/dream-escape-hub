import { useState, useEffect } from "react";
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

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("momo");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentState = location.state as PaymentState | undefined;

  // Mock data if no state
  const booking: PaymentState = paymentState || {
    hotelId: "1",
    hotelName: "Vinpearl Resort & Spa Nha Trang Bay",
    hotelImage: "/placeholder.svg",
    hotelRating: 4.8,
    hotelAddress: "Đảo Hòn Tre, Vĩnh Nguyên, Nha Trang",
    roomName: "Phòng Deluxe Hướng Biển",
    roomPrice: 2500000,
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    nights: 2,
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
    totalPrice: 5000000,
    serviceFee: 500000,
    grandTotal: 5500000,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "WELCOME10") {
      const discountAmount = Math.round(booking.grandTotal * 0.1);
      setDiscount(discountAmount);
      toast.success("Áp dụng mã giảm giá thành công!", {
        description: `Giảm ${discountAmount.toLocaleString("vi-VN")}₫`,
      });
    } else if (promoCode) {
      toast.error("Mã giảm giá không hợp lệ");
    }
  };

  const finalTotal = booking.grandTotal - discount;

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

            {/* Security Notice */}
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
              <CardContent className="p-4 flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-400">
                    Thanh toán an toàn
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-500">
                    Thông tin của bạn được mã hóa SSL 256-bit và tuân thủ PCI DSS
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Tóm tắt đặt phòng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hotel Info */}
                <div className="flex gap-4">
                  <img
                    src={booking.hotelImage}
                    alt={booking.hotelName}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-2">
                      {booking.hotelName}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
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

                {/* Room Info */}
                <div>
                  <p className="font-medium">{booking.roomName}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.rooms} phòng
                  </p>
                </div>

                <Separator />

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Nhận phòng</span>
                    </div>
                    <p className="font-medium">
                      {format(new Date(booking.checkIn), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Trả phòng</span>
                    </div>
                    <p className="font-medium">
                      {format(new Date(booking.checkOut), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </p>
                  </div>
                </div>

                {/* Guests */}
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {booking.adults} người lớn
                    {booking.children > 0 && `, ${booking.children} trẻ em`}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span>{booking.nights} đêm</span>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Giá phòng</span>
                    <span>{booking.totalPrice.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Thuế và phí dịch vụ</span>
                    <span>{booking.serviceFee.toLocaleString("vi-VN")}₫</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá</span>
                      <span>-{discount.toLocaleString("vi-VN")}₫</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-primary">
                      {finalTotal.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>

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
                      <Shield className="h-4 w-4 mr-2" />
                      Thanh toán {finalTotal.toLocaleString("vi-VN")}₫
                    </>
                  )}
                </Button>

                {/* Benefits */}
                <div className="space-y-2 text-sm">
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
    </div>
  );
};

export default Payment;
