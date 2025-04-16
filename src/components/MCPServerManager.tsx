
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useOllama } from "@/contexts/OllamaContext";
import { Server, Plus, Edit, Trash } from "lucide-react";
import { MCPServer } from "@/types/mcp";

export const MCPServerManager = () => {
  const { servers } = useOllama();
  const [isOpen, setIsOpen] = React.useState(false);
  const [editingServer, setEditingServer] = React.useState<MCPServer | null>(null);

  // These functions are placeholders for now
  // In a real implementation, these would connect to a service to update the MCP configuration
  const handleAddServer = (formData: FormData) => {
    // This would be implemented to add a server to the MCP configuration
    console.log("Adding server", Object.fromEntries(formData.entries()));
    setIsOpen(false);
  };

  const handleEditServer = (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    if (server) {
      setEditingServer(server);
      setIsOpen(true);
    }
  };

  const handleDeleteServer = (serverId: string) => {
    // This would be implemented to remove a server from the MCP configuration
    console.log("Deleting server", serverId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">MCP Servers</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Server
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingServer ? 'Edit Server' : 'Add New MCP Server'}</DialogTitle>
              <DialogDescription>
                Configure a new server connection for your AI models.
              </DialogDescription>
            </DialogHeader>

            <form action={handleAddServer} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Server Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="My Ollama Server" 
                  defaultValue={editingServer?.name} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">Server URL</Label>
                <Input 
                  id="url" 
                  name="url" 
                  placeholder="http://localhost:11434" 
                  defaultValue={editingServer?.url}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Server Type</Label>
                <Select name="type" defaultValue={editingServer?.type || "ollama"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select server type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ollama">Ollama</SelectItem>
                    <SelectItem value="openai">OpenAI Compatible</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key (if required)</Label>
                <Input 
                  id="apiKey" 
                  name="apiKey" 
                  type="password" 
                  placeholder="API Key" 
                  defaultValue={editingServer?.apiKey}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive" 
                  name="isActive" 
                  defaultChecked={editingServer?.isActive ?? true} 
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input 
                  id="description" 
                  name="description" 
                  placeholder="Description" 
                  defaultValue={editingServer?.description}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit">
                  {editingServer ? 'Save Changes' : 'Add Server'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {servers.length === 0 ? (
          <div className="text-center p-4 border rounded-md text-muted-foreground">
            No servers configured. Add a server to get started.
          </div>
        ) : (
          servers.map(server => (
            <div 
              key={server.id} 
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">{server.name}</h3>
                  <p className="text-xs text-muted-foreground">{server.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEditServer(server.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteServer(server.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        <p>Note: Server configuration is stored locally. Future versions will support syncing.</p>
      </div>
    </div>
  );
};
