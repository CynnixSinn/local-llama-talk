
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, RefreshCw } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { CodePreview } from "@/components/CodePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Message = {
  role: "user" | "assistant";
  content: string;
  id: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input on component mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user" as const,
      content: input,
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Mock API call for now
      setTimeout(() => {
        const botResponse = {
          role: "assistant" as const,
          content: "This is a sample response from Ollama. I can help with coding too! Here's an example:\n```jsx\nconst Hello = () => {\n  return <div>Hello World</div>;\n};\n```",
          id: (Date.now() + 1).toString(),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching response:", error);
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="flex items-center justify-between px-6 py-3 border-b">
        <h1 className="text-xl font-semibold">Ollama Chat</h1>
        <Button variant="ghost" onClick={resetChat} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          New Chat
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium text-center mb-2">Welcome to Ollama Chat</h3>
                    <p className="text-center text-muted-foreground">
                      Start a conversation with your AI assistant.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6 pb-24">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2 border-l overflow-auto hidden lg:block">
          <Tabs defaultValue="preview" className="h-full flex flex-col">
            <div className="border-b p-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </div>
            <div className="flex-1 overflow-auto">
              <TabsContent value="code" className="h-full">
                <CodePreview messages={messages} type="code" />
              </TabsContent>
              <TabsContent value="preview" className="h-full">
                <CodePreview messages={messages} type="preview" />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <div className="p-4 border-t bg-background absolute bottom-0 left-0 right-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
