import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Facebook,
  Twitter,
  Mail,
  Link2,
  Check,
  MessageCircle,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  description?: string;
  image?: string;
}

const ShareModal = ({
  isOpen,
  onClose,
  title,
  url = window.location.href,
  description = "",
  image = "",
}: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-[#1877F2] hover:bg-[#1877F2]/90",
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
          "_blank",
          "width=600,height=400"
        );
      },
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-[#1DA1F2] hover:bg-[#1DA1F2]/90",
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          "_blank",
          "width=600,height=400"
        );
      },
    },
    {
      name: "Zalo",
      icon: MessageCircle,
      color: "bg-[#0068FF] hover:bg-[#0068FF]/90",
      onClick: () => {
        window.open(
          `https://zalo.me/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
          "_blank"
        );
      },
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-muted-foreground hover:bg-muted-foreground/90",
      onClick: () => {
        const subject = encodeURIComponent(title);
        const body = encodeURIComponent(`${description}\n\nXem chi tiết: ${url}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      },
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Đã sao chép liên kết",
        description: "Liên kết đã được sao chép vào clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Không thể sao chép",
        description: "Vui lòng thử lại",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ khách sạn</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
            {image && (
              <img
                src={image}
                alt={title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium line-clamp-2">{title}</p>
              {description && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Share buttons */}
          <div className="grid grid-cols-4 gap-3">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.onClick}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg text-white transition-all hover:scale-105 ${option.color}`}
              >
                <option.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{option.name}</span>
              </button>
            ))}
          </div>

          {/* Copy link */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Hoặc sao chép liên kết
            </p>
            <div className="flex gap-2">
              <Input
                value={url}
                readOnly
                className="flex-1 text-sm bg-muted/50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
