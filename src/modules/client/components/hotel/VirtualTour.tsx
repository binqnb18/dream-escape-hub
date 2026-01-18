import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Move3D,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import hotelImage1 from "@/assets/hotel-1.jpg";
import hotelImage2 from "@/assets/hotel-2.jpg";
import hotelImage3 from "@/assets/hotel-3.jpg";
import hotelImage4 from "@/assets/hotel-4.jpg";
import hotelImage5 from "@/assets/hotel-5.jpg";

interface TourSpot {
  id: string;
  name: string;
  description: string;
  image: string;
  hotspots?: {
    x: number;
    y: number;
    label: string;
    targetId?: string;
  }[];
}

interface VirtualTourProps {
  hotelName?: string;
}

const tourSpots: TourSpot[] = [
  {
    id: "lobby",
    name: "Sảnh chính",
    description: "Sảnh đón tiếp sang trọng với thiết kế hiện đại, chandelier pha lê và không gian rộng rãi",
    image: hotelImage1,
    hotspots: [
      { x: 30, y: 60, label: "Quầy lễ tân", targetId: "reception" },
      { x: 70, y: 40, label: "Nhà hàng", targetId: "restaurant" },
    ],
  },
  {
    id: "pool",
    name: "Hồ bơi vô cực",
    description: "Hồ bơi ngoài trời view biển tuyệt đẹp, mở cửa từ 6:00 - 22:00",
    image: hotelImage2,
    hotspots: [
      { x: 20, y: 70, label: "Bar bên hồ", targetId: "bar" },
      { x: 80, y: 50, label: "Khu nghỉ mát", targetId: "lounge" },
    ],
  },
  {
    id: "room-deluxe",
    name: "Phòng Deluxe Ocean View",
    description: "Phòng ngủ cao cấp 45m² với ban công riêng và tầm nhìn ra biển",
    image: hotelImage3,
    hotspots: [
      { x: 50, y: 30, label: "Ban công", targetId: "balcony" },
      { x: 25, y: 65, label: "Phòng tắm", targetId: "bathroom" },
    ],
  },
  {
    id: "spa",
    name: "Spa & Wellness",
    description: "Trung tâm spa đẳng cấp với các liệu pháp truyền thống và hiện đại",
    image: hotelImage4,
    hotspots: [
      { x: 40, y: 55, label: "Phòng massage", targetId: "massage" },
      { x: 65, y: 45, label: "Phòng xông hơi", targetId: "sauna" },
    ],
  },
  {
    id: "restaurant",
    name: "Nhà hàng Sky View",
    description: "Nhà hàng trên tầng thượng với ẩm thực fusion và view panorama thành phố",
    image: hotelImage5,
    hotspots: [
      { x: 35, y: 50, label: "Khu vực trong nhà", targetId: "indoor" },
      { x: 70, y: 60, label: "Khu vực ngoài trời", targetId: "outdoor" },
    ],
  },
];

const VirtualTour = ({ hotelName = "Khách sạn" }: VirtualTourProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSpotIndex, setCurrentSpotIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showHotspots, setShowHotspots] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const currentSpot = tourSpots[currentSpotIndex];

  // Auto rotation effect
  useEffect(() => {
    if (isAutoRotating && isOpen) {
      const animate = () => {
        setRotation((prev) => ({
          x: prev.x,
          y: (prev.y + 0.2) % 360,
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoRotating, isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    setRotation((prev) => ({
      x: Math.max(-30, Math.min(30, prev.x - deltaY * 0.2)),
      y: prev.y + deltaX * 0.3,
    }));
    
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startPos.x;
    const deltaY = e.touches[0].clientY - startPos.y;
    
    setRotation((prev) => ({
      x: Math.max(-30, Math.min(30, prev.x - deltaY * 0.2)),
      y: prev.y + deltaX * 0.3,
    }));
    
    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const resetRotation = () => {
    setRotation({ x: 0, y: 0 });
    setIsAutoRotating(false);
  };

  const nextSpot = () => {
    setCurrentSpotIndex((prev) => (prev + 1) % tourSpots.length);
    resetRotation();
  };

  const prevSpot = () => {
    setCurrentSpotIndex((prev) => (prev - 1 + tourSpots.length) % tourSpots.length);
    resetRotation();
  };

  const goToSpot = (index: number) => {
    setCurrentSpotIndex(index);
    resetRotation();
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-6 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Move3D className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Tour ảo 360°</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Khám phá {hotelName} qua tour ảo tương tác. Xem sảnh, phòng nghỉ, hồ bơi và nhiều hơn nữa.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tourSpots.slice(0, 4).map((spot, index) => (
                <Badge key={spot.id} variant="secondary" className="text-xs">
                  {spot.name}
                </Badge>
              ))}
              {tourSpots.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{tourSpots.length - 4} khác
                </Badge>
              )}
            </div>
            <Button onClick={() => setIsOpen(true)} className="gap-2">
              <Eye className="h-4 w-4" />
              Bắt đầu Tour
            </Button>
          </div>
        </div>
      </div>

      {/* Virtual Tour Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-[90vh] p-0 bg-black border-none overflow-hidden">
          <DialogTitle className="sr-only">Virtual Tour 360° - {currentSpot.name}</DialogTitle>
          
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                  <Move3D className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">{currentSpot.name}</h2>
                  <p className="text-white/70 text-sm">
                    {currentSpotIndex + 1} / {tourSpots.length}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowHotspots(!showHotspots)}
                >
                  <Info className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* 360° Viewer */}
          <div
            ref={containerRef}
            className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Panorama Image with 3D Transform */}
            <div
              className="absolute inset-0 transition-transform duration-100"
              style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.2)`,
                transformStyle: "preserve-3d",
              }}
            >
              <img
                src={currentSpot.image}
                alt={currentSpot.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
              
              {/* Hotspots */}
              {showHotspots && currentSpot.hotspots?.map((hotspot, index) => (
                <button
                  key={index}
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2",
                    "group cursor-pointer z-10"
                  )}
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Navigate to target if exists
                    const targetIndex = tourSpots.findIndex(s => s.id === hotspot.targetId);
                    if (targetIndex >= 0) {
                      goToSpot(targetIndex);
                    }
                  }}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                        {hotspot.label}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Drag hint */}
            {!isDragging && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
                  <Move3D className="h-4 w-4" />
                  Kéo để xoay 360°
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              onClick={prevSpot}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              onClick={nextSpot}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Description */}
            <div className="text-center mb-4">
              <p className="text-white/80 text-sm max-w-lg mx-auto">
                {currentSpot.description}
              </p>
            </div>

            {/* Spot Thumbnails */}
            <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto pb-2">
              {tourSpots.map((spot, index) => (
                <button
                  key={spot.id}
                  onClick={() => goToSpot(index)}
                  className={cn(
                    "relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all",
                    currentSpotIndex === index
                      ? "ring-2 ring-primary scale-110"
                      : "opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                  />
                  {currentSpotIndex === index && (
                    <div className="absolute inset-0 bg-primary/20" />
                  )}
                </button>
              ))}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 gap-2"
                onClick={() => setIsAutoRotating(!isAutoRotating)}
              >
                {isAutoRotating ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Dừng xoay
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Tự động xoay
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 gap-2"
                onClick={resetRotation}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VirtualTour;