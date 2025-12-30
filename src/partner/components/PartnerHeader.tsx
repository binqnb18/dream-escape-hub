import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/client/components/ThemeToggle";
import { Link } from "react-router-dom";

interface PartnerHeaderProps {
  onMenuClick?: () => void;
}

const PartnerHeader = ({ onMenuClick }: PartnerHeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between gap-4">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đặt phòng, khách hàng..."
            className="pl-9 w-64 lg:w-80"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                5
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <p className="font-medium text-sm">Đặt phòng mới #12345</p>
                <p className="text-xs text-muted-foreground">Khách hàng Nguyễn Văn A đã đặt phòng Deluxe</p>
                <p className="text-xs text-muted-foreground">5 phút trước</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <p className="font-medium text-sm">Đánh giá mới</p>
                <p className="text-xs text-muted-foreground">Bạn nhận được đánh giá 5 sao từ khách hàng</p>
                <p className="text-xs text-muted-foreground">1 giờ trước</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <p className="font-medium text-sm">Thanh toán đã nhận</p>
                <p className="text-xs text-muted-foreground">₫2,500,000 đã được chuyển vào tài khoản</p>
                <p className="text-xs text-muted-foreground">2 giờ trước</p>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/partner/notifications" className="w-full text-center text-primary">
                Xem tất cả thông báo
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                <AvatarFallback>NH</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">Nguyễn Hùng</p>
                <p className="text-xs text-muted-foreground">Grand Hotel Saigon</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/partner/profile">Thông tin cá nhân</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/partner/hotel-settings">Cài đặt khách sạn</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/partner/billing">Thanh toán & Hóa đơn</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-destructive">
              <Link to="/partner/login">Đăng xuất</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default PartnerHeader;
