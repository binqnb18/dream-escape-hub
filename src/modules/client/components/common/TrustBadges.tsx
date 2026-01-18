import { Award, Users, Star, Shield, Building2, Globe, CalendarCheck } from "lucide-react";

const TrustBadges = () => {
  const mainStats = [
    {
      icon: Building2,
      value: "15,000+",
      label: "Khách sạn",
      color: "text-blue-600",
    },
    {
      icon: CalendarCheck,
      value: "5.2M+",
      label: "Đặt phòng",
      color: "text-emerald-600",
    },
    {
      icon: Users,
      value: "2.5M+",
      label: "Khách hàng",
      color: "text-purple-600",
    },
    {
      icon: Globe,
      value: "63",
      label: "Tỉnh/Thành",
      color: "text-amber-600",
    },
  ];

  return (
    <section className="w-full px-4 md:px-6 lg:px-12 py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-0">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Vì sao chọn VBOOKING?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Nền tảng đặt phòng khách sạn đáng tin cậy hàng đầu Việt Nam
          </p>
        </div>

        {/* StatsSection - Main Numbers */}
        <div className="mb-12 md:mb-16">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 md:p-8 lg:p-12 border border-primary/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {mainStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center space-y-3">
                    <div className="flex justify-center">
                      <div className={`${stat.color} p-3 md:p-4 rounded-full bg-background/90 backdrop-blur-sm shadow-md`}>
                        <Icon className="h-6 w-6 md:h-8 md:w-8" />
                      </div>
                    </div>
                    <div className={`text-3xl md:text-4xl lg:text-5xl font-bold ${stat.color} leading-tight`}>
                      {stat.value}
                    </div>
                    <div className="text-sm md:text-base lg:text-lg font-semibold text-foreground">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trust Badges Row */}
        <div className="mt-8 md:mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium">Thanh toán bảo mật SSL</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium">Giá tốt nhất đảm bảo</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Đánh giá thực từ khách hàng</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
