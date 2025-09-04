import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import JsonTool from './tools/JsonTool';
import TimestampTool from './tools/TimestampTool';
import Base64Tool from './tools/Base64Tool';
import UuidTool from './tools/UuidTool';
import RegexTool from './tools/RegexTool';
import QrCodeTool from './tools/QrCodeTool';

function App() {
  const [currentTool, setCurrentTool] = useState('json');

  const tools = {
    json: JsonTool,
    timestamp: TimestampTool,
    base64: Base64Tool,
    uuid: UuidTool,
    regex: RegexTool,
    qrcode: QrCodeTool,
  };

  const CurrentToolComponent = tools[currentTool as keyof typeof tools] || JsonTool;

  return (
    <div className="min-h-screen bg-white">
      <Header currentTool={currentTool} onToolChange={setCurrentTool} />
      
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <CurrentToolComponent />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;