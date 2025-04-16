
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { getCurrentModel, listModels, setApiBaseUrl } from "@/services/ollamaService";
import { MCPServer } from "@/types/mcp";
import { getDefaultServer, getServers } from "@/services/mcpService";

type OllamaContextType = {
  currentModel: string | null;
  models: string[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  refreshModels: () => Promise<void>;
  currentServer: MCPServer | null;
  servers: MCPServer[];
  setCurrentServer: (server: MCPServer) => Promise<void>;
};

const OllamaContext = createContext<OllamaContextType>({
  currentModel: null,
  models: [],
  isConnected: false,
  isLoading: true,
  error: null,
  refreshModels: async () => {},
  currentServer: null,
  servers: [],
  setCurrentServer: async () => {},
});

export const useOllama = () => useContext(OllamaContext);

export const OllamaProvider = ({ children }: { children: ReactNode }) => {
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentServer, setCurrentServer] = useState<MCPServer | null>(null);
  const [servers, setServers] = useState<MCPServer[]>([]);

  const loadServers = async () => {
    try {
      const allServers = await getServers();
      setServers(allServers);
      
      const defaultServer = await getDefaultServer();
      if (defaultServer) {
        await changeServer(defaultServer);
      }
    } catch (err) {
      console.error("Failed to load MCP servers:", err);
    }
  };

  const changeServer = async (server: MCPServer) => {
    setCurrentServer(server);
    setApiBaseUrl(server);
    await refreshModels();
  };

  const refreshModels = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get available models
      const modelsList = await listModels(currentServer);
      setModels(modelsList);
      
      // Get current model
      const model = await getCurrentModel();
      setCurrentModel(model);
      
      setIsConnected(modelsList.length > 0);
    } catch (err) {
      setError(`Failed to connect to ${currentServer?.name || "Ollama"}. Is it running?`);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServers();
  }, []);

  return (
    <OllamaContext.Provider
      value={{
        currentModel,
        models,
        isConnected,
        isLoading,
        error,
        refreshModels,
        currentServer,
        servers,
        setCurrentServer: changeServer,
      }}
    >
      {children}
    </OllamaContext.Provider>
  );
};
