import { 
  TrendingUp, 
  TrendingDown, 
  CalendarCheck, 
  Users, 
  DollarSign, 
  Star,
  ArrowUpRight,
  MoreHorizontal,
  Eye
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import PartnerSidebar from "../components/PartnerSidebar";
import PartnerHeader from "../components/PartnerHeader";

const stats = [
  {
    title: "Doanh thu tháng này",
    value: "₫125,500,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Đặt phòng mới",
    value: "48",
    change: "+8.2%",
    trend: "up",
    icon: CalendarCheck,
  },
  {
    title: "Khách đang lưu trú",
    value: "32",
    change: "-2.1%",
    trend: "down",
    icon: Users,
  },
  {
    title: "Đánh giá trung bình",
    value: "4.8",
    change: "+0.3",
    trend: "up",
    icon: Star,
  },
];

const recentBookings = [
  {
    id: "BK-12345",
    guest: "Nguyễn Văn A",
    room: "Phòng Deluxe",
    checkIn: "15/01/2024",
    checkOut: "17/01/2024",
    status: "confirmed",
    amount: "₫2,500,000",
  },
  {
    id: "BK-12346",
    guest: "Trần Thị B",
    room: "Phòng Superior",
    checkIn: "16/01/2024",
    checkOut: "18/01/2024",
    status: "pending",
    amount: "₫1,800,000",
  },
  {
    id: "BK-12347",
    guest: "Lê Văn C",
    room: "Suite Executive",
    checkIn: "14/01/2024",
    checkOut: "16/01/2024",
    status: "checked_in",
    amount: "₫4,200,000",
  },
  {
    id: "BK-12348",
    guest: "Phạm Thị D",
    room: "Phòng Standard",
    checkIn: "17/01/2024",
    checkOut: "19/01/2024",
    status: "confirmed",
    amount: "₫1,200,000",
  },
];

const roomOccupancy = [
  { type: "Phòng Standard", occupied: 8, total: 10, percentage: 80 },
  { type: "Phòng Superior", occupied: 12, total: 15, percentage: 80 },
  { type: "Phòng Deluxe", occupied: 6, total: 10, percentage: 60 },
  { type: "Suite Executive", occupied: 4, total: 5, percentage: 80 },
];

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    confirmed: { label: "Đã xác nhận", variant: "default" },
    pending: { label: "Chờ xác nhận", variant: "secondary" },
    checked_in: { label: "Đang lưu trú", variant: "outline" },
    cancelled: { label: "Đã hủy", variant: "destructive" },
  };
  const { label, variant } = statusMap[status] || { label: status, variant: "secondary" as const };
  return <Badge variant={variant}>{label}</Badge>;
};

const PartnerDashboard = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <PartnerSidebar />
      </div>
      
      <div className="flex-1 flex flex-col">
        <PartnerHeader />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Xin chào, Nguyễn Hùng! 👋</h1>
            <p className="text-muted-foreground">Đây là tổng quan hoạt động của Grand Hotel Saigon hôm nay.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-destructive"
                    }`}>
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Bookings */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Đặt phòng gần đây</CardTitle>
                    <CardDescription>Các đặt phòng mới nhất cần xử lý</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Xem tất cả
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Mã đặt</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Khách</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Phòng</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Check-in</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Trạng thái</th>
                          <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Tổng tiền</th>
                          <th className="py-3 px-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                            <td className="py-3 px-2 text-sm font-medium text-primary">{booking.id}</td>
                            <td className="py-3 px-2 text-sm">{booking.guest}</td>
                            <td className="py-3 px-2 text-sm hidden md:table-cell text-muted-foreground">{booking.room}</td>
                            <td className="py-3 px-2 text-sm hidden lg:table-cell text-muted-foreground">{booking.checkIn}</td>
                            <td className="py-3 px-2">{getStatusBadge(booking.status)}</td>
                            <td className="py-3 px-2 text-sm font-medium text-right">{booking.amount}</td>
                            <td className="py-3 px-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Room Occupancy */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Tình trạng phòng</CardTitle>
                  <CardDescription>Tỷ lệ lấp đầy theo loại phòng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roomOccupancy.map((room, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{room.type}</span>
                        <span className="text-muted-foreground">
                          {room.occupied}/{room.total} phòng
                        </span>
                      </div>
                      <Progress value={room.percentage} className="h-2" />
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tổng tỷ lệ lấp đầy</span>
                      <span className="text-lg font-bold text-primary">75%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Thao tác nhanh</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <CalendarCheck className="w-5 h-5" />
                    <span className="text-xs">Thêm đặt phòng</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Users className="w-5 h-5" />
                    <span className="text-xs">Check-in khách</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-xs">Cập nhật giá</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <MoreHorizontal className="w-5 h-5" />
                    <span className="text-xs">Xem thêm</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PartnerDashboard;
