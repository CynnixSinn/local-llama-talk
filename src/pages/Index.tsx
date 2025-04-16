
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2, Server } from "lucide-react";
import { useOllama } from "@/contexts/OllamaContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const { 
    currentModel, 
    isConnected, 
    isLoading, 
    error, 
    refreshModels, 
    currentServer, 
    servers, 
    setCurrentServer 
  } = useOllama();

  const handleServerChange = async (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    if (server) {
      await setCurrentServer(server);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Ollama Chat Interface</h1>
      <p className="text-xl text-center mb-8 max-w-md">
        A modern chat interface for Ollama, with code preview capabilities
      </p>

      {servers.length > 0 && (
        <div className="mb-6 w-full max-w-md">
          <label className="block text-sm font-medium mb-2">MCP Server</label>
          <Select 
            value={currentServer?.id} 
            onValueChange={handleServerChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a server" />
            </SelectTrigger>
            <SelectContent>
              {servers.map(server => (
                <SelectItem key={server.id} value={server.id}>
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <span>{server.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 mb-6">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Connecting to {currentServer?.name || "Ollama"}...</p>
        </div>
      ) : !isConnected ? (
        <Alert variant="destructive" className="mb-6 max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {error || `Could not connect to ${currentServer?.name || "Ollama"}. Make sure it's running and try again.`}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshModels} 
              className="mt-2 w-full"
            >
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="text-center mb-6">
          <p className="text-green-600 mb-2">
            ✓ Connected to {currentServer?.name || "Ollama"}
          </p>
          {currentModel && (
            <p className="text-sm mb-4">
              Using model: <span className="font-bold">{currentModel}</span>
            </p>
          )}
        </div>
      )}

      <Link to="/chat">
        <Button size="lg" className="gap-2" disabled={!isConnected}>
          <MessageSquare className="h-5 w-5" />
          Start Chatting
        </Button>
      </Link>
    </div>
  );
};

export default Index;
