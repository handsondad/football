/**
 * 足球奇遇记 · 可扩展双层知识库核心协议（Schema v2）
 *
 * 架构设计原则：
 * 1. 同题双层（Dual-Layer Pedagogy）：
 *    - 👦 亲子共读层（dialogue）：小念 × 爸爸费曼式追问链 + 交互图解，让孩子直观理解现象与因果；
 *    - 🎓 专业深潜层（proDeepDive）：面向爸爸/基层教练的体系化内参（理论框架、球探量化KPI、实操训练处方、红线判据）。
 * 2. 插件化零侵入扩容（Zero-Touch Auto-Discovery）：
 *    - 领域模块放在 `src/content/domains/<序号>-<id>/domain.ts`，由 `import.meta.glob` 自动发现挂载；
 *    - 教案库 `src/content/drills/*.ts`、双语词典 `src/content/lexicon/*.ts` 独立解耦并通过 ID 双向互链；
 *    - 后续新增第 10、11 个领域或上百篇课题、教案、词条无需改动路由与页面骨架代码。
 */

export type TopicId = string;

export type Difficulty = 1 | 2 | 3;

export const difficultyLabel: Record<Difficulty, string> = {
  1: '入门',
  2: '进阶',
  3: '深入',
};

export const difficultyHint: Record<Difficulty, string> = {
  1: '核心概念、基础规则与运动安全底层常识',
  2: '生物力学机制、小组战术原则、训练课结构与区域生态',
  3: '高阶战术模型、数据球探指标、选材生理学与国内外法规体系',
};

/** 全站阅读视角模式 */
export type ReadLens = 'dual' | 'pro' | 'kid';

export type Source = {
  readonly id: string;
  readonly title: string;
  readonly url: string;
  readonly by: string;
};

export type FootballTopic = {
  readonly id: TopicId;
  /** 排序权重，越小越靠前 */
  readonly order: number;
  readonly emoji: string;
  readonly title: string;
  readonly short: string;
  readonly color: string;
  /** 孩子视角的好奇钩子 */
  readonly kidHook: string;
  /** 爸爸/教练视角的专业知识域定义 */
  readonly dadLens: string;
  /** 关联亚足联/欧足联知识模块标签 */
  readonly moduleCode: string;
};

export type Show =
  | { readonly kind: 'steps'; readonly frames: readonly { readonly icon: string; readonly label: string }[] }
  | { readonly kind: 'numbers'; readonly items: readonly { readonly value: string; readonly unit: string; readonly label: string }[] }
  | { readonly kind: 'bars'; readonly unit: string; readonly items: readonly { readonly icon: string; readonly label: string; readonly value: number; readonly text?: string }[] }
  | {
      readonly kind: 'compare';
      readonly badTitle: string;
      readonly goodTitle: string;
      readonly rows: readonly { readonly bad: string; readonly good: string }[];
    }
  | {
      readonly kind: 'ruler';
      readonly unit: string;
      readonly even?: boolean;
      readonly marks: readonly {
        readonly at: number;
        readonly icon: string;
        readonly name: string;
        readonly text: string;
        readonly cite?: readonly string[];
      }[];
    }
  /** 105×68m 标准球场几何标线解剖 */
  | { readonly kind: 'pitch-anatomy' }
  /** 5v5 / 8v8 / 11v11 场地尺寸按比例叠放 */
  | { readonly kind: 'pitch-formats' }
  /** 1–11号位置职责活动热区与球星模板 */
  | { readonly kind: 'pitch-roles' }
  /** 越位规则 5 情景定格与前插模拟器 */
  | { readonly kind: 'offside' }
  /** 1-4-3-3 / 1-4-2-3-1 / 1-4-4-2 / 8人制 攻防转换动态推演 */
  | { readonly kind: 'formations' }
  /** 菱形双三角抢圈（Rondo）可点击传球遛猴沙盘 */
  | { readonly kind: 'triangles' }
  /** 接球前抬头扫描（Scanning）360° 视野与转身结果模拟 */
  | { readonly kind: 'scanning' }
  /** 香蕉球（马格努斯）与电梯球（卡门涡街）空气动力学风洞 */
  | { readonly kind: 'ball-curve' }
  /** 现代球探数据沙盘：xG 期望进球 + xT 期望威胁网格 + Packing 破线计数 */
  | { readonly kind: 'analytics-xg' }
  /** Horst Wein FUNiño 3v3 四球门宽度与弱侧转移推演板 */
  | { readonly kind: 'funino' }
  /** 百年足球阵型「倒转金字塔」演进沙盘（1872→2026） */
  | { readonly kind: 'history-pyramid' }
  /** 裁判对角线跑位制与训练场尺寸×人数动态配平沙盘 */
  | { readonly kind: 'referee-cla' };

export type DialogueTurn = {
  readonly nian: string;
  readonly dad: string;
  readonly cite?: readonly string[];
  readonly show?: Show;
};

/**
 * 🎓 专业深潜层（面向爸爸自我研修 / 基层青训教练 / 长期体系支撑）
 */
export type ProDeepDive = {
  /** 核心论断提炼 */
  readonly thesis: string;
  /** 理论模型与机制拆解（2–3 个结构化小节） */
  readonly sections: readonly {
    readonly heading: string;
    readonly content: string;
  }[];
  /** 量化评估标尺与球探观测指标 */
  readonly kpis: readonly {
    readonly metric: string;
    readonly target: string;
    readonly meaning: string;
  }[];
  /** 标准训练处方 / 实操执行方案 */
  readonly prescription: {
    readonly name: string;
    readonly spec: string;
    readonly method: string;
    readonly cues: readonly string[];
  };
  /** 常见认知误区与决策红线 */
  readonly pitfalls: readonly string[];
  /** 关联专业术语词典 ID */
  readonly lexiconIds?: readonly string[];
  /** 关联标准训练教案 ID */
  readonly drillIds?: readonly string[];
  /** 专业文献出处 ID */
  readonly citeIds?: readonly string[];
};

export type FootballQuestion = {
  readonly id: string;
  readonly topic: TopicId;
  readonly difficulty: Difficulty;
  readonly tags: readonly string[];
  /** 亲子问答切入标题（带 ？） */
  readonly title: string;
  /** 专业课程副标题（教练/科学体系命名） */
  readonly proSubtitle: string;
  /** 真实球场观察触发场景 */
  readonly trigger: string;
  /** 第一层：小念 × 爸爸费曼式追问链 */
  readonly dialogue: readonly DialogueTurn[];
  /** 第二层：爸爸/教练专业深潜内参 */
  readonly proDeepDive: ProDeepDive;
  /** 跨领域关联课题 ID（双向自动构建知识图谱） */
  readonly relatedIds?: readonly string[];
};

/** 领域插件包结构（每个领域独立文件夹导出一个 DomainBundle） */
export type DomainBundle = {
  readonly meta: FootballTopic;
  readonly articles: readonly FootballQuestion[];
};

/** 标准训练教案数据结构（`src/content/drills/`） */
export type DrillDiagramType =
  | 'rondo-split'
  | 'funino-4goal'
  | 'wall-scan'
  | '1v1-gates'
  | 'transition-box'
  | 'gk-triangle'
  | 'third-man'
  | 'warmup-11plus'
  | 'back-four-shift'
  | 'cutback-corridor'
  | 'futsal-sole-4s'
  | 'arrow-agility';

export type TrainingDrill = {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly enTitle: string;
  readonly ageStage: 'U5–U8' | 'U9–U12' | 'U13–U16' | '全年龄段';
  readonly category:
    | '球感与第一触球'
    | '1v1突破与防守'
    | '传控与位置战'
    | '攻防转换压迫'
    | '门卫专项'
    | '神经肌肉防伤'
    | '防线协同与定位球'
    | '射门终结与传中';
  readonly areaSize: string;
  readonly players: string;
  readonly workRest: string;
  readonly equipment: string;
  readonly diagram: DrillDiagramType;
  readonly objective: string;
  readonly rules: readonly string[];
  readonly progressions: readonly string[];
  readonly coachingQuestions: readonly string[];
  readonly relatedArticleIds: readonly string[];
};

/** 足球双语专业术语词条（`src/content/lexicon/`） */
export type LexiconCategory =
  | '战术模型与位置战'
  | '数据球探与分析'
  | '技术与运动生物力学'
  | '青训教学法'
  | '运动生理与医学'
  | '规则与国际转会法'
  | '足球历史与国际治理';

export type LexiconTerm = {
  readonly id: string;
  readonly zh: string;
  readonly en: string;
  readonly origin?: string;
  readonly category: LexiconCategory;
  readonly summary: string;
  readonly detail: string;
  readonly onPitchSign: string;
  readonly relatedArticleIds: readonly string[];
};

export type VideoCategory =
  | '规则与裁判'
  | '个人技术教学'
  | '青训与亲子训练'
  | '运动医学与防伤'
  | '战术分析'
  | '经典比赛'
  | '纪录片与人物';

export type VideoKind =
  | 'video'
  | 'playlist'
  | 'channel'
  | 'channel-search'
  | 'course'
  | 'archive'
  | 'documentary';

export type VideoAudience = '亲子' | '教练' | '裁判' | '球迷';

export type VideoResource = {
  readonly id: string;
  readonly title: string;
  readonly category: VideoCategory;
  readonly kind: VideoKind;
  readonly platform: string;
  readonly publisher: string;
  readonly url: string;
  /** 国内可直接打开的备用入口（多为 B 站搜索） */
  readonly altUrl?: string;
  readonly altLabel?: string;
  readonly lang: string;
  readonly audience: readonly VideoAudience[];
  readonly level: '入门' | '进阶' | '专业';
  readonly year?: number;
  readonly duration?: string;
  readonly access: '免费' | '免费注册' | '付费订阅';
  readonly summary: string;
  readonly howToWatch: string;
  readonly relatedArticleIds: readonly string[];
};
