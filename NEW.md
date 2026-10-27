# 添加新游戏网页指导

本项目的每个游戏详情页都是**完全独立的页面**（独立风格、独立 CSS/JS、不共享模板）。添加新游戏时，需要同时创建详情页并在首页注册。

## 设计原则（务必遵守）

1. **每页一种独立风格**：新游戏的页面风格应贴合游戏本身，可以与现有 6 个完全不同——字体、配色、布局、交互逻辑都要为这个游戏量身定做，像一个全新的小网站。
2. **深入原作再写**：先去游戏的商店主页（TapTap / Steam / itch.io）了解真实美术、玩法、文案。页面内容用真实设定，不要二次编造。如有源码或设定集，优先引用真实关卡名、卡牌、世界观。
3. **页面即体验**：尽量让页面交互呼应游戏机制。例：LightingForYou 的鼠标光晕 = 游戏的"微弱视野"；Bug 的合成台 = 游戏的"概念合成"；Archipelago 的战场动画 = 塔防战场。
4. **自包含**：详情页内联全部 CSS/JS，不引用任何外部文件（项目已删除 `shared/` 目录）。
5. **无外部依赖**：字体用系统栈，图片用本地文件，无 CDN / 框架 / 图标库 / Google Fonts。**唯一例外**是内嵌「该游戏本体的真实字体」——需子集化到几十 KB，并确认授权（见步骤 1.2）。
6. **暗色基调 + 该游戏代表色**：保持暗色背景，用一个代表该游戏的强调色（`--c-<slug>`）。
7. **可访问性**：保留 `prefers-reduced-motion` 媒体查询、卡片键盘可操作、图片有 alt。
8. **用游戏原生素材**：详情页的主视觉必须来自游戏本体（精灵图、卡面、插画、UI 元素），不要用网络图床或凭空画的替代品——这是让页面「看起来就是这款游戏」的最有效手段。

## 步骤

### 1. 准备素材

在 `games/<slug>/` 目录下放入：
- `cover.jpg` —— 首页卡片封面（建议 16:9 左右）
- `screenshot-01.jpg`、`screenshot-02.jpg` … —— 详情页截图（3-6 张，按递增编号）
- `<slug>` 用 kebab-case，与目录名一致（如 `ninth-slime-card`）

#### 1.1 游戏原生素材 → `assets/`

从该游戏的本地工程里挑出最有辨识度的美术，降采样后放进 `games/<slug>/assets/`，详情页用相对路径 `assets/xxx` 引用。

约定：

- **命名**：小写 + 连字符，按用途加前缀，保留工程里的原始拼写
  （例：`tower-00.webp` … `tower-13.webp`、`card-斩击.webp`、`mon-bat.webp`、`ch-0-光影造物.webp`、`enemy-hunter.webp`）
- **格式**：插画 / 卡面 / 大图 → WebP（q84-88），并限制最大边长；像素精灵 → 保留 PNG 保证边缘锐利，页面配 `image-rendering: pixelated`
- **体积**：单个页面控制在 200 KB 量级，全站素材合计约 1 MB
- **第三方素材**：若来自资源包（如 Kenney），必须同目录放 `CREDITS-*.txt` 写明出处与许可
- **只读**：`assets/` 一旦生成就不要手改文件名，页面里全是硬编码引用

有用的素材类型（按视觉冲击力排序）：
1. **精灵表**（如 `player.png` 6×10 帧、`tiles.png` 2×3）——用 `background-size` + `background-position` 就能在 CSS 里逐帧播放，无需 JS
2. **角色 / 物件精灵**——像素风页面的主视觉
3. **插画 / 卡面**——故事、卡牌类页面的核心
4. **粒子 / 光效贴图**——叠加 `mix-blend-mode: screen` 做光晕，成本极低、氛围收益极大

#### 1.2 字体：什么时候内嵌

默认用系统栈。只有当该游戏**自带字体且授权明确**时，才子集化后内嵌：

- 只保留页面实际用到的字符（把页面 HTML 的字符集喂给子集化工具），CJK 字体可从数 MB 压到几十 KB
- 用 `@font-face` + `font-display: swap`，并**必须配完整 fallback 栈**，让子集外的生僻字自动回退
- 在同目录留许可说明
- **授权不明就不要内嵌**：若字体 `name` 表写着 "All rights reserved" 且工程里没有许可文件，宁可用 CSS 排版去营造气质，也不要赌

### 2. 创建独立详情页 `games/<slug>/index.html`

参考现有 6 个游戏页之一作为骨架起点（复制结构最接近的，再整体替换风格）。**不要照搬配色和交互**，要为新游戏设计专属视觉。

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

> **注意**：首页当前是「六扇门」结构（`.gate` 区块），**不是**作品网格 / showcase 切换器。
> 每款游戏对应一个 `.gate` 区块，依次包含：`.ghost`（序号大字）、`.stage`（封面 + 微视觉）、`.info`（kicker / h2 / tagline / desc / tags / cta）。
> 相邻区块用 `flip` 类左右交替（`<section class="gate g-<slug> flip">`）。

需要改 **4 处**（缺一处就会出现死链或高亮失效）：

#### 3.1 加该游戏的配色类（`<style>` 内，仿照 `.g-light` / `.g-six`）

```css
.g-<slug> {
  --accent:#代表色; --tint:rgba(R,G,B,.09); --bg2:#深底色;
  --ink:#亮字色; --tagc:#次亮; --desc:#暗字; 
  --tagbg:rgba(R,G,B,.08); --tagbd:rgba(R,G,B,.35);
  --gx:32%;   /* 光晕水平位置，与相邻区块交替取 32% / 68% */
  --tilt:1.5deg;
}
```

> 区块内所有颜色都取自这些变量，改一处即可整门换色。

#### 3.2 加 `.gate` 区块（放进 `<main>`，紧接上一个区块）

```html
<section class="gate g-<slug> flip" id="<slug>">
  <span class="ghost" aria-hidden="true">07</span>
  <div class="gate-inner">
    <div class="info">
      <p class="kicker reveal d1">07 / 年份.月 · 平台 · 类型</p>
      <h2 class="reveal d1">游戏名<span class="cn">中文副标题（可选）</span></h2>
      <p class="tagline reveal d2">一句话标语。</p>
      <p class="desc reveal d2">两三句介绍，用真实设定与真实数值。</p>
      <div class="tags reveal d3">
        <span class="tag">主类型</span>
        <span class="tag">特色机制</span>
      </div>
      <a class="cta reveal d3" href="games/<slug>/index.html">进入详情 <span class="ar">→</span></a>
    </div>
    <div class="stage reveal">
      <div class="cover">
        <img src="games/<slug>/cover.jpg" alt="游戏名 游戏封面" loading="lazy" />
      </div>
      <!-- 该游戏的微视觉（可选）：纯 CSS 小动效，见 .orb-micro / .tri-micro / .tape / .d-cir / .fan / .hexring -->
    </div>
  </div>
</section>
```

> `id` 必须与下一步 3.3 的锚点、3.4 的侧栏 `href` 一致。
> `reveal d1/d2/d3` 是滚动浮现的错峰延迟，照抄即可。
> `flip` 控制图文左右互换，与相邻区块相反以形成节奏。

#### 3.3 加顶栏导航链接（`.nav-links` 内）

```html
<a href="#<slug>">游戏名</a>
```

#### 3.4 加侧栏目录链接（`.rail` 内）并注册到 JS 高亮数组

```html
<a href="#<slug>" style="--rc:#代表色"><i>07</i><span>游戏名</span></a>
```

再改 `<script>` 里的区块数组（**必须加**，否则顶栏/侧栏的当前区块高亮对该游戏失效）：

```js
var sections = ['lighting', 'unreal', 'luminary', 'bug', 'slime', 'six', '<slug>'].map(...);
```

#### 3.5（可选）加封面质感叠加

如果想让该门封面有专属质感，仿照 `.g-six .cover::before` / `.g-unreal .cover::before` 追加：

```css
.g-<slug> .cover::before {
  content: ""; position: absolute; inset: 0; z-index: 2; pointer-events: none;
  /* 例：扫描线 */ background: repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 1px, transparent 1px 3px);
  /* 例：网格 */ background-image: linear-gradient(rgba(R,G,B,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(R,G,B,.10) 1px, transparent 1px); background-size: 26px 26px;
}
```

### 4. 检查清单

**素材**
- [ ] `games/<slug>/` 目录有 `cover.jpg` 和截图
- [ ] `games/<slug>/assets/` 里是**该游戏的原生素材**（不是网络图片），文件名小写连字符
- [ ] 所有 `assets/` 引用都能解析到实际文件（无 404）
- [ ] 素材合计体积在 200 KB 量级；第三方素材有 `CREDITS-*.txt`
- [ ] 若内嵌字体：已子集化、有 fallback 栈、有许可说明

**详情页**
- [ ] 风格独立、内容来自**真实设定**（有本地工程就读本地工程，不要编造数值）
- [ ] 自包含无外部依赖（内联 CSS/JS）
- [ ] 顶部有"返回作品集"（`../../index.html`）和商店链接
- [ ] 截图可点击放大、支持 Escape 关闭、有焦点管理
- [ ] 有 `prefers-reduced-motion` 媒体查询
- [ ] 所有 `<img>` 都有 `alt`
- [ ] 至少一个移动端断点
- [ ] 交互控件（可点的元素）要么有真实行为，要么不要给 pointer / hover 暗示

**首页（4 处都要改）**
- [ ] `:root` 或区块内加了 `.g-<slug>` 配色类
- [ ] `<main>` 内加了 `.gate` 区块，`id` 正确
- [ ] `.nav-links` 加了 `#<slug>` 链接
- [ ] `.rail` 加了 `#<slug>` 链接
- [ ] `<script>` 的 `sections` 数组加了 `'<slug>'`

**验证**
- [ ] 本地 `python -m http.server 8000` 预览，首页与详情页都正常
- [ ] 首页导航/侧栏点击能跳到新区块，滚动时高亮跟随
- [ ] 详情页图片、返回链接无 404
- [ ] `git push` 上线

## 参考现有游戏页

| 游戏 | slug | 风格关键词 | 适合参考的场景 |
|---|---|---|---|
| LightingForYou | `lightingforyou` | 纵向光轴 / 微弱视野 / serif / 烛火与光斑 | 叙事、氛围、诗意 |
| UnReal Objects | `unreal-objects` | 像素棋盘 / CRT / 精灵表逐帧 / 阶梯切角 | 复古、像素、错觉 |
| Archipelago Luminary | `archipelago-luminary` | 等距战场 / 黑白 + 金 / monospace | 策略、极简、军事 |
| Bug Universe God | `bug-universe-god` | 造物档案 / 手写 / 倾斜 / 墨迹 | 混沌、合成、实验 |
| 第九张史莱姆牌 | `ninth-slime-card` | 牌桌 / 3D 翻卡 / 内嵌游戏字体 | 卡牌、Roguelike、桌游 |
| 瑟克斯遗纪 | `six-elements` | 像素字体 / 反应矩阵 / 图鉴 | 数据密集、矩阵、图鉴 |

> `six-elements` 是数据密度最高的参考页：数据驱动的可交互矩阵（点击矩阵 ↔ 清单卡片双向联动）、内嵌游戏本体像素字体、完整的 lightbox 焦点管理。做数据密集的页面时优先参考它。
> `lightingforyou` 是「素材驱动氛围」的参考：16 个真实光效贴图撑起整页光感，滚动驱动的光轴把 14 关串成一条旅程。
> `unreal-objects` 是「精灵表在 CSS 里动起来」的参考：真实 6×10 行走精灵表用 `steps()` 逐帧播放，等距/棋盘底纹用 `background-size` 精确对齐格子。

## 内容来源（写内容前必读）

每款游戏的详情页内容应当来自**真实来源**，不要从商店页爬取后就编造数值。本地工程与权威数据文件对照表见 [README.md](./README.md) 的「内容来源」一节。

关键提醒：
- 若该游戏有本地工程，**优先读工程**：真实关卡名、真实数值、真实剧情原文都在里面。
- `lang.json`（Archipelago）含非标准 `NaN`，无法用常规 JSON 解析器读取，需按行正则提取。
- `Assets\Arts\Font\Lang\*.txt` 是字体子集化字符集，不是翻译文本。
- 写完后自查：页面里每个数值都能指出出处（文件 + 行号/记录 ID）。

## 可复用技法

几个在现有页面里验证过、成本低但效果强的写法，做新页面时可直接搬。

### 像素阶梯切角框（无 `border-radius`）

用一个 `.px` 类同时拿到「阶梯切角 + 3px 硬边 + 硬投影」，单个元素即可，不额外加 DOM：

```css
:root{
  --stair: polygon(0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0,
    calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px,
    100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px), calc(100% - 3px) calc(100% - 3px),
    calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%,
    6px 100%, 6px calc(100% - 3px), 3px calc(100% - 3px), 3px calc(100% - 6px), 0 calc(100% - 6px));
}
.px{ position:relative; isolation:isolate; filter: drop-shadow(5px 5px 0 rgba(0,0,0,.5)); }
.px::before{
  content:""; position:absolute; inset:-3px; z-index:-1; pointer-events:none;
  border:3px solid transparent;
  background: linear-gradient(var(--fill,#101019),var(--fill,#101019)) padding-box,
              var(--edge,#33334d) border-box;   /* 3px 边框 + 内部填充 */
  clip-path: var(--stair);                       /* 阶梯切角 */
}
```

要点：
- `filter` 与 `clip-path` 必须分在不同元素上——同一元素上 `clip-path` 会把 `drop-shadow` 一起裁掉，所以投影放父级 `filter`、裁角放 `::before`
- `isolation: isolate` 保证 `z-index:-1` 的 `::before` 仍在本元素之上、内容之下
- 想换色只改 `--fill` / `--edge` 两个变量

### 精灵表逐帧动画（纯 CSS）

真实精灵表直接当 `background-image`，用 `background-size` 放大 N 倍、`steps()` 逐帧：

```css
.sprite{
  --fw: 64px;                                  /* 单帧显示尺寸 */
  width: var(--fw); height: var(--fw);
  background: url("assets/player.png") no-repeat;
  background-size: calc(var(--fw)*6) calc(var(--fw)*10);  /* 6 列 × 10 行 */
  background-position: 0 calc(var(--row,0) * var(--fw) * -1);
  image-rendering: pixelated;
  animation: walk .5s steps(1,end) infinite;
  animation-timing-function: steps(1,end);     /* 关键：每段保持起始帧，不插值 */
}
@keyframes walk{
  0%{background-position-x:0}
  16.667%{background-position-x:calc(var(--fw)*-1)}
  33.333%{background-position-x:calc(var(--fw)*-2)}
  50%{background-position-x:calc(var(--fw)*-3)}
  66.667%{background-position-x:calc(var(--fw)*-4)}
  83.333%{background-position-x:calc(var(--fw)*-5)}
  100%{background-position-x:0}                /* 回到首帧，无缝循环 */
}
```

`--row` 选行（上/下/左/右各一行），`transform: scaleX(-1)` 复用行走帧做「向左」。注意 `background-position` 简写设了 y，动画只动 `background-position-x` 长手属性，两者不冲突。

### 棋盘 / 网格底纹与格子精确对齐

底纹想对齐到格子，用**百分比** `background-size`，而不是像素：

```css
.board{
  aspect-ratio: 18 / 7;                       /* 18 列 7 行 → 格子是正方形 */
  background-size: calc(100% / 6) calc(100% * 6 / 7);  /* 横向 6 张、纵向 6 张铺满 */
  image-rendering: pixelated;
}
```

格子尺寸想随容器缩放，用容器查询单位，让「一格 = 容器宽的 1/18」：

```css
.stage{ container-type: inline-size; }
.board{ --cell: 5.5556cqw; }                  /* 100% / 18 */
```

这样精灵、拾取物、格子位置全部可以用 `calc(var(--cell) * n)` 表达，断点里只改 `--cell` 一个值。

### 光效叠加

粒子/光斑贴图配 `mix-blend-mode: screen`，黑色部分自动透明，只留亮部发光：

```css
.glow{ mix-blend-mode: screen; opacity: .55; animation: drift 34s linear infinite; }
```

比 PNG 透明通道更干净，也比 `filter: blur()` 便宜得多。

### 滚动浮现的三件套（必须成套出现）

`.reveal { opacity: 0 }` 这类写法一旦 `IntersectionObserver` 没跑起来，整页就是空白。必须同时满足三条：

```js
/* 1) 只有 IO 真的存在，才允许隐藏 —— 最稳的一条 */
if ('IntersectionObserver' in window && revealEls.length) {
  document.documentElement.classList.add('js-reveal');   // 由这个类触发 opacity:0
  var io = new IntersectionObserver(/* ... */);
  Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });

  /* 2) 兜底定时器：2.4~2.6s 后强制全部可见 */
  setTimeout(function () {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('in'); });
  }, 2500);
}
```

```css
/* 3) 减弱动效时直接强制可见 */
@media (prefers-reduced-motion: reduce) {
  html.js-reveal .reveal { opacity: 1 !important; transform: none !important; }
}
```

三条缺一不可：只做 1 会因截图/异常环境出现空白；只做 2 会白等 2.5 秒；缺 3 则减弱动效的用户看不到内容。
注意 `opacity: 0` 要挂在 `html.js-reveal` 这类**由 JS 自己加上的类**上，而不是无条件的 `.reveal`——这样 JS 被禁用时页面天然完整。

### 深色页的"质感"要往亮里加，不能往暗里压

从 `six-elements` 抄扫描线到近黑页面会**完全失效**——这是踩过的坑：

```css
/* ✗ 底色本身只有 5~6 的亮度，压黑最多压到 0，视觉差只有 2 档，肉眼看不见 */
body::before { background: repeating-linear-gradient(0deg, rgba(0,0,0,.30) 0 2px, transparent 2px 4px); }

/* ✓ 同样的纹理，改成往亮里加，亮度在 5→11 之间交替，约 6 档差，可见但不抢戏 */
body::before { background: repeating-linear-gradient(0deg, rgba(255,214,140,.028) 0 1px, transparent 1px 3px); }
```

配套两条经验：

1. **辉光要视口锚定**。`radial-gradient(... at 50% -12%, ...)` 的百分比是相对 **`body` 盒**算的，而详情页往往一两万像素高，`-12%` 早就跑到首屏之外了。要让"顶部那团光"真的出现在首屏，必须 `background-attachment: fixed`（可以逐层混用：纹理 `scroll`、辉光 `fixed`）。
2. **别用 `body::before` 盖内容**。`position: fixed; z-index: 0` 的伪元素会盖在未定位内容之上。要么把内容容器提成 `position: relative; z-index: 1`（并用 `elementFromPoint` 实测确认），要么干脆把纹理直接写进 `body` 的多层 `background`——后者没有层叠风险，优先选它。

判断"有没有质感"不要靠眼睛猜，用像素统计：**同一张背景图，`std` 从 0.00 变成 1.9 就说明纹理真的生效了**；同时盯着均值，别让噪声把整体亮度从 5 抬到 28（那样页面会发灰、毁掉暗色设定）。

**别用 `background-attachment: fixed` 做视口锚定**——iOS Safari 会忽略这个属性（当作 `scroll`），辉光就跟着页面滚走了。要视口锚定就用 `position: fixed` 伪元素：

```css
body { background: /* 只放随内容滚动的纹理 */ ...; }
body::before {
  content: ""; position: fixed; inset: 0;
  z-index: 0; pointer-events: none;
  background: radial-gradient(...), radial-gradient(...);   /* 视口锚定的辉光 */
}
/* 内容容器必须抬到伪元素之上 */
.wrap { position: relative; z-index: 2; }
```

## 备注

- 详情页之间互不依赖，可以放心做完全不同的设计。
- 首页每新增一门，`.gate` 区块的 `flip` 要与相邻区块交替，保持左右节奏。
- 区块的 `--gx`（光晕位置）也在 32% / 68% 之间交替。
- **首页侧栏的游戏名不要放进流内文本**。`.rail` 是 `position: fixed` 固定在右侧，标签一旦是普通 `<span>`，游戏名有多长侧栏就有多宽，会压住 `.gate-inner` 右栏、并把那块区域的点击吃掉（实测 "Archipelago Luminary" 让侧栏从 136px 涨到 202px，重叠 176px）。做法：名称放 `data-name` + `aria-label`，用 `::after` 绝对定位做悬浮标签（不占布局），桌面端再给 `.gate` 留 78px 内边距当专用通道。
