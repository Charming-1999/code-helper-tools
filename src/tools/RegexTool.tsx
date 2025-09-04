import React, { useState, useEffect } from 'react';

interface RegexMatch {
  match: string;
  index: number;
  groups?: string[];
}

const RegexTool: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // 常用正则表达式模板
  const regexTemplates = [
    {
      name: '邮箱地址',
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      example: 'user@example.com'
    },
    {
      name: '手机号码',
      pattern: '1[3-9]\\d{9}',
      example: '13812345678'
    },
    {
      name: 'IP地址',
      pattern: '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
      example: '192.168.1.1'
    },
    {
      name: 'URL链接',
      pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?',
      example: 'https://www.example.com'
    },
    {
      name: '身份证号',
      pattern: '[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]',
      example: '110101199001011234'
    },
    {
      name: '日期 (YYYY-MM-DD)',
      pattern: '\\d{4}-\\d{2}-\\d{2}',
      example: '2024-01-01'
    },
    {
      name: '时间 (HH:MM:SS)',
      pattern: '([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]',
      example: '14:30:25'
    },
    {
      name: '十六进制颜色',
      pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})',
      example: '#FF5733'
    }
  ];

  // 测试正则表达式
  const testRegex = () => {
    try {
      setError('');
      setMatches([]);

      if (!pattern) {
        setIsValid(null);
        return;
      }

      // 创建正则表达式对象
      const regex = new RegExp(pattern, flags);
      setIsValid(true);

      if (!testString) {
        return;
      }

      const foundMatches: RegexMatch[] = [];
      
      if (flags.includes('g')) {
        // 全局匹配
        let match;
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          
          // 防止无限循环
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        // 单次匹配
        const match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      setMatches(foundMatches);
    } catch (err) {
      setError(err instanceof Error ? err.message : '正则表达式错误');
      setIsValid(false);
      setMatches([]);
    }
  };

  // 使用模板
  const useTemplate = (template: typeof regexTemplates[0]) => {
    setPattern(template.pattern);
    setTestString(template.example);
  };

  // 切换标志
  const toggleFlag = (flag: string) => {
    setFlags(prevFlags => {
      if (prevFlags.includes(flag)) {
        return prevFlags.replace(flag, '');
      } else {
        return prevFlags + flag;
      }
    });
  };

  // 实时测试
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      testRegex();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [pattern, flags, testString]);

  // 高亮匹配结果
  const highlightMatches = (text: string, matches: RegexMatch[]): JSX.Element[] => {
    if (matches.length === 0) {
      return [<span key="0">{text}</span>];
    }

    const elements: JSX.Element[] = [];
    let lastIndex = 0;

    matches.forEach((match, index) => {
      // 添加匹配前的文本
      if (match.index > lastIndex) {
        elements.push(
          <span key={`before-${index}`}>
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }

      // 添加高亮的匹配文本
      elements.push(
        <span
          key={`match-${index}`}
          className="bg-yellow-200 px-1 rounded font-medium"
        >
          {match.match}
        </span>
      );

      lastIndex = match.index + match.match.length;
    });

    // 添加最后的文本
    if (lastIndex < text.length) {
      elements.push(
        <span key="after">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-headline font-bold text-apple-gray-900 mb-2">
          正则表达式测试器
        </h2>
        <p className="text-body text-apple-gray-600">
          测试和调试正则表达式，支持实时匹配预览
        </p>
      </div>

      {/* 正则表达式输入 */}
      <div className="apple-card p-6">
        <h3 className="text-title font-semibold text-apple-gray-900 mb-4">
          正则表达式
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="输入正则表达式..."
                className={`apple-input font-mono ${
                  isValid === false ? 'border-red-300' : ''
                }`}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-apple-gray-700">标志:</span>
              {['g', 'i', 'm', 's'].map(flag => (
                <button
                  key={flag}
                  onClick={() => toggleFlag(flag)}
                  className={`px-2 py-1 text-sm rounded ${
                    flags.includes(flag)
                      ? 'bg-apple-gray-900 text-white'
                      : 'bg-apple-gray-100 text-apple-gray-700 hover:bg-apple-gray-200'
                  }`}
                >
                  {flag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isValid !== null && (
              <div className={`flex items-center space-x-1 ${
                isValid ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{isValid ? '✓' : '✗'}</span>
                <span className="text-sm">
                  {isValid ? '正则表达式有效' : '正则表达式无效'}
                </span>
              </div>
            )}
            
            {matches.length > 0 && (
              <div className="text-sm text-apple-gray-600">
                找到 {matches.length} 个匹配
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                <span className="font-medium">错误:</span> {error}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 测试字符串 */}
      <div className="apple-card p-6">
        <h3 className="text-title font-semibold text-apple-gray-900 mb-4">
          测试字符串
        </h3>
        
        <div className="space-y-4">
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="输入要测试的字符串..."
            className="apple-textarea h-32"
          />
          
          {testString && (
            <div className="p-4 bg-apple-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-apple-gray-700 mb-2">
                匹配预览:
              </h4>
              <div className="text-sm leading-relaxed font-mono whitespace-pre-wrap">
                {highlightMatches(testString, matches)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 匹配结果 */}
      {matches.length > 0 && (
        <div className="apple-card p-6">
          <h3 className="text-title font-semibold text-apple-gray-900 mb-4">
            匹配结果
          </h3>
          
          <div className="space-y-2">
            {matches.map((match, index) => (
              <div key={index} className="p-3 bg-apple-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-apple-gray-700">
                    匹配 #{index + 1}
                  </span>
                  <span className="text-xs text-apple-gray-500">
                    位置: {match.index}
                  </span>
                </div>
                <div className="font-mono text-sm text-apple-gray-900 mb-2">
                  "{match.match}"
                </div>
                {match.groups && match.groups.length > 0 && (
                  <div className="text-xs text-apple-gray-600">
                    <span className="font-medium">捕获组:</span>
                    {match.groups.map((group, groupIndex) => (
                      <span key={groupIndex} className="ml-2">
                        ${groupIndex + 1}: "{group}"
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 常用模板 */}
      <div className="apple-card p-6">
        <h3 className="text-title font-semibold text-apple-gray-900 mb-4">
          常用正则表达式
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {regexTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => useTemplate(template)}
              className="p-3 text-left border border-apple-gray-200 rounded-lg hover:bg-apple-gray-50 transition-colors"
            >
              <div className="font-medium text-apple-gray-900 mb-1">
                {template.name}
              </div>
              <div className="text-xs font-mono text-apple-gray-600 mb-1">
                {template.pattern}
              </div>
              <div className="text-xs text-apple-gray-500">
                示例: {template.example}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 标志说明 */}
      <div className="apple-card p-6">
        <h3 className="text-title font-semibold text-apple-gray-900 mb-4">
          标志说明
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <code className="px-2 py-1 bg-apple-gray-100 rounded text-sm">g</code>
              <span className="text-sm font-medium">全局匹配</span>
            </div>
            <p className="text-xs text-apple-gray-600 mb-3">查找所有匹配，而不是第一个</p>
            
            <div className="flex items-center space-x-2 mb-1">
              <code className="px-2 py-1 bg-apple-gray-100 rounded text-sm">i</code>
              <span className="text-sm font-medium">忽略大小写</span>
            </div>
            <p className="text-xs text-apple-gray-600">不区分大小写进行匹配</p>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <code className="px-2 py-1 bg-apple-gray-100 rounded text-sm">m</code>
              <span className="text-sm font-medium">多行模式</span>
            </div>
            <p className="text-xs text-apple-gray-600 mb-3">^ 和 $ 匹配每行的开始和结束</p>
            
            <div className="flex items-center space-x-2 mb-1">
              <code className="px-2 py-1 bg-apple-gray-100 rounded text-sm">s</code>
              <span className="text-sm font-medium">单行模式</span>
            </div>
            <p className="text-xs text-apple-gray-600">. 匹配包括换行符在内的所有字符</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTool;