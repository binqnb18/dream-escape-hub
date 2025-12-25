import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Tag, Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PromotionNotification {
  id: string;
  hotelId: string;
  hotelName: string;
  promotionText: string;
  discountPercent?: number;
  expiresAt?: Date;
}

// Mock promotion notifications - would come from backend push notifications
const mockPromotions: PromotionNotification[] = [
  {
    id: "promo-1",
    hotelId: "1",
    hotelName: "Vinpearl Resort & Spa Phú Quốc",
    promotionText: "Flash Sale cuối tuần",
    discountPercent: 30,
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "promo-2",
    hotelId: "3",
    hotelName: "JW Marriott Phu Quoc Emerald Bay",
    promotionText: "Ưu đãi đặc biệt mùa lễ hội",
    discountPercent: 25,
  },
];

interface WishlistPromotionBannerProps {
  wishlistIds: string[];
}

const WishlistPromotionBanner = ({ wishlistIds }: WishlistPromotionBannerProps) => {
  const [promotions, setPromotions] = useState<PromotionNotification[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    const stored = localStorage.getItem("dismissed_wishlist_promos");
    return stored ? JSON.parse(stored) : [];
  });
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Filter promotions for hotels in wishlist and not dismissed
    const relevantPromos = mockPromotions.filter(
      (promo) =>
        wishlistIds.includes(promo.hotelId) && !dismissedIds.includes(promo.id)
    );
    setPromotions(relevantPromos);
  }, [wishlistIds, dismissedIds]);

  const handleDismiss = (promoId: string) => {
    const newDismissed = [...dismissedIds, promoId];
    setDismissedIds(newDismissed);
    localStorage.setItem("dismissed_wishlist_promos", JSON.stringify(newDismissed));
  };

  const handleDismissAll = () => {
    const allIds = promotions.map((p) => p.id);
    const newDismissed = [...dismissedIds, ...allIds];
    setDismissedIds(newDismissed);
    localStorage.setItem("dismissed_wishlist_promos", JSON.stringify(newDismissed));
  };

  if (promotions.length === 0) return null;

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-r from-accent/5 via-accent/10 to-primary/5">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-5 w-5 text-accent" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
              {promotions.length}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">
              Khuyến mãi cho khách sạn yêu thích
            </h3>
            <p className="text-xs text-muted-foreground">
              {promotions.length} khách sạn đang có ưu đãi đặc biệt
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDismissAll();
          }}
        >
          Ẩn tất cả
        </Button>
      </div>

      {/* Promotions List */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="px-4 pb-4 space-y-2">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="flex items-center justify-between gap-4 p-3 bg-background rounded-lg border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Tag className="h-5 w-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{promo.hotelName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-accent font-medium">
                      {promo.promotionText}
                    </span>
                    {promo.discountPercent && (
                      <span className="text-xs text-white bg-destructive px-1.5 py-0.5 rounded">
                        -{promo.discountPercent}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/hotel/${promo.hotelId}`}>
                  <Button size="sm" className="gap-1">
                    Xem ngay
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDismiss(promo.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPromotionBanner;
