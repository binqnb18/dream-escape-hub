import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  threshold?: number;
  rootMargin?: string;
}

const ScrollReveal = ({
  children,
  className,
  delay = 0,
  direction = "up",
  threshold = 0.1,
  rootMargin = "0px",
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delay, threshold, rootMargin]);

  const directionClasses = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "-translate-x-8",
    right: "translate-x-8",
    fade: "",
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
