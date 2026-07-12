# 鲜知 FreshKnow

让冰箱会说话，用现有食材秒出菜谱。智能冰箱食材管家，帮你减少食物浪费，发现更多美味。

## 功能特性

- 🍎 **冰箱管理** - 快速录入食材，追踪保质期，临期提醒
- 🍳 **智能菜谱** - 根据现有食材一键推荐菜谱
- 🛒 **购物清单** - 缺什么记什么，买菜不遗漏
- 👨‍👩‍👧 **全家共享** - 邀请家人共享冰箱，一起管理
- 📱 **PWA 支持** - 可安装到桌面，离线也能用

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 样式**: Tailwind CSS v4
- **状态管理**: Zustand + localStorage 持久化
- **路由管理**: React Router v6
- **PWA**: vite-plugin-pwa
- **部署**: Vercel + Serverless Functions

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
# 启动前端开发服务器
npm run dev

# 启动 Mock 服务（另开终端）
node mock-server/server.js
```

访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

## 部署到 Vercel

### 一键部署

1. 将代码推送到 GitHub 仓库
2. 登录 [Vercel](https://vercel.com)，导入项目
3. Vercel 会自动识别 Vite 项目，配置构建参数
4. 配置环境变量（见下文）
5. 点击 Deploy，等待部署完成

### 环境变量

| 变量名 | 说明 | 必填 | 示例 |
|--------|------|------|------|
| `VITE_APP_NAME` | 应用名称 | 否 | 鲜知 FreshKnow |
| `VITE_APP_DESCRIPTION` | 应用描述 | 否 | 让冰箱会说话 |
| `VITE_APP_THEME_COLOR` | 主题色 | 否 | #22c55e |
| `VITE_UMAMI_WEBSITE_ID` | Umami 网站 ID | 否 | xxxxxxxx-xxxx-xxxx |
| `VITE_UMAMI_SCRIPT_URL` | Umami 脚本地址 | 否 | https://cloud.umami.is/script.js |
| `VITE_FEEDBACK_URL` | 反馈表单链接 | 否 | https://wj.qq.com/xxx |

> 注意：
> - `VITE_` 前缀的变量会在构建时注入到前端代码中
> - Umami 和反馈表单配置为可选，不配置时对应功能自动隐藏

### Serverless 函数

项目使用 Vercel Serverless Functions 提供 Mock API，所有接口位于 `api/` 目录：

```
api/
├── v1/
│   ├── recipes/
│   │   ├── match.ts       # POST 食材匹配菜谱
│   │   └── generate.ts    # POST AI生成菜谱
│   ├── shopping-list/
│   │   ├── index.ts       # GET/POST 购物清单
│   │   └── [id].ts        # PUT/DELETE 购物清单项
│   └── fridge/
│       ├── share.ts       # POST 邀请共享成员
│       └── members/
│           └── [id].ts    # DELETE 移除成员
└── _data.ts               # 共享 Mock 数据
```

> ⚠️ Serverless 函数是无状态的，数据存储在内存中，冷启动后会重置。生产环境需要接入真实数据库。

## 项目结构

```
src/
├── features/
│   └── fresh-know/        # 鲜知业务模块
│       ├── components/    # 页面组件
│       ├── api.ts         # API 调用
│       └── types.ts       # 类型定义
├── components/
│   └── shared/            # 共享组件
├── store/                 # 状态管理
├── lib/                   # 工具库
│   ├── api-client.ts      # API 客户端
│   └── analytics.ts       # 埋点工具
├── types/                 # 全局类型
└── main.tsx               # 入口文件
```

## 核心流程

1. **添加食材** → 录入冰箱食材，设置保质期
2. **菜谱推荐** → 基于现有食材智能匹配菜谱
3. **加入清单** → 缺少的食材一键加入购物清单
4. **全家共享** → 邀请家人，共同管理冰箱

## 埋点说明

项目集成 Umami 行为埋点，跟踪以下核心事件：

- `add_ingredient` - 添加食材
- `generate_recipe` - 生成菜谱（match/ai）
- `add_to_shopping_list` - 加入购物清单
- `share_invite` - 邀请共享成员

## 上线检查清单

- [ ] 核心流程走通：添加食材 → 菜谱推荐 → 加入清单 → 共享邀请
- [ ] PWA 可正常安装到桌面
- [ ] 移动端响应式布局正常
- [ ] 错误场景有友好提示
- [ ] Umami 埋点正常发送
- [ ] 反馈入口正常跳转
- [ ] 环境变量配置正确

## 常见问题

### 为什么数据刷新后丢失了？

Vercel Serverless 函数是无状态的，Mock 数据存储在内存中。函数冷启动后数据会重置。生产环境需要接入真实的数据库服务。

### 如何配置自定义域名？

在 Vercel 项目设置 → Domains 中添加自定义域名，按照提示配置 DNS 解析即可。

### PWA 图标不显示？

确保 `public/` 目录下有 `icon-192.svg` 和 `icon-512.svg` 图标文件。

## License

MIT
