import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/modules/client/components/auth/AuthLayout";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { verifyOtp, resendOtp, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newOtp.every(digit => digit) && newOtp.join("").length === 6) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (otpValue?: string) => {
    const code = otpValue || otp.join("");
    
    if (code.length !== 6) {
      setError("Vui lòng nhập đủ 6 số");
      return;
    }

    const result = await verifyOtp(code);
    
    if (result.success) {
      toast({
        title: "Xác thực thành công!",
        description: "Tài khoản của bạn đã được kích hoạt",
      });
      navigate("/");
    } else {
      setError(result.error || "Mã OTP không đúng");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    const result = await resendOtp();
    
    if (result.success) {
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      toast({
        title: "Đã gửi lại mã OTP",
        description: "Vui lòng kiểm tra tin nhắn/email của bạn",
      });
    }
  };

  return (
    <AuthLayout
      title="Xác thực OTP"
      subtitle="Nhập mã 6 số đã được gửi đến email/điện thoại của bạn"
    >
      <div className="space-y-6">
        {/* OTP Inputs */}
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 text-center text-2xl font-bold ${
                error ? 'border-destructive' : digit ? 'border-primary' : ''
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}

        {/* Demo hint */}
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Demo:</strong> Nhập mã <code className="bg-muted px-1 rounded">123456</code> để xác thực
          </p>
        </div>

        {/* Resend */}
        <div className="text-center">
          {canResend ? (
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={isLoading}
              className="text-primary"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Gửi lại mã OTP
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Gửi lại mã sau <span className="font-medium text-primary">{countdown}s</span>
            </p>
          )}
        </div>

        {/* Submit button */}
        <Button
          onClick={() => handleSubmit()}
          className="w-full"
          size="lg"
          disabled={isLoading || otp.some(d => !d)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xác thực...
            </>
          ) : (
            "Xác nhận"
          )}
        </Button>

        {/* Back button */}
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtp;
