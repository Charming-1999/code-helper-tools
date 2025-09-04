import React from 'react';

interface HeaderProps {
  currentTool?: string;
  onToolChange: (toolId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentTool, onToolChange }) => {
  const tools = [
    { id: 'json', name: 'JSON 工具', icon: '{ }' },
    { id: 'timestamp', name: '时间戳转换', icon: '⏰' },
    { id: 'base64', name: 'Base64', icon: '🔄' },
    { id: 'uuid', name: 'UUID 生成', icon: '🆔' },
    { id: 'regex', name: '正则测试', icon: '.*' },
    { id: 'qrcode', name: '二维码生成', icon: '📱' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CT</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Code Helper Tools
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentTool === tool.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tool.icon}</span>
                {tool.name}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center space-x-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* 移动端导航 */}
        <div className="md:hidden mt-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentTool === tool.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{tool.icon}</span>
                {tool.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;