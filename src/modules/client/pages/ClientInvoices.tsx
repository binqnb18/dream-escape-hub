import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/modules/client/components/common/Header";
import ClientFooter from "@/modules/client/components/common/ClientFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Download,
  Printer,
  Mail,
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Building2,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

interface Invoice {
  id: string;
  bookingId: string;
  hotelName: string;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  status: "paid" | "pending" | "cancelled";
  createdAt: Date;
  dueDate?: Date;
}

const mockInvoices: Invoice[] = [
  {
    id: "INV-2024-001",
    bookingId: "VNT12345678",
    hotelName: "Vinpearl Resort & Spa Nha Trang Bay",
    checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    totalAmount: 5060000,
    status: "paid",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "INV-2024-002",
    bookingId: "VNT87654321",
    hotelName: "Fusion Resort Nha Trang",
    checkIn: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    totalAmount: 5940000,
    status: "paid",
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
  },
  {
    id: "INV-2024-003",
    bookingId: "VNT11223344",
    hotelName: "Mia Resort Nha Trang",
    checkIn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    totalAmount: 8500000,
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "INV-2024-004",
    bookingId: "VNT99887766",
    hotelName: "InterContinental Đà Nẵng",
    checkIn: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() - 57 * 24 * 60 * 60 * 1000),
    totalAmount: 12000000,
    status: "cancelled",
    createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
  },
];

const statusConfig = {
  paid: {
    label: "Đã thanh toán",
    icon: CheckCircle,
    color: "text-green-600 bg-green-50",
  },
  pending: {
    label: "Chờ thanh toán",
    icon: Clock,
    color: "text-amber-600 bg-amber-50",
  },
  cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    color: "text-red-600 bg-red-50",
  },
};

const InvoiceCard = ({ invoice }: { invoice: Invoice }) => {
  const config = statusConfig[invoice.status];
  const StatusIcon = config.icon;

  const handleDownload = () => {
    toast({
      title: "Đang tải hóa đơn",
      description: `Hóa đơn ${invoice.id} sẽ được tải xuống`,
    });
  };

  const handlePrint = () => {
    toast({
      title: "Đang in hóa đơn",
      description: `Đang chuẩn bị in hóa đơn ${invoice.id}`,
    });
  };

  const handleSendEmail = () => {
    toast({
      title: "Đã gửi email",
      description: `Hóa đơn ${invoice.id} đã được gửi qua email`,
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Invoice Info */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{invoice.id}</h3>
                <Badge className={config.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <Building2 className="h-3.5 w-3.5" />
                <span>{invoice.hotelName}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(invoice.checkIn, "dd/MM/yyyy", { locale: vi })} - {format(invoice.checkOut, "dd/MM/yyyy", { locale: vi })}
                </span>
                <span>Mã đặt phòng: {invoice.bookingId}</span>
              </div>
            </div>
          </div>

          {/* Amount & Actions */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Tổng tiền</p>
              <p className="text-lg font-bold text-primary">
                {invoice.totalAmount.toLocaleString("vi-VN")}₫
              </p>
              {invoice.status === "pending" && invoice.dueDate && (
                <p className="text-xs text-amber-600">
                  Hạn: {format(invoice.dueDate, "dd/MM/yyyy", { locale: vi })}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handleDownload} title="Tải xuống">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handlePrint} title="In">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSendEmail} title="Gửi email">
                <Mail className="h-4 w-4" />
              </Button>
              <Link to={`/booking/${invoice.bookingId}`}>
                <Button variant="ghost" size="icon" title="Xem chi tiết">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ClientInvoices = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesTab = activeTab === "all" || invoice.status === activeTab;
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const paidCount = mockInvoices.filter((i) => i.status === "paid").length;
  const pendingCount = mockInvoices.filter((i) => i.status === "pending").length;
  const cancelledCount = mockInvoices.filter((i) => i.status === "cancelled").length;

  const totalPaid = mockInvoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Hóa đơn của tôi
              </h1>
              <p className="text-muted-foreground">
                Quản lý và xem lịch sử hóa đơn
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-primary">{mockInvoices.length}</div>
              <p className="text-sm text-muted-foreground">Tổng hóa đơn</p>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">{paidCount}</div>
              <p className="text-sm text-muted-foreground">Đã thanh toán</p>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
              <p className="text-sm text-muted-foreground">Chờ thanh toán</p>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-primary">
                {totalPaid.toLocaleString("vi-VN")}₫
              </div>
              <p className="text-sm text-muted-foreground">Tổng đã thanh toán</p>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã hóa đơn, khách sạn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="all">
                Tất cả ({mockInvoices.length})
              </TabsTrigger>
              <TabsTrigger value="paid">
                Đã TT ({paidCount})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Chờ TT ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Đã hủy ({cancelledCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6 space-y-4">
              {filteredInvoices.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Không có hóa đơn nào trong mục này
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredInvoices.map((invoice) => (
                  <InvoiceCard key={invoice.id} invoice={invoice} />
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

export default ClientInvoices;
