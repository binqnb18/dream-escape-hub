import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X } from "lucide-react";
import { ComparisonRoom } from "@/hooks/use-room-comparison";
import hotelImage1 from "@/assets/hotel-1.jpg";
import hotelImage2 from "@/assets/hotel-2.jpg";
import hotelImage3 from "@/assets/hotel-3.jpg";

interface RoomComparisonModalProps {
  rooms: ComparisonRoom[];
  onClose: () => void;
}

const defaultImages = [hotelImage1, hotelImage2, hotelImage3, hotelImage1];

const RoomComparisonModal = ({ rooms, onClose }: RoomComparisonModalProps) => {
  const highlightedAmenities = [
    "Hướng thành phố",
    "Ấm nước điện",
    "Phòng tắm riêng",
    "Vòi sen",
    "Áo choàng tắm",
  ];

  // Get unique hotels for grouping
  const hotelNames = [...new Set(rooms.map((r) => r.hotelName))];
  const isMultiHotel = hotelNames.length > 1;

  return (
    <div className="fixed inset-0 bg-background z-[60] overflow-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">So sánh phòng</h1>
              <p className="text-muted-foreground text-sm">
                {isMultiHotel
                  ? `So sánh ${rooms.length} phòng từ ${hotelNames.length} khách sạn`
                  : `${hotelNames[0]} • ${rooms.length} phòng`}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Quay lại
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="border rounded-lg overflow-hidden bg-card overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 w-40 text-muted-foreground font-medium sticky left-0 bg-muted/50">
                  Tiêu chí
                </th>
                {rooms.map((room, idx) => (
                  <th
                    key={`${room.hotelId}-${room.id}`}
                    className="text-left p-4 min-w-[280px]"
                  >
                    <div className="space-y-1">
                      {isMultiHotel && (
                        <p className="text-xs text-muted-foreground font-normal">
                          {room.hotelName}
                        </p>
                      )}
                      <div className="font-semibold text-foreground">
                        {room.roomName}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        Phòng {idx + 1}
                      </Badge>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Hotel Name (if multi-hotel) */}
              {isMultiHotel && (
                <tr className="border-b bg-primary/5">
                  <td className="p-4 text-muted-foreground font-medium sticky left-0 bg-primary/5">
                    Khách sạn
                  </td>
                  {rooms.map((room) => (
                    <td
                      key={`${room.hotelId}-${room.id}-hotel`}
                      className="p-4 font-medium text-primary"
                    >
                      {room.hotelName}
                    </td>
                  ))}
                </tr>
              )}

              {/* Room Images */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground sticky left-0 bg-card">
                  Hình ảnh chính
                </td>
                {rooms.map((room, idx) => (
                  <td key={`${room.hotelId}-${room.id}-img`} className="p-4">
                    <img
                      src={room.image || defaultImages[idx % defaultImages.length]}
                      alt={room.roomName}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground sticky left-0 bg-card">
                  Giá mỗi đêm
                </td>
                {rooms.map((room) => (
                  <td key={`${room.hotelId}-${room.id}-price`} className="p-4">
                    {room.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        {room.originalPrice.toLocaleString("vi-VN")} ₫
                      </div>
                    )}
                    <div className="text-2xl font-bold text-destructive">
                      {room.price.toLocaleString("vi-VN")} ₫
                    </div>
                    <div className="text-sm text-muted-foreground">Mỗi đêm</div>
                  </td>
                ))}
              </tr>

              {/* Size */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground sticky left-0 bg-card">
                  Diện tích
                </td>
                {rooms.map((room) => (
                  <td
                    key={`${room.hotelId}-${room.id}-size`}
                    className="p-4 font-medium"
                  >
                    {room.size} m²
                  </td>
                ))}
              </tr>

              {/* Max Guests */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground sticky left-0 bg-card">
                  Sức chứa
                </td>
                {rooms.map((room) => (
                  <td
                    key={`${room.hotelId}-${room.id}-guests`}
                    className="p-4 font-medium"
                  >
                    {room.maxGuests} người lớn
                  </td>
                ))}
              </tr>

              {/* Bed Type */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground sticky left-0 bg-card">
                  Loại giường
                </td>
                {rooms.map((room) => (
                  <td
                    key={`${room.hotelId}-${room.id}-bed`}
                    className="p-4 font-medium"
                  >
                    {room.bedType}
                  </td>
                ))}
              </tr>

              {/* View */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground sticky left-0 bg-card">
                  View
                </td>
                {rooms.map((room) => (
                  <td
                    key={`${room.hotelId}-${room.id}-view`}
                    className="p-4 font-medium"
                  >
                    {room.view || "Thành phố"}
                  </td>
                ))}
              </tr>

              {/* Amenities */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground align-top sticky left-0 bg-card">
                  Tiện nghi nổi bật
                </td>
                {rooms.map((room) => (
                  <td key={`${room.hotelId}-${room.id}-amenities`} className="p-4">
                    <div className="space-y-2">
                      {room.amenities.slice(0, 5).map((amenity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 text-primary" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                      {room.amenities.length > 5 && (
                        <div className="text-sm text-muted-foreground mt-2">
                          +{room.amenities.length - 5} tiện nghi khác
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Breakfast */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground sticky left-0 bg-card">
                  Bữa sáng
                </td>
                {rooms.map((room) => (
                  <td
                    key={`${room.hotelId}-${room.id}-breakfast`}
                    className="p-4 font-medium"
                  >
                    {room.features.breakfast ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <Check className="h-4 w-4" /> Có
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <X className="h-4 w-4" /> Không
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Cancellation Policy */}
              <tr className="border-b">
                <td className="p-4 text-muted-foreground sticky left-0 bg-card">
                  Chính sách hủy
                </td>
                {rooms.map((room) => (
                  <td
                    key={`${room.hotelId}-${room.id}-cancel`}
                    className="p-4 font-medium"
                  >
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
                <td className="p-4 text-muted-foreground sticky left-0 bg-card">
                  Hành động
                </td>
                {rooms.map((room) => (
                  <td key={`${room.hotelId}-${room.id}-action`} className="p-4">
                    <Button className="bg-slate-700 hover:bg-slate-800 text-white">
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

export default RoomComparisonModal;
