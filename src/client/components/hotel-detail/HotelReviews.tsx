import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star, ThumbsUp, MessageSquare, Filter, Flag, CheckCircle, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface HotelReviewsProps {
  rating: number;
  reviewCount: number;
}

// Rating categories with detailed criteria
const ratingCategories = [
  { label: "Vị trí", key: "location", score: 9.5 },
  { label: "Dịch vụ", key: "service", score: 9.6 },
  { label: "Sạch sẽ", key: "cleanliness", score: 9.4 },
  { label: "Giá trị", key: "value", score: 8.8 },
  { label: "Tiện nghi", key: "amenities", score: 9.0 },
  { label: "Thoải mái", key: "comfort", score: 9.2 },
];

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
    country: string;
    isVerified: boolean;
  };
  rating: number;
  ratingDetails: {
    location: number;
    service: number;
    cleanliness: number;
    value: number;
  };
  date: string;
  stayType: string;
  roomType: string;
  title: string;
  comment: string;
  likes: number;
  helpful: boolean;
  images?: string[];
}

const reviews: Review[] = [
  {
    id: "1",
    user: {
      name: "Nguyễn Văn A",
      avatar: "",
      country: "Việt Nam",
      isVerified: true,
    },
    rating: 9.5,
    ratingDetails: {
      location: 10,
      service: 9,
      cleanliness: 10,
      value: 9,
    },
    date: "Tháng 12, 2024",
    stayType: "Cặp đôi",
    roomType: "Phòng Deluxe Hướng Biển",
    title: "Kỳ nghỉ tuyệt vời!",
    comment:
      "Resort rất đẹp, view biển tuyệt vời. Nhân viên nhiệt tình và chuyên nghiệp. Bữa sáng buffet đa dạng và ngon. Hồ bơi vô cực rất đẹp để chụp ảnh. Chắc chắn sẽ quay lại!",
    likes: 24,
    helpful: true,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200",
    ],
  },
  {
    id: "2",
    user: {
      name: "Trần Thị B",
      avatar: "",
      country: "Việt Nam",
      isVerified: false,
    },
    rating: 8.5,
    ratingDetails: {
      location: 9,
      service: 8,
      cleanliness: 9,
      value: 8,
    },
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
      isVerified: true,
    },
    rating: 10,
    ratingDetails: {
      location: 10,
      service: 10,
      cleanliness: 10,
      value: 10,
    },
    date: "Tháng 10, 2024",
    stayType: "Cặp đôi",
    roomType: "Villa Hồ Bơi Riêng",
    title: "Best resort in Vietnam!",
    comment:
      "Amazing experience! The private pool villa was absolutely stunning. Staff went above and beyond to make our honeymoon special. The spa was world-class. Highly recommend!",
    likes: 42,
    helpful: true,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200",
    ],
  },
];

const ratingDistribution = [
  { stars: 5, percentage: 75, count: 2135 },
  { stars: 4, percentage: 18, count: 512 },
  { stars: 3, percentage: 5, count: 142 },
  { stars: 2, percentage: 1, count: 29 },
  { stars: 1, percentage: 1, count: 29 },
];

const HotelReviews = ({ rating, reviewCount }: HotelReviewsProps) => {
  const [filterType, setFilterType] = useState("all");
  const [filterStar, setFilterStar] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [viewingImages, setViewingImages] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getRatingLabel = (rating: number) => {
    if (rating >= 9) return "Xuất sắc";
    if (rating >= 8) return "Tuyệt vời";
    if (rating >= 7) return "Rất tốt";
    if (rating >= 6) return "Tốt";
    return "Bình thường";
  };

  const handleReport = (reviewId: string) => {
    setReportingReviewId(reviewId);
    setReportDialogOpen(true);
  };

  const submitReport = () => {
    if (!reportReason.trim()) {
      toast({
        title: "Vui lòng nhập lý do",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Đã gửi báo cáo",
      description: "Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét nội dung này.",
    });
    setReportDialogOpen(false);
    setReportReason("");
    setReportingReviewId(null);
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      if (filterType !== "all" && review.stayType !== filterType) return false;
      if (filterStar !== "all") {
        const starRating = Math.floor(review.rating / 2);
        if (starRating !== parseInt(filterStar)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "helpful":
          return b.likes - a.likes;
        default:
          return 0; // newest - keep original order
      }
    });

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

        {/* Rating Categories with detailed criteria */}
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {ratingCategories.map((category) => (
            <div key={category.key} className="space-y-1">
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
        <h3 className="font-semibold mb-3">Phân bố đánh giá</h3>
        {ratingDistribution.map((item) => (
          <button
            key={item.stars}
            onClick={() => setFilterStar(filterStar === item.stars.toString() ? "all" : item.stars.toString())}
            className={cn(
              "w-full flex items-center gap-3 p-2 rounded-lg transition-colors",
              filterStar === item.stars.toString() ? "bg-primary/10" : "hover:bg-muted/50"
            )}
          >
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm">{item.stars}</span>
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            </div>
            <Progress value={item.percentage} className="flex-1 h-2" />
            <span className="text-sm text-muted-foreground w-20 text-right">
              {item.count} ({item.percentage}%)
            </span>
          </button>
        ))}
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-3 pb-2 border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Lọc:</span>
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Loại khách" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="Cặp đôi">Cặp đôi</SelectItem>
            <SelectItem value="Gia đình">Gia đình</SelectItem>
            <SelectItem value="Công tác">Công tác</SelectItem>
            <SelectItem value="Bạn bè">Bạn bè</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStar} onValueChange={setFilterStar}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Số sao" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả sao</SelectItem>
            <SelectItem value="5">5 sao</SelectItem>
            <SelectItem value="4">4 sao</SelectItem>
            <SelectItem value="3">3 sao</SelectItem>
            <SelectItem value="2">2 sao</SelectItem>
            <SelectItem value="1">1 sao</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1" />

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="highest">Điểm cao nhất</SelectItem>
            <SelectItem value="lowest">Điểm thấp nhất</SelectItem>
            <SelectItem value="helpful">Hữu ích nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Không có đánh giá nào phù hợp với bộ lọc
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={review.user.avatar} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{review.user.name}</p>
                        {review.user.isVerified && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Đã xác minh
                          </Badge>
                        )}
                      </div>
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

                  {/* Rating Details */}
                  <div className="flex flex-wrap gap-3">
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      Vị trí: {review.ratingDetails.location}/10
                    </span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      Dịch vụ: {review.ratingDetails.service}/10
                    </span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      Sạch sẽ: {review.ratingDetails.cleanliness}/10
                    </span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      Giá trị: {review.ratingDetails.value}/10
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">{review.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </div>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {review.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setViewingImages(review.images!);
                            setCurrentImageIndex(index);
                          }}
                          className="relative w-20 h-20 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 0 && review.images!.length > 1 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-white" />
                              <span className="text-white text-xs ml-1">
                                +{review.images!.length - 1}
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-muted-foreground"
                    >
                      <ThumbsUp
                        className={cn(
                          "h-4 w-4",
                          review.helpful && "fill-current text-primary"
                        )}
                      />
                      Hữu ích ({review.likes})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-muted-foreground"
                      onClick={() => handleReport(review.id)}
                    >
                      <Flag className="h-4 w-4" />
                      Báo cáo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Button variant="outline" className="w-full">
        Xem tất cả {reviewCount.toLocaleString()} đánh giá
      </Button>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Báo cáo đánh giá</DialogTitle>
            <DialogDescription>
              Vui lòng cho chúng tôi biết lý do bạn báo cáo đánh giá này
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Nhập lý do báo cáo..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={submitReport}>Gửi báo cáo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog open={!!viewingImages} onOpenChange={() => setViewingImages(null)}>
        <DialogContent className="max-w-3xl p-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setViewingImages(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            {viewingImages && (
              <img
                src={viewingImages[currentImageIndex]}
                alt="Review"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
            {viewingImages && viewingImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {viewingImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      currentImageIndex === index
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/70"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HotelReviews;
