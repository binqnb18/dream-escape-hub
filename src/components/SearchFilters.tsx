import { useState, useEffect, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Star,
  RotateCcw,
  Wifi,
  Car,
  Waves,
  Utensils,
  Dumbbell,
  Wind,
  Tv,
  Coffee,
  Bath,
  MapPin,
  CreditCard,
  Building2,
  Hotel,
  Home,
  Castle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    popular: true,
    reviewScore: true,
    starRating: true,
    propertyType: false,
    neighborhood: false,
    payment: false,
    facilities: false,
    amenities: false,
  });
  
  const [showMoreSections, setShowMoreSections] = useState<{ [key: string]: boolean }>({});

  // Count selected filters
  const selectedCount = useMemo(() => {
    return Object.values(selectedFilters).filter(Boolean).length;
  }, [selectedFilters]);

  // Get selected filter labels for badges
  const selectedFilterLabels = useMemo(() => {
    return Object.entries(selectedFilters)
      .filter(([_, value]) => value)
      .map(([key]) => key);
  }, [selectedFilters]);

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
      
      if (key.includes("Free cancellation") || key.includes("Pay at") || key.includes("Book") || key.includes("No prepayment")) {
        paymentOptions.push(key);
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

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const toggleShowMore = (sectionKey: string) => {
    setShowMoreSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const getPropertyIcon = (label: string) => {
    if (label.includes("Hotel")) return <Hotel className="w-4 h-4" />;
    if (label.includes("Apartment")) return <Building2 className="w-4 h-4" />;
    if (label.includes("Villa")) return <Castle className="w-4 h-4" />;
    if (label.includes("Resort")) return <Waves className="w-4 h-4" />;
    return <Home className="w-4 h-4" />;
  };

  const getFacilityIcon = (label: string) => {
    if (label.includes("WiFi") || label.includes("Internet")) return <Wifi className="w-4 h-4" />;
    if (label.includes("pool") || label.includes("Pool")) return <Waves className="w-4 h-4" />;
    if (label.includes("Car") || label.includes("park")) return <Car className="w-4 h-4" />;
    if (label.includes("Gym") || label.includes("fitness")) return <Dumbbell className="w-4 h-4" />;
    if (label.includes("Restaurant")) return <Utensils className="w-4 h-4" />;
    if (label.includes("Air") || label.includes("conditioning")) return <Wind className="w-4 h-4" />;
    if (label.includes("TV")) return <Tv className="w-4 h-4" />;
    if (label.includes("Coffee")) return <Coffee className="w-4 h-4" />;
    if (label.includes("Bathtub") || label.includes("Bath")) return <Bath className="w-4 h-4" />;
    return null;
  };

  const renderStarRating = (stars: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
    );
  };

  const FilterSection = ({ 
    title, 
    sectionKey, 
    items, 
    showIcons = false,
    isStarRating = false,
    maxInitialItems = 5 
  }: { 
    title: string; 
    sectionKey: string; 
    items: { label: string; count: string }[];
    showIcons?: boolean;
    isStarRating?: boolean;
    maxInitialItems?: number;
  }) => {
    const isExpanded = expandedSections[sectionKey];
    const showMore = showMoreSections[sectionKey];
    const displayItems = showMore ? items : items.slice(0, maxInitialItems);
    const hasMore = items.length > maxInitialItems;
    
    // Count selected in this section
    const sectionSelectedCount = items.filter(item => selectedFilters[item.label]).length;

    return (
      <Collapsible open={isExpanded} onOpenChange={() => toggleSection(sectionKey)}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground text-sm">
              {title}
            </h4>
            {sectionSelectedCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs font-medium">
                {sectionSelectedCount}
              </Badge>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pt-2">
          <div className="space-y-1">
            {displayItems.map((item, itemIndex) => {
              const filterKey = item.label;
              const isChecked = selectedFilters[filterKey] || false;
              const stars = isStarRating ? parseInt(item.label) : 0;
              
              return (
                <label
                  key={itemIndex}
                  className={`flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer transition-colors ${
                    isChecked 
                      ? "bg-primary/10" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleFilterToggle(filterKey)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    {isStarRating ? (
                      renderStarRating(stars)
                    ) : showIcons ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {getFacilityIcon(item.label) || getPropertyIcon(item.label)}
                        <span className="text-sm text-foreground">{item.label}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-foreground">{item.label}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{item.count}</span>
                </label>
              );
            })}
          </div>
          
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-primary hover:text-primary hover:bg-primary/5"
              onClick={() => toggleShowMore(sectionKey)}
            >
              {showMore ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Thu gọn
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Xem thêm {items.length - maxInitialItems} mục
                </>
              )}
            </Button>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const filterSections = {
    popular: {
      title: "Bộ lọc phổ biến",
      items: [
        { label: "Free cancellation", count: "5,694" },
        { label: "Pay at the hotel", count: "3,250" },
        { label: "Breakfast included", count: "330" },
        { label: "Free WiFi", count: "6,389" },
        { label: "Swimming pool", count: "1,833" },
        { label: "Air conditioning", count: "5,116" },
      ],
    },
    reviewScore: {
      title: "Điểm đánh giá",
      items: [
        { label: "Wonderful: 9+", count: "1,081" },
        { label: "Very Good: 8+", count: "2,148" },
        { label: "Good: 7+", count: "2,675" },
        { label: "Pleasant: 6+", count: "2,867" },
      ],
    },
    starRating: {
      title: "Xếp hạng sao",
      items: [
        { label: "5 stars", count: "76" },
        { label: "4 stars", count: "1,291" },
        { label: "3 stars", count: "874" },
        { label: "2 stars", count: "144" },
        { label: "1 star", count: "47" },
      ],
    },
    propertyType: {
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
    neighborhood: {
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
    payment: {
      title: "Tùy chọn thanh toán",
      items: [
        { label: "Free cancellation", count: "5,694" },
        { label: "Pay at the hotel", count: "3,250" },
        { label: "Book now, pay later", count: "3,487" },
        { label: "Book without credit card", count: "1,985" },
        { label: "No prepayment needed", count: "3,250" },
      ],
    },
    facilities: {
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
      ],
    },
    amenities: {
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
        { label: "Coffee/tea maker", count: "672" },
      ],
    },
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-foreground text-lg">Bộ lọc</h3>
          {selectedCount > 0 && (
            <Badge className="bg-primary text-primary-foreground">
              {selectedCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetAll}
          className="text-primary hover:text-primary hover:bg-primary/5 gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt lại
        </Button>
      </div>

      {/* Selected Filters Badges */}
      {selectedFilterLabels.length > 0 && (
        <div className="p-4 border-b bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Đang lọc theo:</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedFilterLabels.slice(0, 5).map((label) => (
              <Badge
                key={label}
                variant="secondary"
                className="cursor-pointer gap-1 hover:bg-destructive/10 hover:text-destructive transition-colors text-xs"
                onClick={() => handleFilterToggle(label)}
              >
                {label.length > 15 ? label.substring(0, 15) + "..." : label}
                <X className="w-3 h-3" />
              </Badge>
            ))}
            {selectedFilterLabels.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{selectedFilterLabels.length - 5} khác
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên khách sạn..."
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
            value={textSearch}
            onChange={(e) => handleTextSearchChange(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="p-4 space-y-1">
          {/* Budget Slider */}
          <div className="pb-4 mb-2 border-b">
            <h4 className="font-semibold text-foreground text-sm mb-4">Ngân sách (mỗi đêm)</h4>
            
            <div className="px-1">
              <Slider
                value={budget}
                onValueChange={handleBudgetChange}
                min={0}
                max={4000000}
                step={100000}
                className="mb-6"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Tối thiểu</span>
                <div className="mt-1 px-3 py-2 bg-muted/50 rounded-lg text-sm font-medium">
                  ₫{budget[0].toLocaleString("vi-VN")}
                </div>
              </div>
              <div className="text-muted-foreground mt-4">—</div>
              <div className="flex-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Tối đa</span>
                <div className="mt-1 px-3 py-2 bg-muted/50 rounded-lg text-sm font-medium">
                  {budget[1] >= 4000000 ? "₫4,000,000+" : `₫${budget[1].toLocaleString("vi-VN")}`}
                </div>
              </div>
            </div>
          </div>

          {/* Filter Sections */}
          <div className="space-y-1 divide-y divide-border">
            <FilterSection 
              title={filterSections.popular.title} 
              sectionKey="popular" 
              items={filterSections.popular.items}
              showIcons
            />
            
            <FilterSection 
              title={filterSections.reviewScore.title} 
              sectionKey="reviewScore" 
              items={filterSections.reviewScore.items}
            />
            
            <FilterSection 
              title={filterSections.starRating.title} 
              sectionKey="starRating" 
              items={filterSections.starRating.items}
              isStarRating
            />
            
            <FilterSection 
              title={filterSections.propertyType.title} 
              sectionKey="propertyType" 
              items={filterSections.propertyType.items}
              showIcons
            />
            
            <FilterSection 
              title={filterSections.neighborhood.title} 
              sectionKey="neighborhood" 
              items={filterSections.neighborhood.items}
            />
            
            <FilterSection 
              title={filterSections.payment.title} 
              sectionKey="payment" 
              items={filterSections.payment.items}
            />
            
            <FilterSection 
              title={filterSections.facilities.title} 
              sectionKey="facilities" 
              items={filterSections.facilities.items}
              showIcons
            />
            
            <FilterSection 
              title={filterSections.amenities.title} 
              sectionKey="amenities" 
              items={filterSections.amenities.items}
              showIcons
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchFilters;
