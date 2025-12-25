import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: 1,
    title: "10 Địa Điểm Du Lịch Đà Lạt Không Thể Bỏ Qua",
    excerpt: "Khám phá những điểm đến tuyệt vời nhất tại thành phố ngàn hoa...",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    category: "Du lịch",
    date: "15 Tháng 1, 2025",
    readTime: "5 phút đọc",
  },
  {
    id: 2,
    title: "Hướng Dẫn Đặt Phòng Khách Sạn Online An Toàn",
    excerpt: "Bí quyết để có trải nghiệm đặt phòng tốt nhất, tránh các rủi ro...",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    category: "Tips",
    date: "12 Tháng 1, 2025",
    readTime: "4 phút đọc",
  },
  {
    id: 3,
    title: "Khám Phá Ẩm Thực Đường Phố TP.HCM",
    excerpt: "Hành trình ẩm thực qua các món ăn đường phố nổi tiếng nhất Sài Gòn...",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
    category: "Ẩm thực",
    date: "10 Tháng 1, 2025",
    readTime: "6 phút đọc",
  },
];

const BlogSection = () => {
  return (
    <section className="w-full px-4 md:px-6 lg:px-12 py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-0">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Blog Du Lịch & Tips
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Khám phá những bài viết hữu ích về du lịch, ẩm thực và kinh nghiệm đặt phòng
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`}>
              <Card className="overflow-hidden h-full group hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link to="/blog">
            <Button variant="outline" className="gap-2">
              Xem tất cả bài viết
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
