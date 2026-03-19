# Web Tools Collection 设计规范 (Design Specification)

本规范定义了 Web Tools Collection 项目的视觉风格、交互逻辑与组件标准，旨在确保所有现有工具及未来新增工具在视觉与易用性上保持高度一致。

---

## 1. 核心设计原则
- **现代与简约 (Modern & Minimalist)**: 减少不必要的视觉噪音，聚焦功能本身。
- **响应式布局 (Responsive Layout)**: 完美适配桌面、平板与移动端。
- **Slate/Grayscale 配色**: 使用 Slate (石板灰) 作为基础色调，营造高端、专业的质感。
- **暗色模式支持 (Dark Mode)**: 全局支持平滑的暗色切换，并持久化用户偏好。

---

## 2. 配色方案 (Color Palette)

项目统一使用 Tailwind CSS 的 **Slate** 色系。

### 2.1 基础色 (Foundations)
| 状态 | 背景 (Background) | 文本 (Text) | 边框 (Border) |
| :--- | :--- | :--- | :--- |
| **亮色模式** | `Slate-50` / `White` | `Slate-900` | `Slate-200` |
| **暗色模式** | `Slate-950` / `Slate-900` | `Slate-100` | `Slate-800` |

### 2.2 辅助色 (Status Colors)
- **成功 (Success)**: `Emerald-500` (用于 Toast 成功提示、成功图标)。
- **错误 (Error)**: `Rose-500` / `Rose-600` (用于删除按钮、警告提示)。
- **提示 (Info)**: `Slate-400` / `Slate-500` (用于次要文本、占位符)。

---

## 3. 字体与图标 (Typography & Icons)

### 3.1 字体 (Fonts)
- **正文/界面**: `Inter`, system-ui, sans-serif。
- **代码/等宽**: `JetBrains Mono`, `Fira Code`, monospace。

### 3.2 图标 (Icons)
- **库**: [RemixIcon](https://remixicon.com/) (版本: `4.9.1`)。
- **用法**: 严禁使用 Emoji 代替功能图标。所有交互元素应优先配以对应的 RemixIcon。

---

## 4. 页面结构标准 (Page Architecture)

### 4.1 头部 (Header - 64px/H-16)
- **左侧**: 返回首页按钮 (`ri-arrow-left-line`) + 工具图标 + 工具名称。
- **右侧**: 功能按钮 (如复制、导出) + 主题切换按钮 (`ri-sun-line`/`ri-moon-line`)。
- **效果**: 粘性定位 (Sticky)，带有 `backdrop-blur` 模糊效果。

### 4.2 底部状态栏 (Status Bar - 40px/H-10)
- **内容**: 状态提示 (如 "就绪")、统计信息 (字数、行数) 或最后更新时间。
- **样式**: 使用 `text-[10px]` 极小字体，`font-bold` 加粗且 `uppercase` 大写加宽。

### 4.3 容器 (Container)
- 工具主体应垂直或水平撑满屏幕 `min-h-screen`。
- 多功能工具建议使用左右分栏 (Split-Pane) 或 Tab 切换。

---

## 5. 组件规范 (Component Standards)

### 5.1 按钮 (Buttons)
- **圆角**: `rounded-xl` (12px)。
- **交互**: 带有 `hover:bg-slate-100` (亮) 或 `hover:bg-slate-800` (暗) 的平滑过渡。
- **主按钮**: 深色背景 (`bg-slate-900` 亮 / `bg-white` 暗)。

### 5.2 输入框 (Inputs & Textareas)
- **样式**: 无边框风格或极淡边框。
- **焦点**: `focus:ring-0` 或 `focus:ring-slate-400`。
- **占位符**: 详尽的 Placeholder 引导，深色模式下使用 `placeholder:text-slate-600`。

### 5.3 弹窗/通知 (Toasts)
- **定位**: 固定在底部中心 `bottom-8 left-1/2`。
- **样式**: 高斯模糊 `backdrop-blur-xl`, 深色半透明 `bg-slate-900/90`。

---

## 6. 技术栈参考 (Tech Stack)
- **构建系统**: Vite 8+ (Multi-Page Application)。
- **样式引擎**: Tailwind CSS v4 (CSS-First 架构，无运行编译)。
- **核心逻辑**: 原生 JavaScript (ES Modules)。
- **资源管理**: npm 管理所有依赖（含 RemixIcon、工具库等）。
- **SEO**: 每页必须包含唯一的 h1、描述性的 title 及 meta description。

---

## 7. 新增工具 Checklist
1. [ ] 在 tools/ 目录下创建 HTML 文件并引用 /src/style.css 与 /src/common.js。
2. [ ] 在 HTML 底部添加 <!-- INJECT_FOOTER --> 占位符。
3. [ ] 实现标准的 Header（含返回键与暗色切换）。
4. [ ] 使用 localStorage 进行主题与内容持久化。
5. [ ] 适配响应式布局并采用统一的 Toast 系统。
6. [ ] 运行 npm run build 验证构建产物。
