import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Code Helper Tools Test</h1>
      <p>如果你能看到这个页面，说明React应用正常工作！</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ padding: '10px 20px', margin: '10px 0', display: 'block' }}
      >
        点击测试: {count}
      </button>
      <div style={{ marginTop: '20px' }}>
        <h2>工具列表:</h2>
        <ul>
          <li>JSON 格式化工具</li>
          <li>时间戳转换工具</li>
          <li>Base64 编码解码工具</li>
          <li>UUID 生成器</li>
          <li>正则表达式测试器</li>
          <li>二维码生成工具</li>
        </ul>
      </div>
    </div>
  );
}

export default App;