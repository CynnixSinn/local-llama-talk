
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2, Server, Zap, Terminal } from "lucide-react";
import { useOllama } from "@/contexts/OllamaContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

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

  // Connect to Ollama automatically on page load
  useEffect(() => {
    if (!isConnected && !isLoading) {
      refreshModels();
    }
  }, []);

  const handleServerChange = async (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    if (server) {
      await setCurrentServer(server);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-background/80">
      <div className="glass-morphism p-8 rounded-lg max-w-md w-full animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Zap className="h-8 w-8 text-primary animate-pulse-slow" />
          <h1 className="text-4xl font-bold text-gradient">Ollama Chat</h1>
        </div>
        
        <p className="text-xl text-center mb-8 text-muted-foreground">
          A modern chat interface for Ollama with code preview capabilities
        </p>

        {servers.length > 0 && (
          <div className="mb-6 w-full">
            <label className="block text-sm font-medium mb-2">MCP Server</label>
            <Select 
              value={currentServer?.id} 
              onValueChange={handleServerChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full glass-morphism">
                <SelectValue placeholder="Select a server" />
              </SelectTrigger>
              <SelectContent className="neo-blur">
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
          <Card className="mb-6 neo-blur">
            <CardContent className="pt-6 flex items-center gap-2 justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p>Connecting to {currentServer?.name || "Ollama"}...</p>
            </CardContent>
          </Card>
        ) : !isConnected ? (
          <Alert variant="destructive" className="mb-6 bg-destructive/10 border-destructive/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              {error || `Could not connect to ${currentServer?.name || "Ollama"}. Make sure it's running and try again.`}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshModels} 
                className="mt-2 w-full glass-morphism"
              >
                Retry Connection
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <Card className="mb-6 glass-morphism">
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <p>Connected to {currentServer?.name || "Ollama"}</p>
              </div>
              {currentModel && (
                <div className="flex items-center justify-center gap-1 text-sm mb-4">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span>Using model: <span className="font-bold text-primary">{currentModel}</span></span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Link to="/chat" className="block w-full">
          <Button size="lg" className="gap-2 w-full bg-primary/80 hover:bg-primary" disabled={!isConnected}>
            <MessageSquare className="h-5 w-5" />
            Start Chatting
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
