# 艺术感 / 交互感升级 · 进度

参考项目：`E:\Projects\Git\pelican-6000-pure-code`
设计纲领：见 [ART-DIRECTION.md](./ART-DIRECTION.md)

## 状态

| 任务 | 页面 | mode | 状态 |
|---|---|---|---|
| — | 首页 index.html | atlas | ✅ 完成（样板） |
| task-6 | lightingforyou | lumen | ✅ 完成 |
| task-7 | unreal-objects | crt | ✅ 完成 |
| task-8 | archipelago-luminary | mono | ✅ 完成 |
| task-9 | ninth-slime-card | felt | ✅ 完成 |
| task-10 | bug-universe-god | dossier | ✅ 完成（lead 补齐影院外壳 + --mode + 过冲曲线） |
| task-11 | six-elements | slate | ✅ 完成（lead 补齐影院外壳 JS） |

## 七页最终实测

**影院外壳退场**（CDP 实测，静置 2.6s 后读计算样式）

| 页面 | 选择器 | 活动 | 静置 |
|---|---|---|---|
| 首页 | `.nav` | 1 | 0.28 |
| lightingforyou | `.chrome` | 1 | 0.12 |
| unreal-objects | `.hud` | 1 | 0 |
| archipelago | `.topbar` | 1 | 0.26 |
| ninth-slime | `.topbar` | 1 | 0.16 |
| bug-universe | `.topbar` | 1 | 0.18 |
| six-elements | `.topbar` | 1 | 0 |

七页全部退场成功，鼠标移动即恢复。

**渲染体检**（14 项：7 页 × 桌面/移动）

全部 OK，无空白、无过曝（过曝率最高 0.66%，为首页 Hero 的高光）。
Archipelago 暗部 85.6%，守住了「95% 黑 + 颜色稀缺」的基调。

## 收尾时补的三处缺口

teammate 交付时遗漏、由 lead 补齐：

1. **bug-universe-god 缺影院外壳**：`.topbar` 已有 `transition` 和注释引用了
   `.cinema-idle`，但规则与 JS 都没写。补上 `html.js-reveal.cinema-idle .topbar`
   规则 + `bump()` 计时器（reduced-motion 下直接 return，不退场）。
2. **six-elements 缺影院外壳 JS**：CSS 写了 `html.has-chrome.is-idle .topbar`，
   但没有任何 JS 加这两个类，导致退场**完全不生效**（实测 opacity 恒为 1）。
   补上 `has-chrome` 声明与计时器，并让灯箱打开时不退场。
3. **`--mode` 字面量缺失**：ninth-slime-card / bug-universe-god 只有注释没变量，已补。

另外删除了 archipelago 里 2 个「备而未用」的死代码类 `.edge-layers` /
`.edge-layers--gold`（该页用 `.px` 的 `clip-path` 阶梯边框，`box-shadow` 会被裁掉，
分层描边实际是靠三层 `drop-shadow` 实现的），原地留注释说明原因。

## 待办

- 更新 README.md 与 NEW.md，记录新的设计系统
- 提交并推送

## 已知遗留

- `games/lightingforyou/promo.html` 是未跟踪的孤儿文件（75KB，无任何页面引用），
  非本次改动产生。待确认是删除还是保留。
- `--hz` 令牌只在 unreal-objects / six-elements 落地（这两页是像素风，最需要时间量化）；
  其余页面的 `steps()` 用量为 0，属可接受——非像素风页面不需要帧率感。
