import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Navigation, Train, Plane, Coffee, ShoppingBag, AlertCircle, Utensils, Camera, Fuel, Hospital, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HotelLocationProps {
  address: string;
  coordinates?: { lat: number; lng: number };
}

interface NearbyPlace {
  name: string;
  distance: string;
  icon: React.ElementType;
  type: "transport" | "attraction" | "food" | "shopping" | "other";
  coordinates: { lat: number; lng: number };
  description?: string;
}

const nearbyPlaces: NearbyPlace[] = [
  { name: "Sân bay Cam Ranh", distance: "35 km", icon: Plane, type: "transport", coordinates: { lat: 11.9981, lng: 109.2193 }, description: "Sân bay quốc tế" },
  { name: "Ga Nha Trang", distance: "8 km", icon: Train, type: "transport", coordinates: { lat: 12.2466, lng: 109.1913 }, description: "Ga đường sắt" },
  { name: "Tháp Bà Ponagar", distance: "5 km", icon: Camera, type: "attraction", coordinates: { lat: 12.2656, lng: 109.1962 }, description: "Di tích lịch sử" },
  { name: "Vincom Plaza", distance: "6 km", icon: ShoppingBag, type: "shopping", coordinates: { lat: 12.2388, lng: 109.1967 }, description: "Trung tâm mua sắm" },
  { name: "Trung tâm thành phố", distance: "7 km", icon: Building2, type: "other", coordinates: { lat: 12.2451, lng: 109.1943 }, description: "Khu vực trung tâm" },
  { name: "Chợ Đầm", distance: "6.5 km", icon: ShoppingBag, type: "shopping", coordinates: { lat: 12.2489, lng: 109.1912 }, description: "Chợ truyền thống" },
  { name: "Nhà hàng Hải Sản Nha Trang", distance: "3 km", icon: Utensils, type: "food", coordinates: { lat: 12.2150, lng: 109.2200 }, description: "Hải sản tươi sống" },
  { name: "Cafe The Rooftop", distance: "4 km", icon: Coffee, type: "food", coordinates: { lat: 12.2300, lng: 109.2050 }, description: "Quán cafe view biển" },
  { name: "Bệnh viện Đa khoa Khánh Hòa", distance: "9 km", icon: Hospital, type: "other", coordinates: { lat: 12.2520, lng: 109.1850 }, description: "Bệnh viện lớn" },
  { name: "Trạm xăng Petrolimex", distance: "2 km", icon: Fuel, type: "other", coordinates: { lat: 12.2050, lng: 109.2280 }, description: "Trạm xăng" },
];

const placeTypeConfig = {
  transport: { label: "Giao thông", color: "bg-blue-500" },
  attraction: { label: "Điểm tham quan", color: "bg-purple-500" },
  food: { label: "Ẩm thực", color: "bg-orange-500" },
  shopping: { label: "Mua sắm", color: "bg-pink-500" },
  other: { label: "Khác", color: "bg-gray-500" },
};

// Default coordinates for Nha Trang (Vinpearl Resort)
const DEFAULT_COORDS = { lat: 12.2096, lng: 109.2256 };

const HotelLocation = ({ address, coordinates = DEFAULT_COORDS }: HotelLocationProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const hotelMarker = useRef<mapboxgl.Marker | null>(null);
  const placeMarkers = useRef<mapboxgl.Marker[]>([]);
  
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem("mapbox_token") || "";
  });
  const [tempToken, setTempToken] = useState("");
  const [mapError, setMapError] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["transport", "attraction", "food", "shopping"]);
  const [showNearbyPlaces, setShowNearbyPlaces] = useState(true);

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "transport": return "#3B82F6";
      case "attraction": return "#8B5CF6";
      case "food": return "#F97316";
      case "shopping": return "#EC4899";
      default: return "#6B7280";
    }
  };

  const addNearbyPlaceMarkers = () => {
    if (!map.current) return;

    // Remove existing place markers
    placeMarkers.current.forEach((marker) => marker.remove());
    placeMarkers.current = [];

    if (!showNearbyPlaces) return;

    nearbyPlaces
      .filter((place) => selectedTypes.includes(place.type))
      .forEach((place) => {
        const el = document.createElement("div");
        el.className = "nearby-marker";
        el.style.cssText = `
          width: 32px;
          height: 32px;
          background-color: ${getMarkerColor(place.type)};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        `;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([place.coordinates.lng, place.coordinates.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 8px; min-width: 150px;">
                <strong style="font-size: 14px;">${place.name}</strong>
                <p style="margin: 4px 0; color: #666; font-size: 12px;">${place.description || ""}</p>
                <p style="margin: 4px 0; color: #3B82F6; font-size: 12px; font-weight: 500;">📍 ${place.distance}</p>
              </div>
            `)
          )
          .addTo(map.current!);

        placeMarkers.current.push(marker);
      });
  };

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [coordinates.lng, coordinates.lat],
        zoom: 13,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add hotel marker
      hotelMarker.current = new mapboxgl.Marker({ color: "#E53E3E" })
        .setLngLat([coordinates.lng, coordinates.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 8px;">
              <strong style="font-size: 14px;">Vinpearl Resort & Spa</strong>
              <p style="margin: 4px 0; color: #666; font-size: 12px;">${address}</p>
            </div>`
          )
        )
        .addTo(map.current);

      // Add nearby place markers after map loads
      map.current.on("load", () => {
        addNearbyPlaceMarkers();
      });

      setMapError(false);
    } catch (error) {
      console.error("Map initialization error:", error);
      setMapError(true);
    }
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap(mapboxToken);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, coordinates]);

  useEffect(() => {
    addNearbyPlaceMarkers();
  }, [selectedTypes, showNearbyPlaces]);

  const handleSaveToken = () => {
    if (tempToken.trim()) {
      localStorage.setItem("mapbox_token", tempToken.trim());
      setMapboxToken(tempToken.trim());
      setTempToken("");
    }
  };

  const togglePlaceType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredPlaces = nearbyPlaces.filter((place) =>
    selectedTypes.includes(place.type)
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Vị trí</h2>

      {/* Map Filter Buttons */}
      {mapboxToken && !mapError && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={showNearbyPlaces ? "default" : "outline"}
            size="sm"
            onClick={() => setShowNearbyPlaces(!showNearbyPlaces)}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Hiển thị địa điểm
          </Button>
          {showNearbyPlaces && (
            <>
              {Object.entries(placeTypeConfig).map(([type, config]) => (
                <Button
                  key={type}
                  variant={selectedTypes.includes(type) ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => togglePlaceType(type)}
                  className="gap-1"
                >
                  <span
                    className={cn("w-2 h-2 rounded-full", config.color)}
                  />
                  {config.label}
                </Button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Map */}
      <div className="relative h-[350px] bg-muted rounded-xl overflow-hidden">
        {!mapboxToken ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-6">
            <div className="text-center max-w-md space-y-4">
              <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
              <div>
                <p className="font-medium mb-1">Nhập Mapbox Token để xem bản đồ</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Lấy token miễn phí tại{" "}
                  <a
                    href="https://mapbox.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    mapbox.com
                  </a>
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="pk.eyJ1Ijo..."
                  value={tempToken}
                  onChange={(e) => setTempToken(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSaveToken} disabled={!tempToken.trim()}>
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        ) : mapError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-destructive/5 to-destructive/10">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
              <p className="text-muted-foreground">Không thể tải bản đồ</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  localStorage.removeItem("mapbox_token");
                  setMapboxToken("");
                }}
              >
                Nhập lại token
              </Button>
            </div>
          </div>
        ) : (
          <div ref={mapContainer} className="absolute inset-0" />
        )}

        {/* Address overlay */}
        {mapboxToken && !mapError && (
          <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{address}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Vị trí tuyệt vời - được đánh giá 9.2/10
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        {mapboxToken && !mapError && showNearbyPlaces && (
          <div className="absolute top-4 left-4 bg-background/95 backdrop-blur rounded-lg p-3 shadow-lg">
            <p className="text-xs font-medium mb-2">Chú thích</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span>Khách sạn</span>
              </div>
              {Object.entries(placeTypeConfig)
                .filter(([type]) => selectedTypes.includes(type))
                .map(([type, config]) => (
                  <div key={type} className="flex items-center gap-2 text-xs">
                    <span className={cn("w-3 h-3 rounded-full", config.color)} />
                    <span>{config.label}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Nearby Places */}
      <div>
        <h3 className="font-semibold mb-4">Các địa điểm lân cận</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPlaces.map((place, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => {
                if (map.current) {
                  map.current.flyTo({
                    center: [place.coordinates.lng, place.coordinates.lat],
                    zoom: 15,
                  });
                }
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${getMarkerColor(place.type)}20` }}
              >
                <place.icon
                  className="h-5 w-5"
                  style={{ color: getMarkerColor(place.type) }}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{place.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{place.distance}</p>
                  <Badge variant="outline" className="text-xs h-5">
                    {placeTypeConfig[place.type].label}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transportation info */}
      <div className="bg-muted/30 rounded-xl p-5">
        <h3 className="font-semibold mb-3">Di chuyển</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-primary" />
            <span>Xe đưa đón sân bay miễn phí (cần đặt trước)</span>
          </li>
          <li className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            <span>Cáp treo ra đảo miễn phí cho khách lưu trú</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HotelLocation;
