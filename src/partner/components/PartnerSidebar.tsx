import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Hotel, 
  CalendarDays, 
  MessageSquare, 
  Star, 
  DollarSign, 
  BarChart3, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  LogOut,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/partner/dashboard" },
  { icon: Hotel, label: "Quản lý phòng", path: "/partner/rooms" },
  { icon: CalendarDays, label: "Đặt phòng", path: "/partner/bookings" },
  { icon: MessageSquare, label: "Tin nhắn", path: "/partner/messages" },
  { icon: Star, label: "Đánh giá", path: "/partner/reviews" },
  { icon: DollarSign, label: "Doanh thu", path: "/partner/revenue" },
  { icon: BarChart3, label: "Báo cáo", path: "/partner/reports" },
];

const bottomMenuItems = [
  { icon: Settings, label: "Cài đặt", path: "/partner/settings" },
  { icon: HelpCircle, label: "Hỗ trợ", path: "/partner/support" },
];

const PartnerSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <Link to="/partner/dashboard" className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-primary" />
            <span className="font-bold text-lg text-foreground">Partner</span>
          </Link>
        )}
        {collapsed && (
          <Building2 className="w-8 h-8 text-primary mx-auto" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", collapsed && "mx-auto mt-2")}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="p-2 border-t border-border space-y-1">
        {bottomMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
        
        <Link
          to="/partner/login"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-destructive hover:bg-destructive/10",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Đăng xuất" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Đăng xuất</span>}
        </Link>
      </div>
    </aside>
  );
};

export default PartnerSidebar;
