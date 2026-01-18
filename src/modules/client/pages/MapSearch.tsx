import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Star,
  X,
  Filter,
  List,
  ChevronUp,
  ChevronDown,
  Locate,
} from "lucide-react";
import Header from "@/modules/client/components/common/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  coordinates: [number, number]; // [lng, lat]
}

const mockHotels: Hotel[] = [
  {
    id: "1",
    name: "Vinpearl Resort Phú Quốc",
    location: "Phú Quốc, Kiên Giang",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
    rating: 4.8,
    reviewCount: 2345,
    price: 3500000,
    coordinates: [103.9840, 10.2899],
  },
  {
    id: "2",
    name: "InterContinental Đà Nẵng",
    location: "Đà Nẵng",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400",
    rating: 4.9,
    reviewCount: 1876,
    price: 8500000,
    coordinates: [108.2022, 16.0544],
  },
  {
    id: "3",
    name: "Park Hyatt Saigon",
    location: "TP. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400",
    rating: 4.6,
    reviewCount: 987,
    price: 5800000,
    coordinates: [106.7009, 10.7769],
  },
  {
    id: "4",
    name: "JW Marriott Hanoi",
    location: "Hà Nội",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    rating: 4.7,
    reviewCount: 1234,
    price: 4500000,
    coordinates: [105.8342, 21.0285],
  },
  {
    id: "5",
    name: "The Anam Cam Ranh",
    location: "Cam Ranh, Khánh Hòa",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
    rating: 4.8,
    reviewCount: 567,
    price: 6200000,
    coordinates: [109.1856, 11.8839],
  },
];

const MapSearch = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showList, setShowList] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [minRating, setMinRating] = useState(0);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);

  const filteredHotels = mockHotels.filter(
    (hotel) =>
      hotel.price >= priceRange[0] &&
      hotel.price <= priceRange[1] &&
      hotel.rating >= minRating
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [106.7, 14.5], // Center of Vietnam
      zoom: 5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      setIsMapReady(true);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || !isMapReady) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll(".mapboxgl-marker");
    existingMarkers.forEach((marker) => marker.remove());

    // Add markers for hotels
    filteredHotels.forEach((hotel) => {
      const el = document.createElement("div");
      el.className = "hotel-marker";
      el.style.cssText = `
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;
      el.textContent = formatPrice(hotel.price).replace("₫", "").trim();

      el.addEventListener("click", () => {
        setSelectedHotel(hotel);
      });

      new mapboxgl.Marker(el)
        .setLngLat(hotel.coordinates)
        .addTo(map.current!);
    });
  }, [filteredHotels, isMapReady]);

  const flyToHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    map.current?.flyTo({
      center: hotel.coordinates,
      zoom: 14,
      duration: 1500,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="relative h-[calc(100vh-80px)]">
        {/* Map Token Input (for demo) */}
        {!mapboxToken && (
          <div className="absolute inset-0 z-20 bg-background flex items-center justify-center">
            <Card className="w-full max-w-md mx-4">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h2 className="text-xl font-bold">Nhập Mapbox Token</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Để sử dụng tính năng bản đồ, vui lòng nhập Mapbox public token của bạn.
                    Bạn có thể lấy token miễn phí tại{" "}
                    <a
                      href="https://mapbox.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      mapbox.com
                    </a>
                  </p>
                </div>
                <Input
                  placeholder="pk.eyJ1IjoieW91..."
                  onChange={(e) => setMapboxToken(e.target.value)}
                />
                <Button
                  className="w-full"
                  disabled={!mapboxToken}
                  onClick={() => setMapboxToken(mapboxToken)}
                >
                  Tiếp tục
                </Button>
                <Link to="/search">
                  <Button variant="outline" className="w-full">
                    Quay lại tìm kiếm thường
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Map */}
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Locate button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-16 z-10 shadow-lg"
          onClick={() => {
            navigator.geolocation.getCurrentPosition((pos) => {
              map.current?.flyTo({
                center: [pos.coords.longitude, pos.coords.latitude],
                zoom: 12,
              });
            });
          }}
        >
          <Locate className="h-4 w-4" />
        </Button>

        {/* Filter Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              className="absolute top-4 left-4 z-10 shadow-lg"
            >
              <Filter className="mr-2 h-4 w-4" />
              Bộ lọc
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Bộ lọc</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div>
                <h4 className="font-medium mb-4">Khoảng giá</h4>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={10000000}
                  step={500000}
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Đánh giá tối thiểu</h4>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <Button
                      key={rating}
                      variant={minRating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMinRating(rating)}
                    >
                      {rating === 0 ? "Tất cả" : `${rating}+`}
                    </Button>
                  ))}
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Tìm thấy {filteredHotels.length} khách sạn
              </p>
            </div>
          </SheetContent>
        </Sheet>

        {/* Toggle List Button */}
        <Button
          variant="secondary"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 shadow-lg md:hidden"
          onClick={() => setShowList(!showList)}
        >
          <List className="mr-2 h-4 w-4" />
          {showList ? "Ẩn danh sách" : "Hiện danh sách"}
          {showList ? <ChevronDown className="ml-2 h-4 w-4" /> : <ChevronUp className="ml-2 h-4 w-4" />}
        </Button>

        {/* Hotel List - Desktop Sidebar */}
        <div className="hidden md:block absolute top-4 right-4 bottom-4 w-80 z-10">
          <Card className="h-full overflow-hidden">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="p-4 border-b">
                <h3 className="font-semibold">{filteredHotels.length} khách sạn</h3>
              </div>
              <div className="flex-1 overflow-auto">
                {filteredHotels.map((hotel) => (
                  <button
                    key={hotel.id}
                    onClick={() => flyToHotel(hotel)}
                    className={`w-full p-4 flex gap-3 hover:bg-muted/50 transition-colors text-left border-b ${
                      selectedHotel?.id === hotel.id ? "bg-muted" : ""
                    }`}
                  >
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-20 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{hotel.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Star className="h-3 w-3 text-accent fill-accent" />
                        {hotel.rating} ({hotel.reviewCount})
                      </div>
                      <p className="font-bold text-primary text-sm mt-1">
                        {formatPrice(hotel.price)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotel List - Mobile Bottom Sheet */}
        {showList && (
          <div className="md:hidden absolute bottom-0 left-0 right-0 z-10 bg-background rounded-t-2xl shadow-lg max-h-[50vh] overflow-hidden">
            <div className="p-4 border-b">
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-3" />
              <h3 className="font-semibold">{filteredHotels.length} khách sạn</h3>
            </div>
            <div className="overflow-auto max-h-[calc(50vh-80px)]">
              {filteredHotels.map((hotel) => (
                <button
                  key={hotel.id}
                  onClick={() => flyToHotel(hotel)}
                  className="w-full p-4 flex gap-3 hover:bg-muted/50 transition-colors text-left border-b"
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-20 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">{hotel.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Star className="h-3 w-3 text-accent fill-accent" />
                      {hotel.rating} ({hotel.reviewCount})
                    </div>
                    <p className="font-bold text-primary text-sm mt-1">
                      {formatPrice(hotel.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Hotel Popup */}
        {selectedHotel && (
          <div className="absolute bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-[360px] md:w-80 z-20">
            <Card className="overflow-hidden">
              <button
                className="absolute top-2 right-2 z-10 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center"
                onClick={() => setSelectedHotel(null)}
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={selectedHotel.image}
                alt={selectedHotel.name}
                className="w-full h-32 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold">{selectedHotel.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  {selectedHotel.location}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-accent fill-accent" />
                    <span className="font-medium">{selectedHotel.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({selectedHotel.reviewCount})
                    </span>
                  </div>
                  <span className="font-bold text-primary">
                    {formatPrice(selectedHotel.price)}
                  </span>
                </div>
                <Link to={`/hotel/${selectedHotel.id}`}>
                  <Button className="w-full mt-3">Xem chi tiết</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default MapSearch;
