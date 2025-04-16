
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { getCurrentModel, listModels } from "@/services/ollamaService";

type OllamaContextType = {
  currentModel: string | null;
  models: string[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  refreshModels: () => Promise<void>;
};

const OllamaContext = createContext<OllamaContextType>({
  currentModel: null,
  models: [],
  isConnected: false,
  isLoading: true,
  error: null,
  refreshModels: async () => {},
});

export const useOllama = () => useContext(OllamaContext);

export const OllamaProvider = ({ children }: { children: ReactNode }) => {
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshModels = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get available models
      const modelsList = await listModels();
      setModels(modelsList);
      
      // Get current model
      const model = await getCurrentModel();
      setCurrentModel(model);
      
      setIsConnected(modelsList.length > 0);
    } catch (err) {
      setError("Failed to connect to Ollama. Is it running?");
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshModels();
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
      }}
    >
      {children}
    </OllamaContext.Provider>
  );
};
