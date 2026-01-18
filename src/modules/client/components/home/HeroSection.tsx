import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Calendar, Users, ChevronDown, Minus, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-hotel.jpg";

interface LocationSuggestion {
  name: string;
  hotelCount: number;
}

const ALL_SUGGESTIONS: LocationSuggestion[] = [
  { name: "TP.HCM", hotelCount: 3245 },
  { name: "Đà Nẵng", hotelCount: 1892 },
  { name: "Hà Nội", hotelCount: 2156 },
  { name: "Phú Quốc", hotelCount: 456 },
];

interface GuestData {
  rooms: number;
  adults: number;
  children: number;
}

const HeroSection = () => {
  const navigate = useNavigate();
  const [locationInput, setLocationInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [guestData, setGuestData] = useState<GuestData>({
    rooms: 1,
    adults: 2,
    children: 0,
  });
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return { date: "", day: "" };
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      date: `${date.getDate()} ${months[date.getMonth()]}`,
      day: "",
    };
  };

  const suggestions = useMemo(() => {
    if (locationInput.trim() === "") {
      return ALL_SUGGESTIONS;
    }
    return ALL_SUGGESTIONS.filter((suggestion) =>
      suggestion.name.toLowerCase().includes(locationInput.toLowerCase())
    );
  }, [locationInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
      }
    }, 200);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setLocationInput(suggestion.name);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    navigate("/search");
  };

  const updateGuestData = (field: keyof GuestData, delta: number) => {
    setGuestData((prev) => {
      const newValue = Math.max(0, prev[field] + delta);
      
      if (field === "rooms") {
        return { ...prev, rooms: Math.max(1, Math.min(9, newValue)) };
      }
      if (field === "adults") {
        return { ...prev, adults: Math.max(1, Math.min(30, newValue)) };
      }
      if (field === "children") {
        return { ...prev, children: Math.max(0, Math.min(10, newValue)) };
      }
      return prev;
    });
  };

  const getTotalGuests = () => {
    return guestData.adults + guestData.children;
  };

  return (
    <section className="relative w-full px-4 md:px-6 lg:px-12 py-8 md:py-12">
      <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
        <img
          src={heroImage}
          alt="Luxury hotel room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 to-foreground/20" />
        
        {/* Text Content */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full px-4 z-10">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-4 drop-shadow-lg">
              Đặt phòng khách sạn cùng VBOOKING
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-primary-foreground/95 drop-shadow-md max-w-2xl">
              Hàng nghìn phòng nghỉ tại Việt Nam & quốc tế đang chờ bạn khám phá.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative -mt-20 md:-mt-28 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-20">
        <div className="bg-card rounded-xl shadow-elevated overflow-hidden border border-border">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Location Input */}
              <div className="flex-[2] relative">
                <label className="block text-xs font-semibold text-foreground mb-1.5">Địa điểm</label>
                <div className="relative">
                  <Input
                    ref={inputRef}
                    value={locationInput}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Bạn muốn đi đâu?"
                    className="h-11 text-sm border-0 bg-transparent focus-visible:ring-0 px-0 placeholder:text-muted-foreground"
                  />
                </div>
                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.name}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted transition-colors",
                          index === selectedIndex && "bg-muted"
                        )}
                      >
                        <Search className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-popover-foreground">{suggestion.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {suggestion.hotelCount.toLocaleString("vi-VN")} khách sạn
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-12 bg-border" />

              {/* Check-in Date */}
              <div className="flex-1 relative">
                <label className="block text-xs font-semibold text-foreground mb-1.5">Check-in</label>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("checkin-date") as HTMLInputElement;
                    input?.showPicker?.();
                  }}
                  className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {checkInDate ? formatDateDisplay(checkInDate).date : "Thêm ngày"}
                </button>
                <Input
                  id="checkin-date"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-12 bg-border" />

              {/* Check-out Date */}
              <div className="flex-1 relative">
                <label className="block text-xs font-semibold text-foreground mb-1.5">Check-out</label>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("checkout-date") as HTMLInputElement;
                    input?.showPicker?.();
                  }}
                  className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {checkOutDate ? formatDateDisplay(checkOutDate).date : "Thêm ngày"}
                </button>
                <Input
                  id="checkout-date"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-12 bg-border" />

              {/* Guests/Rooms */}
              <div className="flex-1">
                <Popover open={guestPopoverOpen} onOpenChange={setGuestPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full text-left"
                    >
                      <label className="block text-xs font-semibold text-foreground mb-1.5">Khách</label>
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {guestData.adults} người, {guestData.rooms} phòng
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="start">
                    <TooltipProvider>
                      <div className="p-4 space-y-4">
                        {/* Room Selection */}
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-popover-foreground">Phòng</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              disabled={guestData.rooms <= 1}
                              onClick={() => updateGuestData("rooms", -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium text-sm">{guestData.rooms}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                              disabled={guestData.rooms >= 9}
                              onClick={() => updateGuestData("rooms", 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Adults Selection */}
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-popover-foreground">Người lớn</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Từ 18 tuổi trở lên</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              disabled={guestData.adults <= 1}
                              onClick={() => updateGuestData("adults", -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium text-sm">{guestData.adults}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                              disabled={guestData.adults >= 30}
                              onClick={() => updateGuestData("adults", 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Children Selection */}
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-popover-foreground">Trẻ em</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Từ 0-17 tuổi</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              disabled={guestData.children <= 0}
                              onClick={() => updateGuestData("children", -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium text-sm">{guestData.children}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                              disabled={guestData.children >= 10}
                              onClick={() => updateGuestData("children", 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Info Text */}
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            Tổng số khách: <span className="font-medium text-popover-foreground">{getTotalGuests()}</span>
                          </p>
                        </div>
                      </div>
                    </TooltipProvider>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Button - Circular on same row */}
              <Button
                onClick={handleSearch}
                size="icon"
                className="h-12 w-12 rounded-full bg-primary hover:bg-navy-light shadow-lg hover:shadow-xl transition-all shrink-0"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
