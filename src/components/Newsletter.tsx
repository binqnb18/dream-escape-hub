import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Newsletter = () => {
  return (
    <section className="w-full px-4 md:px-6 lg:px-12 py-12 md:py-16">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-border">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shrink-0">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Nhận ưu đãi bí mật!
            </h3>
            <p className="text-muted-foreground text-sm md:text-base">
              Đăng ký nhận bản tin VBOOKING để không bỏ lỡ các deal phòng giá tốt, flash sale và voucher độc quyền dành cho bạn.
            </p>
          </div>

          <Button size="lg" className="shrink-0">
            Đăng ký nhận bản tin
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
