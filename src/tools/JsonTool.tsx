import React, { useState, useCallback } from 'react';

const JsonTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const formatJson = useCallback(() => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        setIsValid(null);
        return;
      }

      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');
      setIsValid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '无效的 JSON 格式');
      setOutput('');
      setIsValid(false);
    }
  }, [input]);

  const minifyJson = useCallback(() => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        setIsValid(null);
        return;
      }

      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
      setIsValid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '无效的 JSON 格式');
      setOutput('');
      setIsValid(false);
    }
  }, [input]);

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setIsValid(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (input.trim()) {
        formatJson();
      } else {
        setOutput('');
        setError('');
        setIsValid(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [input, formatJson]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          JSON 格式化工具
        </h2>
        <p className="text-base text-gray-600">
          验证、格式化和压缩 JSON 数据
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              输入 JSON
            </h3>
            <div className="flex items-center space-x-2">
              {isValid !== null && (
                <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                  isValid 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isValid ? '✓ 有效' : '✗ 无效'}
                </div>
              )}
              <button
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                清空
              </button>
            </div>
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="粘贴您的 JSON 数据..."
            className="apple-textarea h-96"
          />
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                <span className="font-medium">错误:</span> {error}
              </p>
            </div>
          )}
        </div>

        {/* 输出区域 */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              格式化结果
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={formatJson}
                className="apple-button-secondary text-sm"
                disabled={!input.trim()}
              >
                格式化
              </button>
              <button
                onClick={minifyJson}
                className="apple-button-secondary text-sm"
                disabled={!input.trim()}
              >
                压缩
              </button>
              {output && (
                <button
                  onClick={() => copyToClipboard(output)}
                  className="apple-button-primary text-sm"
                >
                  复制
                </button>
              )}
            </div>
          </div>
          
          <textarea
            value={output}
            readOnly
            placeholder="格式化后的 JSON 将显示在这里..."
            className="apple-textarea h-96 bg-gray-50"
          />
        </div>
      </div>

      {/* 功能说明 */}
      <div className="apple-card p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          功能说明
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl mb-2">✓</div>
            <h4 className="font-medium text-gray-900 mb-1">JSON 验证</h4>
            <p className="text-sm text-gray-600">
              实时检查 JSON 格式是否正确
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl mb-2">🎨</div>
            <h4 className="font-medium text-gray-900 mb-1">美化格式</h4>
            <p className="text-sm text-gray-600">
              将压缩的 JSON 格式化为易读形式
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl mb-2">📦</div>
            <h4 className="font-medium text-gray-900 mb-1">压缩优化</h4>
            <p className="text-sm text-gray-600">
              移除多余空格，减小文件大小
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonTool;