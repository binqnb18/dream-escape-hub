import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  type?: "card" | "list" | "text" | "image" | "search-card";
  count?: number;
}

const SkeletonLoader = ({ type = "card", count = 1 }: SkeletonLoaderProps) => {
  const renderSkeleton = () => {
    switch (type) {
      case "search-card":
        return (
          <div className="bg-card rounded-lg border overflow-hidden animate-pulse">
            {/* Desktop */}
            <div className="hidden md:flex">
              <Skeleton className="w-64 h-[220px] rounded-none" />
              <div className="flex-1 p-4 flex">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex gap-1">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-3" />
                  </div>
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="w-44 pl-4 border-l border-border space-y-3">
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-5 w-24 ml-auto" />
                    <Skeleton className="h-3 w-20 ml-auto" />
                    <Skeleton className="h-3 w-28 ml-auto" />
                  </div>
                  <div className="space-y-2 text-right pt-6">
                    <Skeleton className="h-5 w-20 ml-auto" />
                    <Skeleton className="h-4 w-24 ml-auto" />
                    <Skeleton className="h-7 w-28 ml-auto" />
                    <Skeleton className="h-3 w-32 ml-auto" />
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile */}
            <div className="md:hidden">
              <Skeleton className="w-full h-48 rounded-none" />
              <div className="p-3 space-y-3">
                <div className="flex justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-1">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-3" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
                <Skeleton className="h-3 w-2/3" />
                <div className="flex justify-between pt-2 border-t">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </div>
          </div>
        );
      case "card":
        return (
          <div className="bg-card rounded-lg border overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <Skeleton className="w-full md:w-72 h-48 md:h-56" />
              <div className="flex-1 p-4 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex justify-between items-end pt-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          </div>
        );
      case "list":
        return (
          <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
            <Skeleton className="w-16 h-16 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        );
      case "text":
        return (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        );
      case "image":
        return <Skeleton className="w-full h-48 rounded-lg" />;
      default:
        return <Skeleton className="h-20 w-full" />;
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
