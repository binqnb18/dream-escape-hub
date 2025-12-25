import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/client/components/Header";
import ClientFooter from "@/client/components/ClientFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Sparkles,
  Zap,
  Calendar,
  Gift,
  Users,
  TrendingUp,
  Timer,
  Hotel,
  Percent,
  ArrowRight,
  Star,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  discount: string;
  discountValue: number;
  icon: typeof Zap;
  gradient: string;
  hotelCount: number;
  usedCount: number;
  maxUses: number;
  expiresAt?: Date;
  condition: string;
  code?: string;
  category: "flash" | "seasonal" | "member" | "special";
  minBooking?: number;
  featured: boolean;
}

const promotions: Promotion[] = [
  {
    id: "flash-sale",
    title: "Flash Sale 70%",
    subtitle: "Giảm giá sốc hôm nay",
    description: "Ưu đãi giảm giá lên đến 70% cho các khách sạn 4-5 sao. Số lượng có hạn, đặt ngay!",
    discount: "Lên đến 70%",
    discountValue: 70,
    icon: Zap,
    gradient: "from-red-500 via-orange-500 to-red-600",
    hotelCount: 2458,
    usedCount: 1823,
    maxUses: 2000,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    condition: "Áp dụng cho đặt phòng từ 2 đêm",
    code: "FLASH70",
    category: "flash",
    minBooking: 2000000,
    featured: true,
  },
  {
    id: "early-bird",
    title: "Early Bird",
    subtitle: "Đặt trước 30 ngày",
    description: "Lên kế hoạch sớm và tiết kiệm 30% chi phí khách sạn khi đặt trước 30 ngày.",
    discount: "Giảm 30%",
    discountValue: 30,
    icon: Calendar,
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    hotelCount: 1892,
    usedCount: 567,
    maxUses: 1000,
    condition: "Đặt trước tối thiểu 30 ngày",
    code: "EARLY30",
    category: "seasonal",
    featured: true,
  },
  {
    id: "last-minute",
    title: "Last Minute",
    subtitle: "Ưu đãi phút cuối",
    description: "Giảm ngay 40% cho các đặt phòng trong vòng 24 giờ. Hoàn hảo cho chuyến đi bất ngờ!",
    discount: "Giảm 40%",
    discountValue: 40,
    icon: Clock,
    gradient: "from-violet-600 via-violet-500 to-pink-500",
    hotelCount: 856,
    usedCount: 234,
    maxUses: 500,
    condition: "Check-in trong vòng 24h",
    code: "LAST40",
    category: "flash",
    featured: false,
  },
  {
    id: "weekend-deal",
    title: "Weekend Deal",
    subtitle: "Ưu đãi cuối tuần",
    description: "Nghỉ dưỡng cuối tuần với giá ưu đãi. Giảm 25% cho tất cả đặt phòng từ Thứ 6 đến Chủ nhật.",
    discount: "Giảm 25%",
    discountValue: 25,
    icon: Sparkles,
    gradient: "from-blue-600 via-indigo-500 to-violet-600",
    hotelCount: 1234,
    usedCount: 890,
    maxUses: 1500,
    condition: "Áp dụng Thứ 6 - Chủ nhật",
    code: "WEEKEND25",
    category: "seasonal",
    featured: true,
  },
  {
    id: "member-exclusive",
    title: "Member Exclusive",
    subtitle: "Dành cho thành viên",
    description: "Ưu đãi độc quyền 15% cho thành viên đăng ký. Đăng ký miễn phí ngay hôm nay!",
    discount: "Giảm 15%",
    discountValue: 15,
    icon: Gift,
    gradient: "from-amber-500 via-yellow-500 to-orange-500",
    hotelCount: 3456,
    usedCount: 2100,
    maxUses: 5000,
    condition: "Cần đăng nhập tài khoản",
    category: "member",
    featured: false,
  },
  {
    id: "family-package",
    title: "Gói Gia Đình",
    subtitle: "Ưu đãi cho gia đình",
    description: "Tiết kiệm 20% khi đặt phòng cho gia đình từ 3 người trở lên. Thêm giường phụ miễn phí!",
    discount: "Giảm 20%",
    discountValue: 20,
    icon: Users,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    hotelCount: 678,
    usedCount: 345,
    maxUses: 800,
    condition: "Từ 3 khách trở lên",
    code: "FAMILY20",
    category: "special",
    featured: false,
  },
  {
    id: "trending",
    title: "Đang Hot",
    subtitle: "Khách sạn được yêu thích",
    description: "Giảm 35% tại các khách sạn có đánh giá từ 8.5/10 trở lên. Chất lượng đảm bảo!",
    discount: "Giảm 35%",
    discountValue: 35,
    icon: TrendingUp,
    gradient: "from-slate-700 via-slate-800 to-slate-900",
    hotelCount: 4123,
    usedCount: 1567,
    maxUses: 3000,
    condition: "Khách sạn đánh giá 8.5+",
    code: "HOT35",
    category: "special",
    featured: true,
  },
  {
    id: "new-year",
    title: "Năm Mới 2025",
    subtitle: "Chào năm mới",
    description: "Mừng năm mới với ưu đãi đặc biệt giảm 50% cho tuần lễ đầu năm!",
    discount: "Giảm 50%",
    discountValue: 50,
    icon: Star,
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    hotelCount: 1500,
    usedCount: 800,
    maxUses: 1000,
    expiresAt: new Date("2025-01-07"),
    condition: "Check-in từ 01/01 - 07/01/2025",
    code: "NEWYEAR50",
    category: "seasonal",
    featured: true,
  },
];

const categoryLabels = {
  all: "Tất cả",
  flash: "Flash Sale",
  seasonal: "Theo mùa",
  member: "Thành viên",
  special: "Đặc biệt",
};

const PromotionDetailCard = ({ promotion }: { promotion: Promotion }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const Icon = promotion.icon;
  
  const progressPercent = (promotion.usedCount / promotion.maxUses) * 100;
  const remaining = promotion.maxUses - promotion.usedCount;

  const handleCopyCode = () => {
    if (promotion.code) {
      navigator.clipboard.writeText(promotion.code);
      setCopied(true);
      toast({
        title: "Đã sao chép mã",
        description: `Mã ${promotion.code} đã được sao chép vào clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTimeLeft = (date: Date) => {
    const diff = date.getTime() - Date.now();
    if (diff <= 0) return "Đã hết hạn";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Còn ${days} ngày`;
    }
    return `Còn ${hours}h ${minutes}m`;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-elevated transition-all duration-300 border-border/50">
      {/* Header with gradient */}
      <div className={`relative h-32 bg-gradient-to-br ${promotion.gradient} p-4`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">{promotion.title}</h3>
              <p className="text-sm text-white/80">{promotion.subtitle}</p>
            </div>
          </div>
          {promotion.featured && (
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
              Nổi bật
            </Badge>
          )}
        </div>
        
        {/* Discount display */}
        <div className="absolute bottom-4 right-4">
          <div className="text-3xl font-black text-white">
            {promotion.discount}
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10" />
      </div>

      <CardContent className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {promotion.description}
        </p>

        {/* Usage progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Đã sử dụng</span>
            <span className="font-medium">{promotion.usedCount.toLocaleString()}/{promotion.maxUses.toLocaleString()}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Còn lại <span className="text-primary font-medium">{remaining.toLocaleString()}</span> suất
          </p>
        </div>

        {/* Timer or Condition */}
        <div className="flex items-center gap-2 text-sm">
          {promotion.expiresAt ? (
            <div className="flex items-center gap-1.5 text-destructive">
              <Timer className="h-4 w-4" />
              <span className="font-medium">{formatTimeLeft(promotion.expiresAt)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{promotion.condition}</span>
            </div>
          )}
        </div>

        {/* Code & Stats */}
        <div className="flex items-center gap-3 pt-2 border-t border-border/50">
          {promotion.code && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="gap-1.5 font-mono"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {promotion.code}
            </Button>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <Hotel className="h-3.5 w-3.5" />
            <span>{promotion.hotelCount.toLocaleString()} khách sạn</span>
          </div>
        </div>

        {/* CTA */}
        <Button 
          className="w-full gap-2"
          onClick={() => navigate(`/search?promo=${promotion.id}`)}
        >
          Xem ưu đãi
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

const Promotions = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredPromotions = promotions.filter((promo) => {
    if (activeTab === "all") return true;
    return promo.category === activeTab;
  });

  const featuredPromotions = promotions.filter((p) => p.featured);
  const totalSavings = promotions.reduce((sum, p) => sum + p.discountValue, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-12 md:py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-4 bg-white/20 text-white border-0">
            <Sparkles className="h-3 w-3 mr-1" />
            Ưu đãi độc quyền
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Khuyến Mãi & Ưu Đãi
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Khám phá các chương trình khuyến mãi hấp dẫn và tiết kiệm cho chuyến đi của bạn
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
              <div className="text-2xl md:text-3xl font-bold text-white">{promotions.length}</div>
              <p className="text-sm text-white/80">Chương trình</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
              <div className="text-2xl md:text-3xl font-bold text-white">70%</div>
              <p className="text-sm text-white/80">Giảm tối đa</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
              <div className="text-2xl md:text-3xl font-bold text-white">
                {promotions.reduce((sum, p) => sum + p.hotelCount, 0).toLocaleString()}+
              </div>
              <p className="text-sm text-white/80">Khách sạn</p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {key === "all" 
                    ? promotions.length 
                    : promotions.filter(p => p.category === key).length
                  }
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Featured Section */}
        {activeTab === "all" && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
              <h2 className="text-2xl font-bold">Ưu đãi nổi bật</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPromotions.slice(0, 3).map((promo) => (
                <PromotionDetailCard key={promo.id} promotion={promo} />
              ))}
            </div>
          </section>
        )}

        {/* All Promotions */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {activeTab === "all" ? "Tất cả ưu đãi" : categoryLabels[activeTab as keyof typeof categoryLabels]}
          </h2>
          
          {filteredPromotions.length === 0 ? (
            <div className="text-center py-12">
              <Percent className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Không có ưu đãi trong danh mục này</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPromotions.map((promo) => (
                <PromotionDetailCard key={promo.id} promotion={promo} />
              ))}
            </div>
          )}
        </section>

        {/* How to use section */}
        <section className="mt-12 bg-muted/30 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 text-center">Cách sử dụng mã giảm giá</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Chọn ưu đãi</h3>
              <p className="text-sm text-muted-foreground">
                Tìm và chọn ưu đãi phù hợp với nhu cầu của bạn
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Sao chép mã</h3>
              <p className="text-sm text-muted-foreground">
                Nhấn vào nút sao chép để lấy mã giảm giá
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Áp dụng khi thanh toán</h3>
              <p className="text-sm text-muted-foreground">
                Nhập mã vào ô khuyến mãi khi hoàn tất đặt phòng
              </p>
            </div>
          </div>
        </section>
      </main>

      <ClientFooter />
    </div>
  );
};

export default Promotions;
