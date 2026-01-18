import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/modules/client/components/layout/Header';
import ClientFooter from '@/modules/client/components/layout/ClientFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, Shield, CreditCard, Globe, ArrowLeft, 
  Mail, MessageSquare, Smartphone, Eye, EyeOff,
  Trash2, Plus, Check, Lock, KeyRound, Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Notification settings
const notificationTypes = [
  { id: 'booking_confirm', label: 'Xác nhận đặt phòng', description: 'Thông báo khi booking được xác nhận' },
  { id: 'checkin_reminder', label: 'Nhắc nhở check-in', description: 'Nhắc nhở trước ngày check-in' },
  { id: 'checkout_reminder', label: 'Nhắc nhở check-out', description: 'Nhắc nhở vào ngày check-out' },
  { id: 'promotions', label: 'Khuyến mãi mới', description: 'Thông báo về ưu đãi và giảm giá' },
  { id: 'wishlist_deals', label: 'Ưu đãi Wishlist', description: 'Khi khách sạn yêu thích có khuyến mãi' },
  { id: 'review_reminder', label: 'Nhắc nhở đánh giá', description: 'Nhắc đánh giá sau khi trả phòng' },
  { id: 'booking_updates', label: 'Cập nhật booking', description: 'Thay đổi về booking của bạn' },
];

const AccountSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('notifications');
  
  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState('immediate');
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>({
    booking_confirm: true,
    checkin_reminder: true,
    checkout_reminder: true,
    promotions: true,
    wishlist_deals: true,
    review_reminder: true,
    booking_updates: true,
  });

  // Security states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Payment states
  const [savedCards, setSavedCards] = useState([
    { id: '1', type: 'visa', last4: '4242', expiry: '12/25', isDefault: true },
    { id: '2', type: 'mastercard', last4: '8888', expiry: '06/26', isDefault: false },
  ]);

  // Currency & Language
  const [currency, setCurrency] = useState('VND');
  const [language, setLanguage] = useState('vi');

  const toggleNotificationPref = (id: string) => {
    setNotificationPrefs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveNotifications = () => {
    toast({ title: 'Đã lưu cài đặt thông báo' });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Mật khẩu xác nhận không khớp', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: 'Mật khẩu phải có ít nhất 8 ký tự', variant: 'destructive' });
      return;
    }
    // Simulate password change
    toast({ title: 'Đã đổi mật khẩu thành công' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({ 
      title: twoFactorEnabled ? 'Đã tắt xác thực 2 bước' : 'Đã bật xác thực 2 bước' 
    });
  };

  const handleSetDefaultCard = (cardId: string) => {
    setSavedCards(prev => prev.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
    toast({ title: 'Đã đặt làm thẻ mặc định' });
  };

  const handleDeleteCard = (cardId: string) => {
    setSavedCards(prev => prev.filter(card => card.id !== cardId));
    toast({ title: 'Đã xóa thẻ thanh toán' });
  };

  const handleDownloadData = () => {
    toast({ title: 'Yêu cầu tải dữ liệu đã được gửi', description: 'Bạn sẽ nhận email trong 24 giờ' });
  };

  const handleDeleteAccount = () => {
    toast({ 
      title: 'Yêu cầu xóa tài khoản', 
      description: 'Vui lòng xác nhận qua email để hoàn tất',
      variant: 'destructive'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Quay lại hồ sơ
        </Link>

        <h1 className="text-3xl font-bold mb-8">Cài đặt tài khoản</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 gap-2">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Thông báo</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Bảo mật</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Thanh toán</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Tùy chọn</span>
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kênh thông báo</CardTitle>
                <CardDescription>Chọn cách bạn muốn nhận thông báo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
                    </div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">SMS</p>
                      <p className="text-sm text-muted-foreground">Nhận tin nhắn văn bản</p>
                    </div>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Push Notification</p>
                      <p className="text-sm text-muted-foreground">Thông báo trên trình duyệt/app</p>
                    </div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <Separator />

                <div>
                  <Label>Tần suất nhận thông báo</Label>
                  <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
                    <SelectTrigger className="w-full md:w-[300px] mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Ngay lập tức</SelectItem>
                      <SelectItem value="daily">Tổng hợp hàng ngày</SelectItem>
                      <SelectItem value="weekly">Tổng hợp hàng tuần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loại thông báo</CardTitle>
                <CardDescription>Chọn loại thông báo bạn muốn nhận</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notificationTypes.map((type) => (
                  <div key={type.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">{type.label}</p>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    <Switch 
                      checked={notificationPrefs[type.id]} 
                      onCheckedChange={() => toggleNotificationPref(type.id)} 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button onClick={handleSaveNotifications}>Lưu cài đặt</Button>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Đổi mật khẩu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                  <div className="relative mt-2">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-password">Mật khẩu mới</Label>
                  <div className="relative mt-2">
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <Button onClick={handleChangePassword}>Đổi mật khẩu</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Xác thực 2 bước (2FA)
                </CardTitle>
                <CardDescription>
                  Thêm lớp bảo mật bằng mã OTP khi đăng nhập
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Trạng thái</p>
                    <Badge variant={twoFactorEnabled ? 'default' : 'secondary'}>
                      {twoFactorEnabled ? 'Đã bật' : 'Chưa bật'}
                    </Badge>
                  </div>
                  <Button 
                    variant={twoFactorEnabled ? 'outline' : 'default'}
                    onClick={handleToggle2FA}
                  >
                    {twoFactorEnabled ? 'Tắt 2FA' : 'Bật 2FA'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quyền riêng tư & Dữ liệu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tải dữ liệu cá nhân</p>
                    <p className="text-sm text-muted-foreground">Tải về tất cả dữ liệu của bạn</p>
                  </div>
                  <Button variant="outline" onClick={handleDownloadData}>
                    <Download className="h-4 w-4 mr-2" />
                    Tải về
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-destructive">Xóa tài khoản</p>
                    <p className="text-sm text-muted-foreground">Xóa vĩnh viễn tài khoản và dữ liệu</p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa tài khoản
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thẻ thanh toán đã lưu</CardTitle>
                <CardDescription>Quản lý các phương thức thanh toán</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedCards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold uppercase">
                        {card.type}
                      </div>
                      <div>
                        <p className="font-medium">**** **** **** {card.last4}</p>
                        <p className="text-sm text-muted-foreground">Hết hạn: {card.expiry}</p>
                      </div>
                      {card.isDefault && (
                        <Badge variant="outline" className="ml-2">Mặc định</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!card.isDefault && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSetDefaultCard(card.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Đặt mặc định
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thẻ mới
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ví điện tử</CardTitle>
                <CardDescription>Liên kết ví điện tử để thanh toán nhanh hơn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                      M
                    </div>
                    <div>
                      <p className="font-medium">MoMo</p>
                      <p className="text-sm text-muted-foreground">Chưa liên kết</p>
                    </div>
                  </div>
                  <Button variant="outline">Liên kết</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                      V
                    </div>
                    <div>
                      <p className="font-medium">VNPay</p>
                      <p className="text-sm text-muted-foreground">Chưa liên kết</p>
                    </div>
                  </div>
                  <Button variant="outline">Liên kết</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ngôn ngữ & Tiền tệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Ngôn ngữ hiển thị</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full md:w-[300px] mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Đơn vị tiền tệ</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-full md:w-[300px] mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VND">VND - Việt Nam Đồng</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ClientFooter />
    </div>
  );
};

export default AccountSettings;
