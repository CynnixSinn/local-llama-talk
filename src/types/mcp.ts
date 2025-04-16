
/**
 * MCP (Multi-Connection Protocol) server configuration type
 */
export type MCPServer = {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  type: "ollama" | "custom" | "openai";
  isActive: boolean;
  description?: string;
};

export type MCPConfig = {
  servers: MCPServer[];
  defaultServerId?: string;
};
