import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar,
  Users,
  MapPin,
  Star,
  ChevronLeft,
  Clock,
  CreditCard,
  Shield,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Header from "@/modules/client/components/layout/Header";
import ClientFooter from "@/modules/client/components/layout/ClientFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

// Booking data from previous page
interface BookingState {
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
}

const guestSchema = z.object({
  firstName: z.string().min(2, "Họ phải có ít nhất 2 ký tự"),
  lastName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ").max(15),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  specialRequests: z.string().max(500).optional(),
  bedType: z.string().optional(),
  smokingRoom: z.boolean().optional(),
  earlyCheckIn: z.boolean().optional(),
  lateCheckOut: z.boolean().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản",
  }),
});

type GuestFormValues = z.infer<typeof guestSchema>;

// Country codes for phone input
const countryCodes = [
  { code: "+84", country: "VN", name: "Việt Nam" },
  { code: "+1", country: "US", name: "Hoa Kỳ" },
  { code: "+44", country: "UK", name: "Anh" },
  { code: "+81", country: "JP", name: "Nhật Bản" },
  { code: "+82", country: "KR", name: "Hàn Quốc" },
  { code: "+86", country: "CN", name: "Trung Quốc" },
  { code: "+61", country: "AU", name: "Úc" },
];

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const bookingState = location.state as BookingState | undefined;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [phoneCountryCode, setPhoneCountryCode] = useState("+84");
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});

  // Mock data if no state
  const booking: BookingState = bookingState || {
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
  };

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "VN",
      specialRequests: "",
      bedType: "king",
      smokingRoom: false,
      earlyCheckIn: false,
      lateCheckOut: false,
      agreeTerms: false,
    },
    mode: "onBlur", // Real-time validation on blur
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Handle field blur for validation
  const handleFieldBlur = (fieldName: string) => {
    setFieldTouched(prev => ({ ...prev, [fieldName]: true }));
    form.trigger(fieldName as keyof GuestFormValues);
  };
  
  // Get field validation state
  const getFieldState = (fieldName: string) => {
    const error = form.formState.errors[fieldName as keyof GuestFormValues];
    const touched = fieldTouched[fieldName];
    const value = form.watch(fieldName as keyof GuestFormValues);
    
    if (!touched) return "default";
    if (error) return "error";
    if (value && !error) return "success";
    return "default";
  };

  const totalPrice = booking.roomPrice * booking.nights * booking.rooms;
  const serviceFee = Math.round(totalPrice * 0.1);
  const grandTotal = totalPrice + serviceFee;

  const onSubmit = (data: GuestFormValues) => {
    navigate("/booking/payment", {
      state: {
        ...booking,
        guestInfo: data,
        totalPrice,
        serviceFee,
        grandTotal,
      },
    });
  };

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {/* Progress bar skeleton */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="flex-1 mx-4 h-2" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="flex-1 mx-4 h-2" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
          
          <Skeleton className="h-10 w-24 mb-4" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-px w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-36" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Skeleton className="w-20 h-20 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-px w-full" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-px w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-px w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Progress Bar with animation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium animate-pulse shadow-lg shadow-primary/30">
                1
              </div>
              <span className="font-medium hidden sm:inline">Thông tin khách</span>
              <span className="font-medium sm:hidden text-sm">Thông tin</span>
            </div>
            <div className="flex-1 mx-2 sm:mx-4">
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                  style={{ width: '100%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full border-2 border-muted flex items-center justify-center text-sm">
                2
              </div>
              <span className="hidden sm:inline">Thanh toán</span>
            </div>
            <div className="flex-1 mx-2 sm:mx-4">
              <Progress value={0} className="h-2" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full border-2 border-muted flex items-center justify-center text-sm">
                3
              </div>
              <span className="hidden sm:inline">Xác nhận</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Guest Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => {
                          const state = getFieldState("firstName");
                          return (
                            <FormItem>
                              <FormLabel>Họ *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="Nguyễn"
                                    className={`pr-10 ${
                                      state === "error" ? "border-destructive focus-visible:ring-destructive" :
                                      state === "success" ? "border-green-500 focus-visible:ring-green-500" : ""
                                    }`}
                                    {...field}
                                    onBlur={(e) => {
                                      field.onBlur();
                                      handleFieldBlur("firstName");
                                    }}
                                  />
                                  {state === "error" && (
                                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                                  )}
                                  {state === "success" && (
                                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage className="flex items-center gap-1">
                                {form.formState.errors.firstName && (
                                  <>
                                    <AlertCircle className="h-3 w-3" />
                                    {form.formState.errors.firstName.message}
                                  </>
                                )}
                              </FormMessage>
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => {
                          const state = getFieldState("lastName");
                          return (
                            <FormItem>
                              <FormLabel>Tên *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="Văn A"
                                    className={`pr-10 ${
                                      state === "error" ? "border-destructive focus-visible:ring-destructive" :
                                      state === "success" ? "border-green-500 focus-visible:ring-green-500" : ""
                                    }`}
                                    {...field}
                                    onBlur={(e) => {
                                      field.onBlur();
                                      handleFieldBlur("lastName");
                                    }}
                                  />
                                  {state === "error" && (
                                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                                  )}
                                  {state === "success" && (
                                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage className="flex items-center gap-1">
                                {form.formState.errors.lastName && (
                                  <>
                                    <AlertCircle className="h-3 w-3" />
                                    {form.formState.errors.lastName.message}
                                  </>
                                )}
                              </FormMessage>
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => {
                          const state = getFieldState("email");
                          return (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="email"
                                    placeholder="email@example.com"
                                    className={`pr-10 ${
                                      state === "error" ? "border-destructive focus-visible:ring-destructive" :
                                      state === "success" ? "border-green-500 focus-visible:ring-green-500" : ""
                                    }`}
                                    {...field}
                                    onBlur={(e) => {
                                      field.onBlur();
                                      handleFieldBlur("email");
                                    }}
                                  />
                                  {state === "error" && (
                                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                                  )}
                                  {state === "success" && (
                                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage className="flex items-center gap-1">
                                {form.formState.errors.email && (
                                  <>
                                    <AlertCircle className="h-3 w-3" />
                                    {form.formState.errors.email.message}
                                  </>
                                )}
                              </FormMessage>
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => {
                          const state = getFieldState("phone");
                          return (
                            <FormItem>
                              <FormLabel>Số điện thoại *</FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <Select
                                    value={phoneCountryCode}
                                    onValueChange={setPhoneCountryCode}
                                  >
                                    <SelectTrigger className="w-[90px] rounded-r-none border-r-0 focus:ring-0">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {countryCodes.map((cc) => (
                                        <SelectItem key={cc.code} value={cc.code}>
                                          {cc.code}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <div className="relative flex-1">
                                    <Input
                                      placeholder="901234567"
                                      className={`rounded-l-none pr-10 ${
                                        state === "error" ? "border-destructive focus-visible:ring-destructive" :
                                        state === "success" ? "border-green-500 focus-visible:ring-green-500" : ""
                                      }`}
                                      {...field}
                                      onBlur={(e) => {
                                        field.onBlur();
                                        handleFieldBlur("phone");
                                      }}
                                    />
                                    {state === "error" && (
                                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                                    )}
                                    {state === "success" && (
                                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                    )}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className="flex items-center gap-1 text-destructive">
                                {form.formState.errors.phone && (
                                  <>
                                    <AlertCircle className="h-3 w-3" />
                                    {form.formState.errors.phone.message}
                                  </>
                                )}
                              </FormMessage>
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quốc gia *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn quốc gia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="VN">Việt Nam</SelectItem>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="UK">United Kingdom</SelectItem>
                              <SelectItem value="JP">Japan</SelectItem>
                              <SelectItem value="KR">South Korea</SelectItem>
                              <SelectItem value="CN">China</SelectItem>
                              <SelectItem value="AU">Australia</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-4">Tùy chọn phòng</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="bedType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loại giường ưa thích</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="king">
                                    Giường King
                                  </SelectItem>
                                  <SelectItem value="queen">
                                    Giường Queen
                                  </SelectItem>
                                  <SelectItem value="twin">
                                    2 Giường đơn
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="smokingRoom"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0 pt-8">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Phòng không hút thuốc
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="earlyCheckIn"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Yêu cầu nhận phòng sớm (tùy thuộc phòng trống)
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lateCheckOut"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Yêu cầu trả phòng muộn (tùy thuộc phòng trống)
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="specialRequests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yêu cầu đặc biệt</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập yêu cầu đặc biệt của bạn (ví dụ: phòng tầng cao, gần thang máy...)"
                              className="min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <FormField
                      control={form.control}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex items-start gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-normal cursor-pointer">
                              Tôi đồng ý với{" "}
                              <a
                                href="#"
                                className="text-primary hover:underline"
                              >
                                Điều khoản sử dụng
                              </a>{" "}
                              và{" "}
                              <a
                                href="#"
                                className="text-primary hover:underline"
                              >
                                Chính sách bảo mật
                              </a>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Desktop submit button */}
                    <Button type="submit" size="lg" className="w-full hidden lg:flex">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Tiếp tục thanh toán
                    </Button>
                  </form>
                </Form>
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
                    Thông tin của bạn được mã hóa SSL 256-bit
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            {isMobile ? (
              <Collapsible
                open={isSummaryOpen}
                onOpenChange={setIsSummaryOpen}
                className="w-full"
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Tóm tắt đặt phòng</CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold">
                            {grandTotal.toLocaleString("vi-VN")}₫
                          </span>
                          {isSummaryOpen ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4 pt-0">
                      <BookingSummaryContent booking={booking} totalPrice={totalPrice} serviceFee={serviceFee} grandTotal={grandTotal} />
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ) : (
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Tóm tắt đặt phòng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <BookingSummaryContent booking={booking} totalPrice={totalPrice} serviceFee={serviceFee} grandTotal={grandTotal} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      {/* Mobile sticky button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg lg:hidden z-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Tổng cộng</span>
          <span className="text-lg font-bold text-primary">
            {grandTotal.toLocaleString("vi-VN")}₫
          </span>
        </div>
        <Button 
          size="lg" 
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Tiếp tục thanh toán
        </Button>
      </div>

      <ClientFooter />
    </div>
  );
};

// Extracted BookingSummaryContent component
const BookingSummaryContent = ({ 
  booking, 
  totalPrice, 
  serviceFee, 
  grandTotal 
}: { 
  booking: BookingState; 
  totalPrice: number; 
  serviceFee: number; 
  grandTotal: number; 
}) => (
  <>
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
        <p className="text-xs text-muted-foreground">Từ 14:00</p>
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
        <p className="text-xs text-muted-foreground">Trước 12:00</p>
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
        <span>
          {booking.roomPrice.toLocaleString("vi-VN")}₫ x{" "}
          {booking.nights} đêm x {booking.rooms} phòng
        </span>
        <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Thuế và phí dịch vụ (10%)</span>
        <span>{serviceFee.toLocaleString("vi-VN")}₫</span>
      </div>
      <Separator />
      <div className="flex justify-between font-bold text-lg">
        <span>Tổng cộng</span>
        <span className="text-primary">
          {grandTotal.toLocaleString("vi-VN")}₫
        </span>
      </div>
    </div>

    {/* Cancellation Policy */}
    <div className="p-3 bg-muted rounded-lg">
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
        <div className="text-xs">
          <p className="font-medium">Chính sách hủy phòng</p>
          <p className="text-muted-foreground mt-1">
            Miễn phí hủy trước 48 giờ. Sau thời hạn sẽ tính phí 1 đêm.
          </p>
        </div>
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
        <span>Không cần thanh toán trước</span>
      </div>
      <div className="flex items-center gap-2 text-green-600">
        <Check className="h-4 w-4" />
        <span>WiFi miễn phí</span>
      </div>
    </div>
  </>
);

export default Booking;
