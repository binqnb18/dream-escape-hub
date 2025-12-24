import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X } from "lucide-react";
import hotelImage1 from "@/assets/hotel-1.jpg";
import hotelImage2 from "@/assets/hotel-2.jpg";
import hotelImage3 from "@/assets/hotel-3.jpg";

interface Room {
  id: string;
  name: string;
  size: number;
  maxGuests: number;
  bedType: string;
  amenities: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  features: {
    freeCancellation: boolean;
    noPrepayment: boolean;
    breakfast: boolean;
  };
  available: number;
  view?: string;
}

interface RoomComparisonProps {
  rooms: Room[];
  hotelName: string;
  onClose: () => void;
  onSelectRoom: (roomId: string) => void;
}

const roomImages: Record<string, string> = {
  "1": hotelImage1,
  "2": hotelImage2,
  "3": hotelImage3,
};

const RoomComparison = ({ rooms, hotelName, onClose, onSelectRoom }: RoomComparisonProps) => {
  const highlightedAmenities = [
    "Hướng thành phố",
    "Ấm nước điện",
    "Phòng tắm riêng",
    "Vòi sen",
    "Áo choàng tắm",
  ];

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">So sánh phòng</h1>
              <p className="text-muted-foreground text-sm">
                {hotelName} • → • đêm
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Quay lại
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="border rounded-lg overflow-hidden bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 w-40 text-muted-foreground font-medium">Tiêu chí</th>
                {rooms.map((room) => (
                  <th key={room.id} className="text-left p-4 min-w-[300px]">
                    <div className="font-semibold text-foreground">{room.name}</div>
                    <Badge variant="outline" className="mt-1">Phòng {room.id}</Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Room Images */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground">Hình ảnh chính</td>
                {rooms.map((room) => (
                  <td key={room.id} className="p-4">
                    <img
                      src={roomImages[room.id] || hotelImage1}
                      alt={room.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground">Giá mỗi đêm</td>
                {rooms.map((room) => (
                  <td key={room.id} className="p-4">
                    <div className="text-2xl font-bold text-destructive">
                      {room.price.toLocaleString("vi-VN")} ₫
                    </div>
                    <div className="text-sm text-muted-foreground">Mỗi đêm</div>
                  </td>
                ))}
              </tr>

              {/* Size */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground">Diện tích</td>
                {rooms.map((room) => (
                  <td key={room.id} className="p-4 font-medium">
                    {room.size} m²
                  </td>
                ))}
              </tr>

              {/* Max Guests */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground">Sức chứa</td>
                {rooms.map((room) => (
                  <td key={room.id} className="p-4 font-medium">
                    {room.maxGuests} người lớn
                  </td>
                ))}
              </tr>

              {/* Bed Type */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground">Loại giường</td>
                {rooms.map((room) => (
                  <td key={room.id} className="p-4 font-medium">
                    {room.bedType}
                  </td>
                ))}
              </tr>

              {/* View */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground">View</td>
                {rooms.map((room) => (
                  <td key={room.id} className="p-4 font-medium">
                    {room.view || "Thành phố"}
                  </td>
                ))}
              </tr>

              {/* Amenities */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground align-top">Tiện nghi nổi bật</td>
                {rooms.map((room) => (
                  <td key={room.id} className="p-4">
                    <div className="space-y-2">
                      {highlightedAmenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                      <div className="text-sm text-muted-foreground mt-2">
                        +{room.amenities.length} tiện nghi khác
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Breakfast */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground">Bữa sáng</td>
                {rooms.map((room) => (
                  <td key={room.id} className="p-4 font-medium">
                    {room.features.breakfast ? (
                      <span className="text-green-600">Có</span>
                    ) : (
                      <span className="text-muted-foreground">Không</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Cancellation Policy */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground">Chính sách hủy</td>
                {rooms.map((room) => (
                  <td key={room.id} className="p-4 font-medium">
                    {room.features.freeCancellation ? (
                      <span className="text-green-600">Miễn phí hủy trước 48h</span>
                    ) : (
                      <span className="text-muted-foreground">Không hoàn tiền</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Action */}
              <tr>
                <td className="p-4 text-muted-foreground">Hành động</td>
                {rooms.map((room) => (
                  <td key={room.id} className="p-4">
                    <Button
                      onClick={() => onSelectRoom(room.id)}
                      className="bg-slate-700 hover:bg-slate-800 text-white"
                    >
                      Chọn phòng
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomComparison;
