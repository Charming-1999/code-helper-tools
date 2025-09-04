import React, { useState, useEffect } from 'react';

const TimestampTool: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timestampResult, setTimestampResult] = useState('');
  const [dateResult, setDateResult] = useState('');
  const [timestampError, setTimestampError] = useState('');
  const [dateError, setDateError] = useState('');

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 时间戳转日期
  const convertTimestampToDate = (timestamp: string) => {
    try {
      setTimestampError('');
      if (!timestamp.trim()) {
        setTimestampResult('');
        return;
      }

      let ts = parseInt(timestamp);
      
      // 检测时间戳长度，如果是10位则转为13位（秒转毫秒）
      if (timestamp.length === 10) {
        ts = ts * 1000;
      }

      const date = new Date(ts);
      
      if (isNaN(date.getTime())) {
        throw new Error('无效的时间戳');
      }

      const result = {
        '标准格式': date.toISOString(),
        '本地时间': date.toLocaleString('zh-CN', { 
          timeZone: 'Asia/Shanghai',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        'UTC时间': date.toUTCString(),
        '年/月/日': date.toLocaleDateString('zh-CN'),
        '时:分:秒': date.toLocaleTimeString('zh-CN'),
      };

      setTimestampResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setTimestampError(error instanceof Error ? error.message : '转换失败');
      setTimestampResult('');
    }
  };

  // 日期转时间戳
  const convertDateToTimestamp = (dateStr: string) => {
    try {
      setDateError('');
      if (!dateStr.trim()) {
        setDateResult('');
        return;
      }

      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        throw new Error('无效的日期格式');
      }

      const timestamp = date.getTime();
      const timestampSeconds = Math.floor(timestamp / 1000);

      const result = {
        '毫秒时间戳': timestamp.toString(),
        '秒时间戳': timestampSeconds.toString(),
        'ISO格式': date.toISOString(),
        'Unix时间戳': timestampSeconds,
      };

      setDateResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setDateError(error instanceof Error ? error.message : '转换失败');
      setDateResult('');
    }
  };

  const getCurrentTimestamp = () => {
    const now = Date.now();
    setTimestampInput(now.toString());
    convertTimestampToDate(now.toString());
  };

  const getCurrentDate = () => {
    const now = new Date().toISOString().slice(0, 16);
    setDateInput(now);
    convertDateToTimestamp(now);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      convertTimestampToDate(timestampInput);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [timestampInput]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      convertDateToTimestamp(dateInput);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [dateInput]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-headline font-bold text-apple-gray-900 mb-2">
          时间戳转换工具
        </h2>
        <p className="text-body text-apple-gray-600">
          时间戳与日期格式之间的相互转换
        </p>
      </div>

      {/* 当前时间显示 */}
      <div className="apple-card p-6">
        <h3 className="text-title font-semibold text-apple-gray-900 mb-4 text-center">
          当前时间
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-apple-gray-50 rounded-xl">
            <div className="text-sm text-apple-gray-600 mb-1">当前时间戳(毫秒)</div>
            <div className="text-lg font-mono text-apple-gray-900">
              {currentTime.getTime()}
            </div>
            <button
              onClick={() => copyToClipboard(currentTime.getTime().toString())}
              className="mt-2 text-xs text-apple-gray-500 hover:text-apple-gray-700"
            >
              复制
            </button>
          </div>
          <div className="text-center p-4 bg-apple-gray-50 rounded-xl">
            <div className="text-sm text-apple-gray-600 mb-1">当前时间戳(秒)</div>
            <div className="text-lg font-mono text-apple-gray-900">
              {Math.floor(currentTime.getTime() / 1000)}
            </div>
            <button
              onClick={() => copyToClipboard(Math.floor(currentTime.getTime() / 1000).toString())}
              className="mt-2 text-xs text-apple-gray-500 hover:text-apple-gray-700"
            >
              复制
            </button>
          </div>
          <div className="text-center p-4 bg-apple-gray-50 rounded-xl">
            <div className="text-sm text-apple-gray-600 mb-1">本地时间</div>
            <div className="text-lg font-mono text-apple-gray-900">
              {currentTime.toLocaleString('zh-CN')}
            </div>
          </div>
          <div className="text-center p-4 bg-apple-gray-50 rounded-xl">
            <div className="text-sm text-apple-gray-600 mb-1">UTC时间</div>
            <div className="text-lg font-mono text-apple-gray-900">
              {currentTime.toUTCString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 时间戳转日期 */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-title font-semibold text-apple-gray-900">
              时间戳转日期
            </h3>
            <button
              onClick={getCurrentTimestamp}
              className="apple-button-secondary text-sm"
            >
              当前时间戳
            </button>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="输入时间戳 (支持10位秒或13位毫秒)"
              className="apple-input"
            />
            
            {timestampError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <span className="font-medium">错误:</span> {timestampError}
                </p>
              </div>
            )}
            
            {timestampResult && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-apple-gray-700">转换结果</span>
                  <button
                    onClick={() => copyToClipboard(timestampResult)}
                    className="text-sm text-apple-gray-500 hover:text-apple-gray-700"
                  >
                    复制
                  </button>
                </div>
                <textarea
                  value={timestampResult}
                  readOnly
                  className="apple-textarea h-48 bg-apple-gray-50"
                />
              </div>
            )}
          </div>
        </div>

        {/* 日期转时间戳 */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-title font-semibold text-apple-gray-900">
              日期转时间戳
            </h3>
            <button
              onClick={getCurrentDate}
              className="apple-button-secondary text-sm"
            >
              当前时间
            </button>
          </div>
          
          <div className="space-y-4">
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="apple-input"
            />
            
            {dateError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <span className="font-medium">错误:</span> {dateError}
                </p>
              </div>
            )}
            
            {dateResult && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-apple-gray-700">转换结果</span>
                  <button
                    onClick={() => copyToClipboard(dateResult)}
                    className="text-sm text-apple-gray-500 hover:text-apple-gray-700"
                  >
                    复制
                  </button>
                </div>
                <textarea
                  value={dateResult}
                  readOnly
                  className="apple-textarea h-48 bg-apple-gray-50"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 功能说明 */}
      <div className="apple-card p-6">
        <h3 className="text-title font-semibold text-apple-gray-900 mb-4">
          使用说明
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-apple-gray-900 mb-2">时间戳格式</h4>
            <ul className="text-sm text-apple-gray-600 space-y-1">
              <li>• 10位数字：Unix时间戳（秒）</li>
              <li>• 13位数字：JavaScript时间戳（毫秒）</li>
              <li>• 自动识别并转换</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-apple-gray-900 mb-2">日期格式</h4>
            <ul className="text-sm text-apple-gray-600 space-y-1">
              <li>• 支持标准ISO格式</li>
              <li>• 支持本地化日期时间</li>
              <li>• 可通过日期选择器输入</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimestampTool;