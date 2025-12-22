import hcmImg from "@/assets/destination-hcm.jpg";
import hanoiImg from "@/assets/destination-hanoi.jpg";
import danangImg from "@/assets/destination-danang.jpg";
import phuquocImg from "@/assets/destination-phuquoc.jpg";
import nhatrangImg from "@/assets/destination-nhatrang.jpg";
import dalatImg from "@/assets/destination-dalat.jpg";
import DestinationCard from "./DestinationCard";

const PopularDestinations = () => {
  return (
    <section className="w-full px-4 md:px-6 lg:px-12 py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8">
        Điểm đến được yêu thích
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {/* HCM - Full height */}
        <div className="h-[350px] md:h-[420px]">
          <DestinationCard image={hcmImg} name="TP.HCM" />
        </div>
        
        {/* Hanoi & Danang */}
        <div className="flex flex-col gap-4 md:gap-5 h-[350px] md:h-[420px]">
          <div className="h-2/3">
            <DestinationCard image={hanoiImg} name="Hà Nội" />
          </div>
          <div className="h-1/3">
            <DestinationCard image={danangImg} name="Đà Nẵng" size="small" />
          </div>
        </div>

        {/* Phu Quoc - Full height */}
        <div className="h-[350px] md:h-[420px]">
          <DestinationCard image={phuquocImg} name="Phú Quốc" />
        </div>

        {/* Nha Trang & Da Lat */}
        <div className="flex flex-col gap-4 md:gap-5 h-[350px] md:h-[420px]">
          <div className="h-1/3">
            <DestinationCard image={nhatrangImg} name="Nha Trang" size="small" />
          </div>
          <div className="h-2/3">
            <DestinationCard image={dalatImg} name="Đà Lạt" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
