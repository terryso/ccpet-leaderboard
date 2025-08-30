# 🐾 CCPET 排行榜

一个美观的实时排行榜应用，专为 Claude Code 虚拟宠物（CCPET）设计。使用 Next.js 15 和 Supabase 构建，实时追踪宠物的 token 使用量、成本和生存时间，提供引人入胜的竞技体验！

## ✨ 核心功能

### 🏆 实时排行榜
- **多时间段排名**：今日、7天、30天、全时段排行榜
- **智能排序**：按 token 使用量、成本或生存时间排序
- **实时更新**：数据变化时自动刷新排名
- **分页显示**：支持大量宠物数据的分页浏览

### 🐾 宠物展示
- **可爱表情符号**：根据宠物类型自动匹配表情符号（🐱🐶🐰等）
- **生存状态**：清晰显示宠物存活状态（✅ 存活 / 💀 死亡）
- **详细信息**：宠物名称、类型、生存天数
- **使用统计**：输入/输出 token 数量和总成本

### 📱 响应式设计
- **移动端优化**：卡片式布局，完美适配手机屏幕
- **桌面端表格**：详细的表格视图，展示完整数据
- **自适应界面**：根据屏幕尺寸自动调整布局
- **现代化UI**：使用 Shadcn/ui 组件库，界面美观统一

### 🔧 技术特性
- **错误边界**：完善的错误处理和恢复机制
- **水合优化**：防止 SSR/CSR 不匹配问题
- **请求管理**：AbortController 取消无效请求
- **性能优化**：智能缓存和数据聚合

## 🚀 快速开始

### 环境要求
- **Node.js** 18+ 
- **包管理器** npm/yarn/bun
- **数据库** 配置好的 CCPET Supabase 实例

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/ccpet-leaderboard
   cd ccpet-leaderboard
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或者
   bun install
   ```

3. **配置数据库**
   
   在 `src/lib/supabase.ts` 中更新 Supabase 配置：
   ```typescript
   const supabaseUrl = 'your-supabase-url'
   const supabaseAnonKey = 'your-supabase-anon-key'
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或者使用 Turbopack（更快）
   npm run dev --turbo
   ```

5. **访问应用**
   
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 🏗️ 项目架构

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主排行榜页面
│   ├── layout.tsx         # 根布局（包含 ErrorBoundary）
│   ├── ClientBody.tsx     # 客户端包装器（防水合问题）
│   └── globals.css        # 全局样式
├── components/
│   ├── ui/                # Shadcn/ui 组件
│   │   ├── badge.tsx      # 徽章组件
│   │   ├── button.tsx     # 按钮组件
│   │   ├── table.tsx      # 表格组件
│   │   ├── tabs.tsx       # 标签页组件
│   │   └── loading-skeleton.tsx # 加载和错误状态
│   └── ErrorBoundary.tsx  # 错误边界组件
├── hooks/
│   └── useLeaderboard.ts  # 排行榜数据钩子
└── lib/
    ├── supabase.ts        # Supabase 客户端和类型定义
    └── utils.tsx          # 工具函数
```

## 📊 数据库结构

应用连接到 CCPET 的 Supabase 数据库，主要使用以下表：

### `pet_records` 表
- `id`: 宠物唯一标识
- `pet_name`: 宠物名称
- `animal_type`: 动物类型（cat, dog, rabbit 等）
- `emoji`: 自定义表情符号
- `birth_time`: 出生时间
- `death_time`: 死亡时间（可为空）
- `survival_days`: 生存天数

### `token_usage` 表
- `pet_id`: 关联的宠物ID
- `usage_date`: 使用日期
- `input_tokens`: 输入 token 数量
- `output_tokens`: 输出 token 数量
- `total_tokens`: 总 token 数量
- `cost_usd`: 美元成本
- `model_name`: 使用的模型名称

## 🛠️ 技术栈

### 前端框架
- **[Next.js 15](https://nextjs.org/)** - React 全栈框架，使用 App Router
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript
- **[React 18](https://react.dev/)** - 用户界面库

### 样式和UI
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架
- **[Shadcn/ui](https://ui.shadcn.com/)** - 现代化 React 组件库
- **[Lucide React](https://lucide.dev/)** - 美观的图标库
- **[Class Variance Authority](https://cva.style/)** - 组件变体管理

### 后端和数据
- **[Supabase](https://supabase.com/)** - 后端即服务，提供数据库和实时功能
- **PostgreSQL** - 通过 Supabase 提供的关系型数据库

### 开发工具
- **[Biome](https://biomejs.dev/)** - 快速的代码格式化和检查工具
- **[ESLint](https://eslint.org/)** - JavaScript/TypeScript 代码检查
- **PostCSS** - CSS 后处理器

## 🎯 核心功能详解

### 🏆 排名系统
- **动态排序**：支持按 token 使用量、成本、生存时间排序
- **实时更新**：数据变化时自动重新计算排名
- **分页支持**：处理大量宠物数据，默认显示前25名
- **时间过滤**：支持今日、7天、30天、全时段的数据筛选

### 📈 数据聚合
- **智能聚合**：自动汇总同一宠物的多条 token 使用记录
- **时间范围**：根据选择的时间段过滤数据
- **性能优化**：使用 Map 数据结构提高聚合效率
- **错误处理**：完善的数据验证和错误恢复

### 🔄 状态管理
- **请求取消**：使用 AbortController 取消无效请求
- **加载状态**：优雅的加载动画和骨架屏
- **错误恢复**：用户友好的错误提示和重试机制
- **防抖优化**：避免频繁的数据请求

### 🎨 用户体验
- **响应式布局**：移动端卡片式，桌面端表格式
- **平滑动画**：使用 Tailwind CSS 动画
- **无障碍支持**：语义化 HTML 和键盘导航
- **深色模式**：支持系统主题切换

## 🚀 部署指南

### Vercel（推荐）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署到生产环境
vercel --prod
```

### Netlify
```bash
# 构建项目
npm run build

# 部署到 Netlify
npx netlify-cli deploy --prod --dir=.next
```

### Surge.sh（快速部署）
```bash
# 使用内置脚本
npm run deploy:surge
```

### 静态导出
```bash
# 生成静态文件
npm run build

# 静态文件位于 .next 目录
```

更多部署选项请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔧 自定义配置

### 修改宠物表情符号
在 `src/lib/supabase.ts` 中的 `getAnimalEmoji` 函数：
```typescript
const emojiMap: { [key: string]: string } = {
  cat: '🐱',
  dog: '🐶', 
  rabbit: '🐰',
  // 添加更多映射...
}
```

### 调整排序逻辑
在 `src/hooks/useLeaderboard.ts` 中的 `sortLeaderboardData` 函数：
```typescript
case 'custom':
  sortedData.sort((a, b) => {
    // 自定义排序逻辑
  })
  break
```

### 修改时间段
在 `src/hooks/useLeaderboard.ts` 中的 `getDateFilter` 函数添加新的时间段选项。

## 🔍 故障排除

### 常见问题

**1. 页面频繁刷新时出现错误**
- 已实现 AbortController 取消机制
- 增加了 15 秒超时时间
- 添加了水合状态管理

**2. 数据不显示**
- 检查 Supabase 配置是否正确
- 确认数据库中有 `pet_records` 和 `token_usage` 数据
- 查看浏览器控制台的网络请求

**3. 样式问题**
- 确保 Tailwind CSS 正确配置
- 检查 `globals.css` 是否正确导入
- 验证 Shadcn/ui 组件是否正确安装

### 调试模式
开发环境下，ErrorBoundary 会显示详细的错误信息，帮助快速定位问题。

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. **Fork 项目**
2. **创建功能分支** (`git checkout -b feature/amazing-feature`)
3. **提交更改** (`git commit -m 'Add some amazing feature'`)
4. **推送分支** (`git push origin feature/amazing-feature`)
5. **创建 Pull Request**

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 Biome 的代码格式化规则
- 编写有意义的提交信息
- 添加必要的注释和文档

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢 CCPET 社区的支持和反馈
- 感谢所有为项目做出贡献的开发者
- 特别感谢那些让虚拟宠物保持活力的用户们！🐾

---

**快速开始命令：**
```bash
npx ccpet  # 创建你的虚拟宠物
```

让你的宠物快乐成长，攀登排行榜！🚀
