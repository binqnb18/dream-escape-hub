import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/modules/client/components/layout/Header";
import ClientFooter from "@/modules/client/components/layout/ClientFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Star,
  Hotel,
  Search,
  TrendingUp,
  Thermometer,
  Umbrella,
  Sun,
  Mountain,
  Waves,
  TreePine,
  Building2,
} from "lucide-react";

import hcmImg from "@/assets/destination-hcm.jpg";
import hanoiImg from "@/assets/destination-hanoi.jpg";
import danangImg from "@/assets/destination-danang.jpg";
import phuquocImg from "@/assets/destination-phuquoc.jpg";
import nhatrangImg from "@/assets/destination-nhatrang.jpg";
import dalatImg from "@/assets/destination-dalat.jpg";

interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  hotelCount: number;
  avgPrice: number;
  rating: number;
  reviews: number;
  bestTime: string;
  weather: string;
  highlights: string[];
  category: "beach" | "mountain" | "city" | "nature";
  trending: boolean;
}

const destinations: Destination[] = [
  {
    id: "ho-chi-minh",
    name: "TP. Hồ Chí Minh",
    image: hcmImg,
    description: "Thành phố năng động nhất Việt Nam với nền ẩm thực phong phú và đời sống về đêm sôi động.",
    hotelCount: 2458,
    avgPrice: 1200000,
    rating: 4.5,
    reviews: 12456,
    bestTime: "Tháng 12 - 4",
    weather: "28°C",
    highlights: ["Phố đi bộ", "Chợ Bến Thành", "Landmark 81"],
    category: "city",
    trending: true,
  },
  {
    id: "ha-noi",
    name: "Hà Nội",
    image: hanoiImg,
    description: "Thủ đô ngàn năm văn hiến với kiến trúc cổ kính và ẩm thực đường phố nổi tiếng.",
    hotelCount: 1892,
    avgPrice: 1000000,
    rating: 4.6,
    reviews: 10234,
    bestTime: "Tháng 9 - 11",
    weather: "25°C",
    highlights: ["Phố cổ", "Hồ Hoàn Kiếm", "Văn Miếu"],
    category: "city",
    trending: true,
  },
  {
    id: "da-nang",
    name: "Đà Nẵng",
    image: danangImg,
    description: "Thành phố đáng sống với bãi biển tuyệt đẹp và những cây cầu nổi tiếng thế giới.",
    hotelCount: 1456,
    avgPrice: 1500000,
    rating: 4.7,
    reviews: 8567,
    bestTime: "Tháng 5 - 8",
    weather: "30°C",
    highlights: ["Bà Nà Hills", "Cầu Vàng", "Biển Mỹ Khê"],
    category: "beach",
    trending: true,
  },
  {
    id: "phu-quoc",
    name: "Phú Quốc",
    image: phuquocImg,
    description: "Đảo ngọc với bãi biển hoang sơ, resort sang trọng và hải sản tươi ngon.",
    hotelCount: 856,
    avgPrice: 2000000,
    rating: 4.8,
    reviews: 6789,
    bestTime: "Tháng 11 - 4",
    weather: "29°C",
    highlights: ["Bãi Sao", "Grand World", "Sunset Sanato"],
    category: "beach",
    trending: true,
  },
  {
    id: "nha-trang",
    name: "Nha Trang",
    image: nhatrangImg,
    description: "Thành phố biển nổi tiếng với vịnh đẹp nhất Việt Nam và các hoạt động thể thao nước.",
    hotelCount: 1234,
    avgPrice: 1300000,
    rating: 4.5,
    reviews: 9876,
    bestTime: "Tháng 1 - 8",
    weather: "28°C",
    highlights: ["Vinpearl Land", "Hòn Mun", "Tháp Bà Ponagar"],
    category: "beach",
    trending: false,
  },
  {
    id: "da-lat",
    name: "Đà Lạt",
    image: dalatImg,
    description: "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm và cảnh quan thiên nhiên lãng mạn.",
    hotelCount: 987,
    avgPrice: 900000,
    rating: 4.6,
    reviews: 7654,
    bestTime: "Tháng 12 - 3",
    weather: "18°C",
    highlights: ["Thung lũng Tình Yêu", "Hồ Xuân Hương", "Dinh Bảo Đại"],
    category: "mountain",
    trending: false,
  },
];

const categoryIcons = {
  beach: Waves,
  mountain: Mountain,
  city: Building2,
  nature: TreePine,
};

const categoryLabels = {
  beach: "Biển",
  mountain: "Núi",
  city: "Thành phố",
  nature: "Thiên nhiên",
};

const DestinationDetailCard = ({ destination }: { destination: Destination }) => {
  const navigate = useNavigate();
  const CategoryIcon = categoryIcons[destination.category];

  return (
    <Card className="group overflow-hidden hover:shadow-elevated transition-all duration-300 cursor-pointer border-border/50">
      <div className="relative h-56 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="gap-1 bg-background/90 backdrop-blur-sm">
            <CategoryIcon className="h-3 w-3" />
            {categoryLabels[destination.category]}
          </Badge>
          {destination.trending && (
            <Badge className="gap-1 bg-primary text-primary-foreground">
              <TrendingUp className="h-3 w-3" />
              Trending
            </Badge>
          )}
        </div>

        {/* Weather */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-background/90 backdrop-blur-sm border-0 gap-1">
            <Thermometer className="h-3 w-3" />
            {destination.weather}
          </Badge>
        </div>

        {/* Name & Location */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <MapPin className="h-4 w-4" />
            <span>Việt Nam</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {destination.description}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1.5">
          {destination.highlights.map((highlight) => (
            <Badge key={highlight} variant="outline" className="text-xs font-normal">
              {highlight}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-semibold text-sm">{destination.rating}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{destination.reviews.toLocaleString()} đánh giá</p>
          </div>
          <div className="text-center border-x border-border/50">
            <div className="flex items-center justify-center gap-1 text-primary mb-0.5">
              <Hotel className="h-3.5 w-3.5" />
              <span className="font-semibold text-sm">{destination.hotelCount.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Khách sạn</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-500 mb-0.5">
              <Sun className="h-3.5 w-3.5" />
            </div>
            <p className="text-[10px] text-muted-foreground">{destination.bestTime}</p>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Giá từ</p>
            <p className="text-lg font-bold text-primary">
              {destination.avgPrice.toLocaleString("vi-VN")}₫
              <span className="text-xs font-normal text-muted-foreground">/đêm</span>
            </p>
          </div>
          <Button 
            size="sm"
            onClick={() => navigate(`/search?destination=${destination.id}`)}
          >
            Khám phá
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Destinations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const trendingDestinations = destinations.filter((d) => d.trending);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <img
          src={danangImg}
          alt="Destinations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Khám Phá Điểm Đến
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
            Tìm kiếm những địa điểm du lịch tuyệt vời nhất Việt Nam
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm điểm đến..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-background/95 backdrop-blur-sm border-border/50 text-foreground"
            />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            Tất cả
          </Button>
          {Object.entries(categoryLabels).map(([key, label]) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons];
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(key)}
                className="gap-1.5"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            );
          })}
        </div>

        {/* Trending Section */}
        {selectedCategory === "all" && !searchQuery && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Điểm đến hot nhất</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingDestinations.map((dest) => (
                <DestinationDetailCard key={dest.id} destination={dest} />
              ))}
            </div>
          </section>
        )}

        {/* All Destinations */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory === "all" ? "Tất cả điểm đến" : `Điểm đến ${categoryLabels[selectedCategory as keyof typeof categoryLabels]}`}
          </h2>
          
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Không tìm thấy điểm đến phù hợp</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => (
                <DestinationDetailCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </section>

        {/* Quick Stats */}
        <section className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-1">
              {destinations.reduce((sum, d) => sum + d.hotelCount, 0).toLocaleString()}+
            </div>
            <p className="text-sm text-muted-foreground">Khách sạn</p>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-1">
              {destinations.length}
            </div>
            <p className="text-sm text-muted-foreground">Điểm đến</p>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-1">
              {destinations.reduce((sum, d) => sum + d.reviews, 0).toLocaleString()}+
            </div>
            <p className="text-sm text-muted-foreground">Đánh giá</p>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-1">4.6</div>
            <p className="text-sm text-muted-foreground">Đánh giá trung bình</p>
          </Card>
        </section>
      </main>

      <ClientFooter />
    </div>
  );
};

export default Destinations;
