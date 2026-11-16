# AGENTS.md — 《足球奇遇记》AI 协同扩建与内容工程规范

本文件面向所有后续维护与扩充本项目的 AI 智能体（Copilot CLI、Claude Code、Cursor、Codex 等）。在新增领域、编写课题、扩充教案/词典或开发交互沙盘前，**请完整阅读并严格遵循本规范**，确保生成内容在专业深度、叙事口吻、视觉交互与数据结构上与全站保持 100% 一致。

---

## 1. 产品定位与「同题双层」内容哲学

本站是一座**同时服务孩子直觉启蒙与家长/基层教练系统进阶**的交互式足球知识库。全站顶部提供 `🌗 双层同看 / 🎓 专业模式 / 👦 亲子模式` 三档全局阅读视角切换，因此每一篇课题（`FootballQuestion`）都必须围绕**同一个真实球场现象**构建严格对应的上下两层内容：

1. **上层 · 亲子费曼追问链（`dialogue`）**
   - **角色设定**：好奇、善于抓细节提问的孩子「小念」 × 既懂运动科学与现代战术、又会打比方的「爸爸」。
   - **教学路径**：从看球或踢球时亲眼见到的一幕具体场景（`trigger`）切入 → 第一句先给清晰结论 → 用生活物理/几何比方讲透原理 → 连续追问边界条件与常见误解 → 最后由小念用自己的话串起完整因果链。
2. **下层 · 教练与球探专业深潜（`proDeepDive`）**
   - **专业水位**：对标欧足联（UEFA）/ 亚足联（AFC）教练员教材、IFAB 最新《足球竞赛规则》、运动生理学/生物力学论文及现代数据球探分析框架。
   - **结构闭环**：必须同时具备「核心论断（`thesis`）+ 机制拆解（`sections`）+ 量化评估标尺（`kpis`）+ 可直接落地的训练处方（`prescription`）+ 基层常见误区红线（`pitfalls`）」。

---

## 2. 仓库架构与零侵入扩容地图

项目基于 **React 19 + TypeScript + Vite** 构建，核心采用**自动发现插件化架构**（`src/content/registry.ts`）：

| 目录 / 文件 | 职责说明 | 扩容时是否需要改动路由/页面？ |
| :--- | :--- | :--- |
| `src/data/types.ts` | 全站核心 TypeScript 协议（`DomainBundle`、`FootballQuestion`、`Show`、`TrainingDrill`、`LexiconTerm`） | 仅在新增 `Show` 模拟器种类或 `DrillDiagramType` 时扩展联合类型 |
| `src/content/domains/<序号>-<slug>/domain.ts` | 各大模块化知识领域包（如 `01-pitch-equipment` 至 `23-gk-rts-matchread`） | **零改动自动挂载**：`import.meta.glob('./domains/*/domain.ts')` 自动发现、按 `meta.order` 排序、自动建立双向关联图谱并接入全文搜索（新增领域如归属五阶学习路线，可同步追加 `TopicId` 至 `src/pages/DadMasteryPage.tsx` 的 `MASTERY_STAGES`） |
| `src/data/sources.ts` | 全站权威文献与规则信源注册表（`SOURCES`） | 新增引用前**必须先在此注册 `id`、标题、机构与真实 URL** |
| `src/content/lexicon/terms.ts` | 中英双语专业术语词典（`LEXICON_TERMS`） | 追加词条对象即可自动渲染并与课题双向互链 |
| `src/content/drills/drills.ts` | 年龄分级标准训练教案库（`TRAINING_DRILLS`） | 若复用现有 12 种 `diagram` 则零改页面；若新增战术图类型需在 `src/pages/DrillsBenchPage.tsx` 的 `DrillDiagramSvg` 中补充对应 SVG 分支 |
| `src/components/shows/*.tsx` + `ShowView.tsx` | 嵌入在对话轮次中的可视化图解与交互式球场模拟器 | 复用 `steps` / `numbers` / `bars` / `compare` / `ruler` 零改组件；新增交互实验室需同步挂载至 `ShowView.tsx` 与 `src/pages/TacticsLabPage.tsx` |
| `src/data/hlg-resources.ts` / `pathway-atlas.ts` | 京北绿茵场地学区实录 / 青训标准与升学通路结构化数据 | 更新地域球场、赛历或升学政策时直接维护对应数据表 |
| `tools/new-content.mjs` | 领域与单篇课题 CLI 脚手架生成器 | 辅助工具，勿随意破坏参数契约 |
| `tools/dialogue-rules.mjs` | **全站内容、对话咬合、字数、禁用词与跨表外键强校验器** | 提交前必须运行 `npm run check` 且零报错 |

---

## 3. 内容撰写铁律（`npm run check` 强制校验清单）

AI 编写任何课题时，必须逐条满足 `tools/dialogue-rules.mjs` 的硬性检查规则，否则构建门禁直接失败：

### 3.1 领域与课题元数据规范
- **模块连续编号**：新增领域文件夹命名为 `<两位序号>-<英文短横线slug>`（例如 `24-setpiece-engineering`），`meta.id` 必须与每篇下属文章的 `article.topic` 完全一致，`meta.order` 与 `meta.moduleCode`（如 `MOD-24 · ...`）保持全站连续无冲突。
- **标题必须带问号**：`article.title` 必须是从现象出发的生动中文提问，且**必须包含全角问号 `？`**（例如：`球探去现场看小球员比赛，为什么不盯刚进球的人，反而老盯着不拿球的人看？`）。
- **专业副标题与触发场景**：`proSubtitle` 提炼硬核学科模型；`trigger` 用一句话白描真实的看台、转播或训练场观察瞬间。

### 3.2 第一层：`dialogue` 费曼追问链五条铁律
1. **轮数区间**：每篇 `dialogue` 必须为 **`5–8` 轮**（推荐 **5 或 6 轮**，节奏最紧凑）。
2. **词语咬合链（Word-Chaining，最易踩坑！）**：
   - 从第 2 轮起（`idx > 0`），`turn[idx].nian` **必须原样包含上一轮 `turn[idx - 1].dad` 中出现过的至少 1 个双汉字实词**！
   - 校验器计算实词时会自动剔除以下单字组成的词：`的了吗呢吧呀啊哦嘛是我你他她它们这那就也都还又在有和么什怎为个一不没会要说想看能可以得很太好真再`。
   - **标准写法示范**：若上一轮爸爸答 `...前锋悄悄溜到了后卫后脑勺背面的视野死角里！`，下一轮小念可接：`悄悄溜到后卫后脑勺的视野死角里！要是后卫贴身跟着我怎么甩开呢？`（精准命中 `悄悄`、`后卫`、`视野`、`死角` 等实词，阅读体感自然连贯）。
3. **提问与总结句式**：
   - 第 `1` 至 `N-1` 轮：`turn.nian` **必须包含全角问号 `？`**。
   - 最后一轮（第 `N` 轮）：`turn.nian` **必须以 `我懂了` 或 `我明白了` 开头**（例如：`我懂了！原来……`），完整复盘本课核心因果；无需带问号。
4. **爸爸单轮字数红线**：
   - 每一轮 `turn.dad.length` **必须严格介于 `25` 到 `205` 个字符之间**（含标点）。
   - **安全建议**：撰写时将 `dad` 控制在 **`70–170` 字**，切忌堆砌超长复句导致突破 205 字上限！
5. **可视化图解（`show`）配置**：
   - 每篇课题至少在 `dialogue[0]`（或核心拆解轮）配置 1 个贴合内容结构的 `show` 对象：
     - 流程拆解用 `kind: 'steps'`（3–4 步带 Emoji）
     - 关键阈值用 `kind: 'numbers'`（3 个核心数字卡片）
     - 量级对比用 `kind: 'bars'`
     - 正误行为对照用 `kind: 'compare'`（`badTitle` vs `goodTitle`）
     - 历史演进或空间刻度用 `kind: 'ruler'`（支持 `even: true` 等距时间轴及节点级 `cite`）
     - 若课题直接讲解越位、阵型、抢圈、抬头扫描、香蕉球、xG、FUNiño、场地标线或百年阵型史，可直接挂载对应的交互沙盘 `kind`（见 `src/data/types.ts` 中的 `Show` 定义）。

### 3.3 第二层：`proDeepDive` 专业深潜五要素
- `thesis`：不少于 20 字的一句话硬核核心论断（点破反直觉本质）。
- `sections`：**至少 2 个**结构化小节（`1. ...`、`2. ...`），深入拆解运动生物力学、战术几何、生理生化或法规条款。
- `kpis`：**至少 2 项**量化观测指标（`metric` 指标名 + `target` 量化区间/判据 + `meaning` 实战球探或医学含义）。
- `prescription`：可直接在草坪、客厅或看台执行的实操方案（必填 `name`、`spec`、`method` 及 `cues` 指导口令数组）。
- `pitfalls`：**至少 1 条**针对基层教练或家长的认知误区与安全红线警示。

### 3.4 全站严禁出现的禁用词黑名单（Forbidden Meta Phrasing）
校验脚本会对整个课题对象执行 `JSON.stringify(q)` 正则扫描。**严禁在任何字段中出现以下脱离大众读者的私设背景词或空洞包装口号**：
> 禁用正则：`/两岁|(?<!\d)2岁|先行做功课|先行备好|为其做职业准备|爸爸功课|十六年计划|深潜内参|筑根基|双层知识引擎|模块化可扩展架构/`
- 注意：写专业层文案时请用「专业深潜」「核心机制」「教练视角」等自然表达，**切勿写出 `深潜内参` 四个字**！

### 3.5 跨模块双向织网要求（拒绝信息孤岛）
- **文献溯源**：每篇课题在 `dialogue[].cite` 与 `proDeepDive.citeIds` 中至少引用 1–3 个存在于 `src/data/sources.ts` 的真实信源 ID。
- **横向图谱**：每篇课题配置 3–4 个跨领域的 `relatedIds`（`registry.ts` 会自动将其扩展为双向无向边）。
- **词典与教案联动**：在 `proDeepDive.lexiconIds` 与 `proDeepDive.drillIds` 中关联对应词条与教案；反之新增 `LexiconTerm` 或 `TrainingDrill` 时，其 `relatedArticleIds` 也必须指向真实存在的课题 ID。

---

## 4. 优质权威内容从哪里获取？（信源分级与检索指南）

**严禁仅凭模型参数记忆编造足球规则细则、医学数据或赛事结果！** 特别是近年国际足坛规则与赛制频繁迭代，动笔前必须通过搜索工具核查以下一级权威来源，并将新来源录入 `src/data/sources.ts`：

1. **竞赛规则与裁判执法（最高优先级核查）**
   - **IFAB（国际足球协会理事会，`theifab.com`）**：最新赛季《Laws of the Game》及官方通告（Circulars）。
   - *时效性重点提醒*：务必核对最新现行规则（例如：2025/26 起门将手控球上限为 **8 秒且超时判对方角球**而非旧版 6 秒间接任意球；点球助跑打滑**意外双脚触球罚进判重罚**而非直接违例取消；**仅限队长沟通协议 Captain-Only**；十一人制界外球要求**双脚均有一部分触及边线或线外地面**等）。
2. **战术理论、青训大纲与教练员方法论**
   - **FIFA Training Centre**（`fifatrainingcentre.com`）与 **UEFA Technical Reports**（欧冠/欧洲杯官方技术报告，获取最新高位逼抢、三中卫出球、定位球趋势数据）。
   - **中国足协《中国足球协会青少年训练大纲（2022年版）》** 与 **AFC Coaching Manuals**（五环模型、敏感期、比赛四个时刻、GAG 训练课结构）。
   - **The Coaches' Voice Academy**、巴萨拉玛西亚位置战文献（Juego de Posición）、Horst Wein（FUNiño 四球门体系）、Jonathan Wilson《Inverting the Pyramid》。
3. **数据球探与比赛表现分析**
   - **StatsBomb / Hudl StatsBomb**（xG、PSxG/xGOT 射门后预期进球、OBV 模型）、**Karun Singh（Expected Threat xT）**、**Impect（Packing 破线人数）**、**Opta Analyst**、**FIFA EPTS（电子表现与追踪系统标准）**。
4. **运动生理、体测国标与运动医学防护**
   - **《British Journal of Sports Medicine (BJSM)》**：FIFA 11+ / 11+ Kids 神经肌肉热身、UEFA 女足前交叉韧带（ACL）防伤共识、SCAT6 运动脑震荡评估工具、Tim Gabbett 急慢性负荷比（ACWR）。
   - **中国足协 × 国家体育总局体育科学研究所**：《青少年球员运动能力测试指导手册》（年龄四分位耐力、冲刺、灵敏箭头跑基准）与生物成熟度评估（Mirwald PHV 身高突增峰值、Bio-banding 生物年龄分组）。
5. **本土赛事生态与体教升学政策**
   - 教育部与国家体育总局最新年度《高校高水平运动队招生》与《体育单招管理办法》（核实文化课折算线与一级运动员报考门槛）、北京市教委特长生招生简章、北京市足协官方竞赛规程（京少联赛、百队杯）。

---

## 5. 如何用 AI 工具链与 Skills 高效扩充本站？（标准 SOP）

当收到用户诸如「帮我扩充 XX 板块」「检查并丰富某主题」「加一个 XX 模拟器」的任务时，请按以下 **6 步标准工作流**执行：

### Step 1：盘点现状与缺口定位（Search First）
- 使用内置文件检索工具（`glob` / `grep` / `view`）查看现有领域列表（`src/content/domains/`）、`terms.ts`、`drills.ts` 与 `sources.ts`，确认已有课题 ID、模块序号上限（如当前已到 `21`）与现有覆盖面，避免主题撞车或 ID 重复。

### Step 2：联网检索一手资料并注册信源（Verify & Cite）
- 使用 `web_search` / `web_fetch`（或派发只读 `research` 子智能体）核查目标课题的最新规则原文、学术论文结论与权威链接。
- 先使用 `edit` 将核实无误的新文献追加进 `src/data/sources.ts`，拿到合法的 `source.id`。

### Step 3：使用 CLI 脚手架生成标准模板（Scaffold）
- **新建整个知识领域**：
  ```bash
  npm run new-content -- domain 22-setpiece-lab "定位球精密战术工程"
  ```
  生成 `src/content/domains/22-setpiece-lab/domain.ts` 后，完善 `meta` 中的 `emoji`、`short`、`color`、`moduleCode`（`MOD-22 · ...`）、`kidHook` 与 `dadLens`。
- **打印单篇双层课题骨架**：
  ```bash
  npm run new-content -- article setpiece-lab throw-in-science "界外球为什么值得豪门专门聘请一位教练？"
  ```

### Step 4：并行撰写课题、词条与教案（Author & Cross-Link）
- 在对应 `domain.ts` 中编写高质量双层课题，逐轮自检「双汉字实词咬合」与「爸爸回答 25–205 字」。
- 若涉及新战术/科学概念，同步在 `src/content/lexicon/terms.ts` 新增双语词条；若涉及经典球场训练法，同步在 `src/content/drills/drills.ts` 新增分级教案（如需新增自定义 SVG 战术图，同步扩展 `src/data/types.ts` 的 `DrillDiagramType` 与 `src/pages/DrillsBenchPage.tsx` 的 `DrillDiagramSvg`）。
- **多智能体并行加速技巧**：若一次需扩充 2 个以上相互独立的领域（例如同时新建 `22-*` 与 `23-*`），可先在主线程统一敲定所有新增文章 ID、词条 ID 与信源 ID，再并行启动多个 `general-purpose` 子智能体各自负责独立目录文件，彻底避免文件写冲突。

### Step 5：按需开发新交互沙盘或衍生视觉物料（Visuals & Skills）
- **站内交互沙盘开发**：在 `src/components/shows/` 下使用**纯内联响应式 SVG + React Hooks** 编写轻量无外部重依赖的交互组件（延续全站 `#3da65c` 球场草皮绿、清晰圆点球员标记与顶部状态切换按钮风格），在 `types.ts`、`ShowView.tsx` 及 `TacticsLabPage.tsx` 注册。
- **配合环境 Agent Skills 拓展衍生内容**：
  - 需要将站内战术体系、青训通路或代码数据流绘制成独立高清架构图/状态流转图时，调用 `archify` skill；
  - 需要将某领域的专业内容提炼为教练培训课件、家长会分享 PPT 或项目路演幻灯片时，调用 `html-briefing-deck` skill；
  - 需要将本站交互沙盘与双层阅读亮点制作为 MP4 产品演示或科普短视频时，调用 `product-promo-video` skill；
  - 需要为 GitHub PR 附上新增交互沙盘或战术图的截图/录屏时，调用 `github-pr-media` skill。

### Step 6：执行强制三连门禁校验（Validate Before Done）
每次修改或扩充完成后，**必须依次通过以下三条命令且零警告零报错**，方可向用户交付：

```bash
npm run check      # 校验全站领域、对话咬合链、字数区间、禁用词及词典/教案/文献双向引用完整性
npm run typecheck  # 校验全量 TypeScript 严格类型契约
npm run build      # 验证 Vite 生产包编译与静态资源打包通过
```
