import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Users, Minus, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const bookingSchema = z.object({
  checkIn: z.date({
    required_error: "Vui lòng chọn ngày nhận phòng",
  }),
  checkOut: z.date({
    required_error: "Vui lòng chọn ngày trả phòng",
  }),
  adults: z.number().min(1, "Cần ít nhất 1 người lớn").max(10, "Tối đa 10 người lớn"),
  children: z.number().min(0).max(6, "Tối đa 6 trẻ em"),
  rooms: z.number().min(1, "Cần ít nhất 1 phòng").max(5, "Tối đa 5 phòng"),
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ").max(15),
  specialRequests: z.string().max(500).optional(),
}).refine((data) => data.checkOut > data.checkIn, {
  message: "Ngày trả phòng phải sau ngày nhận phòng",
  path: ["checkOut"],
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  hotelName: string;
  pricePerNight: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
}

const BookingForm = ({
  hotelName,
  pricePerNight,
  originalPrice,
  discount,
  rating,
  reviewCount,
}: BookingFormProps) => {
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: new Date(),
      checkOut: addDays(new Date(), 2),
      adults: 2,
      children: 0,
      rooms: 1,
      fullName: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
  });

  const watchCheckIn = form.watch("checkIn");
  const watchCheckOut = form.watch("checkOut");
  const watchAdults = form.watch("adults");
  const watchChildren = form.watch("children");
  const watchRooms = form.watch("rooms");

  const nights = watchCheckIn && watchCheckOut 
    ? Math.max(differenceInDays(watchCheckOut, watchCheckIn), 0)
    : 0;
  
  const totalPrice = nights * pricePerNight * watchRooms;
  const serviceFee = Math.round(totalPrice * 0.1);
  const grandTotal = totalPrice + serviceFee;

  const handleBookNow = () => {
    // Validate dates first
    const checkInValid = form.getValues("checkIn");
    const checkOutValid = form.getValues("checkOut");
    
    if (!checkInValid || !checkOutValid || checkOutValid <= checkInValid) {
      toast.error("Vui lòng chọn ngày hợp lệ");
      return;
    }
    
    setShowBookingDialog(true);
  };

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log("Booking submitted:", {
      ...data,
      hotelName,
      totalPrice: grandTotal,
      nights,
    });
    
    setIsSubmitting(false);
    setBookingSuccess(true);
    
    toast.success("Đặt phòng thành công!", {
      description: `${hotelName} - ${nights} đêm`,
    });
  };

  const updateGuests = (field: "adults" | "children" | "rooms", increment: boolean) => {
    const current = form.getValues(field);
    const limits = {
      adults: { min: 1, max: 10 },
      children: { min: 0, max: 6 },
      rooms: { min: 1, max: 5 },
    };
    
    const newValue = increment ? current + 1 : current - 1;
    if (newValue >= limits[field].min && newValue <= limits[field].max) {
      form.setValue(field, newValue);
    }
  };

  return (
    <>
      <div className="bg-card rounded-xl border shadow-lg p-6 space-y-4">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">
            {pricePerNight.toLocaleString("vi-VN")}₫
          </span>
          <span className="text-muted-foreground">/đêm</span>
        </div>

        {originalPrice && discount && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground line-through text-sm">
              {originalPrice.toLocaleString("vi-VN")}₫
            </span>
            <span className="bg-destructive/10 text-destructive text-xs font-semibold px-2 py-1 rounded">
              -{discount}%
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 text-sm">
          <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-xs font-bold">
            {rating}
          </span>
          <span className="font-medium">Tuyệt vời</span>
          <span className="text-muted-foreground">
            ({reviewCount.toLocaleString()} đánh giá)
          </span>
        </div>

        <Form {...form}>
          <form className="space-y-3">
            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-auto py-3",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-xs text-muted-foreground">Nhận phòng</span>
                              <span className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                {field.value ? format(field.value, "dd/MM/yyyy") : "Chọn ngày"}
                              </span>
                            </div>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-auto py-3",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-xs text-muted-foreground">Trả phòng</span>
                              <span className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                {field.value ? format(field.value, "dd/MM/yyyy") : "Chọn ngày"}
                              </span>
                            </div>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date <= watchCheckIn}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Guest Picker */}
            <Popover open={showGuestPicker} onOpenChange={setShowGuestPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-auto py-3"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground">Số khách</span>
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {watchAdults} người lớn
                      {watchChildren > 0 && `, ${watchChildren} trẻ em`}
                      {watchRooms > 1 && `, ${watchRooms} phòng`}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4" align="start">
                <div className="space-y-4">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Người lớn</p>
                      <p className="text-xs text-muted-foreground">Từ 13 tuổi trở lên</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests("adults", false)}
                        disabled={watchAdults <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-6 text-center font-medium">{watchAdults}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests("adults", true)}
                        disabled={watchAdults >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Trẻ em</p>
                      <p className="text-xs text-muted-foreground">0-12 tuổi</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests("children", false)}
                        disabled={watchChildren <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-6 text-center font-medium">{watchChildren}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests("children", true)}
                        disabled={watchChildren >= 6}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Phòng</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests("rooms", false)}
                        disabled={watchRooms <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-6 text-center font-medium">{watchRooms}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests("rooms", true)}
                        disabled={watchRooms >= 5}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => setShowGuestPicker(false)}
                  >
                    Xong
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Price Summary */}
            {nights > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {pricePerNight.toLocaleString("vi-VN")}₫ x {nights} đêm
                    {watchRooms > 1 && ` x ${watchRooms} phòng`}
                  </span>
                  <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí dịch vụ</span>
                  <span>{serviceFee.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{grandTotal.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>
            )}

            <Button
              type="button"
              className="w-full"
              size="lg"
              onClick={handleBookNow}
              disabled={nights <= 0}
            >
              Đặt ngay
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Bạn chưa bị trừ tiền
            </p>
          </form>
        </Form>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-md">
          {bookingSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <DialogTitle className="text-xl mb-2">Đặt phòng thành công!</DialogTitle>
              <DialogDescription className="space-y-2">
                <p>Cảm ơn bạn đã đặt phòng tại {hotelName}</p>
                <p className="font-medium">
                  {format(watchCheckIn, "dd/MM/yyyy")} - {format(watchCheckOut, "dd/MM/yyyy")}
                </p>
                <p className="text-lg font-bold text-primary">
                  {grandTotal.toLocaleString("vi-VN")}₫
                </p>
              </DialogDescription>
              <Button
                className="mt-6"
                onClick={() => {
                  setShowBookingDialog(false);
                  setBookingSuccess(false);
                }}
              >
                Đóng
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Xác nhận đặt phòng</DialogTitle>
                <DialogDescription>
                  Vui lòng điền thông tin để hoàn tất đặt phòng
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
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
                          <Input type="tel" placeholder="0901234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yêu cầu đặc biệt (tùy chọn)</FormLabel>
                        <FormControl>
                          <Input placeholder="VD: Phòng tầng cao, giường đôi..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Summary */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="font-medium">{hotelName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(watchCheckIn, "dd/MM/yyyy")} - {format(watchCheckOut, "dd/MM/yyyy")} ({nights} đêm)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {watchAdults} người lớn{watchChildren > 0 && `, ${watchChildren} trẻ em`}, {watchRooms} phòng
                    </p>
                    <p className="text-lg font-bold text-primary">
                      Tổng: {grandTotal.toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt phòng"}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingForm;
