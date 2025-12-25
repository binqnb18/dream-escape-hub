import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Image,
  Smile,
  Check,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";
import Header from "@/components/Header";
import ClientFooter from "@/components/ClientFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  status: "sent" | "delivered" | "read";
}

interface Conversation {
  id: string;
  hotelName: string;
  hotelImage: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    hotelName: "Vinpearl Resort Phú Quốc",
    hotelImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=100",
    lastMessage: "Dạ, khách sạn có thể sắp xếp xe đưa đón sân bay cho quý khách ạ.",
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
    messages: [
      {
        id: "1",
        content: "Xin chào, tôi có đặt phòng vào ngày 20/01. Khách sạn có dịch vụ đưa đón sân bay không ạ?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isOwn: true,
        status: "read",
      },
      {
        id: "2",
        content: "Xin chào quý khách! Cảm ơn quý khách đã liên hệ.",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        isOwn: false,
        status: "read",
      },
      {
        id: "3",
        content: "Dạ, khách sạn có thể sắp xếp xe đưa đón sân bay cho quý khách ạ.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isOwn: false,
        status: "read",
      },
    ],
  },
  {
    id: "2",
    hotelName: "InterContinental Đà Nẵng",
    hotelImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=100",
    lastMessage: "Cảm ơn quý khách đã đặt phòng tại khách sạn chúng tôi!",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: "1",
        content: "Cảm ơn quý khách đã đặt phòng tại khách sạn chúng tôi!",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOwn: false,
        status: "read",
      },
    ],
  },
  {
    id: "3",
    hotelName: "Park Hyatt Saigon",
    hotelImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=100",
    lastMessage: "Vâng, tôi sẽ check-in vào lúc 15:00 ạ",
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: "1",
        content: "Quý khách dự kiến check-in vào lúc mấy giờ ạ?",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000),
        isOwn: false,
        status: "read",
      },
      {
        id: "2",
        content: "Vâng, tôi sẽ check-in vào lúc 15:00 ạ",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isOwn: true,
        status: "read",
      },
    ],
  },
];

const Messages = () => {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // In real app, this would send to backend
    setNewMessage("");
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-[350px,1fr] h-[calc(100vh-200px)] min-h-[500px]">
            {/* Conversations List */}
            <div className={cn(
              "border-r border-border flex flex-col",
              selectedConversation ? "hidden md:flex" : "flex"
            )}>
              {/* Header */}
              <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <MessageCircle className="h-5 w-5" />
                  Tin nhắn
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm cuộc trò chuyện..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <ScrollArea className="flex-1">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">Không có cuộc trò chuyện nào</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={cn(
                        "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border",
                        selectedConversation?.id === conv.id && "bg-muted"
                      )}
                    >
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={conv.hotelImage} />
                        <AvatarFallback>{conv.hotelName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-medium truncate">{conv.hotelName}</h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTime(conv.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conv.lastMessage}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge className="flex-shrink-0">{conv.unreadCount}</Badge>
                      )}
                    </button>
                  ))
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className={cn(
              "flex flex-col",
              !selectedConversation ? "hidden md:flex" : "flex"
            )}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <Avatar>
                        <AvatarImage src={selectedConversation.hotelImage} />
                        <AvatarFallback>{selectedConversation.hotelName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedConversation.hotelName}</h3>
                        <p className="text-sm text-success">Đang trực tuyến</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            message.isOwn ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2",
                              message.isOwn
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-muted rounded-bl-sm"
                            )}
                          >
                            <p>{message.content}</p>
                            <div
                              className={cn(
                                "flex items-center gap-1 mt-1 text-xs",
                                message.isOwn
                                  ? "text-primary-foreground/70 justify-end"
                                  : "text-muted-foreground"
                              )}
                            >
                              <span>
                                {message.timestamp.toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {message.isOwn && (
                                message.status === "read" ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Image className="h-5 w-5" />
                      </Button>
                      <div className="flex-1 relative">
                        <Input
                          placeholder="Nhập tin nhắn..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSend()}
                          className="pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                        >
                          <Smile className="h-5 w-5" />
                        </Button>
                      </div>
                      <Button onClick={handleSend} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Chọn một cuộc trò chuyện</h3>
                    <p className="text-muted-foreground">
                      Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
};

export default Messages;
