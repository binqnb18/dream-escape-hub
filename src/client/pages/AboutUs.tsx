import Header from '../components/Header';
import ClientFooter from '../components/ClientFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Award, Heart, MapPin, Clock } from 'lucide-react';

const stats = [
  { label: 'Khách sạn đối tác', value: '5,000+' },
  { label: 'Khách hàng hài lòng', value: '1M+' },
  { label: 'Đánh giá 5 sao', value: '500K+' },
  { label: 'Thành phố phủ sóng', value: '63' },
];

const values = [
  { icon: Heart, title: 'Khách hàng là trọng tâm', description: 'Mọi quyết định đều hướng đến trải nghiệm tốt nhất cho khách hàng' },
  { icon: Award, title: 'Chất lượng hàng đầu', description: 'Chỉ hợp tác với các khách sạn đạt chuẩn chất lượng cao' },
  { icon: Target, title: 'Minh bạch & Tin cậy', description: 'Cam kết giá tốt nhất, không phí ẩn, hoàn tiền dễ dàng' },
];

const team = [
  { name: 'Nguyễn Văn A', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { name: 'Trần Thị B', role: 'COO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { name: 'Lê Văn C', role: 'CTO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
  { name: 'Phạm Thị D', role: 'Marketing Director', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
];

const milestones = [
  { year: '2018', event: 'Thành lập công ty với 10 nhân viên' },
  { year: '2019', event: 'Đạt 100,000 booking đầu tiên' },
  { year: '2020', event: 'Mở rộng ra 63 tỉnh thành' },
  { year: '2022', event: 'Đạt 1 triệu khách hàng' },
  { year: '2024', event: 'Ra mắt ứng dụng di động' },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Về Chúng Tôi</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Nền tảng đặt phòng khách sạn hàng đầu Việt Nam, kết nối hàng triệu du khách 
            với những trải nghiệm lưu trú tuyệt vời nhất
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Sứ mệnh của chúng tôi</h2>
              <p className="text-muted-foreground mb-4">
                Chúng tôi tin rằng mọi người đều xứng đáng có những chuyến đi tuyệt vời. 
                Sứ mệnh của chúng tôi là làm cho việc đặt phòng khách sạn trở nên đơn giản, 
                minh bạch và đáng tin cậy hơn bao giờ hết.
              </p>
              <p className="text-muted-foreground">
                Với công nghệ tiên tiến và đội ngũ tận tâm, chúng tôi cam kết mang đến 
                trải nghiệm đặt phòng nhanh chóng, an toàn với mức giá tốt nhất thị trường.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop" 
                alt="Hotel" 
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Giá trị cốt lõi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, idx) => (
              <Card key={idx} className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Đội ngũ lãnh đạo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Hành trình phát triển</h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    {milestone.year}
                  </div>
                  {idx < milestones.length - 1 && <div className="w-0.5 h-12 bg-border mt-2" />}
                </div>
                <div className="pt-3">
                  <p className="text-foreground">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Liên hệ với chúng tôi</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </section>

      <ClientFooter />
    </div>
  );
};

export default AboutUs;
