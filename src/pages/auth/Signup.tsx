import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/components/auth/AuthLayout";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordRequirements = [
    { label: "Ít nhất 8 ký tự", test: (p: string) => p.length >= 8 },
    { label: "Có chữ hoa", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Có chữ thường", test: (p: string) => /[a-z]/.test(p) },
    { label: "Có số", test: (p: string) => /[0-9]/.test(p) },
    { label: "Có ký tự đặc biệt", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Vui lòng nhập họ";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Vui lòng nhập tên";
    }
    
    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (!passwordRequirements.every(req => req.test(formData.password))) {
      newErrors.password = "Mật khẩu chưa đủ mạnh";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    
    if (!agreeTerms) {
      newErrors.terms = "Vui lòng đồng ý với điều khoản sử dụng";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await signup({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    });
    
    if (result.success) {
      toast({
        title: "Đăng ký thành công!",
        description: "Chào mừng bạn đến với TripNest",
      });
      navigate("/auth/verify-otp");
    } else {
      toast({
        title: "Đăng ký thất bại",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      subtitle="Đăng ký để bắt đầu hành trình khám phá cùng TripNest"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">Họ</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                placeholder="Nguyễn"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={`pl-10 ${errors.firstName ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Tên</Label>
            <Input
              id="lastName"
              placeholder="Văn A"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={errors.lastName ? 'border-destructive' : ''}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại (tùy chọn)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+84 901 234 567"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Password strength indicators */}
          {formData.password && (
            <div className="grid grid-cols-2 gap-1 mt-2">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  {req.test(formData.password) ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <X className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className={req.test(formData.password) ? "text-success" : "text-muted-foreground"}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms */}
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              className="mt-0.5"
            />
            <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-tight">
              Tôi đồng ý với{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Chính sách bảo mật
              </Link>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-xs text-destructive">{errors.terms}</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo tài khoản...
            </>
          ) : (
            "Đăng ký"
          )}
        </Button>

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link to="/auth/login" className="text-primary font-medium hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
