
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Ollama Chat Interface</h1>
      <p className="text-xl text-center mb-8 max-w-md">
        A modern chat interface for Ollama, with code preview capabilities
      </p>
      <Link to="/chat">
        <Button size="lg" className="gap-2">
          <MessageSquare className="h-5 w-5" />
          Start Chatting
        </Button>
      </Link>
    </div>
  );
};

export default Index;
