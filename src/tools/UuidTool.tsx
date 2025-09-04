import React, { useState } from 'react';

const UuidTool: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState<'v4' | 'v1'>('v4');
  const [upperCase, setUpperCase] = useState(false);
  const [withHyphens, setWithHyphens] = useState(true);

  // 生成 UUID v4 (随机)
  const generateUUIDv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // 生成 UUID v1 (时间戳基础)
  const generateUUIDv1 = (): string => {
    // 简化版本的 UUID v1 实现
    const timestamp = Date.now();
    const randomBytes = Array.from({ length: 10 }, () => Math.floor(Math.random() * 256));
    
    const hex = (n: number) => n.toString(16).padStart(2, '0');
    
    // 时间戳部分 (简化处理)
    const timeHex = timestamp.toString(16).padStart(12, '0');
    
    return [
      timeHex.slice(0, 8),
      timeHex.slice(8, 12),
      '1' + timeHex.slice(12, 15), // 版本号 1
      (randomBytes[0] & 0x3f | 0x80).toString(16) + hex(randomBytes[1]), // 变体位
      randomBytes.slice(2, 8).map(hex).join('')
    ].join('-');
  };

  // 格式化 UUID
  const formatUUID = (uuid: string): string => {
    let formatted = uuid;
    
    if (!withHyphens) {
      formatted = formatted.replace(/-/g, '');
    }
    
    if (upperCase) {
      formatted = formatted.toUpperCase();
    }
    
    return formatted;
  };

  // 生成 UUID
  const generateUUIDs = () => {
    const newUuids: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const uuid = version === 'v4' ? generateUUIDv4() : generateUUIDv1();
      newUuids.push(formatUUID(uuid));
    }
    
    setUuids(newUuids);
  };

  // 复制单个 UUID
  const copyUUID = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 复制所有 UUID
  const copyAllUUIDs = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 清空列表
  const clearUUIDs = () => {
    setUuids([]);
  };

  // 验证 UUID 格式
  const validateUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const uuidWithoutHyphensRegex = /^[0-9a-f]{32}$/i;
    
    return uuidRegex.test(uuid) || uuidWithoutHyphensRegex.test(uuid);
  };

  const [validateInput, setValidateInput] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    version?: string;
    timestamp?: string;
  } | null>(null);

  // 验证输入的 UUID
  const handleValidation = (input: string) => {
    setValidateInput(input);
    
    if (!input.trim()) {
      setValidationResult(null);
      return;
    }

    const isValid = validateUUID(input);
    let version = '';
    let timestamp = '';

    if (isValid) {
      // 提取版本号
      const cleanUuid = input.replace(/-/g, '');
      const versionChar = cleanUuid.charAt(12);
      version = `UUID v${versionChar}`;

      // 如果是 v1，尝试提取时间戳信息
      if (versionChar === '1') {
        try {
          // 简化的时间戳提取（这里只是示例）
          // const timeLow = cleanUuid.substring(0, 8);
          // const timeMid = cleanUuid.substring(8, 12);
          // const timeHigh = cleanUuid.substring(13, 16);
          
          // 重构时间戳（简化处理）
          timestamp = '包含时间戳信息';
        } catch (e) {
          timestamp = '无法解析时间戳';
        }
      }
    }

    setValidationResult({
      isValid,
      version: isValid ? version : undefined,
      timestamp: isValid && version.includes('v1') ? timestamp : undefined
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-headline font-bold text-apple-gray-900 mb-2">
          UUID 生成器
        </h2>
        <p className="text-body text-apple-gray-600">
          生成和验证通用唯一标识符 (UUID)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 生成配置 */}
        <div className="apple-card p-6">
          <h3 className="text-title font-semibold text-apple-gray-900 mb-4">
            生成配置
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                UUID 版本
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="v4"
                    checked={version === 'v4'}
                    onChange={(e) => setVersion(e.target.value as 'v4')}
                    className="mr-2"
                  />
                  <span className="text-sm">UUID v4 (随机)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="v1"
                    checked={version === 'v1'}
                    onChange={(e) => setVersion(e.target.value as 'v1')}
                    className="mr-2"
                  />
                  <span className="text-sm">UUID v1 (时间戳)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                生成数量
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="apple-input"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={upperCase}
                  onChange={(e) => setUpperCase(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">大写字母</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={withHyphens}
                  onChange={(e) => setWithHyphens(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">包含连字符</span>
              </label>
            </div>

            <button
              onClick={generateUUIDs}
              className="apple-button-primary w-full"
            >
              生成 UUID
            </button>
          </div>
        </div>

        {/* UUID 验证 */}
        <div className="apple-card p-6">
          <h3 className="text-title font-semibold text-apple-gray-900 mb-4">
            UUID 验证
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                输入 UUID
              </label>
              <input
                type="text"
                value={validateInput}
                onChange={(e) => handleValidation(e.target.value)}
                placeholder="输入要验证的 UUID..."
                className="apple-input font-mono"
              />
            </div>

            {validationResult && (
              <div className={`p-4 rounded-lg border ${
                validationResult.isValid 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  <span className={`text-sm font-medium ${
                    validationResult.isValid ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {validationResult.isValid ? '✓ 有效的 UUID' : '✗ 无效的 UUID'}
                  </span>
                </div>
                
                {validationResult.isValid && (
                  <div className="space-y-1">
                    <p className="text-sm text-green-700">
                      <span className="font-medium">版本:</span> {validationResult.version}
                    </p>
                    {validationResult.timestamp && (
                      <p className="text-sm text-green-700">
                        <span className="font-medium">时间戳:</span> {validationResult.timestamp}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 生成结果 */}
      {uuids.length > 0 && (
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-title font-semibold text-apple-gray-900">
              生成结果 ({uuids.length} 个)
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={copyAllUUIDs}
                className="apple-button-primary text-sm"
              >
                复制全部
              </button>
              <button
                onClick={clearUUIDs}
                className="apple-button-secondary text-sm"
              >
                清空
              </button>
            </div>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-apple-gray-50 rounded-lg"
              >
                <code className="font-mono text-sm text-apple-gray-800 flex-1">
                  {uuid}
                </code>
                <button
                  onClick={() => copyUUID(uuid)}
                  className="ml-3 px-3 py-1 text-xs text-apple-gray-600 hover:text-apple-gray-900 hover:bg-apple-gray-200 rounded transition-colors"
                >
                  复制
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 功能说明 */}
      <div className="apple-card p-6">
        <h3 className="text-title font-semibold text-apple-gray-900 mb-4">
          UUID 版本说明
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-apple-gray-900 mb-2">UUID v4 (推荐)</h4>
            <ul className="text-sm text-apple-gray-600 space-y-1">
              <li>• 基于随机数生成</li>
              <li>• 最常用的 UUID 版本</li>
              <li>• 不包含时间或MAC地址信息</li>
              <li>• 适合大多数应用场景</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-apple-gray-900 mb-2">UUID v1</h4>
            <ul className="text-sm text-apple-gray-600 space-y-1">
              <li>• 基于时间戳和MAC地址</li>
              <li>• 可以从中提取时间信息</li>
              <li>• 在同一台机器上是有序的</li>
              <li>• 可能泄露机器信息</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UuidTool;