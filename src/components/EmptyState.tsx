import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  title = "Không tìm thấy kết quả",
  message = "Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.",
  actionLabel = "Xóa bộ lọc",
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <SearchX className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
