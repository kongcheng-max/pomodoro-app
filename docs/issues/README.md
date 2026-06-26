# Issues（Bug 跟踪）

## 目录结构

```
issues/
├── README.md          ← 本文件
├── TEMPLATE.md        ← Bug 报告模板
├── still-exist/       ← 未修复的 bug（待研发处理）
│   └── BUG-XXX-*.md
└── done/              ← 已修复 + 已验收的 bug（归档）
    └── BUG-XXX-*.md
```

## 文件命名

`<序号>-<简短slug>.md`，如 `001-timer-does-not-resume.md`

## Bug 编号

`BUG-001` 起递增，与文件名序号一致。

## 严重程度

| 级别 | 含义 |
|------|------|
| `critical` | 核心功能不可用，数据丢失 |
| `major` | 功能异常但不阻塞主流程 |
| `minor` | 小问题，有绕过方案 |
| `cosmetic` | UI / 文案问题 |

## 模块分类

`番茄钟` | `待办` | `统计` | `主题` | `通知` | `存储` | `布局` | `其他`

## 生命周期

```
still-exist/  ──研发修复──→  产品部验收  ──通过──→  done/
     ↑                                                   
     用户验收发现新 bug                                   
```

1. 用户手动验收发现 bug → 产品部写入 `still-exist/`
2. 研发部修复后将 `status` 改为 `resolved`
3. 产品部识别到 `status: resolved` → 进行验收
4. 验收通过 → `status` 改为 `verified` → 移入 `done/`
5. 验收不通过 → 打回 `still-exist/`，`status` 改为 `open`
