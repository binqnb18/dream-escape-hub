import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Star,
  MapPin,
  Trash2,
  Share2,
  Filter,
  Grid,
  List,
  SortAsc,
} from "lucide-react";
import Header from "@/modules/client/components/layout/Header";
import ClientFooter from "@/modules/client/components/layout/ClientFooter";
import WishlistPromotionBanner from "@/modules/client/components/booking/WishlistPromotionBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import LazyImage from "@/components/LazyImage";
import { Download } from "lucide-react";
import { exportToPdf, generateWishlistHtml } from "@/lib/pdf-export";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface WishlistItem {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  savedAt: Date;
  hasPromotion?: boolean;
  promotionText?: string;
}

const mockWishlist: WishlistItem[] = [
  {
    id: "1",
    name: "Vinpearl Resort & Spa Phú Quốc",
    location: "Phú Quốc, Kiên Giang",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    rating: 4.8,
    reviewCount: 2345,
    priceFrom: 3500000,
    savedAt: new Date("2024-01-15"),
    hasPromotion: true,
    promotionText: "Giảm 25%",
  },
  {
    id: "2",
    name: "InterContinental Đà Nẵng Sun Peninsula",
    location: "Đà Nẵng",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
    rating: 4.9,
    reviewCount: 1876,
    priceFrom: 8500000,
    savedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "JW Marriott Phu Quoc Emerald Bay",
    location: "Phú Quốc, Kiên Giang",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    rating: 4.7,
    reviewCount: 1234,
    priceFrom: 6200000,
    savedAt: new Date("2024-01-05"),
    hasPromotion: true,
    promotionText: "Miễn phí bữa sáng",
  },
  {
    id: "4",
    name: "Park Hyatt Saigon",
    location: "TP. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    rating: 4.6,
    reviewCount: 987,
    priceFrom: 5800000,
    savedAt: new Date("2024-01-01"),
  },
];

const Wishlist = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<WishlistItem[]>(mockWishlist);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [filterBy, setFilterBy] = useState<string>("all");

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast({
      title: "Đã xóa khỏi yêu thích",
      description: "Khách sạn đã được xóa khỏi danh sách yêu thích",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Đã sao chép liên kết" });
  };

  const handleExportPdf = async () => {
    const html = generateWishlistHtml({
      userName: "Người dùng VNTravel",
      exportDate: format(new Date(), "dd/MM/yyyy HH:mm", { locale: vi }),
      hotels: items.map((item) => ({
        name: item.name,
        location: item.location,
        rating: item.rating,
        priceFrom: item.priceFrom,
        savedAt: format(item.savedAt, "dd/MM/yyyy", { locale: vi }),
      })),
    });
    try {
      await exportToPdf(html, { filename: "wishlist-vntravel" });
      toast({ title: "Đã xuất PDF thành công" });
    } catch {
      toast({ title: "Lỗi xuất PDF", variant: "destructive" });
    }
  };

  const getSortedItems = () => {
    let filtered = [...items];

    // Filter
    if (filterBy === "promotion") {
      filtered = filtered.filter((item) => item.hasPromotion);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime());
        break;
      case "price-low":
        filtered.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "price-high":
        filtered.sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const sortedItems = getSortedItems();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 text-destructive fill-destructive" />
              Danh sách yêu thích
            </h1>
            <p className="text-muted-foreground mt-1">
              {items.length} khách sạn đã lưu
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleExportPdf}>
              <Download className="mr-2 h-4 w-4" />
              Xuất PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Chia sẻ
            </Button>
          </div>
        </div>

        {/* Promotion Banner */}
        <WishlistPromotionBanner wishlistIds={items.map((item) => item.id)} />

        {/* Filters & View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Lọc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="promotion">Có khuyến mãi</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SortAsc className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="price-low">Giá thấp nhất</SelectItem>
                <SelectItem value="price-high">Giá cao nhất</SelectItem>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Wishlist Items */}
        {sortedItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chưa có khách sạn yêu thích</h3>
            <p className="text-muted-foreground mb-6">
              Hãy khám phá và lưu những khách sạn bạn yêu thích
            </p>
            <Link to="/search">
              <Button>Tìm khách sạn</Button>
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((item) => (
              <Card key={item.id} className="group overflow-hidden hover-lift">
                <div className="relative aspect-[4/3]">
                  <LazyImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.hasPromotion && (
                    <Badge className="absolute top-3 left-3 bg-destructive">
                      {item.promotionText}
                    </Badge>
                  )}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-destructive hover:bg-background transition-colors"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <Link to={`/hotel/${item.id}`}>
                    <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="font-medium">{item.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({item.reviewCount})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">Từ </span>
                      <span className="font-bold text-primary">
                        {formatPrice(item.priceFrom)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0">
                    <LazyImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.hasPromotion && (
                      <Badge className="absolute top-3 left-3 bg-destructive">
                        {item.promotionText}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <Link to={`/hotel/${item.id}`}>
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 text-accent fill-accent" />
                        <span className="font-medium">{item.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({item.reviewCount} đánh giá)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Giá từ</span>
                        <div className="font-bold text-xl text-primary">
                          {formatPrice(item.priceFrom)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Link to={`/hotel/${item.id}`}>
                          <Button>Xem chi tiết</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <ClientFooter />
    </div>
  );
};

export default Wishlist;
