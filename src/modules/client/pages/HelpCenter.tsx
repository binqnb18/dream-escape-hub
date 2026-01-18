import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from "@/modules/client/components/common/Header";
import ClientFooter from "@/modules/client/components/common/ClientFooter";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Search, HelpCircle, Book, MessageCircle, Phone, Mail, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const faqCategories = [
  {
    title: 'Đặt phòng',
    icon: Book,
    questions: [
      { q: 'Làm thế nào để đặt phòng khách sạn?', a: 'Bạn có thể tìm kiếm khách sạn theo địa điểm, chọn ngày check-in/check-out, sau đó chọn phòng phù hợp và tiến hành thanh toán.' },
      { q: 'Tôi có thể hủy đặt phòng không?', a: 'Có, bạn có thể hủy đặt phòng theo chính sách hủy của từng khách sạn. Vui lòng kiểm tra điều khoản hủy trước khi đặt.' },
      { q: 'Làm sao để thay đổi ngày đặt phòng?', a: 'Truy cập "Đặt phòng của tôi", chọn booking cần sửa và nhấn "Thay đổi ngày". Phụ phí có thể áp dụng.' },
    ]
  },
  {
    title: 'Thanh toán',
    icon: MessageCircle,
    questions: [
      { q: 'Những phương thức thanh toán nào được chấp nhận?', a: 'Chúng tôi chấp nhận thẻ tín dụng/ghi nợ (Visa, MasterCard), ví điện tử (MoMo, ZaloPay), và chuyển khoản ngân hàng.' },
      { q: 'Thanh toán có an toàn không?', a: 'Có, chúng tôi sử dụng mã hóa SSL 256-bit và tuân thủ tiêu chuẩn PCI DSS để bảo vệ thông tin thanh toán của bạn.' },
      { q: 'Khi nào tôi sẽ được hoàn tiền?', a: 'Hoàn tiền thường được xử lý trong 5-7 ngày làm việc sau khi yêu cầu hủy được chấp nhận.' },
    ]
  },
  {
    title: 'Tài khoản',
    icon: HelpCircle,
    questions: [
      { q: 'Làm sao để tạo tài khoản?', a: 'Nhấn "Đăng ký" ở góc phải màn hình, điền thông tin và xác nhận email để hoàn tất.' },
      { q: 'Tôi quên mật khẩu, làm sao để lấy lại?', a: 'Nhấn "Quên mật khẩu" tại trang đăng nhập, nhập email và làm theo hướng dẫn được gửi đến.' },
      { q: 'Làm sao để cập nhật thông tin cá nhân?', a: 'Đăng nhập vào tài khoản, vào "Hồ sơ" và chỉnh sửa các thông tin cần thiết.' },
    ]
  }
];

const guides = [
  { title: 'Hướng dẫn đặt phòng lần đầu', description: 'Từng bước chi tiết cho người mới', link: '#' },
  { title: 'Cách sử dụng mã giảm giá', description: 'Áp dụng voucher để tiết kiệm hơn', link: '#' },
  { title: 'Quản lý đặt phòng', description: 'Xem, sửa, hủy booking dễ dàng', link: '#' },
  { title: 'Chương trình thành viên', description: 'Tích điểm và nhận ưu đãi', link: '#' },
];

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const { toast } = useToast();

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Đã gửi thành công', description: 'Chúng tôi sẽ phản hồi trong 24 giờ.' });
    setContactForm({ name: '', email: '', message: '' });
  };

  const filteredFAQs = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Trung tâm hỗ trợ</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tìm câu trả lời nhanh chóng hoặc liên hệ đội ngũ hỗ trợ của chúng tôi
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Hotline 24/7</h3>
                <p className="text-primary font-medium">1900 1234</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Email hỗ trợ</h3>
                <p className="text-primary font-medium">support@hotelbooking.vn</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-muted-foreground">Trò chuyện trực tiếp</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Hướng dẫn sử dụng</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {guides.map((guide, idx) => (
              <Card key={idx} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                  <Link to={guide.link} className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                    Xem chi tiết <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Câu hỏi thường gặp</h2>
          <div className="space-y-6">
            {(searchQuery ? filteredFAQs : faqCategories).map((category, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {category.questions.map((faq, faqIdx) => (
                      <AccordionItem key={faqIdx} value={`${idx}-${faqIdx}`}>
                        <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Liên hệ hỗ trợ</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Họ và tên"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <Textarea
                  placeholder="Nội dung cần hỗ trợ..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="md:col-span-2"
                  rows={4}
                  required
                />
                <Button type="submit" className="md:col-span-2">Gửi yêu cầu</Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>

      <ClientFooter />
    </div>
  );
};

export default HelpCenter;
