import { Shield, Clock, CreditCard, Headphones } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "An toàn & Bảo mật",
    description: "Thanh toán được bảo vệ 100%",
  },
  {
    icon: Clock,
    title: "Xác nhận tức thì",
    description: "Nhận xác nhận ngay lập tức",
  },
  {
    icon: CreditCard,
    title: "Giá tốt nhất",
    description: "Cam kết giá tốt nhất thị trường",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    description: "Luôn sẵn sàng hỗ trợ bạn",
  },
];

const TrustBadges = () => {
  return (
    <section className="w-full px-4 md:px-6 lg:px-12 py-8 md:py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 md:p-6 bg-card rounded-xl border border-border"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm md:text-base mb-1">
                {badge.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustBadges;
