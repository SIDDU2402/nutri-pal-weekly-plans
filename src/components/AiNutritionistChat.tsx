
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useUserData } from '@/hooks/useUserData';
import { Loader2, MessageCircle, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AiNutritionistChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI nutritionist. How can I help you with your wellness journey today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const { profile } = useUserData();
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-nutritionist-chat', {
        body: {
          message: message,
          user_context: {
            dietary_goals: profile?.dietary_goals,
            allergies: profile?.allergies,
            activity_level: profile?.activity_level,
            age: profile?.age,
            weight: profile?.weight,
            height: profile?.height
          }
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-purple-600" />
          AI Nutritionist Chat
        </CardTitle>
        <CardDescription>
          Get personalized nutrition advice from your AI nutritionist
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-64">
        <ScrollArea className="flex-1 mb-4 pr-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${
                  msg.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!msg.isUser && (
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isUser
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.isUser && (
                  <div className="bg-green-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Bot className="h-4 w-4 text-purple-600" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            placeholder="Ask about nutrition, meal planning, or health tips..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiNutritionistChat;
