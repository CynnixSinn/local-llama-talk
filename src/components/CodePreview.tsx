
import React, { useEffect, useState } from "react";
import { extractCodeFromMessages } from "@/lib/code-utils";
import { Terminal } from "lucide-react";

type CodePreviewProps = {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  type: "code" | "preview";
};

export const CodePreview = ({ messages, type }: CodePreviewProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const extractedCode = extractCodeFromMessages(messages);
      setCode(extractedCode);
      setError(null);
    } catch (err) {
      setError("Error extracting code from messages");
      console.error(err);
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
        <Terminal className="h-8 w-8 mb-2 text-primary/40" />
        <p>No code to display yet</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-destructive">
        {error}
      </div>
    );
  }

  if (type === "code") {
    return (
      <div className="p-4">
        <pre className="bg-black/30 text-zinc-100 p-4 rounded-md overflow-auto h-full border border-white/10 font-mono text-sm">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  // Preview tab - attempt to render the code
  return (
    <div className="p-4 h-full">
      {code ? (
        <div className="glass-morphism rounded-md h-full">
          <div className="border-b border-white/10 p-2 text-sm text-muted-foreground flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span>Preview (simulated)</span>
          </div>
          <div className="p-4">
            <div className="neo-blur rounded-md h-64 flex items-center justify-center">
              <p className="text-gradient">App preview would render here</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Terminal className="h-8 w-8 mb-2 text-primary/40" />
          <p>No preview available</p>
        </div>
      )}
    </div>
  );
};
