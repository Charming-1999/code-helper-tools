import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QrCodeOptions {
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  color: {
    dark: string;
    light: string;
  };
  width: number;
}

const QrCodeTool: React.FC = () => {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [options, setOptions] = useState<QrCodeOptions>({
    errorCorrectionLevel: 'M',
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    width: 256
  });

  // 预设模板
  const templates = [
    {
      name: 'WiFi 连接',
      template: 'WIFI:T:WPA;S:网络名称;P:密码;H:false;;',
      description: '生成 WiFi 连接二维码'
    },
    {
      name: '联系人信息',
      template: 'BEGIN:VCARD\nVERSION:3.0\nFN:姓名\nORG:公司\nTEL:电话号码\nEMAIL:邮箱\nEND:VCARD',
      description: '生成联系人二维码'
    },
    {
      name: '短信',
      template: 'SMSTO:手机号码:短信内容',
      description: '生成短信二维码'
    },
    {
      name: '邮件',
      template: 'mailto:邮箱地址?subject=主题&body=内容',
      description: '生成邮件二维码'
    },
    {
      name: '地理位置',
      template: 'geo:39.9042,116.4074',
      description: '生成地理位置二维码'
    }
  ];

  // 生成二维码
  const generateQrCode = async () => {
    if (!text.trim()) {
      setQrCodeUrl('');
      setError('');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // 生成数据URL
      const url = await QRCode.toDataURL(text, {
        errorCorrectionLevel: options.errorCorrectionLevel,
        margin: options.margin,
        color: options.color,
        width: options.width,
      });
      setQrCodeUrl(url);

      // 同时在canvas上绘制
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, text, {
          errorCorrectionLevel: options.errorCorrectionLevel,
          margin: options.margin,
          color: options.color,
          width: options.width,
        });
      }
    } catch (err) {
      setError('生成二维码失败：' + (err instanceof Error ? err.message : '未知错误'));
      setQrCodeUrl('');
    } finally {
      setIsGenerating(false);
    }
  };

  // 使用模板
  const useTemplate = (template: string) => {
    setText(template);
  };

  // 下载二维码
  const downloadQrCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCodeUrl;
    link.click();
  };

  // 复制到剪贴板
  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 实时生成
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQrCode();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [text, options]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          二维码生成工具
        </h2>
        <p className="text-base text-gray-600">
          生成各种类型的二维码，支持文本、URL、WiFi、联系人等
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入和配置区域 */}
        <div className="space-y-6">
          {/* 文本输入 */}
          <div className="apple-card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              输入内容
            </h3>
            
            <div className="space-y-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="输入要生成二维码的内容..."
                className="apple-textarea h-32"
              />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {text.length} 字符
                </span>
                <button
                  onClick={() => setText('')}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  清空
                </button>
              </div>
            </div>
          </div>

          {/* 配置选项 */}
          <div className="apple-card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              生成配置
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  容错级别
                </label>
                <select
                  value={options.errorCorrectionLevel}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H'
                  }))}
                  className="apple-input"
                >
                  <option value="L">低 (L) ~7%</option>
                  <option value="M">中 (M) ~15%</option>
                  <option value="Q">高 (Q) ~25%</option>
                  <option value="H">最高 (H) ~30%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  尺寸: {options.width}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={options.width}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    width: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  边距: {options.margin}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={options.margin}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    margin: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    前景色
                  </label>
                  <input
                    type="color"
                    value={options.color.dark}
                    onChange={(e) => setOptions(prev => ({
                      ...prev,
                      color: { ...prev.color, dark: e.target.value }
                    }))}
                    className="w-full h-10 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    背景色
                  </label>
                  <input
                    type="color"
                    value={options.color.light}
                    onChange={(e) => setOptions(prev => ({
                      ...prev,
                      color: { ...prev.color, light: e.target.value }
                    }))}
                    className="w-full h-10 rounded-lg border border-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 预览和结果区域 */}
        <div className="space-y-6">
          {/* 二维码预览 */}
          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                二维码预览
              </h3>
              {qrCodeUrl && (
                <div className="flex space-x-2">
                  <button
                    onClick={downloadQrCode}
                    className="apple-button-secondary text-sm"
                  >
                    下载
                  </button>
                  <button
                    onClick={() => copyToClipboard(text)}
                    className="apple-button-primary text-sm"
                  >
                    复制内容
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              {isGenerating ? (
                <div className="flex items-center justify-center w-64 h-64 bg-gray-50 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : qrCodeUrl ? (
                <div className="relative">
                  <img
                    src={qrCodeUrl}
                    alt="Generated QR Code"
                    className="max-w-full h-auto rounded-lg shadow-sm"
                    style={{ width: options.width, height: options.width }}
                  />
                  <canvas
                    ref={canvasRef}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-64 h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 text-center">
                    输入内容后将自动生成二维码
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <span className="font-medium">错误:</span> {error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 模板选择 */}
      <div className="apple-card p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          常用模板
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template, index) => (
            <button
              key={index}
              onClick={() => useTemplate(template.template)}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900 mb-2">
                {template.name}
              </div>
              <div className="text-sm text-gray-600">
                {template.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 使用说明 */}
      <div className="apple-card p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          使用说明
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">支持的内容类型</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 普通文本和URL链接</li>
              <li>• WiFi网络信息</li>
              <li>• 联系人信息 (vCard)</li>
              <li>• 短信和邮件</li>
              <li>• 地理位置坐标</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">容错级别说明</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• L级: 约7%容错，适合清晰环境</li>
              <li>• M级: 约15%容错，一般推荐</li>
              <li>• Q级: 约25%容错，复杂环境</li>
              <li>• H级: 约30%容错，损坏环境</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeTool;