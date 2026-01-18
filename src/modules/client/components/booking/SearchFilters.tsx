import { useState, useEffect, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Star,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import type { SearchFilters as SearchFiltersType } from "@/types/search";
import { defaultFilters } from "@/types/search";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
}

const SearchFilters = ({ filters, onFiltersChange }: SearchFiltersProps) => {
  const [budget, setBudget] = useState(filters.budget);
  const [minBudget, setMinBudget] = useState(budget[0].toString());
  const [maxBudget, setMaxBudget] = useState(budget[1].toString());
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
  
  const [showMoreSections, setShowMoreSections] = useState<{ [key: string]: boolean }>({});

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
      textSearch: "",
      popularFilters,
      reviewScore,
      starRating,
      propertyType,
      neighborhood,
      paymentOptions,
      propertyFacilities,
      roomAmenities,
    });
  }, [budget, selectedFilters, onFiltersChange]);

  const handleBudgetChange = (newBudget: number[]) => {
    setBudget([newBudget[0], newBudget[1]]);
    setMinBudget(newBudget[0].toString());
    setMaxBudget(newBudget[1].toString());
  };

  const handleMinBudgetChange = (value: string) => {
    setMinBudget(value);
    const num = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    if (num <= budget[1]) {
      setBudget([num, budget[1]]);
    }
  };

  const handleMaxBudgetChange = (value: string) => {
    setMaxBudget(value);
    const num = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    if (num >= budget[0]) {
      setBudget([budget[0], num]);
    }
  };

  const handleFilterToggle = (filterKey: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const toggleShowMore = (sectionKey: string) => {
    setShowMoreSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
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
    isStarRating = false,
    maxInitialItems = 10 
  }: { 
    title: string; 
    sectionKey: string; 
    items: { label: string; count?: string }[];
    isStarRating?: boolean;
    maxInitialItems?: number;
  }) => {
    const showMore = showMoreSections[sectionKey];
    const displayItems = showMore ? items : items.slice(0, maxInitialItems);
    const hasMore = items.length > maxInitialItems;

    return (
      <div className="py-4 border-b border-border last:border-b-0">
        <h4 className="font-bold text-foreground text-sm mb-3">
          {title}
        </h4>
        
        <div className="space-y-2">
          {displayItems.map((item, itemIndex) => {
            const filterKey = item.label;
            const isChecked = selectedFilters[filterKey] || false;
            const stars = isStarRating ? parseInt(item.label) : 0;
            
            return (
              <label
                key={itemIndex}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => handleFilterToggle(filterKey)}
                  className="rounded border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                {isStarRating ? (
                  renderStarRating(stars)
                ) : (
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                )}
              </label>
            );
          })}
        </div>
        
        {hasMore && (
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto mt-2 text-primary font-normal"
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
                Xem thêm
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  const filterSections = {
    yourFilters: {
      title: "Your filters",
      items: [
        { label: "Free cancellation" },
        { label: "Air conditioning" },
      ],
    },
    popular: {
      title: "Popular filters for Ho Chi Minh City",
      items: [
        { label: "Book without credit card" },
        { label: "Free cancellation" },
        { label: "Pay now" },
        { label: "Pay at the hotel" },
        { label: "Refrigerator" },
        { label: "Air conditioning" },
        { label: "Guest rating: 6+ Good" },
        { label: "Location: 7+ Very good" },
        { label: "Breakfast included" },
        { label: "Swimming pool" },
        { label: "Free WiFi" },
        { label: "Spa" },
      ],
    },
    reviewScore: {
      title: "Guest rating",
      items: [
        { label: "Wonderful: 9+" },
        { label: "Very Good: 8+" },
        { label: "Good: 7+" },
        { label: "Pleasant: 6+" },
      ],
    },
    starRating: {
      title: "Star rating",
      items: [
        { label: "5 stars" },
        { label: "4 stars" },
        { label: "3 stars" },
        { label: "2 stars" },
        { label: "1 star" },
      ],
    },
    propertyType: {
      title: "Property type",
      items: [
        { label: "Hotels" },
        { label: "Apartments" },
        { label: "Homestays" },
        { label: "Serviced apartment" },
        { label: "Guesthouse/B&B" },
        { label: "Hostel" },
        { label: "Villa" },
        { label: "Resort" },
      ],
    },
    payment: {
      title: "Payment options",
      items: [
        { label: "Free cancellation" },
        { label: "Pay at the hotel" },
        { label: "Book now, pay later" },
        { label: "Book without credit card" },
        { label: "No prepayment needed" },
      ],
    },
    facilities: {
      title: "Property facilities",
      items: [
        { label: "Swimming pool" },
        { label: "Internet" },
        { label: "Car park" },
        { label: "Airport transfer" },
        { label: "Gym/fitness" },
        { label: "Front desk [24-hour]" },
        { label: "Family/child friendly" },
        { label: "Non-smoking" },
        { label: "Spa/sauna" },
        { label: "Restaurants" },
      ],
    },
    amenities: {
      title: "Room amenities",
      items: [
        { label: "Air conditioning" },
        { label: "TV" },
        { label: "Washing machine" },
        { label: "Ironing facilities" },
        { label: "Refrigerator" },
        { label: "Balcony/terrace" },
        { label: "Internet access" },
        { label: "Bathtub" },
        { label: "Kitchen" },
        { label: "Coffee/tea maker" },
      ],
    },
  };

  return (
    <div className="bg-card">
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="pr-4">
          {/* Budget Section */}
          <div className="py-4 border-b border-border">
            <h4 className="font-bold text-foreground text-sm mb-4">
              Your budget (per night)
            </h4>
            
            <div className="px-1 mb-4">
              <Slider
                value={budget}
                onValueChange={handleBudgetChange}
                min={0}
                max={120000000}
                step={100000}
                className="mb-4"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <span className="text-xs text-muted-foreground font-medium uppercase">MIN</span>
                <div className="flex items-center border rounded mt-1">
                  <span className="px-2 text-sm text-muted-foreground">₫</span>
                  <Input
                    type="text"
                    value={parseInt(minBudget).toLocaleString('vi-VN')}
                    onChange={(e) => handleMinBudgetChange(e.target.value)}
                    className="border-0 h-8 px-1 text-sm focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="text-muted-foreground mt-4">- - - -</div>
              <div className="flex-1">
                <span className="text-xs text-muted-foreground font-medium uppercase">MAX</span>
                <div className="flex items-center border rounded mt-1">
                  <span className="px-2 text-sm text-muted-foreground">₫</span>
                  <Input
                    type="text"
                    value={parseInt(maxBudget).toLocaleString('vi-VN')}
                    onChange={(e) => handleMaxBudgetChange(e.target.value)}
                    className="border-0 h-8 px-1 text-sm focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Your Filters */}
          <FilterSection 
            title={filterSections.yourFilters.title} 
            sectionKey="yourFilters" 
            items={filterSections.yourFilters.items}
          />

          {/* Popular Filters */}
          <FilterSection 
            title={filterSections.popular.title} 
            sectionKey="popular" 
            items={filterSections.popular.items}
          />
          
          {/* Guest Rating */}
          <FilterSection 
            title={filterSections.reviewScore.title} 
            sectionKey="reviewScore" 
            items={filterSections.reviewScore.items}
          />
          
          {/* Star Rating */}
          <FilterSection 
            title={filterSections.starRating.title} 
            sectionKey="starRating" 
            items={filterSections.starRating.items}
            isStarRating
          />
          
          {/* Property Type */}
          <FilterSection 
            title={filterSections.propertyType.title} 
            sectionKey="propertyType" 
            items={filterSections.propertyType.items}
          />
          
          {/* Payment Options */}
          <FilterSection 
            title={filterSections.payment.title} 
            sectionKey="payment" 
            items={filterSections.payment.items}
          />
          
          {/* Property Facilities */}
          <FilterSection 
            title={filterSections.facilities.title} 
            sectionKey="facilities" 
            items={filterSections.facilities.items}
          />
          
          {/* Room Amenities */}
          <FilterSection 
            title={filterSections.amenities.title} 
            sectionKey="amenities" 
            items={filterSections.amenities.items}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchFilters;
