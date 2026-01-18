import { useState } from 'react';
import Header from '@/modules/client/components/common/Header';
import ClientFooter from '@/modules/client/components/common/ClientFooter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Shield, Clock } from 'lucide-react';

const TermsPrivacy = () => {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Điều khoản & Chính sách</h1>
          <p className="text-muted-foreground text-center mb-8">Cập nhật lần cuối: 01/01/2024</p>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="terms" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Điều khoản sử dụng
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Chính sách bảo mật
              </TabsTrigger>
            </TabsList>

            <TabsContent value="terms">
              <Card>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      <section>
                        <h2 className="text-xl font-semibold mb-3">1. Giới thiệu</h2>
                        <p className="text-muted-foreground">
                          Chào mừng bạn đến với dịch vụ đặt phòng khách sạn trực tuyến của chúng tôi. 
                          Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản 
                          và điều kiện được quy định dưới đây.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">2. Điều kiện sử dụng dịch vụ</h2>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                          <li>Bạn phải đủ 18 tuổi để sử dụng dịch vụ đặt phòng</li>
                          <li>Thông tin đăng ký phải chính xác và đầy đủ</li>
                          <li>Bạn chịu trách nhiệm bảo mật tài khoản của mình</li>
                          <li>Không được sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                        </ul>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">3. Quy trình đặt phòng</h2>
                        <p className="text-muted-foreground mb-3">
                          Khi đặt phòng qua hệ thống của chúng tôi:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                          <li>Booking được xác nhận khi thanh toán thành công</li>
                          <li>Email xác nhận sẽ được gửi đến địa chỉ email đăng ký</li>
                          <li>Giá phòng đã bao gồm thuế và phí dịch vụ (trừ khi có ghi chú khác)</li>
                        </ul>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">4. Chính sách hủy phòng</h2>
                        <p className="text-muted-foreground mb-3">
                          Chính sách hủy phòng phụ thuộc vào từng khách sạn và loại phòng:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                          <li><strong>Hủy miễn phí:</strong> Hủy trước 24-48 giờ check-in (tùy khách sạn)</li>
                          <li><strong>Hủy có phí:</strong> Phí hủy từ 50-100% giá phòng đêm đầu tiên</li>
                          <li><strong>Không hoàn tiền:</strong> Một số mức giá đặc biệt không được hoàn tiền</li>
                        </ul>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">5. Thanh toán</h2>
                        <p className="text-muted-foreground">
                          Chúng tôi chấp nhận nhiều hình thức thanh toán bao gồm thẻ tín dụng/ghi nợ, 
                          ví điện tử và chuyển khoản ngân hàng. Mọi giao dịch đều được mã hóa và bảo mật.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">6. Trách nhiệm của chúng tôi</h2>
                        <p className="text-muted-foreground">
                          Chúng tôi cam kết cung cấp thông tin chính xác về khách sạn và dịch vụ. 
                          Tuy nhiên, chúng tôi không chịu trách nhiệm về chất lượng dịch vụ của khách sạn 
                          vì đây là bên thứ ba độc lập.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">7. Quyền sở hữu trí tuệ</h2>
                        <p className="text-muted-foreground">
                          Tất cả nội dung trên website bao gồm văn bản, hình ảnh, logo, biểu tượng 
                          đều thuộc quyền sở hữu của chúng tôi hoặc đối tác được cấp phép.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">8. Liên hệ</h2>
                        <p className="text-muted-foreground">
                          Nếu bạn có bất kỳ câu hỏi nào về Điều khoản sử dụng, vui lòng liên hệ 
                          qua email: legal@hotelbooking.vn hoặc hotline: 1900 1234.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      <section>
                        <h2 className="text-xl font-semibold mb-3">1. Thu thập thông tin</h2>
                        <p className="text-muted-foreground mb-3">
                          Chúng tôi thu thập các loại thông tin sau:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                          <li>Thông tin cá nhân: họ tên, email, số điện thoại, địa chỉ</li>
                          <li>Thông tin thanh toán: số thẻ (được mã hóa), thông tin ngân hàng</li>
                          <li>Thông tin đặt phòng: lịch sử booking, preferences</li>
                          <li>Thông tin kỹ thuật: IP, thiết bị, trình duyệt, cookies</li>
                        </ul>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">2. Mục đích sử dụng</h2>
                        <p className="text-muted-foreground mb-3">
                          Thông tin của bạn được sử dụng để:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                          <li>Xử lý và xác nhận đặt phòng</li>
                          <li>Liên lạc về booking và hỗ trợ khách hàng</li>
                          <li>Gửi thông báo khuyến mãi (nếu bạn đồng ý)</li>
                          <li>Cải thiện dịch vụ và trải nghiệm người dùng</li>
                          <li>Phát hiện và ngăn chặn gian lận</li>
                        </ul>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">3. Chia sẻ thông tin</h2>
                        <p className="text-muted-foreground mb-3">
                          Chúng tôi có thể chia sẻ thông tin với:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                          <li>Khách sạn để hoàn tất booking của bạn</li>
                          <li>Đối tác thanh toán để xử lý giao dịch</li>
                          <li>Cơ quan có thẩm quyền khi có yêu cầu pháp lý</li>
                        </ul>
                        <p className="text-muted-foreground mt-3">
                          Chúng tôi KHÔNG bán thông tin cá nhân của bạn cho bên thứ ba.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">4. Bảo mật dữ liệu</h2>
                        <p className="text-muted-foreground">
                          Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn ngành bao gồm:
                          mã hóa SSL/TLS, tuân thủ PCI DSS cho thanh toán, kiểm soát truy cập nghiêm ngặt,
                          và backup dữ liệu định kỳ.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
                        <p className="text-muted-foreground">
                          Website sử dụng cookies để cải thiện trải nghiệm duyệt web. 
                          Bạn có thể quản lý cookies thông qua cài đặt trình duyệt. 
                          Một số tính năng có thể không hoạt động nếu cookies bị tắt.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">6. Quyền của bạn</h2>
                        <p className="text-muted-foreground mb-3">
                          Bạn có quyền:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                          <li>Truy cập và xem thông tin cá nhân của mình</li>
                          <li>Yêu cầu chỉnh sửa thông tin không chính xác</li>
                          <li>Yêu cầu xóa tài khoản và dữ liệu</li>
                          <li>Từ chối nhận email marketing</li>
                          <li>Xuất dữ liệu cá nhân</li>
                        </ul>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">7. Lưu trữ dữ liệu</h2>
                        <p className="text-muted-foreground">
                          Dữ liệu cá nhân được lưu trữ trong thời gian cần thiết để cung cấp dịch vụ 
                          hoặc theo yêu cầu pháp luật. Dữ liệu booking được lưu tối thiểu 5 năm 
                          theo quy định về lưu trữ hồ sơ.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">8. Thay đổi chính sách</h2>
                        <p className="text-muted-foreground">
                          Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian. 
                          Mọi thay đổi quan trọng sẽ được thông báo qua email hoặc trên website.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-3">9. Liên hệ</h2>
                        <p className="text-muted-foreground">
                          Để thực hiện quyền của bạn hoặc có thắc mắc về bảo mật dữ liệu, 
                          vui lòng liên hệ: privacy@hotelbooking.vn
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ClientFooter />
    </div>
  );
};

export default TermsPrivacy;
