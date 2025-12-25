import html2pdf from "html2pdf.js";

interface ExportOptions {
  filename: string;
  margin?: number;
  format?: "a4" | "letter";
  orientation?: "portrait" | "landscape";
}

export const exportToPdf = async (
  element: HTMLElement | string,
  options: ExportOptions
): Promise<void> => {
  const {
    filename,
    margin = 10,
    format = "a4",
    orientation = "portrait",
  } = options;

  const opt = {
    margin,
    filename: `${filename}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format,
      orientation,
    },
  };

  try {
    if (typeof element === "string") {
      // Create temporary element from HTML string
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = element;
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);
      
      await html2pdf().set(opt).from(tempDiv).save();
      document.body.removeChild(tempDiv);
    } else {
      await html2pdf().set(opt).from(element).save();
    }
  } catch (error) {
    console.error("PDF export failed:", error);
    throw new Error("Không thể xuất PDF. Vui lòng thử lại.");
  }
};

// Generate Invoice HTML template
export const generateInvoiceHtml = (data: {
  invoiceId: string;
  hotelName: string;
  hotelAddress: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  roomName: string;
  roomCount: number;
  nights: number;
  roomPrice: number;
  serviceFee: number;
  tax: number;
  discount: number;
  totalPrice: number;
  paymentMethod: string;
  createdAt: string;
}): string => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #1a365d; padding-bottom: 20px;">
        <div>
          <h1 style="color: #1a365d; margin: 0; font-size: 28px;">VNTravel</h1>
          <p style="color: #718096; margin: 5px 0 0 0; font-size: 14px;">Đặt phòng khách sạn trực tuyến</p>
        </div>
        <div style="text-align: right;">
          <h2 style="color: #1a365d; margin: 0; font-size: 24px;">HÓA ĐƠN</h2>
          <p style="color: #718096; margin: 5px 0 0 0; font-size: 14px;">${data.invoiceId}</p>
          <p style="color: #718096; margin: 5px 0 0 0; font-size: 12px;">Ngày: ${data.createdAt}</p>
        </div>
      </div>

      <!-- Hotel & Guest Info -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div style="flex: 1;">
          <h3 style="color: #1a365d; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">Khách sạn</h3>
          <p style="margin: 0; font-weight: 600;">${data.hotelName}</p>
          <p style="margin: 5px 0; color: #718096; font-size: 14px;">${data.hotelAddress}</p>
        </div>
        <div style="flex: 1; text-align: right;">
          <h3 style="color: #1a365d; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">Khách hàng</h3>
          <p style="margin: 0; font-weight: 600;">${data.guestName}</p>
          <p style="margin: 5px 0; color: #718096; font-size: 14px;">${data.guestEmail}</p>
          <p style="margin: 5px 0; color: #718096; font-size: 14px;">${data.guestPhone}</p>
        </div>
      </div>

      <!-- Booking Details -->
      <div style="background: #f7fafc; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h3 style="color: #1a365d; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase;">Chi tiết đặt phòng</h3>
        <div style="display: flex; gap: 40px;">
          <div>
            <p style="margin: 0; color: #718096; font-size: 12px;">Nhận phòng</p>
            <p style="margin: 5px 0 0 0; font-weight: 600;">${data.checkIn}</p>
          </div>
          <div>
            <p style="margin: 0; color: #718096; font-size: 12px;">Trả phòng</p>
            <p style="margin: 5px 0 0 0; font-weight: 600;">${data.checkOut}</p>
          </div>
          <div>
            <p style="margin: 0; color: #718096; font-size: 12px;">Số đêm</p>
            <p style="margin: 5px 0 0 0; font-weight: 600;">${data.nights} đêm</p>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background: #1a365d; color: white;">
            <th style="text-align: left; padding: 12px; font-size: 14px;">Mô tả</th>
            <th style="text-align: center; padding: 12px; font-size: 14px;">Số lượng</th>
            <th style="text-align: right; padding: 12px; font-size: 14px;">Đơn giá</th>
            <th style="text-align: right; padding: 12px; font-size: 14px;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-size: 14px;">${data.roomName}</td>
            <td style="padding: 12px; text-align: center; font-size: 14px;">${data.roomCount} phòng × ${data.nights} đêm</td>
            <td style="padding: 12px; text-align: right; font-size: 14px;">${formatPrice(data.roomPrice)}</td>
            <td style="padding: 12px; text-align: right; font-size: 14px;">${formatPrice(data.roomPrice * data.roomCount * data.nights)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div style="width: 300px; margin-left: auto;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
          <span style="color: #718096; font-size: 14px;">Tạm tính</span>
          <span style="font-size: 14px;">${formatPrice(data.roomPrice * data.roomCount * data.nights)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
          <span style="color: #718096; font-size: 14px;">Phí dịch vụ</span>
          <span style="font-size: 14px;">${formatPrice(data.serviceFee)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
          <span style="color: #718096; font-size: 14px;">Thuế VAT (10%)</span>
          <span style="font-size: 14px;">${formatPrice(data.tax)}</span>
        </div>
        ${data.discount > 0 ? `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
          <span style="color: #22c55e; font-size: 14px;">Giảm giá</span>
          <span style="color: #22c55e; font-size: 14px;">-${formatPrice(data.discount)}</span>
        </div>
        ` : ""}
        <div style="display: flex; justify-content: space-between; padding: 12px 0; margin-top: 8px;">
          <span style="font-weight: 600; font-size: 16px;">Tổng cộng</span>
          <span style="font-weight: 700; font-size: 18px; color: #1a365d;">${formatPrice(data.totalPrice)}</span>
        </div>
      </div>

      <!-- Payment Info -->
      <div style="margin-top: 30px; padding: 15px; background: #f0fdf4; border-radius: 8px; border: 1px solid #22c55e;">
        <p style="margin: 0; color: #22c55e; font-weight: 600; font-size: 14px;">✓ Đã thanh toán</p>
        <p style="margin: 5px 0 0 0; color: #718096; font-size: 13px;">Phương thức: ${data.paymentMethod}</p>
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; text-align: center; color: #718096; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        <p style="margin: 0;">Cảm ơn bạn đã đặt phòng qua VNTravel</p>
        <p style="margin: 5px 0 0 0;">Hotline: 1900 1234 | Email: support@vntravel.vn</p>
      </div>
    </div>
  `;
};

// Generate Wishlist HTML template
export const generateWishlistHtml = (data: {
  userName: string;
  exportDate: string;
  hotels: Array<{
    name: string;
    location: string;
    rating: number;
    priceFrom: number;
    savedAt: string;
  }>;
}): string => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);

  const hotelRows = data.hotels
    .map(
      (hotel, index) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; font-size: 14px;">${index + 1}</td>
        <td style="padding: 12px; font-size: 14px;">
          <strong>${hotel.name}</strong><br/>
          <span style="color: #718096; font-size: 12px;">${hotel.location}</span>
        </td>
        <td style="padding: 12px; text-align: center; font-size: 14px;">⭐ ${hotel.rating}</td>
        <td style="padding: 12px; text-align: right; font-size: 14px; color: #1a365d; font-weight: 600;">${formatPrice(hotel.priceFrom)}</td>
        <td style="padding: 12px; text-align: right; font-size: 12px; color: #718096;">${hotel.savedAt}</td>
      </tr>
    `
    )
    .join("");

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1a365d; padding-bottom: 20px;">
        <h1 style="color: #1a365d; margin: 0; font-size: 28px;">VNTravel</h1>
        <h2 style="color: #718096; margin: 10px 0 0 0; font-size: 18px;">Danh sách khách sạn yêu thích</h2>
      </div>

      <!-- Info -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px; background: #f7fafc; padding: 15px; border-radius: 8px;">
        <div>
          <p style="margin: 0; color: #718096; font-size: 12px;">Người dùng</p>
          <p style="margin: 5px 0 0 0; font-weight: 600;">${data.userName}</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; color: #718096; font-size: 12px;">Ngày xuất</p>
          <p style="margin: 5px 0 0 0; font-weight: 600;">${data.exportDate}</p>
        </div>
      </div>

      <!-- Hotels Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background: #1a365d; color: white;">
            <th style="text-align: left; padding: 12px; font-size: 14px; width: 40px;">#</th>
            <th style="text-align: left; padding: 12px; font-size: 14px;">Khách sạn</th>
            <th style="text-align: center; padding: 12px; font-size: 14px; width: 80px;">Đánh giá</th>
            <th style="text-align: right; padding: 12px; font-size: 14px; width: 120px;">Giá từ</th>
            <th style="text-align: right; padding: 12px; font-size: 14px; width: 100px;">Ngày lưu</th>
          </tr>
        </thead>
        <tbody>
          ${hotelRows}
        </tbody>
      </table>

      <!-- Summary -->
      <div style="background: #f0fdf4; border-radius: 8px; padding: 15px; text-align: center;">
        <p style="margin: 0; color: #22c55e; font-weight: 600;">
          Tổng cộng: ${data.hotels.length} khách sạn yêu thích
        </p>
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; text-align: center; color: #718096; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        <p style="margin: 0;">Xuất từ VNTravel - vntravel.vn</p>
      </div>
    </div>
  `;
};
