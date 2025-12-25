import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Navigation, Train, Plane, Coffee, ShoppingBag, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HotelLocationProps {
  address: string;
  coordinates?: { lat: number; lng: number };
}

const nearbyPlaces = [
  { name: "Sân bay Cam Ranh", distance: "35 km", icon: Plane },
  { name: "Ga Nha Trang", distance: "8 km", icon: Train },
  { name: "Tháp Bà Ponagar", distance: "5 km", icon: Navigation },
  { name: "Vincom Plaza", distance: "6 km", icon: ShoppingBag },
  { name: "Trung tâm thành phố", distance: "7 km", icon: MapPin },
  { name: "Chợ Đầm", distance: "6.5 km", icon: Coffee },
];

// Default coordinates for Nha Trang (Vinpearl Resort)
const DEFAULT_COORDS = { lat: 12.2096, lng: 109.2256 };

const HotelLocation = ({ address, coordinates = DEFAULT_COORDS }: HotelLocationProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem("mapbox_token") || "";
  });
  const [tempToken, setTempToken] = useState("");
  const [mapError, setMapError] = useState(false);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [coordinates.lng, coordinates.lat],
        zoom: 14,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add marker for hotel location
      marker.current = new mapboxgl.Marker({ color: "#E53E3E" })
        .setLngLat([coordinates.lng, coordinates.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="p-2">
              <strong>Vinpearl Resort & Spa</strong>
              <p class="text-sm text-gray-600">${address}</p>
            </div>`
          )
        )
        .addTo(map.current);

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

  const handleSaveToken = () => {
    if (tempToken.trim()) {
      localStorage.setItem("mapbox_token", tempToken.trim());
      setMapboxToken(tempToken.trim());
      setTempToken("");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Vị trí</h2>

      {/* Map */}
      <div className="relative h-[300px] bg-muted rounded-xl overflow-hidden">
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
      </div>

      {/* Nearby Places */}
      <div>
        <h3 className="font-semibold mb-4">Các địa điểm lân cận</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {nearbyPlaces.map((place, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <place.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{place.name}</p>
                <p className="text-xs text-muted-foreground">{place.distance}</p>
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
