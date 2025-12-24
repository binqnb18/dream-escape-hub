import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Thời gian nhận phòng và trả phòng là mấy giờ?",
    answer:
      "Thời gian nhận phòng (check-in) từ 14:00 và trả phòng (check-out) trước 12:00. Nếu bạn cần nhận phòng sớm hoặc trả phòng muộn, vui lòng liên hệ trực tiếp với khách sạn để được hỗ trợ (có thể phát sinh phí phụ thu).",
  },
  {
    question: "Khách sạn có bãi đỗ xe không?",
    answer:
      "Có, khách sạn có bãi đỗ xe miễn phí cho khách lưu trú. Bãi đỗ xe có camera giám sát 24/7 và bảo vệ trực.",
  },
  {
    question: "Có được mang thú cưng vào khách sạn không?",
    answer:
      "Rất tiếc, khách sạn không cho phép mang thú cưng. Tuy nhiên, một số loại phòng đặc biệt có thể cho phép thú cưng nhỏ với phí phụ thu. Vui lòng liên hệ trước để xác nhận.",
  },
  {
    question: "Khách sạn có hỗ trợ đưa đón sân bay không?",
    answer:
      "Có, khách sạn cung cấp dịch vụ đưa đón sân bay với phí phụ thu. Vui lòng đặt trước ít nhất 24 giờ để đảm bảo có xe phục vụ.",
  },
  {
    question: "Chính sách hủy phòng như thế nào?",
    answer:
      "Chính sách hủy phòng tùy thuộc vào loại phòng và gói dịch vụ bạn đặt. Thông thường, hủy miễn phí trước 48 giờ so với ngày nhận phòng. Hủy sau thời gian này có thể bị tính phí 1 đêm đầu tiên.",
  },
  {
    question: "Khách sạn có bể bơi không?",
    answer:
      "Có, khách sạn có bể bơi ngoài trời và bể bơi vô cực hướng biển. Bể bơi mở cửa từ 6:00 đến 21:00 hàng ngày. Khăn tắm được cung cấp miễn phí tại bể bơi.",
  },
  {
    question: "WiFi có miễn phí không?",
    answer:
      "Có, WiFi tốc độ cao được cung cấp miễn phí trong toàn bộ khuôn viên khách sạn, bao gồm tất cả các phòng và khu vực công cộng.",
  },
  {
    question: "Có thể thanh toán bằng những hình thức nào?",
    answer:
      "Khách sạn chấp nhận thanh toán bằng tiền mặt (VND), thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB, American Express), chuyển khoản ngân hàng và các ví điện tử phổ biến (MoMo, ZaloPay, VNPay).",
  },
];

const HotelFAQ = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Câu hỏi thường gặp</h2>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left hover:text-primary">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default HotelFAQ;
