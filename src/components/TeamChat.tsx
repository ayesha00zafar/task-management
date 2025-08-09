import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  avatar: string;
}

const sampleMessages: ChatMessage[] = [
  {
    id: "1",
    user: "Sarah Chen",
    message: "Hey team! I've completed the authentication wireframes. Ready for review! 🎉",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    avatar: "SC"
  },
  {
    id: "2", 
    user: "Alex Rodriguez",
    message: "Great work Sarah! The drag & drop is working smoothly now.",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    avatar: "AR"
  },
  {
    id: "3",
    user: "Mike Johnson", 
    message: "Database schema is ready for testing. Let me know if you need any changes!",
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    avatar: "MJ"
  }
];

export function TeamChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers] = useState(["Sarah Chen", "Alex Rodriguez", "Mike Johnson", "Emma Wilson"]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      message: newMessage,
      timestamp: new Date(),
      avatar: "YO"
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="glass-card w-14 h-14 rounded-full shadow-lg hover-scale animate-bounce-in relative"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground p-0 flex items-center justify-center text-xs">
            {messages.length}
          </Badge>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 h-96 glass-card border-white/20 shadow-xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-primary/20 to-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">Team Chat</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {onlineUsers.length} online
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-60">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-2 animate-slide-up">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-primary/20 text-primary-foreground">
                  {message.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{message.user}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div className="text-sm bg-muted/30 rounded-lg p-2 backdrop-blur-sm">
                  {message.message}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 glass-card border-white/20"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              onClick={handleSendMessage}
              size="icon"
              className="hover-scale"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}