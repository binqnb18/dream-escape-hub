import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building2, Mail, Lock, User, Phone, MapPin, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const PartnerSignup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Account Info
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Step 2 - Hotel Info
    hotelName: "",
    hotelType: "",
    address: "",
    city: "",
    rooms: "",
    // Terms
    agreeTerms: false,
  });

  const hotelTypes = [
    { value: "hotel", label: "Khách sạn" },
    { value: "resort", label: "Resort" },
    { value: "villa", label: "Villa" },
    { value: "apartment", label: "Căn hộ dịch vụ" },
    { value: "homestay", label: "Homestay" },
    { value: "motel", label: "Nhà nghỉ" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Mật khẩu không khớp");
        return;
      }
      setStep(2);
      return;
    }

    if (!formData.agreeTerms) {
      toast.error("Vui lòng đồng ý với điều khoản sử dụng");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success("Đăng ký thành công!", {
      description: "Chúng tôi sẽ liên hệ xác nhận trong 24 giờ",
    });
    
    setIsLoading(false);
    navigate("/partner/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
          <Building2 className="w-20 h-20 mb-6" />
          <h1 className="text-4xl font-bold mb-4">Trở thành Đối tác</h1>
          <p className="text-xl text-white/90 mb-8 max-w-md">
            Gia nhập mạng lưới đối tác khách sạn lớn nhất Việt Nam
          </p>
          
          <div className="space-y-4 text-left max-w-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
              <p className="text-white/90">Tiếp cận hàng triệu khách hàng tiềm năng mỗi ngày</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
              <p className="text-white/90">Công cụ quản lý đặt phòng thông minh</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
              <p className="text-white/90">Hỗ trợ 24/7 từ đội ngũ chuyên nghiệp</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
              <p className="text-white/90">Thanh toán nhanh chóng và minh bạch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <Building2 className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Đăng ký đối tác</h2>
            <p className="mt-2 text-muted-foreground">
              {step === 1 ? "Bước 1: Thông tin tài khoản" : "Bước 2: Thông tin khách sạn"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Nguyễn Văn A"
                      className="pl-10"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="partner@hotel.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0901234567"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="hotelName">Tên khách sạn</Label>
                  <div className="relative">
                    <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="hotelName"
                      placeholder="Grand Hotel Saigon"
                      className="pl-10"
                      value={formData.hotelName}
                      onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Loại hình lưu trú</Label>
                  <Select
                    value={formData.hotelType}
                    onValueChange={(value) => setFormData({ ...formData, hotelType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại hình" />
                    </SelectTrigger>
                    <SelectContent>
                      {hotelTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="123 Đường ABC, Quận 1"
                      className="pl-10"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Thành phố</Label>
                    <Input
                      id="city"
                      placeholder="TP. Hồ Chí Minh"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rooms">Số phòng</Label>
                    <Input
                      id="rooms"
                      type="number"
                      placeholder="50"
                      value={formData.rooms}
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                      required
                      min={1}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, agreeTerms: checked as boolean })
                    }
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                    Tôi đồng ý với{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Chính sách bảo mật
                    </Link>
                  </Label>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Quay lại
                </Button>
              )}
              <Button type="submit" className="flex-1" size="lg" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : step === 1 ? "Tiếp tục" : "Đăng ký"}
              </Button>
            </div>
          </form>

          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Đã có tài khoản đối tác?{" "}
              <Link to="/partner/login" className="text-primary font-semibold hover:underline">
                Đăng nhập
              </Link>
            </p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSignup;
