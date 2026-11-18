# 艺术感 / 交互感升级 · 设计纲领

参考项目：`E:\Projects\Git\pelican-6000-pure-code`（鹈鹕六千年 · 纯代码版）
—— 零外部位图的 2 分 55 秒纯代码交互式视听长卷，20 个艺术史时代各有一套完整调色板与渲染模式。

本文件把参考项目里**可迁移**的手法提炼成本项目能落地的规则。参考项目是 canvas 影片，
我们是静态内容站，所以迁移的是**方法论与观感标准**，不是照搬代码。

---

## 一、从参考项目提取的 7 条核心手法

### 1. 「时代 = 调色板 + 渲染模式」——最重要的一条

参考项目 `data/palettes.json` 里，每个时代不是"换个主色"，而是给出一整套 6 色
（`paper` / `ink` / `body` / `wing` / `bill` / `accent`）**外加一个 `mode`**：
`rock` / `flat` / `rubbing` / `line` / `ink` / `miniature` / `shadow` / `woodcut` /
`oil` / `expression` / `silent` / `scope` / `pixel` / `gif` / `neon` / `video` / `code`。

**同一个鹈鹕，在不同 mode 下画法完全不同**：`rubbing` 是石花斑驳的拓片，
`line` 是白描勾线，`pixel` 是硬边像素，`neon` 是发光描边。

→ 迁移：我们的 6 个页面也应该各自定义一套**完整令牌集 + 渲染模式**，
而不是现在这样只散落几个 accent 色。每个页面 = 一个"时代"。

### 2. 缓动词汇表，而不是一个 cubic-bezier

参考项目 `timeline.js` 提供 `clamp` / `smoothstep` / `smootherstep` / `lerp` /
`quantizeTime`，并且用它们**组合**出复杂运动，例如：

```js
const env = Math.exp(-Math.pow((s - 0.5) / 0.14, 2));          // 高斯包络
const detour = -0.095 * Math.sin(2*Math.PI*s)
             * smoothstep(0.05, 0.22, s) * smoothstep(0.95, 0.78, s);  // 两端收敛的偏移
```

还有"进场慢启动 + 出场缓停"的四次多项式：
```js
worldX = mX * (-0.5 + s3 - 0.5 * s4);   // s3=s³, s4=s⁴，起止速度均为 0
```

→ 迁移：建立一个**共享缓动库**，统一各页动效手感，并引入"两端收敛""过冲回落"
这类比 `ease-out` 高级得多的曲线。

### 3. 分层叠加代替单层渐变（晕染 / 描边）

参考项目画一团墨晕要叠 5 层椭圆，每层半径与透明度按 `k = i/layers` 递变：
```js
ctx.fillStyle = `rgba(${color}, ${(maxAlpha/layers)*(1.3-0.4*k)})`;
ctx.ellipse(0,0, rx*(0.65+0.42*k), ry*(0.65+0.42*k), ...)
```
画一笔"飞白"要拆成 7 根鬃毛，每根有法向偏移、独立透明度、随机断墨。

→ 迁移：**单层 `radial-gradient` 是廉价的**。要做出质感就叠多层、带随机偏移与
alpha 递变。这条直接适用于我们的辉光、卡片投影、边框。

### 4. 程序化纹理（种子随机）

`getInkPaper()` 用固定种子随机数烘出 1000×1000 的宣纸：横向帘纹每 6px 一道、
950 根草木纤维随机长度角度、1800 个石花斑点、18 条石缝折线。
关键是**确定性**——同一 seed 永远烘出同一张纸。

→ 迁移：页面背景纹理应程序化生成（可复现），而不是手调几个 gradient 参数。

### 5. 影院式取景与"隐藏外壳"

`layout.css` 只有 8 行：`.cinema-viewport { width:100vw; height:100vh; display:flex;
align-items:center; justify-content:center; background:#050403 }`。
内容被放进一个有明确边界的"银幕"里。

`player.js` 的 `bumpActivity()`：鼠标一动就移除 `is-idle`，静置 2 秒后加回。
→ **chrome 会自己退场**，把画面让给内容。

→ 迁移：首页顶栏/侧栏应在用户停止操作后淡出；详情页应有明确的"舞台"边界。

### 6. 时间量化（`quantizeTime`）

```js
export function quantizeTime(t, hz = 10) {
  return Math.floor(t * hz + 1e-6) / hz;   // 吸附到 10Hz 网格
}
```
刻意让运动带一点"帧率感"，不是无限丝滑。

→ 迁移：像素风页面（LFY / UnReal / 瑟克斯）应把动画吸附到离散网格，
强化"这是游戏"的质感；而丝滑页面保持连续。

### 7. 逐幕编排（beat / bar / scene）

`getBeatState()` 把时间解析成 `globalBeat` / `beatIndex` / `isStrongBeat` /
`isBarDownbeat`，动效据此**分级响应**：强拍动作大，弱拍动作小。

→ 迁移：滚动驱动动效也应分级——进入视口是"强拍"（大幅），滚动过程是"弱拍"（微幅）。

---

## 二、落地到本项目的规则

### 2.1 每页一套「渲染模式」令牌

每个页面在 `:root` 声明完整令牌，至少包含：

| 令牌 | 含义 |
|---|---|
| `--paper` | 底材色（纸 / 石 / 绒布 / 屏幕） |
| `--ink` | 主文字色 |
| `--body` | 次级文字色 |
| `--faint` | 三级文字色 |
| `--accent` | 强调色（唯一饱和色，稀缺） |
| `--accent-2` | 辅助强调色 |
| `--edge` | 边框 / 分割线色 |
| `--mode` | 渲染模式名（注释用，指导下面几条） |

并声明该页的：
- `--ease-stage`：主缓动曲线
- `--dur-stage`：主时长
- `--grain`：纹理强度

### 2.2 六页的「时代」设定

| 页面 | mode | 底材 | 强调色 | 动效气质 |
|---|---|---|---|---|
| 首页 | `atlas` | 深空石 | 六色轮转 | 影院取景 + chrome 退场 |
| lightingforyou | `lumen` | 焦黑纸 | 暖金 | 光晕跟随、光轴呼吸 |
| unreal-objects | `crt` | 荧光屏 | 紫罗兰 + 扫描线 | 像素量化、扫描线滚动 |
| archipelago-luminary | `mono` | 黑白棋盘 | 金（极稀缺） | 克制、逐格推进 |
| ninth-slime-card | `felt` | 绒布 | 冷青 + 暖金 | 翻牌、布料经纬 |
| bug-universe-god | `dossier` | 档案纸 | 红 + 橙 | 稿纸横线、印章落款 |
| six-elements | `slate` | 暗石板 | 六元素色 | 反应连锁、像素图标 |

### 2.3 必须遵守的既有约束（不得回退）

- 折叠只藏长文本，**绝不藏条目本身**
- 无 JS 时全文可见；`<details>` 优先
- 滚动显现「三件套」（IO 检测 + 2.5s 兜底 + reduced-motion 强显）
- `<img>` 100% 带 alt；灯箱 Esc / 遮罩 / 焦点管理
- 深色页质感**往亮里加，不往暗里压**
- 视口锚定辉光用 `position: fixed` 伪元素，**不用** `background-attachment: fixed`
- 每页至少一个移动断点；零 CDN 外链
- 100% 自包含（内联 CSS/JS）

### 2.4 验收方式

本模型无法看图，一律**程序化验证**：
- 渲染截图后用 Pillow 统计亮度占比 / 色阶数 / 分区带亮度
- 动效验证用 A/B（改前改后同一采样点对比）
- 结构验证：标签平衡、JS `node --check`、CSS 括号平衡、alt 覆盖率

#### 血泪教训：验证前先确认「你要测的东西真的在截图里」

分层光晕做完后，A/B 测了 5 轮都是 **0 差异**，我一度以为 CSS 写错了、`color-mix`
不支持、`mix-blend-mode` 失效，逐个排除后才发现真正原因：

**首页的 6 个 halo 全部在首屏之下**（第一个 gate 的 y 从 902 开始，而视口只有 902 高）。
我 1000px 高的截图只拍到了 hero，A/B 两边的 halo 都不在画面里，当然零差异。

所以验证前必须先用 CDP 问浏览器要 `getBoundingClientRect()`，确认目标元素
`inViewport` 为真，再截图对比。否则会陷入"改了没用 → 换写法 → 还是没用"的死循环。

同理，滚动显现 `.reveal` 的 `opacity: 0` 也会让整个区块隐形，
测之前要强制 `.reveal { opacity: 1 !important; transform: none !important }`。

### 2.5 分层光晕的实测标定

同一套 halo 代码，在近黑底上做 `mix-blend-mode: screen`，透明度与观感的关系：

| 各层 opacity | 亮部占比 | 色阶 | 结论 |
|---|---|---|---|
| .16 ~ .40 | 2.40%（= 无 halo） | 995 | **完全看不见**，逐像素零差异 |
| .30 ~ .62 | 13.72% | 472 | 看得见，但光晕区色阶 -61，层次被冲掉 |
| .24 ~ .46 | 12.45% | 459 | 采用值，亮部翻 5 倍，光晕区外零影响 |

结论：**近黑底上的 screen 叠加，透明度低于 ~0.2 等于没画**。
另外「全页色阶数下降」不一定是过曝——要先分区测量，确认下降只发生在光晕覆盖区，
而不是整页变脏（本例光晕外角落色阶差为 0）。

---

## 三、执行分工

每个页面由一名 teammate 独占（写作用域 = `games/<slug>/`），Lead 独占
`index.html` / `README.md` / `NEW.md` / 本文件。

**样板先行**：先由 Lead 在首页落一套完整实现作为「样板」，验证观感与手法，
确认有效后再铺开到其余 6 页，避免 7 页一起返工。
