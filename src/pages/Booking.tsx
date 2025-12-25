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
} from "lucide-react";
import Header from "@/components/Header";
import ClientFooter from "@/components/ClientFooter";
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

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingState = location.state as BookingState | undefined;

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
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="font-medium">Thông tin khách</span>
            </div>
            <div className="flex-1 mx-4">
              <Progress value={33} className="h-2" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full border-2 border-muted flex items-center justify-center text-sm">
                2
              </div>
              <span>Thanh toán</span>
            </div>
            <div className="flex-1 mx-4">
              <Progress value={0} className="h-2" />
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
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nguyễn" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên *</FormLabel>
                            <FormControl>
                              <Input placeholder="Văn A" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="email@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại *</FormLabel>
                            <FormControl>
                              <Input placeholder="0901234567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
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

                    <Button type="submit" size="lg" className="w-full">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
};

export default Booking;
