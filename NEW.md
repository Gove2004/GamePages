# 添加新游戏网页指导

本项目的每个游戏详情页都是**完全独立的页面**（独立风格、独立 CSS/JS、不共享模板）。添加新游戏时，需要同时创建详情页并在首页注册。

## 设计原则（务必遵守）

1. **每页一种独立风格**：新游戏的页面风格应贴合游戏本身，可以与现有 5 个完全不同——字体、配色、布局、交互逻辑都要为这个游戏量身定做，像一个全新的小网站。
2. **深入原作再写**：先去游戏的商店主页（TapTap / Steam / itch.io）了解真实美术、玩法、文案。页面内容用真实设定，不要二次编造。如有源码或设定集，优先引用真实关卡名、卡牌、世界观。
3. **页面即体验**：尽量让页面交互呼应游戏机制。例：LightingForYou 的鼠标光晕 = 游戏的"微弱视野"；Bug 的合成台 = 游戏的"概念合成"；Archipelago 的战场动画 = 塔防战场。
4. **自包含**：详情页内联全部 CSS/JS，不引用任何外部文件（项目已删除 `shared/` 目录）。
5. **无外部依赖**：字体用系统栈，图片用本地 `.jpg`，无 CDN / 框架 / 图标库 / Google Fonts。
6. **暗色基调 + 该游戏代表色**：保持暗色背景，用一个代表该游戏的强调色（`--c-<slug>`）。
7. **可访问性**：保留 `prefers-reduced-motion` 媒体查询、卡片键盘可操作、图片有 alt。

## 步骤

### 1. 准备素材

在 `games/<slug>/` 目录下放入：
- `cover.jpg` —— 首页卡片封面（建议 16:9 左右）
- `screenshot-01.jpg`、`screenshot-02.jpg` … —— 详情页截图（3-6 张，按递增编号）
- `<slug>` 用 kebab-case，与目录名一致（如 `ninth-slime-card`）

### 2. 创建独立详情页 `games/<slug>/index.html`

参考现有 5 个游戏页之一作为骨架起点（复制结构最接近的，再整体替换风格）。**不要照搬配色和交互**，要为新游戏设计专属视觉。

详情页最小结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>游戏名 | Gove</title>
  <meta name="description" content="游戏一句话介绍" />
  <style>
    :root {
      /* 该游戏的配色变量 */
      --bg: #......;
      --accent: #......;   /* 该游戏代表色 */
    }
    /* 该游戏专属的全部 CSS */
  </style>
</head>
<body>
  <!-- 顶部：返回作品集 + 商店链接 -->
  <!-- Hero：标题 + 副文案 + 视觉焦点 -->
  <!-- 内容区：玩法 / 故事 / 截图等，用该游戏的视觉语言 -->
  <!-- 底部：商店链接 + 返回作品集 -->
  <script>
    /* 该游戏的交互（滚动浮现、截图放大等） */
  </script>
</body>
</html>
```

必备区块与约定：

- **顶部导航**：必须有 `<a href="../../index.html">返回作品集</a>` + 该游戏的商店外链
- **截图区**：用 `<button class="shot">` 包裹 `<img>`，并配截图放大的 lightbox JS（可直接从现有页复制 `shot` + `overlay` 逻辑）
- **`prefers-reduced-motion`**：复制现有页的媒体查询，关闭动画与过渡
- **响应式**：至少有一个移动端断点（如 860px / 720px / 520px），保证小屏可读
- **font-family**：根据游戏气质选——叙事用 serif、军事/像素用 monospace、涂鸦用手写 cursive、通用用 sans-serif 系统栈

### 3. 在首页 `index.html` 注册新游戏

需要改 4 处：

#### 3.1 加配色变量（`:root` 内）

```css
--c-<slug>: #代表色;
```

#### 3.2 加作品卡片（`.games-grid` 内，复制一张现有卡片改）

```html
<article class="game-card reveal" data-theme="<slug>" style="--game-accent: var(--c-<slug>);" tabindex="0">
  <div class="card-cover">
    <img src="games/<slug>/cover.jpg" alt="游戏名 封面" loading="lazy">
    <div class="cover-tint"></div><div class="cover-glow"></div>
    <span class="card-platform"><span class="dot"></span>平台 · 年份</span>
  </div>
  <div class="card-body">
    <div class="card-tags"><span class="tag accent">主类型</span><span class="tag">子类型</span></div>
    <h3>游戏名</h3>
    <p class="card-tagline">"游戏标语"</p>
    <p class="card-desc">一句话描述。</p>
    <div class="card-foot"><a class="card-link" href="games/<slug>/index.html">查看详情</a></div>
  </div>
</article>
```

> `data-theme` 的值要和下一步 3.4 的 CSS 选择器一致；`--game-accent` 决定该卡片的悬停光晕与强调色。

#### 3.3 加 showcase 切换器 tab + JS

切换器标签（`.showcase-tabs` 内）：

```html
<button class="tab" data-game="<slug>" style="--c: var(--c-<slug>);" type="button"><span class="dot"></span>游戏名</button>
```

JS `games` 对象加一项（在 `<script>` 内）：

```js
<slug>: { name: '游戏名', tagline: '"游戏标语"', c: 'var(--c-<slug>)' },
```

> `data-game` 的值、JS 对象的 key、`--c-<slug>` 三者要保持一致。

#### 3.4（可选）加卡片质感叠加 CSS

如果想让新游戏卡片悬停时有专属质感（如光晕 / 网格 / 扫描线），在 `.card-cover::before` 区追加：

```css
.game-card[data-theme="<slug>"] .card-cover::before {
  /* 该游戏的标志性质感 */
  /* 例：光晕 */ background: radial-gradient(circle at 50% 38%, rgba(R,G,B,0.28), transparent 58%);
  /* 例：网格 */ background-image: linear-gradient(rgba(R,G,B,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(R,G,B,0.14) 1px, transparent 1px); background-size: 22px 22px;
  /* 例：扫描线 */ background: repeating-linear-gradient(0deg, rgba(0,0,0,0.32) 0 1px, transparent 1px 3px);
}
```

### 4. 检查清单

- [ ] `games/<slug>/` 目录有 `cover.jpg` 和截图
- [ ] 详情页 `index.html` 风格独立、内容来自真实设定、自包含无外部依赖
- [ ] 详情页顶部有"返回作品集"（`../../index.html`）和商店链接
- [ ] 详情页截图可点击放大、支持 Escape 关闭
- [ ] 详情页有 `prefers-reduced-motion` 媒体查询
- [ ] 首页 `:root` 加了 `--c-<slug>` 配色变量
- [ ] 首页 `.games-grid` 加了卡片（`data-theme` + `--game-accent`）
- [ ] 首页 showcase 加了 `tab` + JS `games` 对象（三者 key 一致）
- [ ] （可选）首页加了 `.game-card[data-theme="<slug>"] .card-cover::before` 质感 CSS
- [ ] 本地 `python -m http.server 8000` 预览，首页和详情页都正常、卡片可跳转
- [ ] `git push` 上线

## 参考现有游戏页

| 游戏 | slug | 风格关键词 | 适合参考的场景 |
|---|---|---|---|
| LightingForYou | `lightingforyou` | 黑暗 / 光晕 / serif / 滚动浮现 | 叙事、氛围、诗意 |
| Archipelago Luminary | `archipelago-luminary` | 黑白网格 / monospace / 战场动画 | 策略、极简、军事 |
| UnReal Objects | `unreal-objects` | 像素 / CRT / 扫描线 / SVG 几何 | 复古、像素、错觉 |
| Bug Universe God | `bug-universe-god` | 涂鸦 / 手写体 / 倾斜 / 合成交互 | 混沌、合成、实验 |
| 第九张史莱姆牌 | `ninth-slime-card` | 卡牌桌 / 翻转 / 爬层点亮 | 卡牌、Roguelike、桌游 |

## 备注

- 首页作品网格用 `repeat(auto-fill, minmax(330px, 1fr))`，新增卡片会自动排列，无需手动调列数。
- 首页 showcase 切换器与 JS `games` 对象是联动的，少改一处会导致悬停切换失效。
- 详情页之间互不依赖，可以放心做完全不同的设计。
