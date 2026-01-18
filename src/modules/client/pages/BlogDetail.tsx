import { useParams, Link } from 'react-router-dom';
import Header from '@/modules/client/components/common/Header';
import ClientFooter from '@/modules/client/components/common/ClientFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, Calendar, Clock, User, Share2, Heart, 
  Facebook, Twitter, MessageCircle, ChevronRight 
} from 'lucide-react';
import { useState } from 'react';

const blogPost = {
  id: '1',
  title: 'Top 10 khách sạn view biển đẹp nhất Việt Nam 2024',
  excerpt: 'Khám phá những khách sạn có view biển tuyệt đẹp từ Bắc vào Nam',
  content: `
    <p>Việt Nam sở hữu đường bờ biển dài hơn 3,000km với những bãi biển tuyệt đẹp. Và đi kèm với đó là những khách sạn, resort sang trọng với view biển đẹp mê hồn.</p>

    <h2>1. Six Senses Con Dao</h2>
    <p>Nằm trên hòn đảo hoang sơ Côn Đảo, Six Senses mang đến trải nghiệm nghỉ dưỡng xa xỉ với những villa riêng biệt, view ra biển xanh trong vắt. Mỗi villa được thiết kế theo phong cách rustic nhưng không kém phần sang trọng.</p>
    <p>Điểm nhấn: Bể bơi vô cực riêng, spa đẳng cấp thế giới, ẩm thực Việt tinh tế.</p>

    <h2>2. Amanoi Ninh Thuận</h2>
    <p>Ẩn mình trong vườn quốc gia Núi Chúa, Amanoi là viên ngọc ẩn của làng resort Việt Nam. Với kiến trúc lấy cảm hứng từ đền chùa Việt Nam, resort này mang đến sự kết hợp hoàn hảo giữa thiên nhiên và xa xỉ.</p>
    <p>Điểm nhấn: View vịnh Vĩnh Hy tuyệt đẹp, private beach, wellness retreat.</p>

    <h2>3. InterContinental Danang Sun Peninsula</h2>
    <p>Được thiết kế bởi kiến trúc sư nổi tiếng Bill Bensley, InterContinental Danang là tác phẩm nghệ thuật kiến trúc với view ra biển Đông và bán đảo Sơn Trà.</p>
    <p>Điểm nhấn: Kiến trúc độc đáo, nhà hàng đạt sao Michelin, La Maison 1888.</p>

    <h2>4. The Nam Hai Hội An</h2>
    <p>Nằm dọc bãi biển Hà My xinh đẹp, The Nam Hai mang đến không gian nghỉ dưỡng thanh bình với 100 villa sang trọng, mỗi villa đều có bể bơi riêng.</p>
    <p>Điểm nhấn: 3 bể bơi vô cực, spa Việt truyền thống, gần phố cổ Hội An.</p>

    <h2>5. Mia Resort Nha Trang</h2>
    <p>Với thiết kế boutique tinh tế và vị trí đắc địa trên bãi biển Bãi Đông, Mia Resort là lựa chọn hoàn hảo cho những ai tìm kiếm sự riêng tư và yên bình.</p>
    <p>Điểm nhấn: Bãi biển riêng, nhà hàng Sandals, spa với liệu pháp bản địa.</p>
  `,
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop',
  category: 'Du lịch',
  author: {
    name: 'Nguyễn Minh Anh',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    bio: 'Travel blogger với 10+ năm kinh nghiệm du lịch khắp thế giới'
  },
  publishedAt: '2024-01-15',
  readTime: '8 phút đọc',
  likes: 234,
  comments: 45,
};

const relatedPosts = [
  {
    id: '2',
    title: 'Bí quyết đặt phòng khách sạn giá rẻ mùa cao điểm',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
    category: 'Tips',
    readTime: '5 phút đọc',
  },
  {
    id: '3',
    title: 'Review chi tiết Vinpearl Phú Quốc - Có đáng để trải nghiệm?',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
    category: 'Review',
    readTime: '10 phút đọc',
  },
  {
    id: '4',
    title: 'Những điểm đến hoàn hảo cho kỳ nghỉ lễ 30/4',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
    category: 'Du lịch',
    readTime: '6 phút đọc',
  },
];

const BlogDetail = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Image */}
      <div className="relative h-[400px] md:h-[500px]">
        <img 
          src={blogPost.image} 
          alt={blogPost.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Link>
            <Badge className="mb-4">{blogPost.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white max-w-4xl">
              {blogPost.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={blogPost.author.avatar} />
                <AvatarFallback>{blogPost.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{blogPost.author.name}</p>
                <p className="text-xs">{blogPost.author.bio}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {blogPost.publishedAt}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {blogPost.readTime}
            </div>
          </div>

          {/* Content */}
          <article 
            className="prose prose-lg dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />

          <Separator className="my-8" />

          {/* Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant={isLiked ? "default" : "outline"} 
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {blogPost.likes + (isLiked ? 1 : 0)}
              </Button>
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                {blogPost.comments} bình luận
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">Chia sẻ:</span>
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Related Posts */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                    <CardContent className="p-4">
                      <Badge variant="outline" className="mb-2">{post.category}</Badge>
                      <h3 className="font-semibold line-clamp-2 mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">{post.readTime}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <ClientFooter />
    </div>
  );
};

export default BlogDetail;
