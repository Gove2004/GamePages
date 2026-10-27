# Gove 游戏作品集

Gove 的个人独立游戏作品集网站。展示 6 款横跨叙事冒险、极简塔防、不可能物体解谜、概念合成、卡牌与棋盘策略的作品——每款游戏拥有**完全独立的页面风格与交互**，页面本身即游戏体验的延伸。

## 项目目的

把散落在 TapTap、Steam、itch.io 上的作品汇聚成一个统一入口，但**不做千篇一律的模板**：每个游戏的详情页都用贴合其本身的视觉语言（黑暗光晕 / 黑白战场 / 像素 CRT / 涂鸦造物台 / 卡牌桌 / 石板反应矩阵），首页则用「六扇门」结构汇集 6 种气质，让访客在入口就能感受到每款作品的不同。

## 6 款作品

| # | 游戏 | 平台 | 类型 | 详情页风格 |
|---|---|---|---|---|
| 01 | LightingForYou | TapTap · 2024 | 叙事冒险 | 黑暗 + 鼠标光晕跟随（微弱视野）+ 14 关光点 + 光量五级 |
| 02 | UnReal Objects | itch.io · 2025 | 像素解谜 | CRT 扫描线 + 旋转不可能几何 + 像素调色板 |
| 03 | Archipelago Luminary | Steam · 2025 | 极简塔防 | 黑白战场网格 + 战场动画 + 关键物碎片叙事 |
| 04 | Bug Universe God | TapTap · 2025 | 概念合成 | 涂鸦造物台 + 元素合成交互 + 不完美美学 |
| 05 | 第九张史莱姆牌 | TapTap · 2026 | Roguelike 卡牌 | 绒布卡牌桌 + 翻转手牌 + 爬层点亮 |
| 06 | 瑟克斯遗纪 | TapTap · 2026 | 益智 · 棋盘策略 | 暗色石板 + 真实像素图标 + 21 反应矩阵 |

> 首页区块顺序与上表编号一致（`.gate` 区块 id：`lighting` / `unreal` / `luminary` / `bug` / `slime` / `six`）。

## 技术栈

- **纯静态** HTML/CSS/JS，无构建工具、无包管理器、无外部依赖
- 字体以系统栈为主，两个页面例外地内嵌了**游戏本体的真实字体**（均为本地 `woff2`/`otf`，已子集化）：
  - `six-elements` → FusionPixel（像素字体，SIL OFL，许可文件 `FusionPixel-LICENSE.txt` 随仓库提供）
  - `ninth-slime-card` → 阿里巴巴普惠体 2.0 65 Medium（96 KB 子集，出处见 `fonts/CREDITS-Alibaba-PuHuiTi.txt`）
- 详情页的主视觉一律使用**游戏本体的真实美术素材**（精灵图、卡面、插画），经降采样后存放于各游戏目录的 `assets/`，不使用网络图床
- 每个游戏详情页**自包含**（内联 CSS/JS），不共享样式文件（`shared/` 已移除）
- 部署于 GitHub Pages，自定义域名 `gamepages.evog.top`（见 `CNAME`）

## 目录结构

```
index.html              # 首页：固定顶栏 + Hero + 六扇门 + 侧栏目录 + 关于 + 页脚
games/
  <slug>/
    index.html          # 该游戏的独立风格详情页（自包含）
    cover.jpg           # 首页卡片封面
    screenshot-0N.jpg   # 详情页截图
    assets/             # 详情页使用的游戏本体真实素材（精灵图 / 卡面 / 插画，已降采样）
    fonts/              # （部分游戏）内嵌字体，附许可说明
CNAME                   # gamepages.evog.top
NEW.md                  # 添加新游戏的指导文件（见此）
README.md               # 本文件
```

`assets/` 约定：

- 文件名一律小写、连字符分隔，按用途加前缀（`tower-`、`card-`、`mon-`、`ch-`、`enemy-`）
- 大图（插画、卡面）转 WebP 并限制最大边长；像素精灵保留 PNG 以保证边缘锐利，页面用 `image-rendering: pixelated` 放大
- 体积预算：全站新增素材控制在 1 MB 量级（当前 5 个页面合计约 0.97 MB）
- 若素材来自第三方（如 Kenney 资源包），在同一目录放置 `CREDITS-*.txt` 说明出处与许可

## 内容来源（重要）

详情页内容分两类来源，**改内容前务必先确认对应来源**：

| 游戏 | 本地源码工程 | 权威数据文件 |
|---|---|---|
| LightingForYou | `E:\Projects\Godot\LigthingForYou` | `Global\game_control.gd`（14 段隐藏独白 + 光量五级）、`Level\Scenes\level_*.tscn` |
| UnReal Objects | `E:\Projects\Godot\UnReal Objects` | `UnReal Objects.md`（设计文档）、`Actions\Tres\*.tres`（14 个动作）、`project.godot`（按键）、`Maps\*.tscn` |
| Archipelago Luminary | `E:\Projects\Unity\Archipelago-Luminary` | `Assets\Arts\Font\Lang\lang.json`（全部游戏内文案，按行解析） |
| Bug Universe God | `E:\Projects\Unity\Bug Universe God` | `Assets\StreamingAssets\Config\*_配方.json`（201 条 / 174 组合）、`*_故事.json`（8 章）、`*_剧情.json`（6 节点）、`*_文本.json` |
| 第九张史莱姆牌 | `E:\Projects\Unity\Ninth Slime Card` | `Assets\Resources\Configs\cards.csv`（144 张卡）、`achievements.csv`（48 条） |
| 瑟克斯遗纪 | 本地工程直接编写 | 详情页自身即为权威版本 |

解析注意：
- `lang.json` 含非标准 `NaN` 字面量与重复键，**无法**用 `ConvertFrom-Json` / 常规 JSON 解析器读取，需按行用正则提取。
- `Assets\Arts\Font\Lang\*.txt` 是**字体子集化字符集**（乱序汉字表），不是翻译文本。
- `cards.csv` 的效果字段是脚本 DSL，如 `dmg:v1`、`status:vuln:2`、`sstatus:str:v2`、`shield:8`。

## 素材与字体授权

详情页里的美术素材全部取自对应游戏的**本地源码工程**（即 Gove 本人拥有版权的游戏资产），仅做降采样，不做二次创作：

| 页面 | 素材来源 | 授权说明 |
|---|---|---|
| `lightingforyou` | `Asset/Mine/`（4 个 128px 像素物件）+ `Asset/PNG/`（Kenney Particle Pack） | 自有资产 + Kenney Particle Pack（**CC0**，见 `assets/CREDITS-Kenney-Particle-Pack.txt`） |
| `unreal-objects` | `Player/`、`Objects/{Triangle,Fork}`、`Flag/`、`Dust/`、`plains.png` | 自有资产 |
| `archipelago-luminary` | `Assets/Arts/Images/{Towers,Enemys,Tiles}`、`LighringForYou/` | 自有资产（其中 `LighringForYou/` 与 LightingForYou 共用同一批 Kenney CC0 纹理） |
| `ninth-slime-card` | `Assets/.../Cards/`、`Monsters/`、`Resources/Fonts/` | 自有美术 + 阿里巴巴普惠体 2.0（公开发布、可免费商用，见 `fonts/CREDITS-Alibaba-PuHuiTi.txt`） |
| `bug-universe-god` | `Assets/Resources/StoryImages/`、`Assets/Arts/Image/` | 自有资产 |
| `six-elements` | 本地工程直接编写 | 自有资产 + FusionPixel（SIL OFL） |

**未采用**：LightingForYou 与 UnReal Objects 工程内各带一个 `VonwaonBitmap-*.ttf`（全 CJK 点阵字体），但其 `name` 表标注 "All rights reserved" 且工程内无许可文件，授权状态无法确认，因此**没有**内嵌；这两个页面的像素气质改由 CSS 排版与其真实精灵图承担。若确认持有授权，补一个 `@font-face` 即可启用。

## 部署

`git push` 到 `main` 分支即上线（GitHub Pages 自动部署）。纯静态文件，无需构建。

## 本地预览

```bash
python -m http.server 8000
# 打开 http://localhost:8000/
```

## 添加新游戏

参见 [NEW.md](./NEW.md)。
