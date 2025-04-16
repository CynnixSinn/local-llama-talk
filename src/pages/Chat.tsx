
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, RefreshCw, AlertTriangle } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { CodePreview } from "@/components/CodePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sendMessageToOllama } from "@/services/ollamaService";
import { useOllama } from "@/contexts/OllamaContext";
import { useToast } from "@/components/ui/use-toast";

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
  const { currentModel, isConnected, error, refreshModels } = useOllama();
  const { toast } = useToast();

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
    if (!input.trim() || isLoading || !isConnected) return;

    const userMessage = {
      role: "user" as const,
      content: input,
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (!currentModel) {
        throw new Error("No Ollama model selected");
      }

      // Create a placeholder for the assistant's response
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          id: assistantMessageId,
        },
      ]);

      // Function to update the assistant's message as it streams in
      const updateAssistantMessage = (content: string, done: boolean) => {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === assistantMessageId ? { ...msg, content } : msg
          )
        );
        
        if (done) {
          setIsLoading(false);
        }
      };

      // Send message to Ollama and update response as it streams in
      await sendMessageToOllama(currentModel, input, updateAssistantMessage);
    } catch (error) {
      console.error("Error fetching response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from Ollama. Is it running?",
        variant: "destructive",
      });
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
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Ollama Chat</h1>
          {currentModel && (
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
              {currentModel}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshModels} className="gap-2" size="sm">
            <RefreshCw className="h-4 w-4" />
            Refresh Models
          </Button>
          <Button variant="ghost" onClick={resetChat} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium text-center mb-2">Welcome to Ollama Chat</h3>
                    <p className="text-center text-muted-foreground mb-4">
                      Start a conversation with your local LLM.
                    </p>
                    
                    {!isConnected && (
                      <div className="p-3 bg-amber-50 text-amber-800 rounded-md flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        <p className="text-sm">
                          {error || "Not connected to Ollama. Is it running?"}
                        </p>
                      </div>
                    )}
                    
                    {currentModel && (
                      <p className="text-center text-sm">
                        Using model: <span className="font-medium">{currentModel}</span>
                      </p>
                    )}
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
            placeholder={isConnected ? "Type a message..." : "Ollama not connected"}
            className="flex-1"
            disabled={isLoading || !isConnected}
          />
          <Button type="submit" disabled={isLoading || !isConnected || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
