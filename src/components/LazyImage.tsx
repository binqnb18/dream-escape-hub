import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage = ({
  src,
  alt,
  className,
  placeholder,
  blurDataURL,
  onLoad,
  onError,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01,
        rootMargin: "50px",
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
      {/* Blur Placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          style={{
            backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
            backgroundSize: "cover",
            filter: "blur(10px)",
          }}
        />
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={hasError && placeholder ? placeholder : src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Error State */}
      {hasError && !placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <ImageOff className="w-8 h-8" />
              <p className="text-xs">Không thể tải ảnh</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
