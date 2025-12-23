import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SearchFilters as SearchFiltersType } from "@/types/search";
import { defaultFilters } from "@/types/search";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
}

const SearchFilters = ({ filters, onFiltersChange }: SearchFiltersProps) => {
  const [budget, setBudget] = useState(filters.budget);
  const [textSearch, setTextSearch] = useState(filters.textSearch);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: boolean;
  }>(() => {
    const initial: { [key: string]: boolean } = {};
    [
      ...filters.popularFilters,
      ...filters.reviewScore,
      ...filters.starRating,
      ...filters.propertyType,
      ...filters.neighborhood,
      ...filters.paymentOptions,
      ...filters.propertyFacilities,
      ...filters.roomAmenities,
    ].forEach((filter) => {
      initial[filter] = true;
    });
    return initial;
  });

  useEffect(() => {
    const popularFilters: string[] = [];
    const reviewScore: string[] = [];
    const starRating: string[] = [];
    const propertyType: string[] = [];
    const neighborhood: string[] = [];
    const paymentOptions: string[] = [];
    const propertyFacilities: string[] = [];
    const roomAmenities: string[] = [];

    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (!value) return;
      
      if (key.includes("Free cancellation") || key.includes("Pay at") || key.includes("Book")) {
        if (key.includes("Free cancellation") && !paymentOptions.includes(key)) {
          popularFilters.push(key);
          paymentOptions.push(key);
        } else if (!paymentOptions.includes(key)) {
          paymentOptions.push(key);
        }
      } else if (key.includes("stars") || key.includes("star")) {
        starRating.push(key);
      } else if (key.includes("Wonderful") || key.includes("Very Good") || key.includes("Good") || key.includes("Pleasant")) {
        reviewScore.push(key);
      } else if (["Hotels", "Apartments", "Homestays", "Serviced apartment", "Guesthouse", "Hostel", "Villa", "Resort"].some(t => key.includes(t))) {
        propertyType.push(key);
      } else if (["Quận", "Old Quarter", "Ba Đình", "Phú Mỹ", "Thảo Điền", "Phạm Ngũ"].some(n => key.includes(n))) {
        neighborhood.push(key);
      } else if (["Swimming pool", "Internet", "Car park", "Airport", "Gym", "Front desk", "Family", "Non-smoking", "Spa", "Restaurants", "Smoking", "Pets allowed"].some(f => key.includes(f))) {
        propertyFacilities.push(key);
      } else if (["Air conditioning", "TV", "Washing", "Ironing", "Refrigerator", "Balcony", "Internet access", "Bathtub", "Kitchen", "Heating", "Coffee", "Private pool"].some(a => key.includes(a))) {
        roomAmenities.push(key);
      } else {
        popularFilters.push(key);
      }
    });

    onFiltersChange({
      budget,
      textSearch,
      popularFilters,
      reviewScore,
      starRating,
      propertyType,
      neighborhood,
      paymentOptions,
      propertyFacilities,
      roomAmenities,
    });
  }, [budget, textSearch, selectedFilters, onFiltersChange]);

  const handleBudgetChange = (newBudget: number[]) => {
    setBudget([newBudget[0], newBudget[1]]);
  };

  const handleTextSearchChange = (value: string) => {
    setTextSearch(value);
  };

  const handleFilterToggle = (filterKey: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const handleResetAll = () => {
    setBudget(defaultFilters.budget);
    setTextSearch(defaultFilters.textSearch);
    setSelectedFilters({});
    onFiltersChange(defaultFilters);
  };

  const filterSections = [
    {
      title: "BỘ LỌC PHỔ BIẾN",
      items: [
        { label: "Free cancellation", count: "5,694" },
        { label: "Pay at the hotel", count: "3,250" },
        { label: "5 stars", count: "76" },
        { label: "Wonderful: 9+", count: "1,081" },
        { label: "Free WiFi", count: "6,389" },
        { label: "Swimming pool", count: "1,833" },
        { label: "Breakfast included", count: "330" },
        { label: "Air conditioning", count: "5,116" },
      ],
    },
    {
      title: "Điểm đánh giá",
      items: [
        { label: "Wonderful: 9+", count: "1,081" },
        { label: "Very Good: 8+", count: "2,148" },
        { label: "Good: 7+", count: "2,675" },
        { label: "Pleasant: 6+", count: "2,867" },
      ],
    },
    {
      title: "Xếp hạng sao",
      items: [
        { label: "5 stars", count: "76" },
        { label: "4 stars", count: "1,291" },
        { label: "3 stars", count: "874" },
        { label: "2 stars", count: "144" },
        { label: "1 star", count: "47" },
      ],
    },
    {
      title: "Loại chỗ nghỉ",
      items: [
        { label: "Hotels", count: "3,323" },
        { label: "Apartments", count: "3,409" },
        { label: "Homestays", count: "146" },
        { label: "Serviced apartment", count: "476" },
        { label: "Guesthouse/B&B", count: "145" },
        { label: "Hostel", count: "57" },
        { label: "Villa", count: "76" },
        { label: "Resort", count: "11" },
      ],
    },
    {
      title: "Khu vực",
      items: [
        { label: "Quận 1", count: "887" },
        { label: "Old Quarter (Hà Nội)", count: "720" },
        { label: "Quận 7", count: "512" },
        { label: "Ba Đình (Hà Nội)", count: "398" },
        { label: "Phú Mỹ Hưng", count: "280" },
        { label: "Thảo Điền", count: "195" },
        { label: "Phạm Ngũ Lão", count: "312" },
      ],
    },
    {
      title: "Tùy chọn thanh toán",
      items: [
        { label: "Free cancellation", count: "5,694" },
        { label: "Pay at the hotel", count: "3,250" },
        { label: "Book now, pay later", count: "3,487" },
        { label: "Book without credit card", count: "1,985" },
        { label: "No prepayment needed", count: "3,250" },
      ],
    },
    {
      title: "Tiện nghi chỗ nghỉ",
      items: [
        { label: "Swimming pool", count: "1,833" },
        { label: "Internet", count: "6,389" },
        { label: "Car park", count: "3,422" },
        { label: "Airport transfer", count: "1,374" },
        { label: "Gym/fitness", count: "1,745" },
        { label: "Front desk [24-hour]", count: "2,291" },
        { label: "Family/child friendly", count: "2,425" },
        { label: "Non-smoking", count: "2,130" },
        { label: "Spa/sauna", count: "463" },
        { label: "Restaurants", count: "1,111" },
        { label: "Smoking area", count: "2,247" },
        { label: "Pets allowed", count: "952" },
      ],
    },
    {
      title: "Tiện nghi phòng",
      items: [
        { label: "Air conditioning", count: "5,116" },
        { label: "TV", count: "4,836" },
        { label: "Washing machine", count: "3,449" },
        { label: "Ironing facilities", count: "2,564" },
        { label: "Refrigerator", count: "2,186" },
        { label: "Balcony/terrace", count: "1,997" },
        { label: "Internet access", count: "1,543" },
        { label: "Bathtub", count: "983" },
        { label: "Kitchen", count: "793" },
        { label: "Heating", count: "673" },
        { label: "Coffee/tea maker", count: "672" },
        { label: "Private pool", count: "462" },
      ],
    },
  ];

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Bộ lọc</h3>
        <button
          onClick={handleResetAll}
          className="text-sm text-primary hover:underline"
        >
          Đặt lại tất cả
        </button>
      </div>

      {/* Text Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên khách sạn..."
          className="pl-9"
          value={textSearch}
          onChange={(e) => handleTextSearchChange(e.target.value)}
        />
      </div>

      {/* Quick applied filter */}
      {selectedFilters["Air conditioning"] && (
        <div className="mb-4 flex items-center gap-2">
          <Badge
            variant="secondary"
            className="cursor-pointer gap-1"
            onClick={() => handleFilterToggle("Air conditioning")}
          >
            Điều hòa không khí
            <X className="w-3 h-3" />
          </Badge>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-6 pr-4">
          {/* Budget Slider */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Ngân sách (mỗi đêm)</h4>
            <Slider
              value={budget}
              onValueChange={handleBudgetChange}
              min={0}
              max={4000000}
              step={100000}
              className="mt-2"
            />
            <div className="flex items-center justify-between text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">TỐI THIỂU</span>
                <Input
                  value={budget[0].toLocaleString("vi-VN")}
                  className="mt-1 w-28"
                  readOnly
                />
              </div>
              <div className="space-y-1 text-right">
                <span className="text-muted-foreground text-xs">TỐI ĐA</span>
                <Input
                  value={budget[1] >= 4000000 ? "4,000,000+" : budget[1].toLocaleString("vi-VN")}
                  className="mt-1 w-28"
                  readOnly
                />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Filter Sections */}
          {filterSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3">
              <h4 className="font-medium text-foreground text-sm uppercase tracking-wide">
                {section.title}
              </h4>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => {
                  const filterKey = item.label;
                  const isChecked = selectedFilters[filterKey] || false;
                  return (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`${sectionIndex}-${itemIndex}`}
                          checked={isChecked}
                          onCheckedChange={() => handleFilterToggle(filterKey)}
                        />
                        <Label
                          htmlFor={`${sectionIndex}-${itemIndex}`}
                          className="text-sm cursor-pointer text-foreground"
                        >
                          {item.label}
                        </Label>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.count}</span>
                    </div>
                  );
                })}
              </div>
              {sectionIndex < filterSections.length - 1 && (
                <hr className="border-border mt-4" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchFilters;
