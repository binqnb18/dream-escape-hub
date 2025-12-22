import { Star, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
  hotel: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    location: "TP.HCM",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    comment: "Trải nghiệm tuyệt vời! Khách sạn đúng như mô tả, giá cả hợp lý. Nhân viên nhiệt tình, phòng sạch sẽ. Sẽ quay lại lần sau!",
    hotel: "Riverside Saigon Hotel",
    date: "2 tuần trước",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    location: "Hà Nội",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    comment: "Đặt phòng rất dễ dàng, thanh toán nhanh chóng. Khách sạn view đẹp, đầy đủ tiện nghi. Rất hài lòng với dịch vụ của VBOOKING!",
    hotel: "Old Quarter Boutique",
    date: "1 tháng trước",
  },
  {
    id: 3,
    name: "Lê Minh Cường",
    location: "Đà Nẵng",
    avatar: "https://i.pravatar.cc/150?img=33",
    rating: 5,
    comment: "Lần đầu sử dụng VBOOKING và rất ấn tượng! Giao diện dễ dùng, nhiều lựa chọn khách sạn. Đặc biệt là giá rẻ hơn so với đặt trực tiếp.",
    hotel: "Sunrise Beach Resort",
    date: "3 tuần trước",
  },
  {
    id: 4,
    name: "Phạm Thị Dung",
    location: "Phú Quốc",
    avatar: "https://i.pravatar.cc/150?img=20",
    rating: 5,
    comment: "Khách sạn view biển tuyệt đẹp! Phòng rộng rãi, sạch sẽ. Nhân viên hỗ trợ nhiệt tình. Cảm ơn VBOOKING đã giúp tôi có kỳ nghỉ hoàn hảo.",
    hotel: "Sea Breeze Villas",
    date: "1 tuần trước",
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    location: "Đà Lạt",
    avatar: "https://i.pravatar.cc/150?img=51",
    rating: 5,
    comment: "Đặt phòng nhanh chóng, xác nhận ngay lập tức. Khách sạn đúng như hình ảnh, không gian yên tĩnh, phù hợp cho nghỉ dưỡng. Rất recommend!",
    hotel: "Highland View Hotel",
    date: "2 tuần trước",
  },
];

const Testimonials = () => {
  return (
    <section className="w-full px-4 md:px-6 lg:px-12 py-12 md:py-16">
      <div className="container mx-auto px-0">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Khách hàng nói gì về VBOOKING?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Hơn 2.5 triệu khách hàng đã tin tưởng và hài lòng với dịch vụ của chúng tôi
          </p>
        </div>

        {/* Testimonials Carousel */}
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="p-6 h-full">
                  <div className="flex flex-col h-full">
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-foreground text-sm leading-relaxed mb-4 flex-1">
                      "{testimonial.comment}"
                    </p>

                    {/* Hotel Info */}
                    <div className="mb-4 pb-4 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{testimonial.hotel}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>
                          {testimonial.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>

        {/* View All Link */}
        <div className="text-center mt-8">
          <a href="#" className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-sm">
            Xem tất cả đánh giá
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
