---
id: BUG-017
severity: cosmetic
status: verified
reported_by: 产品部 · 手动验收再次确认 · inline style 覆盖了 CSS hover
reported_date: 2026-06-26
module: 番茄钟
---

# 放弃按钮缺少 hover 态

## 复现步骤

1. 开始计时
2. 鼠标悬停在"放弃"按钮上

## 预期行为（ui-design-spec §6.4）

```css
.btn-giveup:hover { background: #95A5A6; }
```

## 实际行为（第二次验收）

加了 CSS 类 `.btn-giveup-hover:hover { background: #95A5A6; }`，但 `style={{ background: '#BDC3C7' }}` 是 inline style，CSS 优先级高于任何 class hover → 悬停时颜色仍不变。

**根因**：Inline style 覆盖了 CSS 类。两处放弃按钮（running 第 49 行、paused 第 74 行）都用 inline style，任何 class 级别的 hover 规则都无法生效。

## 建议修复

**方案 A**（推荐）：用 JS state 控制 inline style
```tsx
const [hoverGiveUp, setHoverGiveUp] = useState(false)
// style={{ background: hoverGiveUp ? '#95A5A6' : '#BDC3C7' }}
// onMouseEnter={() => setHoverGiveUp(true)}
// onMouseLeave={() => setHoverGiveUp(false)}
```

**方案 B**：去掉 inline style，改用 Tailwind `bg-[#BDC3C7] hover:bg-[#95A5A6]`

## 环境信息

- 浏览器：不限
