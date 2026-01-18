import {
  Wifi,
  Car,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  Wine,
  Sparkles,
  Baby,
  PawPrint,
  Accessibility,
  ShieldCheck,
  Clock,
  CreditCard,
  Languages,
} from "lucide-react";

const facilityCategories = [
  {
    title: "Internet",
    icon: Wifi,
    items: ["WiFi miễn phí tất cả các khu vực", "WiFi tốc độ cao"],
  },
  {
    title: "Bãi đỗ xe",
    icon: Car,
    items: ["Đỗ xe miễn phí", "Bãi đỗ xe riêng", "Đỗ xe dành cho khách khuyết tật"],
  },
  {
    title: "Hồ bơi & Spa",
    icon: Waves,
    items: ["Hồ bơi ngoài trời", "Hồ bơi vô cực", "Spa & Wellness", "Phòng xông hơi", "Jacuzzi"],
  },
  {
    title: "Thể dục",
    icon: Dumbbell,
    items: ["Phòng tập gym", "Lớp yoga", "Sân tennis", "Thể thao dưới nước"],
  },
  {
    title: "Ăn uống",
    icon: UtensilsCrossed,
    items: ["Nhà hàng", "Quầy bar", "Phục vụ phòng 24/7", "Bữa sáng buffet", "Thực đơn ăn kiêng"],
  },
  {
    title: "Giải trí",
    icon: Wine,
    items: ["Quầy bar bãi biển", "Karaoke", "Sòng bài", "Công viên nước", "Sân golf mini"],
  },
  {
    title: "Dịch vụ",
    icon: Sparkles,
    items: ["Lễ tân 24/7", "Giặt ủi", "Dịch vụ đặt tour", "Thuê xe", "Dịch vụ đưa đón"],
  },
  {
    title: "Gia đình",
    icon: Baby,
    items: ["Khu vui chơi trẻ em", "Dịch vụ trông trẻ", "Thực đơn trẻ em", "Giường cũi", "Ghế cao"],
  },
];

const generalInfo = [
  { icon: PawPrint, text: "Không cho phép thú cưng" },
  { icon: Accessibility, text: "Phòng dành cho người khuyết tật" },
  { icon: ShieldCheck, text: "An ninh 24/7" },
  { icon: Clock, text: "Lễ tân 24 giờ" },
  { icon: CreditCard, text: "Thanh toán bằng thẻ" },
  { icon: Languages, text: "Nhân viên nói tiếng Anh" },
];

const HotelFacilities = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Cơ sở vật chất</h2>

      {/* Facility Categories */}
      <div className="grid md:grid-cols-2 gap-6">
        {facilityCategories.map((category, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center gap-2">
              <category.icon className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{category.title}</h3>
            </div>
            <ul className="space-y-2 pl-7">
              {category.items.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* General Info */}
      <div className="bg-muted/30 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Thông tin chung</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {generalInfo.map((info, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <info.icon className="h-4 w-4 text-primary" />
              <span>{info.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelFacilities;
