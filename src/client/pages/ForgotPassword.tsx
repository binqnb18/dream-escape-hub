import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/client/components/auth/AuthLayout";

const ForgotPassword = () => {
  const { forgotPassword, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError("Vui lòng nhập email");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email không hợp lệ");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    const result = await forgotPassword(email);
    
    if (result.success) {
      setIsSubmitted(true);
      toast({
        title: "Email đã được gửi!",
        description: "Vui lòng kiểm tra hộp thư của bạn",
      });
    } else {
      toast({
        title: "Không thể gửi email",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Kiểm tra email của bạn"
        subtitle="Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu"
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Chúng tôi đã gửi email đến <strong className="text-foreground">{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Nhấp vào liên kết trong email để đặt lại mật khẩu. 
              Liên kết sẽ hết hạn sau 15 phút.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsSubmitted(false)}
            >
              Gửi lại email
            </Button>
            
            <Link to="/auth/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Không nhận được email? Kiểm tra thư mục spam hoặc{" "}
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-primary hover:underline"
            >
              thử lại với email khác
            </button>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Quên mật khẩu?"
      subtitle="Nhập email của bạn để nhận liên kết đặt lại mật khẩu"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className={`pl-10 ${error ? 'border-destructive' : ''}`}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            "Gửi liên kết đặt lại"
          )}
        </Button>

        <Link to="/auth/login">
          <Button variant="ghost" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại đăng nhập
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
