# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gove 的个人游戏作品集网站 — 纯静态 HTML/CSS/JS，部署于 GitHub Pages，域名 `gamepages.evog.top`（见 CNAME 文件）。

没有构建工具、包管理器或测试框架。每个 HTML 文件是自包含的：内联 CSS 和内联 JS，没有任何外部依赖。

## Site Structure

```
index.html                          # 首页：作品集入口，5 张游戏卡片网格
games/
  lightingforyou/index.html         # 游戏详情页 ×5
  archipelago-luminary/index.html
  unreal-objects/index.html
  bug-universe-god/index.html
  ninth-slime-card/index.html
  */cover.jpg                       # 封面图（首页卡片用）
  */screenshot-0N.jpg               # 截图（详情页媒体区，3-6 张不等）
```

## Architecture: Shared Template Pattern

所有 5 个游戏详情页使用**同一套 CSS 组件模板**，仅通过 CSS 自定义属性（`--*`）换肤。每一页的差异化只体现在 3 个地方：

1. **`:root` CSS 变量** — 配色主题（每个游戏有自己的色调，如 LightingForYou 暖黄光、Archipelago Luminary 青绿、Unreal Objects 紫粉）
2. **Hero 区右侧视觉图** — 每个游戏有独特的纯 CSS 绘制概念图（`.light-card` / `.battlefield` / `.impossible-card` / `.universe-card` / `.card-table`）
3. **文字内容** — 标题、描述、截图数量不同

其余 CSS 类名、布局网格（`hero-layout`, `theme-grid`, `info-grid`, `media-grid`, `detail-grid`, `split`）、动画关键帧（`pageFadeUp`, `heroFloat`, `softPulse`）、响应式断点（860px / 520px）、lightbox 脚本逻辑，在所有游戏页中**完全一致**。

这意味着新增游戏页时，复制任一现有游戏页作为模板，替换配色变量、内容文字和截图路径即可。

## Key Design Decisions

- **暗色主题**：所有页面使用深色背景 + 径向渐变光晕 + 透明网格线（`body::before` 固定伪元素），无浅色模式
- **无外部依赖**：字体使用系统栈 `Inter, ui-sans-serif, ... "Microsoft YaHei"`；无 Google Fonts、无 CDN、无图标库
- **共享 CSS/JS**：游戏详情页的公共样式和脚本在 `shared/` 目录，各页通过 `<link>` / `<script src>` 引用，每页内联 `<style>` 仅保留 `:root` 变量、`body`/`body::before` 背景、独有视觉组件和差异化覆写
- **lightbox**：截图点击放大使用纯 JS 实现的简易 lightbox（`position: fixed` 覆盖层），支持 Escape 关闭
- **卡片可点击**：首页 `.game-card` 整体可点击跳转（排除内部 `<a>` 标签），支持键盘 Enter/Space
- **减少动画**：所有页面包含 `prefers-reduced-motion: reduce` 媒体查询，关闭所有动画和过渡

## Deployment

- 站点通过 GitHub Pages 从 `main` 分支部署
- 自定义域名在 `CNAME` → `gamepages.evog.top`
- 纯静态文件，`git push` 即上线

## Known Issues

### Breakpoint Inconsistency

- 首页 `index.html` 主断点用 `820px`，游戏详情页统一用 `860px`
- 如果同步共享修改，这两个值需保持一致，否则首页和详情页在小屏布局上表现不同

## Editing Guidelines

- 修改共享 UI 模式时，需要同步到 `shared/style.css` 和所有 5 个游戏页的内联样式
- 给某个游戏页添加内容时，只改那一页自己的 HTML/CSS 变量，不要改动共享组件结构
- 图片使用 `.jpg` 格式，封面放在 `games/<slug>/cover.jpg`，截图按 `screenshot-01.jpg` 递增编号
- 游戏页 slug 使用 kebab-case（与目录名一致）

### CSS Shorthand Pitfall

游戏页内联 `.title-accent` 使用 `background: linear-gradient(...)` 简写属性会重置 `background-clip`，**必须**连同 `-webkit-background-clip: text; background-clip: text;` 一起声明，否则渐变文字不可见。同样的问题也存在于其他使用 `background` 简写的选择器（如 `.button.primary`）。