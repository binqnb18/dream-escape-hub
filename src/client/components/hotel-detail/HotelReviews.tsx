import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ThumbsUp, MessageSquare, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface HotelReviewsProps {
  rating: number;
  reviewCount: number;
}

const ratingCategories = [
  { label: "Sạch sẽ", score: 9.4 },
  { label: "Thoải mái", score: 9.2 },
  { label: "Vị trí", score: 9.5 },
  { label: "Tiện nghi", score: 9.0 },
  { label: "Nhân viên", score: 9.6 },
  { label: "Giá trị", score: 8.8 },
];

const reviews = [
  {
    id: "1",
    user: {
      name: "Nguyễn Văn A",
      avatar: "",
      country: "Việt Nam",
    },
    rating: 9.5,
    date: "Tháng 12, 2024",
    stayType: "Cặp đôi",
    roomType: "Phòng Deluxe Hướng Biển",
    title: "Kỳ nghỉ tuyệt vời!",
    comment:
      "Resort rất đẹp, view biển tuyệt vời. Nhân viên nhiệt tình và chuyên nghiệp. Bữa sáng buffet đa dạng và ngon. Hồ bơi vô cực rất đẹp để chụp ảnh. Chắc chắn sẽ quay lại!",
    likes: 24,
    helpful: true,
  },
  {
    id: "2",
    user: {
      name: "Trần Thị B",
      avatar: "",
      country: "Việt Nam",
    },
    rating: 8.5,
    date: "Tháng 11, 2024",
    stayType: "Gia đình",
    roomType: "Phòng Suite Gia Đình",
    title: "Phù hợp cho gia đình",
    comment:
      "Phòng rộng rãi, có khu vui chơi cho trẻ em. Thức ăn ngon và phù hợp khẩu vị. Cáp treo ra đảo miễn phí là điểm cộng lớn. Tuy nhiên giá hơi cao so với các resort khác.",
    likes: 15,
    helpful: false,
  },
  {
    id: "3",
    user: {
      name: "John Smith",
      avatar: "",
      country: "Úc",
    },
    rating: 10,
    date: "Tháng 10, 2024",
    stayType: "Cặp đôi",
    roomType: "Villa Hồ Bơi Riêng",
    title: "Best resort in Vietnam!",
    comment:
      "Amazing experience! The private pool villa was absolutely stunning. Staff went above and beyond to make our honeymoon special. The spa was world-class. Highly recommend!",
    likes: 42,
    helpful: true,
  },
];

const ratingDistribution = [
  { stars: 5, percentage: 75 },
  { stars: 4, percentage: 18 },
  { stars: 3, percentage: 5 },
  { stars: 2, percentage: 1 },
  { stars: 1, percentage: 1 },
];

const HotelReviews = ({ rating, reviewCount }: HotelReviewsProps) => {
  const [filter, setFilter] = useState("all");

  const getRatingLabel = (rating: number) => {
    if (rating >= 9) return "Xuất sắc";
    if (rating >= 8) return "Tuyệt vời";
    if (rating >= 7) return "Rất tốt";
    if (rating >= 6) return "Tốt";
    return "Bình thường";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Đánh giá của khách</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Viết đánh giá
        </Button>
      </div>

      {/* Rating Summary */}
      <div className="grid md:grid-cols-3 gap-6 p-6 bg-muted/30 rounded-xl">
        {/* Overall Score */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-3">
            <div className="text-5xl font-bold text-primary">{rating}</div>
            <div>
              <p className="font-semibold text-lg">{getRatingLabel(rating * 2)}</p>
              <p className="text-sm text-muted-foreground">
                {reviewCount.toLocaleString()} đánh giá
              </p>
            </div>
          </div>
        </div>

        {/* Rating Categories */}
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {ratingCategories.map((category, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{category.label}</span>
                <span className="font-medium">{category.score}</span>
              </div>
              <Progress value={category.score * 10} className="h-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {ratingDistribution.map((item) => (
          <div key={item.stars} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm">{item.stars}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            </div>
            <Progress value={item.percentage} className="flex-1 h-2" />
            <span className="text-sm text-muted-foreground w-12">{item.percentage}%</span>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button variant="ghost" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Lọc
        </Button>
        {["Tất cả", "Cặp đôi", "Gia đình", "Công tác", "Bạn bè"].map((type) => (
          <Button
            key={type}
            variant={filter === type ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(type)}
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={review.user.avatar} />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{review.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.user.country} · {review.stayType} · {review.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-medium">
                    {review.rating}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Đã ở: {review.roomType}
                </p>

                <div>
                  <h4 className="font-medium mb-1">{review.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                    <ThumbsUp className={cn("h-4 w-4", review.helpful && "fill-current text-primary")} />
                    Hữu ích ({review.likes})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full">
        Xem tất cả {reviewCount.toLocaleString()} đánh giá
      </Button>
    </div>
  );
};

export default HotelReviews;
