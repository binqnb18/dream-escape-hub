import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Building2, Clock, TrendingUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Suggestion {
  id: string;
  name: string;
  type: "city" | "hotel" | "recent" | "popular";
  subtitle?: string;
  count?: number;
}

interface DestinationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: Suggestion) => void;
  placeholder?: string;
  className?: string;
}

const popularDestinations: Suggestion[] = [
  { id: "hcm", name: "Hồ Chí Minh", type: "popular", subtitle: "Việt Nam", count: 8157 },
  { id: "hn", name: "Hà Nội", type: "popular", subtitle: "Việt Nam", count: 5420 },
  { id: "dn", name: "Đà Nẵng", type: "popular", subtitle: "Việt Nam", count: 3280 },
  { id: "nt", name: "Nha Trang", type: "popular", subtitle: "Khánh Hòa", count: 2150 },
  { id: "pq", name: "Phú Quốc", type: "popular", subtitle: "Kiên Giang", count: 1890 },
  { id: "dl", name: "Đà Lạt", type: "popular", subtitle: "Lâm Đồng", count: 1650 },
];

const allSuggestions: Suggestion[] = [
  ...popularDestinations,
  { id: "hotel-1", name: "Vilion Central Hotel", type: "hotel", subtitle: "Quận 1, TP.HCM" },
  { id: "hotel-2", name: "Rex Hotel Saigon", type: "hotel", subtitle: "Quận 1, TP.HCM" },
  { id: "hotel-3", name: "Liberty Central Saigon", type: "hotel", subtitle: "Quận 1, TP.HCM" },
  { id: "hotel-4", name: "New World Saigon Hotel", type: "hotel", subtitle: "Quận 1, TP.HCM" },
  { id: "hotel-5", name: "Sheraton Saigon Hotel", type: "hotel", subtitle: "Quận 1, TP.HCM" },
  { id: "hotel-6", name: "InterContinental Hanoi", type: "hotel", subtitle: "Hà Nội" },
  { id: "hotel-7", name: "Sofitel Legend Metropole", type: "hotel", subtitle: "Hà Nội" },
];

const DestinationAutocomplete = ({
  value,
  onChange,
  onSelect,
  placeholder = "Nhập điểm đến hoặc tên khách sạn",
  className,
}: DestinationAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<Suggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 3));
      } catch (e) {
        console.error("Failed to parse recent searches");
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = value.trim()
    ? allSuggestions.filter(
        (s) =>
          s.name.toLowerCase().includes(value.toLowerCase()) ||
          s.subtitle?.toLowerCase().includes(value.toLowerCase())
      )
    : [];

  const handleSelect = (suggestion: Suggestion) => {
    onChange(suggestion.name);
    setIsOpen(false);
    onSelect?.(suggestion);

    // Save to recent searches
    const newRecent = [
      { ...suggestion, type: "recent" as const },
      ...recentSearches.filter((r) => r.id !== suggestion.id),
    ].slice(0, 3);
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
  };

  const clearRecentSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRecent = recentSearches.filter((r) => r.id !== id);
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
  };

  const getIcon = (type: Suggestion["type"]) => {
    switch (type) {
      case "city":
      case "popular":
        return <MapPin className="w-4 h-4 text-primary" />;
      case "hotel":
        return <Building2 className="w-4 h-4 text-muted-foreground" />;
      case "recent":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      default:
        return <MapPin className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-9 h-10 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto"
        >
          {/* Search Results */}
          {value.trim() && filteredSuggestions.length > 0 && (
            <div className="p-2">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Kết quả tìm kiếm
              </p>
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSelect(suggestion)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted transition-colors text-left"
                >
                  {getIcon(suggestion.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {suggestion.name}
                    </p>
                    {suggestion.subtitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        {suggestion.subtitle}
                      </p>
                    )}
                  </div>
                  {suggestion.count && (
                    <span className="text-xs text-primary font-medium">
                      {suggestion.count.toLocaleString()} chỗ ở
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {value.trim() && filteredSuggestions.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Không tìm thấy kết quả cho "{value}"
              </p>
            </div>
          )}

          {/* Default State: Recent + Popular */}
          {!value.trim() && (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="p-2 border-b border-border">
                  <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    Tìm kiếm gần đây
                  </p>
                  {recentSearches.map((search) => (
                    <button
                      key={search.id}
                      onClick={() => handleSelect(search)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left group"
                    >
                      {getIcon("recent")}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {search.name}
                        </p>
                      </div>
                      <button
                        onClick={(e) => clearRecentSearch(search.id, e)}
                        className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/20 transition-opacity"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Destinations */}
              <div className="p-2">
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" />
                  Điểm đến phổ biến
                </p>
                {popularDestinations.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => handleSelect(dest)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted transition-colors text-left"
                  >
                    {getIcon(dest.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {dest.name}
                      </p>
                      {dest.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">
                          {dest.subtitle}
                        </p>
                      )}
                    </div>
                    {dest.count && (
                      <span className="text-xs text-primary font-medium">
                        {dest.count.toLocaleString()} chỗ ở
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DestinationAutocomplete;
