import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const StickySearchBar = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);

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

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background shadow-lg border-b border-border transition-transform duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            {/* Location Input */}
            <div className="md:col-span-2 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Bạn muốn đi đâu?"
                  className="pl-9 h-10 text-sm border-2 focus:border-primary"
                />
              </div>
            </div>

            {/* Check-in Date */}
            <div className="relative">
              <Button
                variant="outline"
                className="w-full h-10 justify-start px-3 text-left font-normal border-2 hover:border-primary text-xs"
              >
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                <span>Check-in</span>
              </Button>
            </div>

            {/* Check-out Date */}
            <div className="relative">
              <Button
                variant="outline"
                className="w-full h-10 justify-start px-3 text-left font-normal border-2 hover:border-primary text-xs"
              >
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                <span>Check-out</span>
              </Button>
            </div>

            {/* Guests */}
            <div className="relative">
              <Button
                variant="outline"
                className="w-full h-10 justify-start px-3 text-left font-normal border-2 hover:border-primary text-xs"
              >
                <Users className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                <span>Khách</span>
              </Button>
            </div>

            {/* Search Button */}
            <div className="flex items-center justify-center">
              <Button
                onClick={handleSearch}
                size="icon"
                className="h-10 w-10 rounded-full bg-primary hover:bg-navy-light shadow-lg transition-all"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickySearchBar;
