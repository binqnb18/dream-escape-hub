import { SearchX, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  suggestions?: string[];
}

const EmptyState = ({
  title = "No properties found",
  message = "We couldn't find any properties matching your search criteria.",
  actionLabel = "Clear filters",
  onAction,
  suggestions = [
    "Try adjusting your filters",
    "Expand your search area",
    "Change your dates",
    "Reduce the number of guests",
  ],
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-card rounded-xl border">
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <SearchX className="w-10 h-10 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      
      {/* Suggestions */}
      <div className="bg-muted/30 rounded-lg p-4 mb-6 max-w-md w-full">
        <p className="text-sm font-medium text-foreground mb-3 flex items-center justify-center gap-2">
          <Filter className="w-4 h-4" />
          Suggestions to get more results:
        </p>
        <ul className="text-sm text-muted-foreground space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
      
      {onAction && (
        <Button onClick={onAction} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
