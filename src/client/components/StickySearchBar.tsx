import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const StickySearchBar = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);
  const [checkInDate, setCheckInDate] = useState<Date>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(new Date(), 1));
  const [guests, setGuests] = useState({ adults: 2, rooms: 1 });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY.current;
      
      if (currentScrollY > 400) {
        if (scrollDifference > 0) {
          setIsVisible(true);
        }
        if (scrollDifference < 0 && currentScrollY < 500) {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = () => {
    navigate("/search");
  };

  const getDayName = (date: Date) => {
    return format(date, "EEEE", { locale: vi });
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg transition-transform duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 bg-card rounded-lg p-1.5 shadow-md border border-border">
            {/* Location Input */}
            <div className="flex-[2] relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Nhập điểm đến hoặc khách sạn"
                  className="pl-9 h-11 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-border" />

            {/* Check-in Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 h-11 justify-start px-3 text-left font-normal hover:bg-muted/50"
                >
                  <Calendar className="h-4 w-4 mr-2 text-primary shrink-0" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">
                      {format(checkInDate, "d MMM yyyy", { locale: vi })}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {getDayName(checkInDate)}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkInDate}
                  onSelect={(date) => date && setCheckInDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {/* Divider */}
            <div className="h-8 w-px bg-border" />

            {/* Check-out Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 h-11 justify-start px-3 text-left font-normal hover:bg-muted/50"
                >
                  <Calendar className="h-4 w-4 mr-2 text-primary shrink-0" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">
                      {format(checkOutDate, "d MMM yyyy", { locale: vi })}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {getDayName(checkOutDate)}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkOutDate}
                  onSelect={(date) => date && setCheckOutDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {/* Divider */}
            <div className="h-8 w-px bg-border" />

            {/* Guests */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 h-11 justify-between px-3 text-left font-normal hover:bg-muted/50"
                >
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary shrink-0" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-foreground">
                        {guests.adults} người lớn
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {guests.rooms} phòng
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 bg-popover" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Người lớn</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setGuests(g => ({ ...g, adults: Math.max(1, g.adults - 1) }))}
                      >
                        -
                      </Button>
                      <span className="w-6 text-center">{guests.adults}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setGuests(g => ({ ...g, adults: Math.min(10, g.adults + 1) }))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Phòng</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setGuests(g => ({ ...g, rooms: Math.max(1, g.rooms - 1) }))}
                      >
                        -
                      </Button>
                      <span className="w-6 text-center">{guests.rooms}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setGuests(g => ({ ...g, rooms: Math.min(5, g.rooms + 1) }))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="h-11 px-6 bg-primary hover:bg-navy-light text-primary-foreground font-semibold rounded-md"
            >
              SEARCH
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickySearchBar;
