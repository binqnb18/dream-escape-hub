import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Users, Minus, Plus, Tag, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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

// Mock discount codes
const VALID_DISCOUNT_CODES: Record<string, { percent: number; maxDiscount: number; minOrder: number; name: string }> = {
  "SUMMER20": { percent: 20, maxDiscount: 1000000, minOrder: 2000000, name: "Khuyến mãi mùa hè" },
  "NEWUSER": { percent: 15, maxDiscount: 500000, minOrder: 1000000, name: "Khách hàng mới" },
  "VIP30": { percent: 30, maxDiscount: 2000000, minOrder: 5000000, name: "Ưu đãi VIP" },
  "WEEKEND10": { percent: 10, maxDiscount: 300000, minOrder: 500000, name: "Cuối tuần vui vẻ" },
};

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
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percent: number;
    amount: number;
    name: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [discountError, setDiscountError] = useState("");

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
  
  // Calculate discount amount based on applied code
  const discountAmount = appliedDiscount?.amount || 0;
  const grandTotal = totalPrice + serviceFee - discountAmount;

  const validateDiscountCode = async () => {
    if (!discountCode.trim()) {
      setDiscountError("Vui lòng nhập mã giảm giá");
      return;
    }

    setIsValidating(true);
    setDiscountError("");

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const code = discountCode.trim().toUpperCase();
    const discountInfo = VALID_DISCOUNT_CODES[code];

    if (!discountInfo) {
      setDiscountError("Mã giảm giá không hợp lệ hoặc đã hết hạn");
      setIsValidating(false);
      return;
    }

    const orderTotal = totalPrice + serviceFee;
    if (orderTotal < discountInfo.minOrder) {
      setDiscountError(`Đơn hàng tối thiểu ${discountInfo.minOrder.toLocaleString("vi-VN")}₫`);
      setIsValidating(false);
      return;
    }

    const calculatedDiscount = Math.min(
      Math.round(orderTotal * (discountInfo.percent / 100)),
      discountInfo.maxDiscount
    );

    setAppliedDiscount({
      code,
      percent: discountInfo.percent,
      amount: calculatedDiscount,
      name: discountInfo.name,
    });
    
    toast.success(`Áp dụng mã "${code}" thành công! Giảm ${calculatedDiscount.toLocaleString("vi-VN")}₫`);
    setIsValidating(false);
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError("");
    toast.info("Đã xóa mã giảm giá");
  };

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
        discountCode: appliedDiscount?.code,
        discountAmount: appliedDiscount?.amount,
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

          {/* Discount Code Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Mã giảm giá
            </label>
            
            {appliedDiscount ? (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <div>
                      <span className="font-medium text-green-700 dark:text-green-400">
                        {appliedDiscount.code}
                      </span>
                      <p className="text-xs text-green-600 dark:text-green-500">
                        {appliedDiscount.name} - Giảm {appliedDiscount.percent}%
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-red-500 hover:bg-red-50"
                    onClick={removeDiscount}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400 mt-2">
                  Bạn được giảm: -{appliedDiscount.amount.toLocaleString("vi-VN")}₫
                </p>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã giảm giá"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value.toUpperCase());
                    setDiscountError("");
                  }}
                  className={cn(
                    "flex-1",
                    discountError && "border-red-500 focus-visible:ring-red-500"
                  )}
                  disabled={isValidating || nights <= 0}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={validateDiscountCode}
                  disabled={isValidating || nights <= 0 || !discountCode.trim()}
                  className="shrink-0"
                >
                  {isValidating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Áp dụng"
                  )}
                </Button>
              </div>
            )}
            
            {discountError && (
              <p className="text-xs text-red-500">{discountError}</p>
            )}
            
            {!appliedDiscount && nights > 0 && (
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Thử mã: <span className="font-mono bg-muted px-1 rounded">SUMMER20</span>, <span className="font-mono bg-muted px-1 rounded">NEWUSER</span></p>
              </div>
            )}
          </div>

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
              
              {appliedDiscount && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Giảm giá ({appliedDiscount.code})
                  </span>
                  <span>-{appliedDiscount.amount.toLocaleString("vi-VN")}₫</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Tổng cộng</span>
                <div className="text-right">
                  <span className="text-primary">{grandTotal.toLocaleString("vi-VN")}₫</span>
                  {appliedDiscount && (
                    <p className="text-xs font-normal text-green-600">
                      Tiết kiệm {appliedDiscount.amount.toLocaleString("vi-VN")}₫
                    </p>
                  )}
                </div>
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
