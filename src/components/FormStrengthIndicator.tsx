import { useMemo } from "react";
import { Check, AlertCircle, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FieldRequirement {
  field: string;
  label: string;
  isValid: boolean;
  isTouched: boolean;
}

interface FormStrengthIndicatorProps {
  requirements: FieldRequirement[];
  className?: string;
  showDetails?: boolean;
}

const FormStrengthIndicator = ({ 
  requirements, 
  className,
  showDetails = true 
}: FormStrengthIndicatorProps) => {
  const { completedCount, totalCount, percentage, strengthLevel, strengthColor, strengthLabel } = useMemo(() => {
    const total = requirements.length;
    const completed = requirements.filter(r => r.isValid).length;
    const pct = Math.round((completed / total) * 100);
    
    let level: "weak" | "medium" | "strong" | "complete" = "weak";
    let color = "bg-destructive";
    let label = "Chưa hoàn thành";
    
    if (pct === 100) {
      level = "complete";
      color = "bg-green-500";
      label = "Hoàn thành";
    } else if (pct >= 75) {
      level = "strong";
      color = "bg-green-500";
      label = "Gần hoàn thành";
    } else if (pct >= 50) {
      level = "medium";
      color = "bg-amber-500";
      label = "Đang tiến triển";
    } else if (pct >= 25) {
      level = "weak";
      color = "bg-orange-500";
      label = "Mới bắt đầu";
    }
    
    return {
      completedCount: completed,
      totalCount: total,
      percentage: pct,
      strengthLevel: level,
      strengthColor: color,
      strengthLabel: label,
    };
  }, [requirements]);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Tiến độ điền thông tin</span>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium transition-colors",
            strengthLevel === "complete" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            strengthLevel === "strong" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            strengthLevel === "medium" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
            strengthLevel === "weak" && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
          )}>
            {strengthLabel}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{totalCount} trường
        </span>
      </div>

      {/* Animated progress bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out",
            strengthColor
          )}
          style={{ width: `${percentage}%` }}
        />
        {percentage < 100 && (
          <div 
            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>

      {/* Field checklist */}
      {showDetails && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
          {requirements.map((req) => (
            <div 
              key={req.field}
              className={cn(
                "flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-md transition-all duration-300",
                req.isValid 
                  ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                  : req.isTouched
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {req.isValid ? (
                <Check className="h-3 w-3 flex-shrink-0" />
              ) : req.isTouched ? (
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
              ) : (
                <Circle className="h-3 w-3 flex-shrink-0" />
              )}
              <span className="truncate">{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Email strength indicator component
interface EmailStrengthProps {
  email: string;
  className?: string;
}

export const EmailStrengthIndicator = ({ email, className }: EmailStrengthProps) => {
  const { checks, score } = useMemo(() => {
    const emailChecks = [
      { label: "Có ký tự @", valid: email.includes("@") },
      { label: "Có domain", valid: email.includes("@") && email.split("@")[1]?.includes(".") },
      { label: "Định dạng hợp lệ", valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) },
      { label: "Domain phổ biến", valid: /(gmail|yahoo|outlook|hotmail|icloud)\.com$/i.test(email) || /.+\.(vn|edu|gov|org)$/i.test(email) },
    ];
    
    const validCount = emailChecks.filter(c => c.valid).length;
    return { checks: emailChecks, score: validCount };
  }, [email]);

  if (!email) return null;

  const getColor = () => {
    if (score === 4) return "bg-green-500";
    if (score >= 3) return "bg-green-400";
    if (score >= 2) return "bg-amber-500";
    return "bg-destructive";
  };

  return (
    <div className={cn("space-y-1.5 mt-1.5", className)}>
      <div className="flex gap-1">
        {checks.map((check, idx) => (
          <div 
            key={idx}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              check.valid ? getColor() : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {score === 4 && "Email hợp lệ ✓"}
        {score === 3 && "Email có thể hợp lệ"}
        {score === 2 && "Kiểm tra định dạng email"}
        {score < 2 && "Nhập email đầy đủ"}
      </p>
    </div>
  );
};

// Phone strength indicator
interface PhoneStrengthProps {
  phone: string;
  countryCode: string;
  className?: string;
}

export const PhoneStrengthIndicator = ({ phone, countryCode, className }: PhoneStrengthProps) => {
  const { checks, score } = useMemo(() => {
    const cleanPhone = phone.replace(/\D/g, "");
    const expectedLength = countryCode === "+84" ? 9 : 10; // Vietnam uses 9 digits after country code
    
    const phoneChecks = [
      { label: "Chỉ có số", valid: /^\d*$/.test(cleanPhone) && cleanPhone.length > 0 },
      { label: "Độ dài đúng", valid: cleanPhone.length >= expectedLength },
      { label: "Định dạng VN", valid: countryCode === "+84" ? /^(3|5|7|8|9)\d{8}$/.test(cleanPhone) : cleanPhone.length >= 10 },
    ];
    
    const validCount = phoneChecks.filter(c => c.valid).length;
    return { checks: phoneChecks, score: validCount };
  }, [phone, countryCode]);

  if (!phone) return null;

  const getColor = () => {
    if (score === 3) return "bg-green-500";
    if (score >= 2) return "bg-amber-500";
    return "bg-destructive";
  };

  return (
    <div className={cn("space-y-1.5 mt-1.5", className)}>
      <div className="flex gap-1">
        {checks.map((check, idx) => (
          <div 
            key={idx}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              check.valid ? getColor() : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {score === 3 && "Số điện thoại hợp lệ ✓"}
        {score === 2 && "Kiểm tra độ dài số điện thoại"}
        {score < 2 && phone.length > 0 && "Nhập đầy đủ số điện thoại"}
      </p>
    </div>
  );
};

// Name strength indicator
interface NameStrengthProps {
  name: string;
  fieldLabel: string;
  className?: string;
}

export const NameStrengthIndicator = ({ name, fieldLabel, className }: NameStrengthProps) => {
  const { isValid, message } = useMemo(() => {
    if (!name) return { isValid: false, message: "" };
    if (name.length < 2) return { isValid: false, message: `${fieldLabel} cần ít nhất 2 ký tự` };
    if (/\d/.test(name)) return { isValid: false, message: `${fieldLabel} không nên chứa số` };
    if (name.length >= 2) return { isValid: true, message: "✓" };
    return { isValid: false, message: "" };
  }, [name, fieldLabel]);

  if (!name) return null;

  return (
    <div className={cn("mt-1", className)}>
      <div className={cn(
        "h-1 rounded-full transition-all duration-300",
        isValid ? "bg-green-500" : "bg-amber-500"
      )} />
      <p className={cn(
        "text-xs mt-1",
        isValid ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
      )}>
        {message}
      </p>
    </div>
  );
};

export default FormStrengthIndicator;
