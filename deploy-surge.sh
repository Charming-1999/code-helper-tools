#!/bin/bash

# 构建项目
echo "🔨 构建项目..."
npm run build

# 使用 Surge 部署
echo "🚀 部署到 Surge..."
cd dist
surge . code-helper-tools.surge.sh

echo "✅ 部署完成！"
echo "🌐 访问地址: https://code-helper-tools.surge.sh"