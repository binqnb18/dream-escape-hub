import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Users, Minus, Plus } from "lucide-react";
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
  const navigate = useNavigate();
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: new Date(),
      checkOut: addDays(new Date(), 2),
      adults: 2,
      children: 0,
      rooms: 1,
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
    const checkInValid = form.getValues("checkIn");
    const checkOutValid = form.getValues("checkOut");
    
    if (!checkInValid || !checkOutValid || checkOutValid <= checkInValid) {
      toast.error("Vui lòng chọn ngày hợp lệ");
      return;
    }
    
    navigate("/booking", {
      state: {
        hotelId: "1",
        hotelName,
        hotelImage: "/placeholder.svg",
        hotelRating: rating,
        hotelAddress: "Việt Nam",
        roomName: "Phòng Deluxe",
        roomPrice: pricePerNight,
        checkIn: checkInValid,
        checkOut: checkOutValid,
        nights,
        adults: watchAdults,
        children: watchChildren,
        rooms: watchRooms,
      },
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
    <div className="bg-card rounded-xl border shadow-lg p-6 space-y-4">
      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-primary">
          {pricePerNight.toLocaleString("vi-VN")}₫
        </span>
        <span className="text-muted-foreground">/đêm</span>
        {originalPrice && (
          <span className="text-sm line-through text-muted-foreground">
            {originalPrice.toLocaleString("vi-VN")}₫
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-medium">
          {rating}
        </span>
        <span className="text-sm text-muted-foreground">{reviewCount} đánh giá</span>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="checkIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhận phòng</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
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
                  <FormLabel>Trả phòng</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date <= (watchCheckIn || new Date())}
                        initialFocus
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
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                {watchAdults} người lớn{watchChildren > 0 && `, ${watchChildren} trẻ em`}, {watchRooms} phòng
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 bg-popover">
              <div className="space-y-4">
                {[
                  { label: "Người lớn", field: "adults" as const, value: watchAdults },
                  { label: "Trẻ em", field: "children" as const, value: watchChildren },
                  { label: "Phòng", field: "rooms" as const, value: watchRooms },
                ].map((item) => (
                  <div key={item.field} className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests(item.field, false)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.value}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests(item.field, true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Price Summary */}
          {nights > 0 && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {pricePerNight.toLocaleString("vi-VN")}₫ x {nights} đêm x {watchRooms} phòng
                </span>
                <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between">
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
  );
};

export default BookingForm;
