import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/modules/client/components/layout/Header';
import ClientFooter from '@/modules/client/components/layout/ClientFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, Check, CheckCheck, Trash2, Settings, 
  Calendar, Tag, MessageCircle, CreditCard, Star,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'booking' | 'promotion' | 'message' | 'payment' | 'review';
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'booking', title: 'Đặt phòng thành công', description: 'Booking #12345 tại Vinpearl Resort đã được xác nhận', time: '5 phút trước', read: false, link: '/booking/12345' },
  { id: '2', type: 'promotion', title: 'Flash Sale 50%', description: 'Giảm 50% cho các khách sạn 5 sao tại Đà Nẵng', time: '1 giờ trước', read: false, link: '/promotions' },
  { id: '3', type: 'message', title: 'Tin nhắn mới từ Khách sạn', description: 'Vinpearl Resort đã phản hồi yêu cầu của bạn', time: '2 giờ trước', read: false, link: '/messages' },
  { id: '4', type: 'payment', title: 'Thanh toán thành công', description: 'Thanh toán 2,500,000đ cho booking #12345', time: '3 giờ trước', read: true, link: '/invoices' },
  { id: '5', type: 'review', title: 'Nhắc nhở đánh giá', description: 'Hãy chia sẻ trải nghiệm tại Mường Thanh Luxury', time: '1 ngày trước', read: true, link: '/write-review/123' },
  { id: '6', type: 'booking', title: 'Check-in ngày mai', description: 'Nhắc nhở: Bạn sẽ check-in tại Fusion Resort vào ngày mai', time: '1 ngày trước', read: true },
  { id: '7', type: 'promotion', title: 'Ưu đãi sinh nhật', description: 'Giảm 20% cho tất cả đặt phòng trong tháng sinh nhật của bạn', time: '2 ngày trước', read: true },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'booking': return Calendar;
    case 'promotion': return Tag;
    case 'message': return MessageCircle;
    case 'payment': return CreditCard;
    case 'review': return Star;
    default: return Bell;
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case 'booking': return 'text-blue-500 bg-blue-500/10';
    case 'promotion': return 'text-green-500 bg-green-500/10';
    case 'message': return 'text-purple-500 bg-purple-500/10';
    case 'payment': return 'text-amber-500 bg-amber-500/10';
    case 'review': return 'text-orange-500 bg-orange-500/10';
    default: return 'text-muted-foreground bg-muted';
  }
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    return n.type === activeTab;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({ title: 'Đã đánh dấu tất cả là đã đọc' });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({ title: 'Đã xóa thông báo' });
  };

  const clearAll = () => {
    setNotifications([]);
    toast({ title: 'Đã xóa tất cả thông báo' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Bell className="h-8 w-8" />
                Thông báo
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount} mới</Badge>
                )}
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Đọc tất cả
              </Button>
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
              <TabsTrigger value="booking">Đặt phòng</TabsTrigger>
              <TabsTrigger value="promotion">Khuyến mãi</TabsTrigger>
              <TabsTrigger value="message">Tin nhắn</TabsTrigger>
              <TabsTrigger value="payment">Thanh toán</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Không có thông báo nào</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = getIcon(notification.type);
                const iconColor = getIconColor(notification.type);
                
                return (
                  <Card 
                    key={notification.id} 
                    className={`transition-colors ${!notification.read ? 'bg-primary/5 border-primary/20' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${iconColor}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {notification.time}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {notification.link && (
                            <Link 
                              to={notification.link}
                              className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Xem chi tiết <ChevronRight className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Clear All */}
          {notifications.length > 0 && (
            <div className="text-center mt-6">
              <Button variant="ghost" onClick={clearAll} className="text-muted-foreground">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả thông báo
              </Button>
            </div>
          )}
        </div>
      </div>

      <ClientFooter />
    </div>
  );
};

export default NotificationCenter;
