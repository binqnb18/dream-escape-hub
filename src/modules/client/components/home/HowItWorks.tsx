import { Search, Calendar, CreditCard, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    id: 1,
    icon: Search,
    title: "Tìm kiếm",
    description: "Nhập địa điểm, chọn ngày và số khách để tìm khách sạn phù hợp",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    icon: Calendar,
    title: "So sánh & Chọn",
    description: "Xem chi tiết, so sánh giá và đánh giá để chọn khách sạn tốt nhất",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    id: 3,
    icon: CreditCard,
    title: "Thanh toán",
    description: "Thanh toán an toàn và nhanh chóng với nhiều phương thức thanh toán",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 4,
    icon: CheckCircle,
    title: "Xác nhận",
    description: "Nhận email xác nhận ngay lập tức và sẵn sàng cho chuyến đi của bạn",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full px-4 md:px-6 lg:px-12 py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-0">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Cách thức hoạt động
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Đặt phòng khách sạn chỉ trong 4 bước đơn giản
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative">
                {/* Step Number Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                    {step.id}
                  </div>
                </div>

                {/* Step Card */}
                <Card className="pt-8 pb-6 px-6 text-center h-full">
                  <div className="flex flex-col items-center">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-full ${step.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-8 h-8 ${step.color}`} />
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-foreground text-lg mb-2">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </Card>

                {/* Connector Arrow (Desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
