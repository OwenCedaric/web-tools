// 工具配置文件
// 随着工具数量增多，将数据与逻辑分离可以极大提升代码的可维护性。

const tools = [
  {
    title: "HTML Renderer",
    description:
      "实时 HTML 代码编辑器和预览工具，支持 HTML、CSS、JavaScript 代码片段的即时预览和测试。",
    icon: "ri-code-line",
    url: "/html-renderer.html",
    tags: ["HTML", "CSS", "JavaScript", "Editor", "Preview"],
  },
  {
    title: "微信封面合并",
    description:
      "将两张不同比例的图片智能拼接为微信公众号封面。支持大图（2.35:1）和小图（1:1）的完美组合，一键生成符合微信规范的文章封面。",
    icon: "ri-wechat-line",
    url: "/wechat-cover-merge.html",
    tags: ["微信", "图片", "合并", "封面", "公众号"],
  },
  {
    title: "Google Font to Svg Path",
    description: "将 Google font 转换为 SVG path 的工具",
    icon: "ri-font-family",
    url: "https://fontsvg.ceda.is/",
    tags: ["Font", "Google", "SVG"],
  },
  {
    title: "IT-Tools",
    description: "为开发者和 IT 行业从业者准备的实用工具集合",
    icon: "ri-tools-line",
    url: "https://tools.ceda.is/",
    tags: ["IT", "Google", "SVG"],
  },
  {
    title: "TraceIt",
    description: "在线图像矢量化工具，将位图快速转换为高质量SVG矢量图",
    icon: "ri-image-line",
    url: "/traceIt.html",
    tags: ["图像处理", "矢量化", "SVG", "设计工具"],
  },
  {
    title: "Image Overlay Editor",
    description: "图片蒙版工具，图片上覆盖文字。",
    icon: "ri-image-circle-line",
    url: "/image-overlay-editor.html",
    tags: ["图像处理", "文字工具", "设计工具"],
  },
  {
    title: "Image EXIF Editor",
    description: "添加图片EXIF 信息",
    icon: "ri-image-edit-line",
    url: "/exif-editor.html",
    tags: ["图像处理", "文字工具", "设计工具"],
  },
  {
    title: "Markdown Builder",
    description: "Markdown 渲染",
    icon: "ri-markdown-line",
    url: "/markdown-builder.html",
    tags: ["文字工具", "设计工具"],
  },
  {
    title: "屏幕清理助手",
    description:
      "一键将屏幕切换为纯黑全屏模式，帮助您更清晰地发现和清理显示器上的灰尘、污渍和指纹。",
    icon: "ri-computer-line",
    url: "/screen-cleaner.html",
    tags: ["工具", "屏幕清理", "系统", "全屏"],
  },
];
