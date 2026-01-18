import { useParams, Link } from 'react-router-dom';
import Header from "@/modules/client/components/common/Header";
import ClientFooter from "@/modules/client/components/common/ClientFooter";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, MapPin, Star, Hotel, Utensils, Camera, 
  Sun, CloudRain, Thermometer, Calendar, ChevronRight
} from 'lucide-react';

import destinationDanang from '@/assets/destination-danang.jpg';

const destinationData = {
  id: 'da-nang',
  name: 'Đà Nẵng',
  description: 'Thành phố biển xinh đẹp với cầu Rồng nổi tiếng, bãi biển Mỹ Khê tuyệt vời và gần các điểm di sản UNESCO như Hội An và Huế.',
  image: destinationDanang,
  rating: 4.8,
  reviewCount: 12500,
  hotelCount: 450,
  priceRange: '500,000đ - 5,000,000đ',
  bestTime: 'Tháng 2 - Tháng 8',
  weather: {
    temp: '25-32°C',
    description: 'Nắng ấm quanh năm',
  },
  highlights: [
    'Cầu Rồng - Biểu tượng của thành phố',
    'Bãi biển Mỹ Khê - Top 25 bãi biển đẹp nhất châu Á',
    'Bà Nà Hills - Cầu Vàng nổi tiếng thế giới',
    'Ngũ Hành Sơn - Di tích lịch sử văn hóa',
    'Phố cổ Hội An - Cách 30km',
  ],
  topHotels: [
    { id: '1', name: 'InterContinental Danang', rating: 4.9, price: '4,500,000', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
    { id: '2', name: 'Fusion Maia Resort', rating: 4.8, price: '3,800,000', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop' },
    { id: '3', name: 'Pullman Danang Beach', rating: 4.7, price: '2,500,000', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop' },
    { id: '4', name: 'Vinpearl Resort', rating: 4.6, price: '2,200,000', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
  ],
  attractions: [
    { name: 'Cầu Rồng', type: 'Landmark', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=300&h=200&fit=crop' },
    { name: 'Bà Nà Hills', type: 'Công viên', image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=300&h=200&fit=crop' },
    { name: 'Ngũ Hành Sơn', type: 'Di tích', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=300&h=200&fit=crop' },
    { name: 'Bãi biển Mỹ Khê', type: 'Bãi biển', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop' },
  ],
  cuisine: [
    { name: 'Mì Quảng', description: 'Món ăn đặc trưng với nước dùng đậm đà' },
    { name: 'Bánh tráng cuốn thịt heo', description: 'Đặc sản nổi tiếng Đà Nẵng' },
    { name: 'Bún chả cá', description: 'Bún với chả cá thơm ngon' },
    { name: 'Bánh xèo', description: 'Bánh xèo giòn với nhân tôm thịt' },
  ],
};

const DestinationDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <div className="relative h-[400px] md:h-[500px]">
        <img 
          src={destinationData.image} 
          alt={destinationData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link to="/destinations" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4" />
              Tất cả điểm đến
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{destinationData.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{destinationData.rating}</span>
                <span className="text-white/70">({destinationData.reviewCount.toLocaleString()} đánh giá)</span>
              </div>
              <div className="flex items-center gap-1">
                <Hotel className="h-5 w-5" />
                <span>{destinationData.hotelCount} khách sạn</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Info */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Thermometer className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nhiệt độ</p>
                <p className="font-semibold">{destinationData.weather.temp}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thời điểm đẹp</p>
                <p className="font-semibold">{destinationData.bestTime}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Hotel className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Giá phòng</p>
                <p className="font-semibold">{destinationData.priceRange}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sun className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thời tiết</p>
                <p className="font-semibold">{destinationData.weather.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
          {destinationData.description}
        </p>

        {/* Highlights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Điểm nổi bật</h2>
          <ul className="grid md:grid-cols-2 gap-3">
            {destinationData.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tabs */}
        <Tabs defaultValue="hotels" className="mb-12">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-6">
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Hotel className="h-4 w-4" />
              Khách sạn
            </TabsTrigger>
            <TabsTrigger value="attractions" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Điểm tham quan
            </TabsTrigger>
            <TabsTrigger value="cuisine" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Ẩm thực
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hotels">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinationData.topHotels.map((hotel) => (
                <Link key={hotel.id} to={`/hotel/${hotel.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-40 object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{hotel.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm">{hotel.rating}</span>
                      </div>
                      <p className="text-primary font-semibold">{hotel.price}đ/đêm</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to={`/search?destination=${destinationData.name}`}>
                <Button>
                  Xem tất cả khách sạn
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="attractions">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinationData.attractions.map((attraction, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <img 
                    src={attraction.image} 
                    alt={attraction.name}
                    className="w-full h-40 object-cover"
                  />
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">{attraction.type}</Badge>
                    <h3 className="font-semibold">{attraction.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cuisine">
            <div className="grid md:grid-cols-2 gap-4">
              {destinationData.cuisine.map((food, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Utensils className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{food.name}</h3>
                      <p className="text-sm text-muted-foreground">{food.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Sẵn sàng khám phá {destinationData.name}?</h2>
            <p className="opacity-90 mb-6">Tìm khách sạn phù hợp với nhu cầu của bạn</p>
            <Link to={`/search?destination=${destinationData.name}`}>
              <Button variant="secondary" size="lg">
                Tìm khách sạn ngay
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <ClientFooter />
    </div>
  );
};

export default DestinationDetail;
