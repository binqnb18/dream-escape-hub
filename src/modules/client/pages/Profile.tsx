import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CreditCard,
  Bell,
  Globe,
  LogOut,
  Camera,
  Edit,
  Save,
  X,
  ChevronRight,
} from "lucide-react";
import Header from "@/modules/client/components/layout/Header";
import ClientFooter from "@/modules/client/components/layout/ClientFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "Nguyễn",
    lastName: user?.lastName || "Văn A",
    email: user?.email || "demo@tripnest.vn",
    phone: user?.phone || "+84 901 234 567",
    birthDate: "1990-05-15",
    gender: "male",
    nationality: "Việt Nam",
    address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    promotions: true,
    bookingUpdates: true,
    reviews: false,
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Đã lưu thông tin",
      description: "Thông tin cá nhân đã được cập nhật thành công",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Đã đăng xuất",
      description: "Hẹn gặp lại bạn!",
    });
    navigate("/");
  };

  // Redirect if not authenticated (demo mode shows mock data)
  const displayUser = isAuthenticated ? user : {
    firstName: "Demo",
    lastName: "User",
    email: "demo@tripnest.vn",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src={displayUser?.avatar} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {displayUser?.firstName?.[0]}{displayUser?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-md hover:bg-primary/90">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">
                  {displayUser?.firstName} {displayUser?.lastName}
                </h1>
                <Badge variant="secondary">Thành viên</Badge>
              </div>
              <p className="text-muted-foreground">{displayUser?.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Thành viên từ tháng 1, 2024
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Hủy
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="w-full grid grid-cols-4 h-auto p-1">
            <TabsTrigger value="personal" className="py-3">
              <User className="mr-2 h-4 w-4" />
              Thông tin
            </TabsTrigger>
            <TabsTrigger value="security" className="py-3">
              <Shield className="mr-2 h-4 w-4" />
              Bảo mật
            </TabsTrigger>
            <TabsTrigger value="payment" className="py-3">
              <CreditCard className="mr-2 h-4 w-4" />
              Thanh toán
            </TabsTrigger>
            <TabsTrigger value="notifications" className="py-3">
              <Bell className="mr-2 h-4 w-4" />
              Thông báo
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Quản lý thông tin cá nhân của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Họ</Label>
                    <Input
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tên</Label>
                    <Input
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={profileData.email}
                        className="pl-10"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ngày sinh</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={profileData.birthDate}
                        onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Quốc tịch</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={profileData.nationality}
                        onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Địa chỉ</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bảo mật tài khoản</CardTitle>
                <CardDescription>
                  Quản lý mật khẩu và xác thực hai yếu tố
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Mật khẩu</h4>
                    <p className="text-sm text-muted-foreground">
                      Đã thay đổi lần cuối 30 ngày trước
                    </p>
                  </div>
                  <Button variant="outline">Đổi mật khẩu</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Xác thực hai yếu tố (2FA)</h4>
                    <p className="text-sm text-muted-foreground">
                      Tăng cường bảo mật cho tài khoản
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Phiên đăng nhập</h4>
                    <p className="text-sm text-muted-foreground">
                      Xem và quản lý các thiết bị đã đăng nhập
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Xem tất cả
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Vùng nguy hiểm</CardTitle>
                <CardDescription>
                  Các thao tác không thể hoàn tác
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Xóa tài khoản</h4>
                    <p className="text-sm text-muted-foreground">
                      Xóa vĩnh viễn tài khoản và tất cả dữ liệu
                    </p>
                  </div>
                  <Button variant="destructive">Xóa tài khoản</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
                <CardDescription>
                  Quản lý thẻ và phương thức thanh toán
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Saved cards */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Hết hạn 12/25</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Mặc định</Badge>
                      <Button variant="ghost" size="sm">Xóa</Button>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Thêm thẻ mới
                </Button>

                <Separator />

                {/* E-wallets */}
                <h4 className="font-medium">Ví điện tử đã liên kết</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      M
                    </div>
                    <div>
                      <p className="font-medium">MoMo</p>
                      <p className="text-sm text-muted-foreground">Đã liên kết</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 flex items-center gap-3 opacity-50">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      V
                    </div>
                    <div>
                      <p className="font-medium">VNPay</p>
                      <p className="text-sm text-muted-foreground">Chưa liên kết</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt thông báo</CardTitle>
                <CardDescription>
                  Chọn cách bạn muốn nhận thông báo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Kênh thông báo</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-sm text-muted-foreground">Nhận thông báo qua tin nhắn</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push Notification</p>
                        <p className="text-sm text-muted-foreground">Nhận thông báo đẩy trên thiết bị</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Loại thông báo</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Khuyến mãi & Ưu đãi</p>
                      <p className="text-sm text-muted-foreground">Nhận thông tin về các khuyến mãi mới</p>
                    </div>
                    <Switch
                      checked={notifications.promotions}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cập nhật đặt phòng</p>
                      <p className="text-sm text-muted-foreground">Thông báo về trạng thái đặt phòng</p>
                    </div>
                    <Switch
                      checked={notifications.bookingUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, bookingUpdates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nhắc đánh giá</p>
                      <p className="text-sm text-muted-foreground">Nhắc nhở đánh giá sau khi trả phòng</p>
                    </div>
                    <Switch
                      checked={notifications.reviews}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, reviews: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout button */}
        <div className="mt-8">
          <Button variant="outline" onClick={handleLogout} className="text-destructive border-destructive/50 hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
};

export default Profile;
