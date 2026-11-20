---
name: football-content-builder
description: >-
  为《足球奇遇记》(football) 新增或扩充双层知识领域（domain）、亲子费曼问答（dialogue）与教练专业深潜（proDeepDive）、双语词条（lexicon）、分级训练教案（drills）、教学视频（videos）或交互式球场沙盘（Show）。凡在本仓库扩充或校对足球内容时调用。
---

# 足球奇遇记 · 双层内容扩充指南 (`football-content-builder`)

本技能将《足球奇遇记》的扩容流程与强校验规则浓缩为可直接执行的行动清单。完整背景、权威信源清单与模块地图见根目录 `AGENTS.md`。

---

## 1. 动手前必查（避免撞车与坏引用）

1. 查看 `src/content/domains/` 现有文件夹序号上限（如 `24-star-tales-magic`，下一个新领域用 `25-<slug>`）。
2. 先读 `src/data/sources.ts`、`src/content/lexicon/terms.ts`、`src/content/drills/drills.ts`、`src/content/videos/videos.ts`，确认已有 ID。
3. 严禁凭记忆编造 IFAB 规则、运动医学参数或赛事细节；用搜索核实官方来源并登记进 `src/data/sources.ts` 后再引用 `cite` / `citeIds`。

---

## 2. 脚手架与零侵入扩容

```bash
# 1. 新建整个领域包（import.meta.glob 自动发现，无需改路由；写完后运行 npm run content:index 刷新目录）
npm run new-content -- domain 25-setpiece-engineering "定位球精密战术工程"

# 2. 打印单篇双层课题骨架（粘贴进对应 domain.ts 的 articles 数组）
npm run new-content -- article setpiece-engineering corner-screens "为什么角球前大家总爱挤在门将面前？"
```

---

## 3. 编写 `FootballQuestion` 硬性铁律（`npm run check` 自动拦截）

### 3.1 元数据
- `article.topic` 必须严格等于所在 `bundle.meta.id`。
- `article.title` 必须是生动提问且**包含全角问号 `？`**。
- 必填 `proSubtitle`（专业理论副标题）和 `trigger`（真实球场/转播场景白描）。

### 3.2 第一层：`dialogue`（5–8 轮）
1. **轮数**：`5–8` 轮（推荐 5 或 6 轮）。
2. **双汉字实词咬合（最易失败）**：从第 2 轮起，`turn[i].nian` **必须原样包含 `turn[i-1].dad` 中出现的至少 1 个双汉字实词**（由常见虚字 `的了吗呢吧呀啊哦嘛是我你他她它们这那就也都还又在有和么什怎为个一不没会要说想看能可以得很太好真再` 组成的词不计）。
3. **句式**：第 `1 ~ N-1` 轮 `nian` 必须包含 `？`；最后一轮 `nian` 必须以 **`我懂了` 或 `我明白了`** 开头做总结。
4. **爸爸字数红线**：每轮 `turn.dad.length` 严格在 **`25–205` 字符**之间（建议写 `70–170` 字）。
5. **可视化图解 `show`**：至少配 1 个贴合内容的 `show`（通用：`steps`、`numbers`、`bars`、`compare`、`ruler`；交互沙盘：`pitch-anatomy`、`pitch-formats`、`pitch-roles`、`offside`、`formations`、`triangles`、`scanning`、`ball-curve`、`analytics-xg`、`funino`、`history-pyramid`、`referee-cla`）。

### 3.3 第二层：`proDeepDive`
- `thesis` ≥ 20 字；`sections` ≥ 2 个；`kpis` ≥ 2 项；`prescription` 完整（`name` / `spec` / `method` / `cues`）；`pitfalls` ≥ 1 条。

### 3.4 禁用词黑名单 & 双向外键
- 全课题对象禁止出现：`两岁`、`2岁`、`先行做功课`、`先行备好`、`为其做职业准备`、`爸爸功课`、`十六年计划`、`深潜内参`、`筑根基`、`双层知识引擎`、`模块化可扩展架构`。
- `cite` / `citeIds`、`lexiconIds`、`drillIds`、`relatedIds` 必须全部指向真实存在的 ID。
- 若在 `terms.ts`、`drills.ts` 或 `videos.ts` 新增条目，其 `relatedArticleIds` 也必须指向真实课题 ID。

---

## 4. 交付前强制三连门禁

```bash
npm run content:index   # 先刷新 src/content/catalog.json（check 会拦截过期目录）
npm run check
npm run typecheck
npm run build
```
