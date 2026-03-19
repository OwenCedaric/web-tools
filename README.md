# Web Tools Collection

基于 Vite + Tailwind CSS v4 构建的现代在线工具箱，内置 27+ 实用工具。

## 快速开始

```bash
# 安装依赖
npm install

# 本地预览
npm run dev

# 生产构建
npm run build
```

## 目录结构

-   index.html: 首页入口
-   tools/: 27+ 工具的 HTML 源码
-   src/: 共享样式和 JS 逻辑
-   config.json: 全局配置（站点名称、页脚文案等）
-   vite.config.mjs: 构建配置
-   scripts/postbuild.js: 构建后处理脚本

## 配置说明

修改根目录下的 config.json 即可同步更新所有页面：

```json
{
  "siteName": "Web Tools",
  "footerText": "© 2024 Web Tools Collection",
  "githubUrl": "https://github.com/Gedaric/web-tools"
}
```

## 开源协议

ISC License
