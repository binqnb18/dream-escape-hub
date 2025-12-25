import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import ClientFooter from '../components/ClientFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Upload, X, Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ratingCriteria = [
  { id: 'location', label: 'Vị trí' },
  { id: 'cleanliness', label: 'Sạch sẽ' },
  { id: 'service', label: 'Dịch vụ' },
  { id: 'facilities', label: 'Tiện nghi' },
  { id: 'value', label: 'Giá trị' },
];

const WriteReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hoverRatings, setHoverRatings] = useState<Record<string, number>>({});
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock booking data
  const booking = {
    id: bookingId,
    hotelName: 'Vinpearl Resort & Spa Nha Trang',
    hotelImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    roomType: 'Deluxe Ocean View',
  };

  const overallRating = Object.values(ratings).length > 0 
    ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1)
    : '0.0';

  const handleRating = (criteriaId: string, value: number) => {
    setRatings(prev => ({ ...prev, [criteriaId]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(ratings).length < ratingCriteria.length) {
      toast({ title: 'Vui lòng đánh giá tất cả tiêu chí', variant: 'destructive' });
      return;
    }

    if (!review.trim()) {
      toast({ title: 'Vui lòng nhập nội dung đánh giá', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({ 
      title: 'Đánh giá đã được gửi!', 
      description: 'Cảm ơn bạn đã chia sẻ trải nghiệm.' 
    });
    
    navigate('/my-bookings');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/my-bookings" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Quay lại đặt phòng của tôi
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Viết đánh giá</h1>
          <p className="text-muted-foreground mb-8">Chia sẻ trải nghiệm của bạn để giúp đỡ du khách khác</p>

          {/* Hotel Info */}
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img 
                  src={booking.hotelImage} 
                  alt={booking.hotelName}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{booking.hotelName}</h3>
                  <p className="text-muted-foreground">{booking.roomType}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.checkIn} - {booking.checkOut}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating Criteria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Đánh giá theo tiêu chí</span>
                  <span className="text-2xl text-primary">{overallRating}/5</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ratingCriteria.map((criteria) => (
                  <div key={criteria.id} className="flex items-center justify-between">
                    <span className="font-medium">{criteria.label}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRating(criteria.id, star)}
                          onMouseEnter={() => setHoverRatings(prev => ({ ...prev, [criteria.id]: star }))}
                          onMouseLeave={() => setHoverRatings(prev => ({ ...prev, [criteria.id]: 0 }))}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`h-6 w-6 ${
                              star <= (hoverRatings[criteria.id] || ratings[criteria.id] || 0)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Review Content */}
            <Card>
              <CardHeader>
                <CardTitle>Nội dung đánh giá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề đánh giá</Label>
                  <Input
                    id="title"
                    placeholder="Tóm tắt trải nghiệm của bạn"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="review">Chi tiết đánh giá *</Label>
                  <Textarea
                    id="review"
                    placeholder="Chia sẻ trải nghiệm chi tiết của bạn..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pros" className="text-green-600">Điểm tốt</Label>
                    <Textarea
                      id="pros"
                      placeholder="Điều bạn thích..."
                      value={pros}
                      onChange={(e) => setPros(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cons" className="text-red-600">Điểm cần cải thiện</Label>
                    <Textarea
                      id="cons"
                      placeholder="Điều có thể cải thiện..."
                      value={cons}
                      onChange={(e) => setCons(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Thêm hình ảnh (tối đa 5 ảnh)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt="" className="w-24 h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="w-24 h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Anonymous Option */}
            <Card>
              <CardContent className="pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div 
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      isAnonymous ? 'bg-primary border-primary' : 'border-muted-foreground'
                    }`}
                    onClick={() => setIsAnonymous(!isAnonymous)}
                  >
                    {isAnonymous && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <span>Đánh giá ẩn danh (tên sẽ hiển thị là "Khách hàng")</span>
                </label>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/my-bookings')}
              >
                Hủy
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <ClientFooter />
    </div>
  );
};

export default WriteReview;
