import { useNavigate } from "react-router-dom";
import { ChevronRight, Clock, Sparkles, Zap, Calendar, Gift, Users, TrendingUp } from "lucide-react";
import PromotionCard from "./PromotionCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const promotions = [
  {
    id: "flash-sale",
    title: "Flash Sale",
    subtitle: "Giảm giá sốc hôm nay",
    discount: "Lên đến 70%",
    discountValue: 70,
    icon: Zap,
    background: "bg-gradient-to-br from-red-500 via-orange-500 to-red-600",
    textColor: "text-primary-foreground",
    hotelCount: "2,458",
    timeLeft: "Còn 8 giờ",
    badge: "HOT",
    badgeColor: "bg-red-600",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    subtitle: "Đặt trước 30 ngày",
    discount: "Giảm 30%",
    discountValue: 30,
    icon: Calendar,
    background: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600",
    textColor: "text-primary-foreground",
    hotelCount: "1,892",
    condition: "Đặt trước 30 ngày",
    badge: "POPULAR",
    badgeColor: "bg-emerald-600",
  },
  {
    id: "last-minute",
    title: "Last Minute",
    subtitle: "Ưu đãi phút cuối",
    discount: "Giảm 40%",
    discountValue: 40,
    icon: Clock,
    background: "bg-gradient-to-br from-violet-600 via-violet-500 to-pink-500",
    textColor: "text-primary-foreground",
    hotelCount: "856",
    condition: "Đặt trong 24h",
    badge: "LIMITED",
    badgeColor: "bg-violet-600",
  },
  {
    id: "weekend-deal",
    title: "Weekend Deal",
    subtitle: "Ưu đãi cuối tuần",
    discount: "Giảm 25%",
    discountValue: 25,
    icon: Sparkles,
    background: "bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-600",
    textColor: "text-primary-foreground",
    hotelCount: "1,234",
    condition: "Thứ 6 - Chủ nhật",
    badge: "WEEKEND",
    badgeColor: "bg-blue-600",
  },
  {
    id: "member-exclusive",
    title: "Member Exclusive",
    subtitle: "Dành cho thành viên",
    discount: "Giảm 15%",
    discountValue: 15,
    icon: Gift,
    background: "bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500",
    textColor: "text-primary-foreground",
    hotelCount: "3,456",
    condition: "Cần đăng nhập",
    badge: "EXCLUSIVE",
    badgeColor: "bg-amber-600",
  },
  {
    id: "family-package",
    title: "Gói Gia Đình",
    subtitle: "Ưu đãi cho gia đình",
    discount: "Giảm 20%",
    discountValue: 20,
    icon: Users,
    background: "bg-gradient-to-br from-pink-500 via-rose-500 to-red-500",
    textColor: "text-primary-foreground",
    hotelCount: "678",
    condition: "Từ 3 người",
    badge: "FAMILY",
    badgeColor: "bg-pink-600",
  },
  {
    id: "trending",
    title: "Đang Hot",
    subtitle: "Khách sạn được yêu thích",
    discount: "Giảm 35%",
    discountValue: 35,
    icon: TrendingUp,
    background: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900",
    textColor: "text-primary-foreground",
    hotelCount: "4,123",
    condition: "Đánh giá 8.5+",
    badge: "TRENDING",
    badgeColor: "bg-slate-600",
  },
];

const AccommodationPromotions = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 md:px-6 lg:px-12 py-12 md:py-16 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Khuyến Mãi Chỗ Ở
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Khám phá các ưu đãi đặc biệt và tiết kiệm cho chuyến đi của bạn
            </p>
          </div>
          <button
            onClick={() => navigate("/search")}
            className="flex items-center gap-1 text-primary hover:text-navy-light transition-colors font-medium text-sm md:text-base whitespace-nowrap"
          >
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {promotions.map((promo) => {
              const IconComponent = promo.icon;
              return (
                <CarouselItem
                  key={promo.id}
                  className="pl-2 md:pl-4 basis-[90%] sm:basis-[45%] lg:basis-[32%] xl:basis-[24%]"
                >
                  <div
                    onClick={() => navigate("/search")}
                    className="h-full cursor-pointer group"
                  >
                    <PromotionCard
                      title={promo.title}
                      subtitle={promo.subtitle}
                      discount={promo.discount}
                      discountValue={promo.discountValue}
                      background={promo.background}
                      textColor={promo.textColor}
                      icon={<IconComponent className="w-6 h-6 md:w-8 md:h-8" />}
                      hotelCount={promo.hotelCount}
                      timeLeft={promo.timeLeft}
                      condition={promo.condition}
                      badge={promo.badge}
                      badgeColor={promo.badgeColor}
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 lg:-left-8" />
          <CarouselNext className="hidden md:flex -right-4 lg:-right-8" />
        </Carousel>

        {/* Quick Stats */}
        <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-card border border-border rounded-lg p-4 md:p-5 text-center shadow-card">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
              {promotions.reduce((sum, p) => sum + parseInt(p.hotelCount.replace(/,/g, "")), 0).toLocaleString()}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Khách sạn có khuyến mãi</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 md:p-5 text-center shadow-card">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
              {Math.max(...promotions.map((p) => p.discountValue))}%
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Giảm giá tối đa</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 md:p-5 text-center shadow-card">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
              {promotions.length}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Chương trình khuyến mãi</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 md:p-5 text-center shadow-card"> 
            <div className="text-2xl md:text-3xl font-bold text-primary mb-1">24/7</div>
            <div className="text-xs md:text-sm text-muted-foreground">Hỗ trợ đặt phòng</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccommodationPromotions;
