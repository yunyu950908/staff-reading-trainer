# 五线谱识谱训练工具 | Staff Reading Trainer

<div align="center">

一个基于**间隔重复算法**的现代化五线谱识谱训练 Web 应用

A modern web-based music notation learning tool powered by **Spaced Repetition System**

[English](#english) | [中文](#中文)

</div>

---

## 项目简介

这是一个使用 **SM-2 间隔重复算法**（类似 Anki）的五线谱识谱训练工具，帮助音乐学习者高效记忆和掌握五线谱音符位置。

## 核心特性

### 智能学习系统

- **SM-2 间隔重复算法** - 科学调整复习间隔，优化长期记忆
- **双谱号支持** - 高音谱号（C4-E6）和低音谱号（E2-G4）
- **自定义音符范围** - 针对性练习特定音符区间
- **四音符模式** - 同时识别 4 个音符，提升挑战难度
- **无限模式** - 不受 SRS 时间限制，持续练习

### 交互体验

- **键盘快捷键** - 数字键 1-7 快速答题，R 重试，Enter 继续
- **智能反馈** - 答对评级（Again/Hard/Good/Easy），答错可重试
- **实时统计** - 学习进度、正确率、卡片状态一目了然
- **音符范围预览** - 可视化预览自定义范围的音符分布

### 技术亮点

- **双语支持** - 完整的中文/英文界面
- **本地存储** - 所有数据保存在浏览器，支持离线使用
- **响应式设计** - 完美适配桌面和移动设备
- **现代化技术栈** - React 19 + TypeScript + Vite

## 快速开始

### 环境要求

- Node.js 18+
- pnpm（推荐）或 npm

### 安装与运行

```bash
# 克隆仓库
git clone <repository-url>
cd staff-reading-trainer

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

访问 `http://localhost:5173` 即可开始使用。

## 使用指南

### 1. 初始化卡片

首次使用时：

1. 进入 **Settings（设置）** 页面
2. （可选）点击 **Show Advanced Settings（显示高级设置）**
3. 选择要启用的谱号和音符范围
4. 点击 **Initialize Cards（初始化卡片）** 创建学习卡片

### 2. 配置音符范围（可选）

展开高级设置后可以：

**启用谱号**

- 高音谱号（Treble Clef）：C4 - E6
- 低音谱号（Bass Clef）：E2 - G4

**自定义范围示例**

初学者 - 中央区域：

```
Treble: C4 - C5
Bass:   C3 - C4
```

高音区强化：

```
Treble: C5 - E6
Bass:   禁用
```

低音区强化：

```
Treble: 禁用
Bass:   E2 - G3
```

### 3. 开始训练

1. 在 Settings 中选择当前要练习的谱号
2. 进入 **Training（训练）** 页面
3. 看到五线谱音符后，使用键盘或鼠标回答

### 4. 回答与评级

**答对时**：

- 选择难度评级：
  - **Again（重来）** - 完全不记得
  - **Hard（困难）** - 记得但很困难
  - **Good（良好）** - 记得，稍有犹豫
  - **Easy（简单）** - 完全记得
- 快捷键：按 `Enter` 或 `Space` 自动评为 "Good"

**答错时**：

- **Retry (R)** - 重新尝试同一张卡片
- **Continue (Enter)** - 继续到下一张（标记为需重新学习）

### 5. 查看统计

在 **Statistics（统计）** 页面查看：

- 总卡片数、新卡片数、学习中的卡片
- 待复习卡片数
- 今日学习数、总复习数
- 正确率

## 键盘快捷键

| 场景   | 按键              | 功能               |
| ------ | ----------------- | ------------------ |
| 答题   | `1-7`             | 选择音符 C-B       |
| 答对后 | `Enter` / `Space` | 评为 "Good" 并继续 |
| 答错后 | `R`               | 重新尝试           |
| 答错后 | `Enter` / `Space` | 继续到下一题       |

## 技术栈

| 类别       | 技术                    | 版本    |
| ---------- | ----------------------- | ------- |
| 框架       | React                   | 19.2.0  |
| 构建工具   | Vite (rolldown-vite)    | 7.2.5   |
| 语言       | TypeScript              | 5.9.3   |
| 样式       | Tailwind CSS            | 4.1.17  |
| UI 组件    | shadcn/ui + Radix UI    | -       |
| 五线谱渲染 | VexFlow                 | 5.0.0   |
| 状态管理   | Jotai                   | 2.15.1  |
| 国际化     | i18next + react-i18next | 25.6.3  |
| 工具库     | Lodash                  | 4.17.21 |

## 项目结构

```
src/
├── components/              # UI 组件
│   ├── ui/                 # shadcn/ui 基础组件
│   ├── StaffNotation.tsx   # 五线谱渲染组件
│   ├── NoteSelector.tsx    # 音符选择器
│   └── NoteRangePreview.tsx # 音符范围预览
├── features/               # 功能模块
│   ├── training/           # 训练功能
│   │   ├── TrainingSession.tsx  # 训练会话
│   │   └── SetupPanel.tsx       # 设置面板
│   └── statistics/         # 统计功能
│       └── StatsPanel.tsx       # 统计面板
├── hooks/                  # 自定义 Hooks
│   └── use-keyboard.ts     # 键盘快捷键处理
├── lib/                    # 核心业务逻辑
│   ├── srs.ts             # SM-2 间隔重复算法
│   ├── notes.ts           # 音符处理工具
│   ├── storage.ts         # LocalStorage 持久化
│   ├── init-cards.ts      # 卡片初始化
│   ├── presets.ts         # 预设配置
│   └── utils.ts           # 通用工具函数
├── store/                  # Jotai 状态管理
│   └── index.ts           # 全局状态原子
├── types/                  # TypeScript 类型定义
│   └── index.ts           # 核心类型
├── locales/                # 国际化翻译文件
│   ├── en.json            # 英文翻译
│   └── zh.json            # 中文翻译
└── i18n.ts                 # i18next 配置
```

## SM-2 间隔重复算法

本项目使用 **SuperMemo 2 (SM-2)** 算法，这是 Anki 等知名记忆软件的核心算法：

- **首次学习**：间隔 1 天
- **第二次**：间隔 6 天
- **之后**：根据难度评分动态调整间隔
- **遗忘**：评分 "Again" 会重置学习进度

算法会根据你的评分自动调整难度系数（Ease Factor）和复习间隔，确保在最佳时机复习，提高学习效率。

## 部署

### Cloudflare Pages（推荐）

1. 将代码推送到 GitHub
2. 在 Cloudflare Pages 中连接仓库
3. 配置构建设置：
   - **构建命令**：`pnpm build`
   - **输出目录**：`dist`
   - **Node 版本**：18+

项目已包含 Cloudflare Pages 所需的配置文件：

- `public/_headers` - HTTP 安全头配置
- `public/_redirects` - SPA 路由重定向

### 其他平台

本项目是标准的静态 SPA，可部署到任何静态托管平台（Vercel、Netlify、GitHub Pages 等）。

## 数据存储

所有数据存储在浏览器的 LocalStorage：

- 学习卡片数据（`staff-training-cards`）
- 学习统计（`staff-training-stats`）
- 用户设置（`selected-clef`、`training-config` 等）
- 语言偏好（`i18nextLng`）

**注意**：清除浏览器数据会导致学习进度丢失。

## 开发文档

详细文档请查看 `docs/` 目录：

- [快速开始指南](docs/QUICKSTART.md)
- [功能总结](docs/SUMMARY.md)
- [音符范围定制](docs/RANGE_CUSTOMIZATION.md)
- [更新日志](docs/CHANGELOG.md)

## 常见问题

**Q: 如何重置所有进度？**
A: 进入 Settings 页面，点击 "Reset All Progress" 按钮。

**Q: 支持哪些音符？**
A: 高音谱号支持 C4-E6（17 个音符），低音谱号支持 E2-G4（17 个音符）。

**Q: 可以离线使用吗？**
A: 可以！所有功能都在本地运行，不需要网络连接。

**Q: 数据如何备份？**
A: 数据存储在 LocalStorage，可通过浏览器的开发者工具导出。

## 许可证

MIT License - 可自由使用和修改
