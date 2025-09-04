import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CT</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Code Helper Tools
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              为后端工程师量身打造的在线工具集合，提供简洁高效的日常开发工具，
              采用苹果风格的设计理念，让工作更加优雅。
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">工具分类</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">数据处理</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">时间工具</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">文本处理</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">编码解码</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">关于项目</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">开源代码</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">功能建议</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">问题反馈</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">使用指南</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            © 2024 Code Helper Tools. 专为开发者设计的工具集合。
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              隐私政策
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              使用条款
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;