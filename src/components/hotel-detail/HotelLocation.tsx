import { MapPin, Navigation, Train, Plane, Coffee, ShoppingBag } from "lucide-react";

interface HotelLocationProps {
  address: string;
}

const nearbyPlaces = [
  { name: "Sân bay Cam Ranh", distance: "35 km", icon: Plane },
  { name: "Ga Nha Trang", distance: "8 km", icon: Train },
  { name: "Tháp Bà Ponagar", distance: "5 km", icon: Navigation },
  { name: "Vincom Plaza", distance: "6 km", icon: ShoppingBag },
  { name: "Trung tâm thành phố", distance: "7 km", icon: MapPin },
  { name: "Chợ Đầm", distance: "6.5 km", icon: Coffee },
];

const HotelLocation = ({ address }: HotelLocationProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Vị trí</h2>

      {/* Map placeholder */}
      <div className="relative h-[300px] bg-muted rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Bản đồ tương tác</p>
            <p className="text-sm text-muted-foreground">(Tích hợp Google Maps)</p>
          </div>
        </div>
        
        {/* Address overlay */}
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
