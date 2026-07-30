# Gove 游戏作品集

Gove 的个人独立游戏作品集网站。展示 5 款横跨叙事冒险、极简塔防、不可能物体解谜、概念合成与卡牌的作品——每款游戏拥有**完全独立的页面风格与交互**，页面本身即游戏体验的延伸。

## 项目目的

把散落在 TapTap、Steam、itch.io 上的作品汇聚成一个统一入口，但**不做千篇一律的模板**：每个游戏的详情页都用贴合其本身的视觉语言（黑暗光晕 / 黑白战场 / 像素 CRT / 涂鸦造物台 / 卡牌桌），首页则用交互式切换器汇集 5 种气质，让访客在入口就能感受到每款作品的不同。

## 5 款作品

| 游戏 | 平台 | 类型 | 详情页风格 |
|---|---|---|---|
| LightingForYou | TapTap · 2024 | 叙事冒险 | 黑暗 + 鼠标光晕跟随（微弱视野）+ 14 关卡光点 + 光量 5 级 |
| Archipelago Luminary | Steam · 2025 | 极简塔防 | 黑白战场网格 + 战场动画 + 关键物碎片叙事 |
| UnReal Objects | itch.io | 像素解谜 | CRT 扫描线 + 旋转不可能几何 + 像素调色板 |
| Bug Universe God | TapTap · 2025 | 概念合成 | 涂鸦造物台 + 元素合成交互 + 不完美美学 |
| 第九张史莱姆牌 | TapTap · 2026 | Roguelike 卡牌 | 绒布卡牌桌 + 翻转手牌 + 爬层点亮 |

## 技术栈

- **纯静态** HTML/CSS/JS，无构建工具、无包管理器、无外部依赖
- 字体使用系统栈，无 Google Fonts / CDN / 图标库
- 每个游戏详情页**自包含**（内联 CSS/JS），不共享样式文件（`shared/` 已移除）
- 部署于 GitHub Pages，自定义域名 `gamepages.evog.top`（见 `CNAME`）

## 目录结构

```
index.html              # 首页：导航 + 交互式作品切换器 + 作品网格
games/
  <slug>/
    index.html          # 该游戏的独立风格详情页（自包含）
    cover.jpg           # 首页卡片封面
    screenshot-0N.jpg   # 详情页截图（3-6 张）
CNAME                   # gamepages.evog.top
CLAUDE.md               # 给 Claude Code 的项目说明
NEW.md                  # 添加新游戏的指导文件（见此）
README.md               # 本文件
```

## 部署

`git push` 到 `main` 分支即上线（GitHub Pages 自动部署）。纯静态文件，无需构建。

## 添加新游戏

参见 [NEW.md](./NEW.md)。
