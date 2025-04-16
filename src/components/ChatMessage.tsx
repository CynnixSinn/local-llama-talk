
import React from "react";
import { cn } from "@/lib/utils";
import { Markdown } from "@/components/Markdown";
import { User, Bot } from "lucide-react";

type ChatMessageProps = {
  message: {
    role: "user" | "assistant";
    content: string;
    id: string;
  };
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[85%]",
          isUser
            ? "glass-morphism bg-primary/30"
            : "neo-blur"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <Markdown content={message.content} />
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-primary" />
        </div>
      )}
    </div>
  );
};
