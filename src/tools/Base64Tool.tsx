import React, { useState, useEffect } from 'react';

const Base64Tool: React.FC = () => {
  const [encodeInput, setEncodeInput] = useState('');
  const [decodeInput, setDecodeInput] = useState('');
  const [encodeResult, setEncodeResult] = useState('');
  const [decodeResult, setDecodeResult] = useState('');
  const [encodeError, setEncodeError] = useState('');
  const [decodeError, setDecodeError] = useState('');

  // Base64 编码
  const encodeBase64 = (text: string) => {
    try {
      setEncodeError('');
      if (!text) {
        setEncodeResult('');
        return;
      }

      // 使用 btoa 进行编码，但需要处理 Unicode 字符
      const encoded = btoa(unescape(encodeURIComponent(text)));
      setEncodeResult(encoded);
    } catch (error) {
      setEncodeError('编码失败：' + (error instanceof Error ? error.message : '未知错误'));
      setEncodeResult('');
    }
  };

  // Base64 解码
  const decodeBase64 = (encoded: string) => {
    try {
      setDecodeError('');
      if (!encoded.trim()) {
        setDecodeResult('');
        return;
      }

      // 移除可能的空白字符
      const cleanEncoded = encoded.replace(/\s/g, '');
      
      // 验证 Base64 格式
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(cleanEncoded)) {
        throw new Error('无效的 Base64 格式');
      }

      // 使用 atob 进行解码，并处理 Unicode 字符
      const decoded = decodeURIComponent(escape(atob(cleanEncoded)));
      setDecodeResult(decoded);
    } catch (error) {
      setDecodeError('解码失败：' + (error instanceof Error ? error.message : '未知错误'));
      setDecodeResult('');
    }
  };

  const clearAll = () => {
    setEncodeInput('');
    setDecodeInput('');
    setEncodeResult('');
    setDecodeResult('');
    setEncodeError('');
    setDecodeError('');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 实时编码
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      encodeBase64(encodeInput);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [encodeInput]);

  // 实时解码
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      decodeBase64(decodeInput);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [decodeInput]);

  // 文件编码功能
  const handleFileEncode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // 移除 data URL 前缀，只保留 Base64 部分
        const base64 = result.split(',')[1] || result;
        setEncodeResult(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-headline font-bold text-apple-gray-900 mb-2">
          Base64 编码解码工具
        </h2>
        <p className="text-body text-apple-gray-600">
          文本和文件的 Base64 编码与解码
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 编码区域 */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-title font-semibold text-apple-gray-900">
              Base64 编码
            </h3>
            <button
              onClick={() => setEncodeInput('')}
              className="text-sm text-apple-gray-500 hover:text-apple-gray-700 transition-colors"
            >
              清空
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                输入文本
              </label>
              <textarea
                value={encodeInput}
                onChange={(e) => setEncodeInput(e.target.value)}
                placeholder="输入要编码的文本..."
                className="apple-textarea h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                或上传文件
              </label>
              <input
                type="file"
                onChange={handleFileEncode}
                className="block w-full text-sm text-apple-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-apple-gray-100 file:text-apple-gray-700 hover:file:bg-apple-gray-200 transition-colors"
              />
              <p className="text-xs text-apple-gray-500 mt-1">
                支持图片、文档等各种文件格式
              </p>
            </div>
            
            {encodeError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <span className="font-medium">错误:</span> {encodeError}
                </p>
              </div>
            )}
            
            {encodeResult && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-apple-gray-700">编码结果</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-apple-gray-500">
                      {encodeResult.length} 字符
                    </span>
                    <button
                      onClick={() => copyToClipboard(encodeResult)}
                      className="apple-button-primary text-sm"
                    >
                      复制
                    </button>
                  </div>
                </div>
                <textarea
                  value={encodeResult}
                  readOnly
                  className="apple-textarea h-32 bg-apple-gray-50 font-mono text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* 解码区域 */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-title font-semibold text-apple-gray-900">
              Base64 解码
            </h3>
            <button
              onClick={() => setDecodeInput('')}
              className="text-sm text-apple-gray-500 hover:text-apple-gray-700 transition-colors"
            >
              清空
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                输入 Base64 编码
              </label>
              <textarea
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="粘贴 Base64 编码的字符串..."
                className="apple-textarea h-32 font-mono text-sm"
              />
            </div>
            
            {decodeError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <span className="font-medium">错误:</span> {decodeError}
                </p>
              </div>
            )}
            
            {decodeResult && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-apple-gray-700">解码结果</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-apple-gray-500">
                      {decodeResult.length} 字符
                    </span>
                    <button
                      onClick={() => copyToClipboard(decodeResult)}
                      className="apple-button-primary text-sm"
                    >
                      复制
                    </button>
                  </div>
                </div>
                <textarea
                  value={decodeResult}
                  readOnly
                  className="apple-textarea h-32 bg-apple-gray-50"
                />
              </div>
            )}
            
            {decodeInput && !decodeError && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✓ Base64 格式验证通过
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="apple-card p-6">
        <h3 className="text-title font-semibold text-apple-gray-900 mb-4">
          快捷操作
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (encodeResult) {
                setDecodeInput(encodeResult);
              }
            }}
            disabled={!encodeResult}
            className="apple-button-secondary"
          >
            编码结果 → 解码输入
          </button>
          <button
            onClick={() => {
              if (decodeResult) {
                setEncodeInput(decodeResult);
              }
            }}
            disabled={!decodeResult}
            className="apple-button-secondary"
          >
            解码结果 → 编码输入
          </button>
          <button
            onClick={clearAll}
            className="apple-button-secondary"
          >
            清空所有
          </button>
        </div>
      </div>

      {/* 功能说明 */}
      <div className="apple-card p-6">
        <h3 className="text-title font-semibold text-apple-gray-900 mb-4">
          使用说明
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-apple-gray-50 rounded-xl">
            <div className="text-2xl mb-2">📝</div>
            <h4 className="font-medium text-apple-gray-900 mb-1">文本编码</h4>
            <p className="text-sm text-apple-gray-600">
              支持中文等 Unicode 字符的编码
            </p>
          </div>
          <div className="text-center p-4 bg-apple-gray-50 rounded-xl">
            <div className="text-2xl mb-2">📁</div>
            <h4 className="font-medium text-apple-gray-900 mb-1">文件编码</h4>
            <p className="text-sm text-apple-gray-600">
              将文件转换为 Base64 字符串
            </p>
          </div>
          <div className="text-center p-4 bg-apple-gray-50 rounded-xl">
            <div className="text-2xl mb-2">🔄</div>
            <h4 className="font-medium text-apple-gray-900 mb-1">实时转换</h4>
            <p className="text-sm text-apple-gray-600">
              输入即时转换，无需点击按钮
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Base64Tool;