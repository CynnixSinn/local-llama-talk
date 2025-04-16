
import mcpConfig from '@/config/mcp.json';
import { MCPConfig, MCPServer } from '@/types/mcp';

/**
 * Get all configured MCP servers
 */
export async function getServers(): Promise<MCPServer[]> {
  try {
    // This could be extended in the future to fetch from local storage
    // or from a remote endpoint
    return mcpConfig.servers;
  } catch (error) {
    console.error("Error getting MCP servers:", error);
    return [];
  }
}

/**
 * Get the default MCP server configuration
 */
export async function getDefaultServer(): Promise<MCPServer | null> {
  try {
    const servers = await getServers();
    
    if (mcpConfig.defaultServerId) {
      const defaultServer = servers.find(server => 
        server.id === mcpConfig.defaultServerId && server.isActive
      );
      if (defaultServer) return defaultServer;
    }
    
    // Fallback to first active server if default not found
    const firstActiveServer = servers.find(server => server.isActive);
    return firstActiveServer || null;
  } catch (error) {
    console.error("Error getting default MCP server:", error);
    return null;
  }
}

/**
 * Update the Ollama API base URL based on the selected server
 * @param server The MCP server configuration
 */
export function updateApiBaseUrl(server: MCPServer | null): string {
  if (!server) return "http://localhost:11434"; // Default fallback
  
  return server.url;
}
