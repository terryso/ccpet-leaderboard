# 🚀 CDN 部署指南

本指南将帮你将CCPET排行榜作为纯静态文件部署到CDN。

## 📦 生成静态文件

### 1. 构建静态文件
```bash
npm run build:static
```

这将在 `out/` 目录中生成所有静态文件。

### 2. 文件结构
生成的静态文件结构：
```
out/
├── index.html              # 主页面
├── 404.html               # 404错误页面
├── index.txt              # 站点地图
└── _next/                 # Next.js资源文件
    ├── static/
    │   ├── chunks/         # JavaScript代码块
    │   ├── css/           # CSS样式文件
    │   └── media/         # 字体文件
    └── 3h1YYJAFFJsckeIIlzYGX/
        ├── _buildManifest.js
        └── _ssgManifest.js
```

## 🌍 CDN部署选项

### 选项1: Vercel (推荐)
**免费，零配置，自动HTTPS**

1. 在Vercel创建账户
2. 导入GitHub仓库或拖拽 `out/` 文件夹
3. 自动部署完成

**优点：**
- ✅ 免费SSL证书
- ✅ 全球CDN
- ✅ 自动部署
- ✅ 自定义域名支持

### 选项2: Netlify
**免费额度，拖拽部署**

1. 访问 [Netlify](https://netlify.com)
2. 将 `out/` 文件夹拖拽到部署区域
3. 获得 `.netlify.app` 域名

**配置文件 `netlify.toml`（已存在）：**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 选项3: GitHub Pages
**完全免费，GitHub集成**

1. 将 `out/` 目录内容推送到 `gh-pages` 分支
2. 在GitHub仓库设置中启用Pages
3. 选择 `gh-pages` 分支作为源

**自动部署脚本：**
```bash
# 添加到package.json scripts
"deploy:github": "npm run build:static && gh-pages -d out"
```

### 选项4: Cloudflare Pages
**免费，极快的全球CDN**

1. 连接GitHub仓库到Cloudflare Pages
2. 构建设置：
   - 构建命令: `npm run build:static`
   - 输出目录: `out`
3. 自动部署

### 选项5: AWS S3 + CloudFront
**企业级，完全控制**

1. 创建S3存储桶
2. 上传 `out/` 目录所有文件
3. 配置CloudFront分发
4. 设置自定义域名

### 选项6: Surge.sh
**简单快速，免费部署**

1. 全局安装Surge CLI: `npm install -g surge`
2. 一键部署: `npm run deploy:surge`
3. 首次使用需要创建账户
4. 获得 `ccpet-leaderboard.surge.sh` 域名

**优点：**
- ✅ 完全免费
- ✅ 一键部署
- ✅ 自动HTTPS
- ✅ 无需配置

### 选项7: 阿里云OSS + CDN
**国内用户推荐**

1. 创建OSS存储桶
2. 上传静态文件
3. 配置CDN加速
4. 绑定自定义域名

## 🔧 部署配置

### 环境变量（如果需要）
如果你想使用环境变量而不是硬编码Supabase配置：

1. **创建 `.env.local`：**
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

2. **更新 `src/lib/supabase.ts`：**
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
```

### 自定义域名配置
大多数CDN支持自定义域名：

1. 添加CNAME记录指向CDN域名
2. 在CDN控制面板添加自定义域名
3. 配置SSL证书（通常自动）

## ⚡ 性能优化建议

### 1. 启用Gzip压缩
大多数CDN默认启用，确保以下文件类型被压缩：
- `.html`, `.css`, `.js`
- `.json`, `.xml`, `.txt`

### 2. 设置缓存头
建议的缓存策略：
```
/index.html: no-cache (always fresh)
/_next/static/: 1 year (immutable files)
/404.html: 1 day
```

### 3. 启用Brotli压缩
如果CDN支持，启用Brotli可以进一步减少文件大小。

## 🔒 CORS配置

如果遇到CORS错误，在CDN设置中添加：

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 📊 监控和分析

### 推荐监控工具：
- **Google Analytics**: 用户行为分析
- **Plausible**: 隐私友好的分析
- **CDN原生分析**: 流量和性能监控

## 🚀 快速部署命令

### 一键部署到不同平台：

**Vercel:**
```bash
npx vercel --prod
```

**Netlify:**
```bash
npx netlify-cli deploy --prod --dir=out
```

**GitHub Pages:**
```bash
npm run build
npx gh-pages -d out
```

**Surge.sh:**
```bash
npm run deploy:surge
```

## 🔄 自动化部署

### GitHub Actions工作流示例：
```yaml
name: Deploy to CDN
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build:static
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          working-directory: ./out
```

## ✅ 部署检查清单

部署前确保：
- [ ] 静态文件构建成功 (`npm run build`)
- [ ] Supabase配置正确
- [ ] CORS设置允许你的域名
- [ ] SSL证书配置
- [ ] 自定义域名解析（如果使用）
- [ ] 缓存策略设置
- [ ] 监控工具配置

## 🆘 故障排除

### 常见问题：

1. **页面空白**
   - 检查浏览器控制台错误
   - 确认Supabase配置正确
   - 检查CORS设置

2. **资源加载失败**
   - 确认 `_next/static/` 文件正确上传
   - 检查CDN缓存设置

3. **数据不显示**
   - 验证Supabase连接
   - 检查网络请求是否成功
   - 确认数据库中有数据

## 🎯 推荐部署流程

1. **开发测试** → 本地 `npm run dev`
2. **构建测试** → 本地 `npm run build` + 静态服务器测试
3. **暂存部署** → 测试环境部署
4. **生产部署** → CDN部署
5. **监控验证** → 检查性能和错误

---

选择最适合你的CDN平台，遵循本指南，你的CCPET排行榜很快就会在全球范围内快速可用！🚀