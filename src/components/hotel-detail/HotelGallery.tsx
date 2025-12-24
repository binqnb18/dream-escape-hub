import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HotelGalleryProps {
  images: string[];
  hotelName: string;
}

const HotelGallery = ({ images, hotelName }: HotelGalleryProps) => {
  const [showGallery, setShowGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[400px] rounded-xl overflow-hidden">
          {/* Main large image */}
          <div 
            className="col-span-2 row-span-2 relative cursor-pointer group"
            onClick={() => { setCurrentIndex(0); setShowGallery(true); }}
          >
            <img
              src={images[0]}
              alt={`${hotelName} - Ảnh chính`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>

          {/* Small images grid */}
          {images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className={cn(
                "relative cursor-pointer group overflow-hidden",
                index === 3 && "relative"
              )}
              onClick={() => { setCurrentIndex(index + 1); setShowGallery(true); }}
            >
              <img
                src={image}
                alt={`${hotelName} - Ảnh ${index + 2}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              
              {/* Last image overlay with "See all photos" */}
              {index === 3 && (
                <div className="absolute top-2 right-2">
                  <Heart className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              )}
            </div>
          ))}

          {/* See all photos button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 gap-2 shadow-lg"
            onClick={() => setShowGallery(true)}
          >
            <Camera className="h-4 w-4" />
            Xem tất cả ảnh
          </Button>
        </div>
      </div>

      {/* Fullscreen Gallery Dialog */}
      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setShowGallery(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-50 text-white hover:bg-white/20 h-12 w-12"
              onClick={prevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-50 text-white hover:bg-white/20 h-12 w-12"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Current image */}
            <img
              src={images[currentIndex]}
              alt={`${hotelName} - Ảnh ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[80vw] p-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-16 h-12 rounded overflow-hidden flex-shrink-0 transition-all",
                    currentIndex === index
                      ? "ring-2 ring-white"
                      : "opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HotelGallery;
