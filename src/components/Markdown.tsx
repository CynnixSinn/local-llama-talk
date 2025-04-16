
import React from "react";
import { cn } from "@/lib/utils";

type MarkdownProps = {
  content: string;
};

export const Markdown = ({ content }: MarkdownProps) => {
  // Very simple markdown renderer for demo purposes
  // In a real app, you'd use a library like react-markdown
  
  const renderMarkdown = (text: string) => {
    const codeBlockRegex = /```(.*?)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before the code block
      if (match.index > lastIndex) {
        elements.push(
          <p key={`text-${lastIndex}`} className="whitespace-pre-wrap mb-4">
            {text.slice(lastIndex, match.index)}
          </p>
        );
      }

      // Add the code block
      const language = match[1].trim();
      const code = match[2];
      elements.push(
        <div key={`code-${match.index}`} className="mb-4">
          <div className="bg-black/50 text-primary/90 p-1 text-sm rounded-t-md border-t border-l border-r border-white/10 flex items-center">
            <span className="font-mono">{language || "code"}</span>
          </div>
          <pre className="bg-black/30 text-zinc-100 p-3 overflow-x-auto rounded-b-md border border-white/10">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last code block
    if (lastIndex < text.length) {
      elements.push(
        <p key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {text.slice(lastIndex)}
        </p>
      );
    }

    return elements;
  };

  return <div className="markdown">{renderMarkdown(content)}</div>;
};
