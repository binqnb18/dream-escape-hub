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
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Header from "@/modules/client/components/layout/Header";
import ClientFooter from "@/modules/client/components/layout/ClientFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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

// Payment method logos as SVG components
const MoMoLogo = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <rect width="48" height="48" rx="8" fill="#A50064"/>
    <circle cx="24" cy="24" r="12" fill="white"/>
    <circle cx="24" cy="24" r="6" fill="#A50064"/>
  </svg>
);

const VNPayLogo = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <rect width="48" height="48" rx="8" fill="#0066CC"/>
    <text x="24" y="28" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">VNPay</text>
  </svg>
);

const VisaLogo = () => (
  <svg viewBox="0 0 48 32" className="w-8 h-5">
    <rect width="48" height="32" rx="4" fill="#1A1F71"/>
    <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontStyle="italic">VISA</text>
  </svg>
);

const MasterCardLogo = () => (
  <svg viewBox="0 0 48 32" className="w-8 h-5">
    <rect width="48" height="32" rx="4" fill="#F5F5F5"/>
    <circle cx="18" cy="16" r="10" fill="#EB001B"/>
    <circle cx="30" cy="16" r="10" fill="#F79E1B"/>
    <path d="M24 8 a10 10 0 0 1 0 16 a10 10 0 0 1 0-16" fill="#FF5F00"/>
  </svg>
);

const JCBLogo = () => (
  <svg viewBox="0 0 48 32" className="w-8 h-5">
    <rect width="48" height="32" rx="4" fill="#0E4C96"/>
    <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">JCB</text>
  </svg>
);

const AmexLogo = () => (
  <svg viewBox="0 0 48 32" className="w-8 h-5">
    <rect width="48" height="32" rx="4" fill="#006FCF"/>
    <text x="24" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">AMEX</text>
  </svg>
);

const paymentMethods = [
  {
    id: "momo",
    name: "Ví MoMo",
    Logo: MoMoLogo,
    description: "Thanh toán qua ví điện tử MoMo",
    popular: true,
  },
  {
    id: "vnpay",
    name: "VNPay",
    Logo: VNPayLogo,
    description: "Thanh toán qua VNPay QR",
    popular: false,
  },
  {
    id: "card",
    name: "Thẻ ngân hàng",
    icon: CreditCard,
    description: "Visa, Mastercard, JCB, American Express",
    color: "bg-gradient-to-r from-blue-500 to-purple-500",
    popular: false,
  },
  {
    id: "qr",
    name: "Quét QR",
    icon: QrCode,
    description: "Quét mã QR để thanh toán nhanh",
    color: "bg-green-500",
    popular: false,
  },
];

// Card type detection
const detectCardType = (cardNumber: string): string | null => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) return 'mastercard';
  if (/^35/.test(cleanNumber)) return 'jcb';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  return null;
};

// Format card number with spaces
const formatCardNumber = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const groups = cleanValue.match(/.{1,4}/g) || [];
  return groups.join(' ').substring(0, 19);
};

// Format expiry date
const formatExpiryDate = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length >= 2) {
    return `${cleanValue.substring(0, 2)}/${cleanValue.substring(2, 4)}`;
  }
  return cleanValue;
};

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
  const progress = (timeLeft / (initialMinutes * 60)) * 100;

  return {
    minutes,
    seconds,
    timeLeft,
    hasExpired,
    reset,
    progress,
    formatted: `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
  };
};

// Card form validation
interface CardFormErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardHolder?: string;
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("momo");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [invoiceOpen, setInvoiceOpen] = useState(true);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [cardErrors, setCardErrors] = useState<CardFormErrors>({});
  const [cardTouched, setCardTouched] = useState<Record<string, boolean>>({});
  
  const detectedCardType = detectCardType(cardNumber);

  const handleCountdownExpire = useCallback(() => {
    setShowExpiredDialog(true);
  }, []);

  const countdown = useCountdown(20, handleCountdownExpire);
  const qrCountdown = useCountdown(5); // 5 minutes for QR

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleExtendTime = () => {
    countdown.reset(10);
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

  // Mock data if no state
  const originalPrice = 7049017;
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
    serviceFee: Math.round(ourPrice * 0.13),
    grandTotal: ourPrice + Math.round(ourPrice * 0.13),
  };

  const taxAndFee = Math.round(booking.roomPrice * 0.13);
  const bookingFee = 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Card validation
  const validateCardForm = (): boolean => {
    const errors: CardFormErrors = {};
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    if (!cleanCardNumber) {
      errors.cardNumber = "Vui lòng nhập số thẻ";
    } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      errors.cardNumber = "Số thẻ không hợp lệ";
    }
    
    if (!expiryDate) {
      errors.expiryDate = "Vui lòng nhập ngày hết hạn";
    } else {
      const [month, year] = expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (!month || !year || parseInt(month) > 12 || parseInt(month) < 1) {
        errors.expiryDate = "Ngày hết hạn không hợp lệ";
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        errors.expiryDate = "Thẻ đã hết hạn";
      }
    }
    
    if (!cvv) {
      errors.cvv = "Vui lòng nhập CVV";
    } else if (cvv.length < 3) {
      errors.cvv = "CVV không hợp lệ";
    }
    
    if (!cardHolder.trim()) {
      errors.cardHolder = "Vui lòng nhập tên chủ thẻ";
    }
    
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
  const cashbackAmount = Math.round(finalTotal * 0.024);

  const handlePayment = async () => {
    if (selectedMethod === 'card' && !validateCardForm()) {
      setCardTouched({ cardNumber: true, expiryDate: true, cvv: true, cardHolder: true });
      toast.error("Vui lòng kiểm tra thông tin thẻ");
      return;
    }
    
    setIsProcessing(true);
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

  // Loading skeleton
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto mb-8">
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Countdown Timer Banner with Progress */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-y border-red-200 dark:from-red-950/30 dark:to-orange-950/30 dark:border-red-900">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-medium">
                Chúng tôi đang giữ giá cho quý khách...
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-32">
                <Progress 
                  value={countdown.progress} 
                  className="h-2 bg-red-200 dark:bg-red-900"
                />
              </div>
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full font-bold tabular-nums",
                countdown.timeLeft <= 60 
                  ? "bg-red-600 text-white animate-pulse" 
                  : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
              )}>
                <Clock className="h-4 w-4" />
                <span className="text-lg">{countdown.formatted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 lg:py-8">
        {/* Progress Bar - Enhanced with animations */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {/* Step 1 - Completed */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 transition-all">
                <Check className="h-5 w-5" />
              </div>
              <span className="hidden sm:block text-sm text-muted-foreground">Thông tin khách</span>
            </div>
            
            {/* Connector 1 */}
            <div className="flex-1 mx-2 sm:mx-4 relative">
              <div className="h-1 bg-primary rounded-full" />
              <div className="absolute inset-0 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full animate-pulse" />
            </div>
            
            {/* Step 2 - Active */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 ring-4 ring-primary/20 animate-pulse">
                <span className="font-bold">2</span>
              </div>
              <span className="hidden sm:block text-sm font-medium">Thanh toán</span>
            </div>
            
            {/* Connector 2 */}
            <div className="flex-1 mx-2 sm:mx-4">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-primary/50 rounded-full" />
              </div>
            </div>
            
            {/* Step 3 - Pending */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-full border-2 border-muted bg-background flex items-center justify-center">
                <span className="font-medium">3</span>
              </div>
              <span className="hidden sm:block text-sm">Xác nhận</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
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

            {/* Payment Methods with Brand Logos */}
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
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        selectedMethod === method.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      
                      {/* Logo or Icon */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                        {method.Logo ? (
                          <method.Logo />
                        ) : (
                          <div className={cn("w-full h-full flex items-center justify-center", method.color)}>
                            {method.icon && <method.icon className="h-6 w-6 text-white" />}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {method.description}
                        </p>
                      </div>
                      
                      {method.popular && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 shrink-0">
                          Phổ biến
                        </Badge>
                      )}
                    </Label>
                  ))}
                </RadioGroup>

                {/* Card Details with Detection & Formatting */}
                {selectedMethod === "card" && (
                  <div className="mt-6 space-y-4 p-5 bg-gradient-to-br from-muted/50 to-muted rounded-xl border">
                    {/* Card Type Indicator */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Thông tin thẻ</span>
                      <div className="flex items-center gap-2">
                        <VisaLogo />
                        <MasterCardLogo />
                        <JCBLogo />
                        <AmexLogo />
                      </div>
                    </div>
                    
                    {/* Card Number */}
                    <div className="space-y-1.5">
                      <Label className="text-sm">Số thẻ</Label>
                      <div className="relative">
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          onBlur={() => setCardTouched(prev => ({ ...prev, cardNumber: true }))}
                          className={cn(
                            "pr-16",
                            cardTouched.cardNumber && cardErrors.cardNumber && "border-red-500 focus-visible:ring-red-500"
                          )}
                          maxLength={19}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          {detectedCardType === 'visa' && <VisaLogo />}
                          {detectedCardType === 'mastercard' && <MasterCardLogo />}
                          {detectedCardType === 'jcb' && <JCBLogo />}
                          {detectedCardType === 'amex' && <AmexLogo />}
                          {cardNumber && !cardErrors.cardNumber && cardNumber.replace(/\s/g, '').length >= 13 && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                      {cardTouched.cardNumber && cardErrors.cardNumber && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {cardErrors.cardNumber}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Expiry Date */}
                      <div className="space-y-1.5">
                        <Label className="text-sm">Ngày hết hạn</Label>
                        <Input
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          onBlur={() => setCardTouched(prev => ({ ...prev, expiryDate: true }))}
                          className={cn(
                            cardTouched.expiryDate && cardErrors.expiryDate && "border-red-500 focus-visible:ring-red-500"
                          )}
                          maxLength={5}
                        />
                        {cardTouched.expiryDate && cardErrors.expiryDate && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            {cardErrors.expiryDate}
                          </p>
                        )}
                      </div>
                      
                      {/* CVV */}
                      <div className="space-y-1.5">
                        <Label className="text-sm">CVV</Label>
                        <div className="relative">
                          <Input
                            type={showCvv ? "text" : "password"}
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                            onBlur={() => setCardTouched(prev => ({ ...prev, cvv: true }))}
                            className={cn(
                              "pr-10",
                              cardTouched.cvv && cardErrors.cvv && "border-red-500 focus-visible:ring-red-500"
                            )}
                            maxLength={4}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCvv(!showCvv)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {cardTouched.cvv && cardErrors.cvv && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            {cardErrors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Card Holder */}
                    <div className="space-y-1.5">
                      <Label className="text-sm">Tên chủ thẻ</Label>
                      <Input
                        placeholder="NGUYEN VAN A"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        onBlur={() => setCardTouched(prev => ({ ...prev, cardHolder: true }))}
                        className={cn(
                          cardTouched.cardHolder && cardErrors.cardHolder && "border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                      {cardTouched.cardHolder && cardErrors.cardHolder && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {cardErrors.cardHolder}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* QR Code Display with Bank Logos */}
                {selectedMethod === "qr" && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-900">
                    <div className="text-center space-y-4">
                      {/* QR Timer */}
                      <div className="flex items-center justify-center gap-2">
                        <Timer className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">Mã QR hết hạn sau:</span>
                        <span className={cn(
                          "font-bold tabular-nums px-2 py-0.5 rounded",
                          qrCountdown.timeLeft <= 60 
                            ? "bg-red-100 text-red-600" 
                            : "bg-orange-100 text-orange-600"
                        )}>
                          {qrCountdown.formatted}
                        </span>
                      </div>
                      
                      {/* QR Code with Logo */}
                      <div className="relative w-52 h-52 mx-auto bg-white rounded-xl shadow-lg p-4">
                        <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                          <QrCode className="h-28 w-28 text-foreground" />
                        </div>
                        {/* Bank logo overlay */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      
                      {/* Supported Banks */}
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">Hỗ trợ:</span>
                        {['VCB', 'TCB', 'MB', 'VP', 'ACB'].map(bank => (
                          <span key={bank} className="text-xs bg-muted px-2 py-1 rounded font-medium">
                            {bank}
                          </span>
                        ))}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                      </p>
                      <p className="font-bold text-primary text-2xl">
                        {finalTotal.toLocaleString("vi-VN")}₫
                      </p>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => qrCountdown.reset(5)}
                        className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Tạo mã mới
                      </Button>
                    </div>
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

          {/* Right Column - Collapsible Invoice on Mobile */}
          <div className="space-y-4">
            {/* Mobile Collapsible */}
            <div className="lg:hidden">
              <Collapsible open={invoiceOpen} onOpenChange={setInvoiceOpen}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardTitle className="flex items-center justify-between text-base">
                        <span>Chi tiết đơn hàng</span>
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold">
                            {finalTotal.toLocaleString("vi-VN")}₫
                          </span>
                          {invoiceOpen ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <InvoiceContent 
                      booking={booking}
                      originalPrice={originalPrice}
                      discountPercent={discountPercent}
                      discount={discount}
                      roomPriceAfterCoupon={roomPriceAfterCoupon}
                      taxAndFee={taxAndFee}
                      finalTotal={finalTotal}
                      cashbackAmount={cashbackAmount}
                      isProcessing={isProcessing}
                      handlePayment={handlePayment}
                    />
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>

            {/* Desktop Sticky */}
            <div className="hidden lg:block">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <InvoiceContent 
                    booking={booking}
                    originalPrice={originalPrice}
                    discountPercent={discountPercent}
                    discount={discount}
                    roomPriceAfterCoupon={roomPriceAfterCoupon}
                    taxAndFee={taxAndFee}
                    finalTotal={finalTotal}
                    cashbackAmount={cashbackAmount}
                    isProcessing={isProcessing}
                    handlePayment={handlePayment}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Mobile Pay Button - Fixed */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
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
                    <Lock className="h-4 w-4 mr-2" />
                    Thanh toán {finalTotal.toLocaleString("vi-VN")}₫
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <ClientFooter />

      {/* Countdown Expired Dialog */}
      <AlertDialog open={showExpiredDialog} onOpenChange={setShowExpiredDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center animate-pulse">
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

// Extracted Invoice Content Component
interface InvoiceContentProps {
  booking: PaymentState;
  originalPrice: number;
  discountPercent: number;
  discount: number;
  roomPriceAfterCoupon: number;
  taxAndFee: number;
  finalTotal: number;
  cashbackAmount: number;
  isProcessing: boolean;
  handlePayment: () => void;
}

const InvoiceContent = ({
  booking,
  originalPrice,
  discountPercent,
  discount,
  roomPriceAfterCoupon,
  taxAndFee,
  finalTotal,
  cashbackAmount,
  isProcessing,
  handlePayment,
}: InvoiceContentProps) => (
  <div className="space-y-4">
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
          <span className="text-xs font-medium">{booking.hotelRating}</span>
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

    {/* Price Breakdown */}
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Giá gốc ({booking.rooms} phòng x {booking.nights} đêm)
        </span>
        <span className="line-through text-muted-foreground">
          {originalPrice.toLocaleString("vi-VN")} ₫
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Giá của chúng tôi</span>
        <span className="text-green-600 font-medium">
          {booking.roomPrice.toLocaleString("vi-VN")} ₫
        </span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Coupon đã sử dụng</span>
          <span className="text-red-500 font-medium">
            -{discount.toLocaleString("vi-VN")} ₫
          </span>
        </div>
      )}

      <Separator />

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Giá phòng ({booking.rooms} phòng x {booking.nights} đêm)
        </span>
        <span className="font-medium">
          {roomPriceAfterCoupon.toLocaleString("vi-VN")} ₫
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Thuế và phí</span>
        <span>{taxAndFee.toLocaleString("vi-VN")} ₫</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Phí đặt trước</span>
        <span className="text-green-600 font-semibold">MIỄN PHÍ</span>
      </div>

      <Separator />

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

    <p className="text-xs text-muted-foreground text-center">
      Giá đã bao gồm: Phí dịch vụ 5%, Thuế 8%
    </p>

    {/* Pay Button - Desktop only */}
    <div className="hidden lg:block">
      <Button
        size="lg"
        className="w-full gap-2"
        onClick={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Thanh toán {finalTotal.toLocaleString("vi-VN")}₫
          </>
        )}
      </Button>
    </div>

    {/* Trust Badges */}
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-4 py-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-xs text-green-700 dark:text-green-400 font-medium">SSL 256-bit</span>
        </div>
        <div className="w-px h-4 bg-green-300" />
        <div className="flex items-center gap-1.5">
          <Lock className="h-4 w-4 text-green-600" />
          <span className="text-xs text-green-700 dark:text-green-400 font-medium">PCI DSS</span>
        </div>
      </div>

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
    </div>
  </div>
);

export default Payment;