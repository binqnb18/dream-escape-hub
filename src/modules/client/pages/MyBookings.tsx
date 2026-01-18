import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/modules/client/components/layout/Header";
import ClientFooter from "@/modules/client/components/layout/ClientFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Eye,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import hotelImage1 from "@/assets/hotel-1.jpg";
import hotelImage2 from "@/assets/hotel-2.jpg";

interface Booking {
  id: string;
  hotelName: string;
  hotelImage: string;
  roomName: string;
  location: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  nights: number;
  totalPrice: number;
  status: "upcoming" | "completed" | "cancelled";
  createdAt: Date;
}

const mockBookings: Booking[] = [
  {
    id: "VNT12345678",
    hotelName: "Vinpearl Resort & Spa Nha Trang Bay",
    hotelImage: hotelImage1,
    roomName: "Phòng Deluxe Hướng Biển",
    location: "Nha Trang, Khánh Hòa",
    checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    guests: 2,
    nights: 2,
    totalPrice: 5000000,
    status: "upcoming",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "VNT87654321",
    hotelName: "Fusion Resort Nha Trang",
    hotelImage: hotelImage2,
    roomName: "Ocean View Suite",
    location: "Nha Trang, Khánh Hòa",
    checkIn: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    guests: 2,
    nights: 2,
    totalPrice: 6400000,
    status: "completed",
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
  },
  {
    id: "VNT11223344",
    hotelName: "Mia Resort Nha Trang",
    hotelImage: hotelImage1,
    roomName: "Garden Villa",
    location: "Cam Ranh, Khánh Hòa",
    checkIn: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() - 57 * 24 * 60 * 60 * 1000),
    guests: 4,
    nights: 3,
    totalPrice: 12000000,
    status: "cancelled",
    createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
  },
];

const statusConfig = {
  upcoming: {
    label: "Sắp tới",
    variant: "default" as const,
    icon: Clock,
    color: "text-blue-600",
  },
  completed: {
    label: "Hoàn thành",
    variant: "secondary" as const,
    icon: CheckCircle,
    color: "text-green-600",
  },
  cancelled: {
    label: "Đã hủy",
    variant: "destructive" as const,
    icon: X,
    color: "text-red-600",
  },
};

const BookingCard = ({ booking }: { booking: Booking }) => {
  const config = statusConfig[booking.status];
  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-48 h-40 md:h-auto relative">
            <img
              src={booking.hotelImage}
              alt={booking.hotelName}
              className="w-full h-full object-cover"
            />
            <Badge
              variant={config.variant}
              className="absolute top-2 left-2 gap-1"
            >
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </Badge>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{booking.hotelName}</h3>
                <p className="text-sm text-muted-foreground">{booking.roomName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Mã đặt phòng</p>
                <p className="font-mono font-medium text-primary">
                  {booking.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {booking.location}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {format(booking.checkIn, "dd/MM/yyyy", { locale: vi })} -{" "}
                  {format(booking.checkOut, "dd/MM/yyyy", { locale: vi })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>{booking.guests} khách</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{booking.nights} đêm</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Tổng tiền</p>
                <p className="text-lg font-bold text-primary">
                  {booking.totalPrice.toLocaleString("vi-VN")}₫
                </p>
              </div>
              <div className="flex gap-2">
                {booking.status === "upcoming" && (
                  <Button variant="outline" size="sm" className="text-destructive">
                    Hủy đặt phòng
                  </Button>
                )}
                <Link to={`/booking/${booking.id}`}>
                  <Button size="sm" className="gap-1">
                    <Eye className="h-4 w-4" />
                    Chi tiết
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Bookings = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredBookings = mockBookings.filter((booking) => {
    if (activeTab === "all") return true;
    return booking.status === activeTab;
  });

  const upcomingCount = mockBookings.filter((b) => b.status === "upcoming").length;
  const completedCount = mockBookings.filter((b) => b.status === "completed").length;
  const cancelledCount = mockBookings.filter((b) => b.status === "cancelled").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Đặt phòng của tôi</h1>
              <p className="text-muted-foreground">
                Quản lý và xem lịch sử đặt phòng
              </p>
            </div>
            <Link to="/search">
              <Button>Đặt phòng mới</Button>
            </Link>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="all">
                Tất cả ({mockBookings.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Sắp tới ({upcomingCount})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Hoàn thành ({completedCount})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Đã hủy ({cancelledCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6 space-y-4">
              {filteredBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Không có đặt phòng nào trong mục này
                    </p>
                    <Link to="/search">
                      <Button variant="link" className="mt-2">
                        Tìm khách sạn ngay
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                filteredBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
};

export default Bookings;
