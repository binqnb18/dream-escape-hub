import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type PromotionCardProps = {
  title: string;
  subtitle: string;
  discount: string;
  discountValue: number;
  background: string;
  textColor: string;
  icon: ReactNode;
  hotelCount: string;
  timeLeft?: string;
  condition?: string;
  badge: string;
  badgeColor: string;
};

const PromotionCard = ({
  title,
  subtitle,
  discount,
  background,
  textColor,
  icon,
  hotelCount,
  timeLeft,
  condition,
  badge,
  badgeColor,
}: PromotionCardProps) => {
  return (
    <div
      className={cn(
        "relative h-[200px] md:h-[220px] rounded-2xl overflow-hidden p-5 md:p-6 transition-all duration-300 group-hover:shadow-elevated group-hover:scale-[1.02]",
        background,
        textColor
      )}
    >
      {/* Badge */}
      <Badge className={cn("absolute top-4 right-4 text-[10px] font-bold", badgeColor, "text-primary-foreground")}>
        {badge}
      </Badge>

      {/* Content */}
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-2">
          {icon}
        </div>
        
        <h3 className="text-lg md:text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm opacity-90 mb-3">{subtitle}</p>
        
        <div className="mt-auto">
          <p className="text-xl md:text-2xl font-bold mb-1">{discount}</p>
          {timeLeft && (
            <p className="text-xs opacity-75">{timeLeft}</p>
          )}
          {condition && (
            <p className="text-xs opacity-75">{condition}</p>
          )}
          <p className="text-xs opacity-75 mt-1">{hotelCount} khách sạn</p>
        </div>
      </div>

      {/* Decorative circle */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-primary-foreground/10" />
    </div>
  );
};

export default PromotionCard;
