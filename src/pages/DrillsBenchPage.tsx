import { useState, type CSSProperties } from 'react';
import { TRAINING_DRILLS } from '../content/registry.ts';
import type { DrillDiagramType, TrainingDrill } from '../data/types.ts';

/**
 * 中国足协 × 国家体育总局体育科学研究所（2026年3月发布）
 * 《青少年足球运动员运动能力测试指导手册（2026年版）》男子四分位常模真实数据表
 */
type AgeKey = 12 | 13 | 14 | 15 | 16;

type QuartileRule = {
  readonly unit: string;
  /** true = 数值越小越优秀（如跑步秒数），false = 数值越大越优秀（如纵跳/引体/YoYo） */
  readonly lowerIsBetter: boolean;
  /** [优秀阈值P75, 良好阈值P50, 及格阈值P25] */
  readonly cutoffs: Partial<Record<AgeKey, readonly [number, number, number]>>;
};

const CFA_2026_STANDARDS: Record<string, QuartileRule> = {
  sprint30: {
    unit: '秒',
    lowerIsBetter: true,
    cutoffs: {
      12: [4.66, 4.80, 4.94],
      13: [4.55, 4.72, 4.90],
      14: [4.32, 4.44, 4.54],
      15: [4.26, 4.37, 4.47],
      16: [4.25, 4.36, 4.45],
    },
  },
  arrowhead: {
    unit: '秒',
    lowerIsBetter: true,
    cutoffs: {
      12: [8.99, 9.22, 9.42],
      13: [8.66, 8.88, 9.15],
      14: [8.41, 8.57, 8.76],
      15: [8.20, 8.33, 8.49],
      16: [8.08, 8.22, 8.38],
    },
  },
  vjump: {
    unit: 'cm',
    lowerIsBetter: false,
    cutoffs: {
      13: [42.0, 36.0, 28.1],
      14: [44.0, 37.1, 30.1],
      15: [46.0, 40.1, 34.1],
      16: [48.0, 42.1, 38.1],
    },
  },
  pullup: {
    unit: '个',
    lowerIsBetter: false,
    cutoffs: {
      13: [4, 2, 1],
      14: [7, 4, 2],
      15: [9, 6, 4],
      16: [13, 10, 8],
    },
  },
  sitreach: {
    unit: 'cm',
    lowerIsBetter: false,
    cutoffs: {
      13: [12.2, 9.0, 5.8],
      14: [15.9, 11.4, 7.3],
      15: [17.6, 13.9, 9.3],
      16: [19.1, 15.0, 12.0],
    },
  },
  yoyo: {
    unit: '米',
    lowerIsBetter: false,
    cutoffs: {
      13: [1550, 1200, 880],
      14: [1840, 1440, 1160],
      15: [2120, 1880, 1520],
      16: [870, 740, 640], // 注：16岁切换为更高强度的 YO-YO IR2 模式
    },
  },
};

function gradeScore(rule: QuartileRule, age: AgeKey, val: number) {
  const cuts = rule.cutoffs[age];
  if (!cuts || Number.isNaN(val)) return null;
  const [exc, good, pass] = cuts;
  if (rule.lowerIsBetter) {
    if (val <= exc) return { label: '🌟 优秀 (全国前25%)', cls: 'grade-exc' };
    if (val <= good) return { label: '✅ 良好 (26%–50%)', cls: 'grade-good' };
    if (val <= pass) return { label: '🟡 及格 (51%–75%)', cls: 'grade-pass' };
    return { label: '🔧 待提升 (后25%)', cls: 'grade-low' };
  }
  if (val >= exc) return { label: '🌟 优秀 (全国前25%)', cls: 'grade-exc' };
  if (val >= good) return { label: '✅ 良好 (26%–50%)', cls: 'grade-good' };
  if (val >= pass) return { label: '🟡 及格 (51%–75%)', cls: 'grade-pass' };
  return { label: '🔧 待提升 (后25%)', cls: 'grade-low' };
}

function DrillDiagram({ kind }: { kind: DrillDiagramType }) {
  return (
    <svg className="drill-svg" viewBox="0 0 360 210" aria-hidden="true">
      <rect width="360" height="210" rx="14" fill="#379956" />
      <rect x="20" y="16" width="320" height="178" fill="none" stroke="rgba(255,255,255,0.82)" strokeWidth="2" />

      {kind === 'rondo-split' && (
        <g>
          <rect x="95" y="28" width="170" height="154" fill="rgba(255,248,210,0.12)" stroke="#ffe066" strokeDasharray="5 4" strokeWidth="2" />
          {[
            [180, 28],
            [265, 105],
            [180, 182],
            [95, 105],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="10" fill="#ff7a3d" stroke="#fff" strokeWidth="2" />
          ))}
          <circle cx="164" cy="96" r="9.5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
          <circle cx="198" cy="116" r="9.5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
          <line x1="180" y1="38" x2="180" y2="172" stroke="#ffe066" strokeWidth="3" strokeDasharray="6 4" />
          <text x="180" y="14" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">
            穿透双人中缝 Split Pass = 3分
          </text>
        </g>
      )}

      {kind === 'funino-4goal' && (
        <g>
          <line x1="82" y1="16" x2="82" y2="194" stroke="#ffe066" strokeDasharray="5 4" strokeWidth="2" />
          <line x1="278" y1="16" x2="278" y2="194" stroke="#ffe066" strokeDasharray="5 4" strokeWidth="2" />
          {[
            [12, 38],
            [12, 146],
            [340, 38],
            [340, 146],
          ].map(([gx, gy], i) => (
            <rect key={i} x={gx} y={gy} width="8" height="26" fill="#fde047" stroke="#fff" strokeWidth="1.8" />
          ))}
          {[
            [215, 52],
            [175, 105],
            [225, 158],
          ].map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r="9.5" fill="#ff6b35" stroke="#fff" strokeWidth="2" />
          ))}
          {[
            [262, 138],
            [288, 158],
            [250, 168],
          ].map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r="9" fill="#2563eb" stroke="#fff" strokeWidth="2" />
          ))}
          <path d="M225 158 L175 105 L292 52" fill="none" stroke="#ffe066" strokeWidth="2.6" strokeDasharray="5 3" />
        </g>
      )}

      {kind === 'wall-scan' && (
        <g>
          <rect x="36" y="64" width="10" height="82" rx="3" fill="#e2e8f0" />
          <text x="41" y="56" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">
            反弹墙/喂球手
          </text>
          <circle cx="172" cy="105" r="12" fill="#ff6b35" stroke="#ffe066" strokeWidth="2.8" />
          <line x1="50" y1="102" x2="158" y2="102" stroke="#fff" strokeWidth="2.2" strokeDasharray="5 3" />
          <rect x="275" y="42" width="8" height="28" fill="#ef4444" />
          <rect x="275" y="140" width="8" height="28" fill="#3b82f6" />
          <path d="M182 96 Q230 62 272 56" fill="none" stroke="#ffe066" strokeWidth="2.8" strokeDasharray="5 3" />
          <circle cx="242" cy="105" r="9.5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
          <text x="242" y="128" textAnchor="middle" fontSize="9.5" fill="#ffe066" fontWeight="700">
            信号源
          </text>
        </g>
      )}

      {kind === '1v1-gates' && (
        <g>
          <rect x="316" y="38" width="8" height="32" fill="#fde047" />
          <rect x="316" y="140" width="8" height="32" fill="#fde047" />
          <circle cx="140" cy="105" r="11" fill="#ff6b35" stroke="#fff" strokeWidth="2.2" />
          <circle cx="222" cy="122" r="11" fill="#2563eb" stroke="#fff" strokeWidth="2.2" />
          <path d="M152 105 L196 128 L205 68 L314 54" fill="none" stroke="#ffe066" strokeWidth="2.8" strokeDasharray="5 3" />
          <text x="195" y="152" textAnchor="middle" fontSize="10" fill="#fff">
            沉肩骗右 → 外拨破左门
          </text>
        </g>
      )}

      {kind === 'transition-box' && (
        <g>
          <rect x="115" y="48" width="130" height="114" fill="rgba(255,255,255,0.1)" stroke="#ffe066" strokeWidth="2" strokeDasharray="5 4" />
          {[
            [24, 22],
            [324, 22],
            [24, 176],
            [324, 176],
          ].map(([gx, gy], i) => (
            <rect key={i} x={gx} y={gy} width="14" height="12" fill="#fde047" />
          ))}
          {[
            [135, 68],
            [225, 68],
            [180, 105],
            [135, 142],
            [225, 142],
          ].map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r="8" fill="#3b82f6" stroke="#fff" strokeWidth="1.8" />
          ))}
          {[
            [162, 88],
            [198, 92],
            [178, 128],
          ].map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r="8" fill="#ef4444" stroke="#fff" strokeWidth="1.8" />
          ))}
        </g>
      )}

      {kind === 'gk-triangle' && (
        <g>
          <rect x="20" y="76" width="10" height="58" fill="#fff" />
          <rect x="20" y="45" width="95" height="120" fill="none" stroke="#fff" strokeWidth="2" />
          <polygon points="155,62 20,76 20,134" fill="rgba(255,224,102,0.28)" stroke="#ffe066" strokeDasharray="4 3" />
          <circle cx="56" cy="96" r="10.5" fill="#2563eb" stroke="#ffe066" strokeWidth="2.5" />
          <circle cx="155" cy="62" r="9.5" fill="#ef4444" stroke="#fff" strokeWidth="2" />
          <circle cx="98" cy="152" r="9.5" fill="#ff7a3d" stroke="#fff" strokeWidth="2" />
          <rect x="312" y="34" width="8" height="28" fill="#fde047" />
          <rect x="312" y="148" width="8" height="28" fill="#fde047" />
        </g>
      )}

      {kind === 'third-man' && (
        <g>
          <line x1="255" y1="16" x2="255" y2="194" stroke="#ffe066" strokeWidth="2.2" strokeDasharray="6 4" />
          <circle cx="105" cy="118" r="10" fill="#ff6b35" stroke="#fff" strokeWidth="2" />
          <circle cx="242" cy="118" r="10" fill="#ff6b35" stroke="#fff" strokeWidth="2" />
          <circle cx="188" cy="156" r="10" fill="#ff8a3d" stroke="#ffe066" strokeWidth="2.5" />
          <circle cx="240" cy="48" r="10" fill="#ef4444" stroke="#ffe066" strokeWidth="2.5" />
          <path d="M115 118 L232 118 L196 150 L308 62" fill="none" stroke="#ffe066" strokeWidth="2.8" strokeDasharray="5 3" />
          <text x="185" y="186" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">
            6传9 → 9回敲8(第三人) → 直塞反越位11!
          </text>
        </g>
      )}

      {kind === 'warmup-11plus' && (
        <g>
          {[65, 125, 185, 245, 305].map((cx, i) => (
            <g key={i}>
              <circle cx={cx} cy="72" r="6" fill="#fde047" />
              <circle cx={cx} cy="138" r="6" fill="#fb923c" />
            </g>
          ))}
          <path d="M65 72 Q95 48 125 72 T185 72 T245 72 L315 72" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="5 3" />
          <text x="180" y="109" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">
            单脚滑冰跳稳停3秒 · 髋—膝—脚尖成直线
          </text>
        </g>
      )}
    </svg>
  );
}

export function DrillsBenchPage({
  initialDrillId,
  onOpenQuestion,
  onBackHome,
}: {
  initialDrillId?: string;
  onOpenQuestion: (id: string) => void;
  onBackHome: () => void;
}) {
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selDrillId, setSelDrillId] = useState<string>(initialDrillId ?? TRAINING_DRILLS[0].id);

  // 2026国标体测评估状态
  const [age, setAge] = useState<AgeKey>(13);
  const [sprint30, setSprint30] = useState('4.52');
  const [arrowL, setArrowL] = useState('8.62');
  const [arrowR, setArrowR] = useState('8.74');
  const [vjump, setVjump] = useState('43');
  const [pullup, setPullup] = useState('5');
  const [sitreach, setSitreach] = useState('13.5');
  const [yoyo, setYoyo] = useState('1620');

  // Khamis-Roche / PHV 季度身高突增预警器状态
  const [prevHeight, setPrevHeight] = useState('156.0');
  const [currHeight, setCurrHeight] = useState('158.2');
  const [daysSpan, setDaysSpan] = useState('90');
  const [fatherH, setFatherH] = useState('178');
  const [motherH, setMotherH] = useState('165');

  const drillsFiltered =
    stageFilter === 'all'
      ? TRAINING_DRILLS
      : TRAINING_DRILLS.filter((d) => d.ageStage === stageFilter);

  const activeDrill: TrainingDrill =
    TRAINING_DRILLS.find((d) => d.id === selDrillId) ?? drillsFiltered[0] ?? TRAINING_DRILLS[0];

  const arrowDiff = Math.abs(parseFloat(arrowL) - parseFloat(arrowR));
  const annualizedVel =
    ((parseFloat(currHeight) - parseFloat(prevHeight)) / Math.max(30, parseFloat(daysSpan))) * 365;
  const midParentBoyTarget = (parseFloat(fatherH) + parseFloat(motherH) + 13) / 2;
  const pahPercent = (parseFloat(currHeight) / midParentBoyTarget) * 100;

  return (
    <div className="subpage">
      <header className="page-top">
        <button type="button" className="back-pill" onClick={onBackHome}>
          ← 回到首页
        </button>
        <div className="page-head-meta">
          <span>欧足联/亚足联标准课表卡片 · 足协×体科所2026版四分位体测评估 · PHV生长板红绿灯监测</span>
          <h1>📋 标准训练教案库与 2026 国标体测中心</h1>
          <p className="page-sub">
            既提供拿去球场就能照图摆碟带练的 9 套分级教案，又提供客观量化身体素质与骨骺发育安全阈值的科学计算台
          </p>
        </div>
      </header>

      {/* 第一部分：结构化标准教案库 */}
      <section className="atlas-section" aria-labelledby="drills-sec-title">
        <div className="home-section-head">
          <h2 id="drills-sec-title" className="atlas-h2">
            一、结构化标准训练教案卡（带球场布置图与教练启发提问）
          </h2>
        </div>

        <div className="age-filter-bar" role="group" aria-label="按年龄段筛选教案">
          {['all', 'U5–U8', 'U9–U12', 'U13–U16', '全年龄段'].map((st) => (
            <button
              key={st}
              type="button"
              className={`age-pill ${stageFilter === st ? 'is-active' : ''}`}
              onClick={() => setStageFilter(st)}
            >
              {st === 'all' ? `🗂️ 全部教案 (${TRAINING_DRILLS.length})` : st}
            </button>
          ))}
        </div>

        <div className="drill-layout">
          <div className="drill-list-col">
            {drillsFiltered.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`drill-nav-card ${d.id === activeDrill.id ? 'is-active' : ''}`}
                onClick={() => setSelDrillId(d.id)}
              >
                <div className="drill-nav-top">
                  <span className="drill-code">{d.code}</span>
                  <em>{d.ageStage}</em>
                  <em>{d.category}</em>
                </div>
                <strong>{d.title}</strong>
                <small>{d.enTitle}</small>
              </button>
            ))}
          </div>

          <article className="drill-sheet" aria-label={activeDrill.title}>
            <div className="drill-sheet-head">
              <div>
                <span className="spot-badge">
                  {activeDrill.code} · {activeDrill.ageStage} · {activeDrill.category}
                </span>
                <h3>{activeDrill.title}</h3>
                <p className="drill-en">{activeDrill.enTitle}</p>
              </div>
            </div>

            <div className="drill-sheet-mid">
              <DrillDiagram kind={activeDrill.diagram} />
              <div className="drill-meta-grid">
                <div>
                  <small>📐 场地尺寸</small>
                  <strong>{activeDrill.areaSize}</strong>
                </div>
                <div>
                  <small>👥 参与人数</small>
                  <strong>{activeDrill.players}</strong>
                </div>
                <div>
                  <small>⏱️ 负荷间歇比</small>
                  <strong>{activeDrill.workRest}</strong>
                </div>
                <div>
                  <small>🧰 所需器材</small>
                  <strong>{activeDrill.equipment}</strong>
                </div>
              </div>
            </div>

            <p className="drill-obj">
              <strong>🎯 核心训练目标：</strong>
              {activeDrill.objective}
            </p>

            <div className="stage-two-col">
              <div className="drill-subbox">
                <h4>📏 组织规则与计分约束</h4>
                <ul>
                  {activeDrill.rules.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="drill-subbox">
                <h4>🔼 难度升降阶 & 💡 引导式提问</h4>
                <ul>
                  {activeDrill.progressions.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <div className="drill-qs">
                  {activeDrill.coachingQuestions.map((cq) => (
                    <p key={cq}>💬 提问队员：「{cq}」</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="drill-links-row">
              <span>🔗 关联问题详解：</span>
              {activeDrill.relatedArticleIds.map((aid) => (
                <button
                  key={aid}
                  type="button"
                  className="mini-link-chip"
                  onClick={() => onOpenQuestion(aid)}
                >
                  查看 #{aid} →
                </button>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* 第二部分：中国足协 × 国家体科所 2026 版运动能力四分位评估器 */}
      <section className="atlas-section" aria-labelledby="bench-sec-title">
        <h2 id="bench-sec-title" className="atlas-h2">
          二、中国足协 × 国家体科所（2026版）男子青少年运动能力四分位评估器
        </h2>
        <div className="stage-box">
          <p className="calc-intro">
            数据严格依据 2026 年 3 月国家体育总局体育科学研究所发布的全国男子青少年足球运动员实测四分位常模（<strong>P75优秀 / P50良好 / P25及格</strong>；12岁及以下按国家保护规范不组织 YO-YO 测试，16岁切换为 IR2 高强度模式）。
          </p>

          <div className="age-filter-bar" role="group" aria-label="选择实测年龄组">
            {([12, 13, 14, 15, 16] as const).map((a) => (
              <button
                key={a}
                type="button"
                className={`age-pill ${age === a ? 'is-active' : ''}`}
                onClick={() => setAge(a)}
              >
                🎂 {a} 岁组 (U{a + 1})
              </button>
            ))}
          </div>

          <div className="bench-grid">
            <div className="bench-card">
              <label>
                ⚡ 30米冲刺（光电门 · 秒）
                <input
                  type="number"
                  step="0.01"
                  value={sprint30}
                  onChange={(e) => setSprint30(e.target.value)}
                />
              </label>
              {(() => {
                const res = gradeScore(CFA_2026_STANDARDS.sprint30, age, parseFloat(sprint30));
                const cuts = CFA_2026_STANDARDS.sprint30.cutoffs[age];
                return (
                  <div className="bench-out">
                    {res && <span className={`grade-pill ${res.cls}`}>{res.label}</span>}
                    {cuts && <small>{age}岁优秀线 ≤{cuts[0]}s · 良好 ≤{cuts[1]}s</small>}
                  </div>
                );
              })()}
            </div>

            <div className="bench-card">
              <label>
                🔀 箭头跑左/右侧（光电门 · 秒）
                <div className="dual-inputs">
                  <input
                    type="number"
                    step="0.01"
                    value={arrowL}
                    onChange={(e) => setArrowL(e.target.value)}
                    aria-label="左侧箭头跑秒数"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={arrowR}
                    onChange={(e) => setArrowR(e.target.value)}
                    aria-label="右侧箭头跑秒数"
                  />
                </div>
              </label>
              {(() => {
                const best = Math.min(parseFloat(arrowL), parseFloat(arrowR));
                const res = gradeScore(CFA_2026_STANDARDS.arrowhead, age, best);
                const cuts = CFA_2026_STANDARDS.arrowhead.cutoffs[age];
                return (
                  <div className="bench-out">
                    {res && <span className={`grade-pill ${res.cls}`}>{res.label}</span>}
                    <small>
                      左右差值 {Number.isNaN(arrowDiff) ? '-' : arrowDiff.toFixed(2)}s
                      {arrowDiff > 0.22 ? ' ⚠️ 左右变向不对称偏大' : ' ✅ 双侧均衡'}（优秀 ≤{cuts?.[0]}s）
                    </small>
                  </div>
                );
              })()}
            </div>

            <div className="bench-card">
              <label>
                🚀 垂直纵跳高度（cm）
                <input
                  type="number"
                  step="0.5"
                  value={vjump}
                  onChange={(e) => setVjump(e.target.value)}
                />
              </label>
              {(() => {
                if (age === 12) {
                  return <div className="bench-out"><small>12岁以动作协调学习为主，13岁起纳入全国四分位评级</small></div>;
                }
                const res = gradeScore(CFA_2026_STANDARDS.vjump, age, parseFloat(vjump));
                const cuts = CFA_2026_STANDARDS.vjump.cutoffs[age];
                return (
                  <div className="bench-out">
                    {res && <span className={`grade-pill ${res.cls}`}>{res.label}</span>}
                    {cuts && <small>{age}岁优秀线 ≥{cuts[0]}cm · 良好 ≥{cuts[1]}cm</small>}
                  </div>
                );
              })()}
            </div>

            <div className="bench-card">
              <label>
                💪 正握引体向上（标准个）
                <input
                  type="number"
                  step="1"
                  value={pullup}
                  onChange={(e) => setPullup(e.target.value)}
                />
              </label>
              {(() => {
                if (age === 12) {
                  return <div className="bench-out"><small>12岁以自重悬垂核心为主，13岁起评级</small></div>;
                }
                const res = gradeScore(CFA_2026_STANDARDS.pullup, age, parseFloat(pullup));
                const cuts = CFA_2026_STANDARDS.pullup.cutoffs[age];
                return (
                  <div className="bench-out">
                    {res && <span className={`grade-pill ${res.cls}`}>{res.label}</span>}
                    {cuts && <small>{age}岁优秀线 ≥{cuts[0]}个 · 良好 ≥{cuts[1]}个</small>}
                  </div>
                );
              })()}
            </div>

            <div className="bench-card">
              <label>
                🧘 坐位体前屈柔韧（cm）
                <input
                  type="number"
                  step="0.5"
                  value={sitreach}
                  onChange={(e) => setSitreach(e.target.value)}
                />
              </label>
              {(() => {
                if (age === 12) {
                  return <div className="bench-out"><small>清晨测前免热身测量，关注腘绳肌柔韧跟进生长速度</small></div>;
                }
                const res = gradeScore(CFA_2026_STANDARDS.sitreach, age, parseFloat(sitreach));
                const cuts = CFA_2026_STANDARDS.sitreach.cutoffs[age];
                return (
                  <div className="bench-out">
                    {res && <span className={`grade-pill ${res.cls}`}>{res.label}</span>}
                    {cuts && <small>{age}岁优秀线 ≥{cuts[0]}cm · 良好 ≥{cuts[1]}cm</small>}
                  </div>
                );
              })()}
            </div>

            <div className="bench-card">
              <label>
                🫁 YO-YO 间歇耐力（{age === 16 ? 'IR2模式' : 'IR1模式'} · 米）
                <input
                  type="number"
                  step="40"
                  value={yoyo}
                  onChange={(e) => setYoyo(e.target.value)}
                />
              </label>
              {(() => {
                if (age === 12) {
                  return (
                    <div className="bench-out">
                      <span className="grade-pill grade-pass">🛡️ 12岁及以下官方免测保护</span>
                      <small>《手册》明文规定 12 岁及以下不组织耗竭性 YO-YO 测试</small>
                    </div>
                  );
                }
                const res = gradeScore(CFA_2026_STANDARDS.yoyo, age, parseFloat(yoyo));
                const cuts = CFA_2026_STANDARDS.yoyo.cutoffs[age];
                return (
                  <div className="bench-out">
                    {res && <span className={`grade-pill ${res.cls}`}>{res.label}</span>}
                    {cuts && (
                      <small>
                        {age}岁({age === 16 ? 'IR2' : 'IR1'})优秀线 ≥{cuts[0]}m · 良好 ≥{cuts[1]}m
                      </small>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* 第三部分：PHV 身高突增速率与生长板防伤预警器 */}
      <section className="atlas-section" aria-labelledby="phv-sec-title">
        <h2 id="phv-sec-title" className="atlas-h2">
          三、季度身高增长速率（PHV）与父母靶身高（%PAH）骨骺防伤预警器
        </h2>
        <div className="stage-box">
          <div className="bench-grid">
            <div className="bench-card">
              <label>
                📏 上次清晨身高 (cm)
                <input
                  type="number"
                  step="0.1"
                  value={prevHeight}
                  onChange={(e) => setPrevHeight(e.target.value)}
                />
              </label>
            </div>
            <div className="bench-card">
              <label>
                📏 本次清晨身高 (cm)
                <input
                  type="number"
                  step="0.1"
                  value={currHeight}
                  onChange={(e) => setCurrHeight(e.target.value)}
                />
              </label>
            </div>
            <div className="bench-card">
              <label>
                🗓️ 两次测量间隔天数 (建议90天)
                <input
                  type="number"
                  step="5"
                  value={daysSpan}
                  onChange={(e) => setDaysSpan(e.target.value)}
                />
              </label>
            </div>
            <div className="bench-card">
              <label>
                👨‍👩‍👦 父亲 / 母亲身高 (cm · 估算男童遗传靶身高)
                <div className="dual-inputs">
                  <input
                    type="number"
                    value={fatherH}
                    onChange={(e) => setFatherH(e.target.value)}
                    aria-label="父亲身高"
                  />
                  <input
                    type="number"
                    value={motherH}
                    onChange={(e) => setMotherH(e.target.value)}
                    aria-label="母亲身高"
                  />
                </div>
              </label>
            </div>
          </div>

          {!Number.isNaN(annualizedVel) && !Number.isNaN(midParentBoyTarget) && (
            <div
              className="phv-result-banner"
              style={
                {
                  '--c': annualizedVel >= 7.5 ? '#ef4444' : annualizedVel >= 5.5 ? '#f59e0b' : '#2fb36d',
                } as CSSProperties
              }
            >
              <div>
                <strong>
                  📈 折合年化生长速率：{annualizedVel.toFixed(1)} cm / 年 ｜ 遗传中位靶身高约{' '}
                  {midParentBoyTarget.toFixed(1)} cm（当前达成度 {pahPercent.toFixed(1)}% PAH）
                </strong>
                <p>
                  {annualizedVel >= 7.5
                    ? '🚨 【红灯：正处于 PHV 身高猛蹿峰值窗口！】此时股骨/胫骨飞长导致肌腱如紧绷橡皮筋，胫骨结节骨软骨炎风险极高！建议主动下调重复大力远射、硬地折返冲刺与跳跃负荷 30%，每日强化股四头肌与小腿泡沫轴放松，严密关注膝下与跟骨按压痛！'
                    : annualizedVel >= 5.5
                      ? '🟡 【黄灯：温和快速生长期】保持正常技术与战术负荷，每周执行 ≥2 次《FIFA 11+》防伤热身，每季度持续追踪坐高与站高变化。'
                      : '🟢 【绿灯：平稳生长期（如 9–11 岁黄金稳态或 16+ 岁增速放缓期）】神经肌肉协调稳定，是精雕双足高频球感、变向灵敏度或骨骺闭合后逐步发展力量的绝佳窗口！'}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
