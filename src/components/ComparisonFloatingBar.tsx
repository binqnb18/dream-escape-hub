import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, GitCompare, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { ComparisonRoom } from "@/hooks/use-room-comparison";
import { cn } from "@/lib/utils";
import RoomComparisonModal from "./RoomComparisonModal";

interface ComparisonFloatingBarProps {
  rooms: ComparisonRoom[];
  onRemove: (roomId: string, hotelId: string) => void;
  onClearAll: () => void;
}

const ComparisonFloatingBar = ({
  rooms,
  onRemove,
  onClearAll,
}: ComparisonFloatingBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  if (rooms.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg animate-fade-in">
        {/* Expanded view */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-40" : "max-h-0"
          )}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {rooms.map((room) => (
                <div
                  key={`${room.hotelId}-${room.id}`}
                  className="flex-shrink-0 bg-muted rounded-lg p-3 min-w-[200px] relative group"
                >
                  <button
                    onClick={() => onRemove(room.id, room.hotelId)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <p className="text-xs text-muted-foreground truncate">
                    {room.hotelName}
                  </p>
                  <p className="font-medium text-sm truncate">{room.roomName}</p>
                  <p className="text-primary font-semibold text-sm">
                    {room.price.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
              >
                <GitCompare className="h-5 w-5" />
                <span className="font-medium">
                  So sánh phòng ({rooms.length}/4)
                </span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Xóa tất cả
              </Button>
            </div>

            <Button
              onClick={() => setShowComparison(true)}
              disabled={rooms.length < 2}
              className="bg-primary hover:bg-primary/90"
            >
              <GitCompare className="h-4 w-4 mr-2" />
              So sánh ngay
            </Button>
          </div>
        </div>
      </div>

      {showComparison && (
        <RoomComparisonModal
          rooms={rooms}
          onClose={() => setShowComparison(false)}
        />
      )}
    </>
  );
};

export default ComparisonFloatingBar;
