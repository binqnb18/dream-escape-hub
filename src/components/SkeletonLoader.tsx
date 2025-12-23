import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  type?: "card" | "list" | "text" | "image";
  count?: number;
}

const SkeletonLoader = ({ type = "card", count = 1 }: SkeletonLoaderProps) => {
  const renderSkeleton = () => {
    switch (type) {
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
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

export default SkeletonLoader;
