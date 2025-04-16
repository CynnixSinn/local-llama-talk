
import { MCPServer } from "@/types/mcp";
import { updateApiBaseUrl } from "./mcpService";

type OllamaResponse = {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
};

type ModelInfo = {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: Record<string, any>;
};

let OLLAMA_API_BASE_URL = "http://localhost:11434";

export function setApiBaseUrl(server: MCPServer | null) {
  OLLAMA_API_BASE_URL = updateApiBaseUrl(server);
}

export async function listModels(server?: MCPServer): Promise<string[]> {
  try {
    // If a specific server is provided, use its URL
    const baseUrl = server ? server.url : OLLAMA_API_BASE_URL;
    
    const response = await fetch(`${baseUrl}/api/tags`);
    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.statusText}`);
    }
    const data = await response.json();
    return data.models?.map((model: ModelInfo) => model.name) || [];
  } catch (error) {
    console.error("Error listing Ollama models:", error);
    return [];
  }
}

export async function getCurrentModel(): Promise<string | null> {
  try {
    const models = await listModels();
    return models.length > 0 ? models[0] : null;
  } catch (error) {
    console.error("Error getting current model:", error);
    return null;
  }
}

export async function sendMessageToOllama(
  model: string,
  prompt: string,
  onUpdate: (content: string, done: boolean) => void
): Promise<void> {
  try {
    console.log(`Sending message to ${model}: ${prompt}`);
    
    const response = await fetch(`${OLLAMA_API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response reader");
    }

    let accumulatedContent = "";
    let decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        onUpdate(accumulatedContent, true);
        break;
      }

      // Decode the chunk and split by lines
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(line => line.trim() !== "");
      
      for (const line of lines) {
        try {
          const parsedChunk = JSON.parse(line) as OllamaResponse;
          accumulatedContent += parsedChunk.message?.content || "";
          onUpdate(accumulatedContent, parsedChunk.done);
          
          if (parsedChunk.done) break;
        } catch (e) {
          console.error("Error parsing JSON from stream:", e);
        }
      }
    }
  } catch (error) {
    console.error("Error communicating with Ollama:", error);
    onUpdate("Error communicating with Ollama. Is the service running?", true);
    throw error;
  }
}
