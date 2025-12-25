import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:flex relative bg-primary overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Background image overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200')"
          }}
        />
        
        {/* Content */}
        <div className="relative flex flex-col justify-between p-12 text-primary-foreground">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Building2 className="h-6 w-6 text-accent-foreground" />
            </div>
            <span className="text-2xl font-bold">TripNest</span>
          </Link>
          
          {/* Tagline */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Khám phá những kỳ nghỉ<br />
              <span className="text-accent">tuyệt vời nhất</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-md">
              Hơn 10,000+ khách sạn hàng đầu Việt Nam đang chờ bạn. 
              Đặt phòng dễ dàng, thanh toán an toàn, trải nghiệm tuyệt vời.
            </p>
            
            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-accent">10K+</div>
                <div className="text-sm text-primary-foreground/70">Khách sạn</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">500K+</div>
                <div className="text-sm text-primary-foreground/70">Khách hàng</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">4.8★</div>
                <div className="text-sm text-primary-foreground/70">Đánh giá</div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <p className="text-sm text-primary-foreground/60">
            © 2024 TripNest. Nền tảng đặt phòng khách sạn hàng đầu Việt Nam.
          </p>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">TripNest</span>
          </Link>
          
          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          
          {/* Form content */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            {children}
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
