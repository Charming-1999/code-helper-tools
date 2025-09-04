# Vercel 部署指南

## 🚀 部署步骤

### 1. GitHub 仓库准备
确保代码已推送到 GitHub 仓库：`https://github.com/Charming-1999/code-helper-tools`

### 2. Vercel 部署配置

#### 在 Vercel 控制台中：
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### 高级配置（可选）：
- **Node.js Version**: `18.x`
- **Function Region**: `hkg1` (香港区域，访问更快)

### 3. 环境变量（如需要）
```
NODE_ENV=production
```

### 4. 自动部署
- 推送到 main 分支会自动触发部署
- 部署完成后会获得访问链接

## 📋 配置文件说明

### vercel.json
```json
{
  "framework": "vite",
  "buildCommand": "npm run build", 
  "outputDirectory": "dist",
  "cleanUrls": false,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### vite.config.ts 关键配置
- `base: '/'` - 使用绝对路径，适合 Vercel
- `build.rollupOptions` - 优化构建输出

## 🔧 故障排除

### 空白页问题解决方案：
1. 确保 `base: '/'` 在 vite.config.ts 中
2. 检查 vercel.json 中的 rewrites 配置
3. 确认构建输出的 dist 目录结构正确

### 检查部署状态：
1. 访问 Vercel 控制台查看构建日志
2. 检查 Functions 标签页是否有错误
3. 查看 Deployments 历史记录

## 📱 访问方式
部署成功后，可通过以下方式访问：
- Vercel 提供的域名：`https://你的项目名.vercel.app`
- 自定义域名（如已配置）

## 🎯 性能优化建议
- 启用 Edge Functions（如需要）
- 配置 CDN 缓存策略
- 使用 Vercel Analytics（可选）