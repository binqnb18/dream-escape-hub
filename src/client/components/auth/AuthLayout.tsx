import { Link } from "react-router-dom";
import { Building2, Star, Shield, Award, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const testimonials = [
  {
    quote: "Đặt phòng nhanh chóng, giá tốt nhất thị trường. Rất hài lòng!",
    author: "Nguyễn Văn Minh",
    location: "Hà Nội",
    rating: 5,
  },
  {
    quote: "Giao diện dễ sử dụng, hỗ trợ 24/7 rất nhiệt tình.",
    author: "Trần Thị Hương",
    location: "TP. Hồ Chí Minh",
    rating: 5,
  },
  {
    quote: "Đã đặt hơn 20 chuyến qua TripNest, chưa bao giờ thất vọng!",
    author: "Lê Hoàng Nam",
    location: "Đà Nẵng",
    rating: 5,
  },
];

const features = [
  {
    icon: Shield,
    title: "Thanh toán an toàn",
    desc: "SSL 256-bit encryption",
  },
  {
    icon: Award,
    title: "Giá tốt nhất",
    desc: "Cam kết hoàn tiền chênh lệch",
  },
  {
    icon: MapPin,
    title: "10,000+ khách sạn",
    desc: "Trên toàn quốc Việt Nam",
  },
];

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen grid lg:grid-cols-5">
      {/* Left side - Branding (3 columns) */}
      <div className="hidden lg:flex lg:col-span-3 relative overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80')"
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/70" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative flex flex-col justify-between p-12 text-primary-foreground w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Building2 className="h-7 w-7 text-accent-foreground" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight">TripNest</span>
              <p className="text-xs text-primary-foreground/70">Vietnam Hotels</p>
            </div>
          </Link>
          
          {/* Main content */}
          <div className="space-y-8 max-w-lg">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-tight">
                Khám phá
                <span className="block text-accent">Việt Nam</span>
                <span className="block text-3xl font-normal mt-2 text-primary-foreground/90">
                  theo cách của bạn
                </span>
              </h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed">
                Từ resort 5 sao đến homestay ấm cúng, TripNest mang đến hàng nghìn 
                lựa chọn lưu trú tuyệt vời với giá tốt nhất.
              </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                >
                  <feature.icon className="h-6 w-6 text-accent mb-2" />
                  <p className="font-semibold text-sm">{feature.title}</p>
                  <p className="text-xs text-primary-foreground/70">{feature.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Testimonial carousel */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-lg italic mb-4">
                "{testimonials[currentTestimonial].quote}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{testimonials[currentTestimonial].author}</p>
                  <p className="text-sm text-primary-foreground/70">
                    {testimonials[currentTestimonial].location}
                  </p>
                </div>
                <div className="flex gap-1">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial 
                          ? 'bg-accent w-6' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-primary-foreground/60">
              © 2024 TripNest. Nền tảng đặt phòng khách sạn hàng đầu Việt Nam.
            </p>
            <div className="flex gap-4">
              <Link to="/terms" className="text-sm text-primary-foreground/60 hover:text-primary-foreground">
                Điều khoản
              </Link>
              <Link to="/privacy" className="text-sm text-primary-foreground/60 hover:text-primary-foreground">
                Bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Form (2 columns) */}
      <div className="lg:col-span-2 flex items-center justify-center p-6 lg:p-10 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">TripNest</span>
          </Link>
          
          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">{title}</h2>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          
          {/* Form content */}
          <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-sm">
            {children}
          </div>
          
          {/* Mobile features */}
          <div className="lg:hidden grid grid-cols-3 gap-2 text-center">
            {features.map((feature, index) => (
              <div key={index} className="p-2">
                <feature.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-medium">{feature.title}</p>
              </div>
            ))}
          </div>
          
          {/* Mobile footer */}
          <p className="lg:hidden text-center text-xs text-muted-foreground">
            © 2024 TripNest. Nền tảng đặt phòng khách sạn hàng đầu Việt Nam.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
