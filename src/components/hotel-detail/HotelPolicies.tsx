import { Clock, CreditCard, Baby, PawPrint, Cigarette, Info, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const HotelPolicies = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Chính sách</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Check-in/Check-out */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Nhận phòng / Trả phòng</h3>
          </div>
          <div className="space-y-3 pl-7">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Nhận phòng</span>
              <span className="font-medium">Từ 14:00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Trả phòng</span>
              <span className="font-medium">Trước 12:00</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Nhận phòng sớm và trả phòng muộn có thể được sắp xếp tùy theo tình trạng phòng.
            </p>
          </div>
        </div>

        {/* Payment */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Thanh toán</h3>
          </div>
          <div className="space-y-2 pl-7 text-sm">
            <p>Chấp nhận các phương thức thanh toán:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Visa, Mastercard, JCB</li>
              <li>• Thanh toán tại chỗ bằng tiền mặt hoặc thẻ</li>
              <li>• Chuyển khoản ngân hàng</li>
              <li>• Ví điện tử (MoMo, ZaloPay, VNPay)</li>
            </ul>
          </div>
        </div>

        {/* Children */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Trẻ em & Giường phụ</h3>
          </div>
          <div className="space-y-2 pl-7 text-sm text-muted-foreground">
            <p>• Trẻ em dưới 6 tuổi: Miễn phí (sử dụng giường có sẵn)</p>
            <p>• Trẻ em từ 6-12 tuổi: 500.000₫/đêm (bao gồm bữa sáng)</p>
            <p>• Giường phụ: 800.000₫/đêm</p>
            <p>• Nôi em bé: Miễn phí (theo yêu cầu)</p>
          </div>
        </div>

        {/* Pets */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Thú cưng</h3>
          </div>
          <div className="pl-7 text-sm text-muted-foreground">
            <p>Không cho phép mang thú cưng vào khu nghỉ dưỡng.</p>
          </div>
        </div>

        {/* Smoking */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cigarette className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Hút thuốc</h3>
          </div>
          <div className="pl-7 text-sm text-muted-foreground">
            <p>• Không hút thuốc trong phòng</p>
            <p>• Có khu vực hút thuốc riêng</p>
            <p>• Phí phạt vi phạm: 2.000.000₫</p>
          </div>
        </div>

        {/* Other policies */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Quy định khác</h3>
          </div>
          <div className="pl-7 text-sm text-muted-foreground">
            <p>• Giữ yên lặng sau 22:00</p>
            <p>• Không mang thức ăn từ bên ngoài</p>
            <p>• Cần xuất trình CMND/CCCD/Passport khi nhận phòng</p>
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Chính sách hủy phòng:</strong> Hủy miễn phí trước 3 ngày. Hủy trong vòng 3 ngày sẽ bị tính phí 1 đêm đầu tiên. Không đến (No-show) sẽ bị tính 100% phí đặt phòng.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default HotelPolicies;
