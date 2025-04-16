
import React, { useEffect, useState } from "react";
import { extractCodeFromMessages } from "@/lib/code-utils";

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
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No code to display yet
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
        <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-md overflow-auto h-full">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  // Preview tab - attempt to render the code
  return (
    <div className="p-4 h-full">
      {code ? (
        <div className="border rounded-md h-full bg-white">
          <div className="border-b p-2 text-sm text-muted-foreground">
            Preview (simulated)
          </div>
          <div className="p-4">
            <div className="p-4 bg-gray-100 rounded-md h-64 flex items-center justify-center">
              App preview would render here
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No preview available
        </div>
      )}
    </div>
  );
};
