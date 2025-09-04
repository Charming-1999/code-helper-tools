export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'data' | 'time' | 'text' | 'network' | 'security';
  component: React.ComponentType;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  tools: Tool[];
}