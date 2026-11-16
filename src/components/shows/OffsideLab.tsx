import { useState } from 'react';

type Scenario = {
  readonly id: string;
  readonly badge: string;
  readonly title: string;
  readonly verdict: 'ok' | 'offside';
  readonly verdictText: string;
  readonly explain: string;
  /** 0–600 球场横向坐标，球门在右侧 x=560，中线在 x=140 */
  readonly gkX: number;
  readonly gkY: number;
  readonly def2X: number; // 倒数第二名防守人
  readonly def2Y: number;
  readonly def3X: number;
  readonly def3Y: number;
  readonly passerX: number;
  readonly passerY: number;
  readonly receiverKickX: number; // 传球瞬间接球人位置
  readonly receiverKickY: number;
  readonly receiverAfterX: number; // 球出脚后接球位置
  readonly receiverAfterY: number;
  readonly exemptLine?: boolean;
};

const SCENARIOS: readonly Scenario[] = [
  {
    id: 'good-run',
    badge: '✅ 反越位好球',
    title: '传球瞬间平线启动，出球后再超车单刀',
    verdict: 'ok',
    verdictText: '✅ 好球不越位！只看传球脚触球那一刹那',
    explain:
      '10号传球脚碰球瞬间，9号前锋还在黄线（倒数第二名蓝队后卫）左侧；球踢出后9号全速冲过黄线接球单刀破门，100%合法好球！',
    gkX: 540,
    gkY: 140,
    def2X: 410,
    def2Y: 195,
    def3X: 375,
    def3Y: 88,
    passerX: 255,
    passerY: 165,
    receiverKickX: 398,
    receiverKickY: 118,
    receiverAfterX: 488,
    receiverAfterY: 125,
  },
  {
    id: 'classic-offside',
    badge: '🚩 经典越位',
    title: '传球瞬间已经站到倒数第二名防守人身后',
    verdict: 'offside',
    verdictText: '🚩 越位犯规！传球瞬间比球和倒数第二人都更靠前',
    explain:
      '10号出脚那一刻，9号已经提前溜到了黄线右侧（比守门员之外最后一名后卫更靠近底线），上前接球即判越位犯规，改判对方间接任意球！',
    gkX: 540,
    gkY: 140,
    def2X: 395,
    def2Y: 190,
    def3X: 365,
    def3Y: 92,
    passerX: 255,
    passerY: 165,
    receiverKickX: 455,
    receiverKickY: 118,
    receiverAfterX: 495,
    receiverAfterY: 128,
  },
  {
    id: 'behind-ball',
    badge: '✅ 球后横传',
    title: '双鬼拍门：接球人在「球」的后面绝不越位',
    verdict: 'ok',
    verdictText: '✅ 好球不越位！哪怕面前只剩空门，在球后面就不越位',
    explain:
      '10号和9号双双突破了所有后卫只剩门将，但传球瞬间9号站在足球基准线左侧（离底线比球更远），横传推空门完全有效！',
    gkX: 538,
    gkY: 148,
    def2X: 350,
    def2Y: 198,
    def3X: 335,
    def3Y: 90,
    passerX: 472,
    passerY: 182,
    receiverKickX: 452,
    receiverKickY: 108,
    receiverAfterX: 498,
    receiverAfterY: 118,
  },
  {
    id: 'own-half',
    badge: '✅ 本方半场启动',
    title: '对手全员压上：从本方半场启动永远不越位',
    verdict: 'ok',
    verdictText: '✅ 好球不越位！传球瞬间站在本方半场中线后豁免越位',
    explain:
      '蓝队后卫全部压过了中线造越位，但10号长传瞬间9号双脚还踩在本方半场（中线左侧），哪怕前面空无一人，冲刺半场单刀破门也绝不越位！',
    gkX: 528,
    gkY: 140,
    def2X: 195,
    def2Y: 190,
    def3X: 185,
    def3Y: 92,
    passerX: 88,
    passerY: 175,
    receiverKickX: 132,
    receiverKickY: 115,
    receiverAfterX: 435,
    receiverAfterY: 125,
    exemptLine: true,
  },
  {
    id: 'throw-in',
    badge: '✅ 界外球豁免',
    title: '直接接界外球、角球、球门球永远没有越位',
    verdict: 'ok',
    verdictText: '✅ 规则豁免不越位！直接接界外球可站在最前面',
    explain:
      'IFAB 第11章特例：直接接界外球、角球、球门球时没有越位犯规！9号哪怕站在所有后卫身后直接接界外球转身射门也完全合法。',
    gkX: 540,
    gkY: 140,
    def2X: 405,
    def2Y: 175,
    def3X: 370,
    def3Y: 105,
    passerX: 360,
    passerY: 22,
    receiverKickX: 468,
    receiverKickY: 74,
    receiverAfterX: 486,
    receiverAfterY: 98,
    exemptLine: true,
  },
];

export function OffsideLab() {
  const [idx, setIdx] = useState(0);
  const [afterKick, setAfterKick] = useState(false);

  const sc = SCENARIOS[idx];
  const recX = afterKick ? sc.receiverAfterX : sc.receiverKickX;
  const recY = afterKick ? sc.receiverAfterY : sc.receiverKickY;
  const ballX = afterKick ? sc.receiverAfterX - 10 : sc.passerX + 12;
  const ballY = afterKick ? sc.receiverAfterY + 4 : sc.passerY - 4;
  // 越位基准线取「倒数第二名防守人」与「传球瞬间球位置」中更靠近底线的一条
  const refLineX = Math.max(sc.def2X, sc.passerX + 12);

  return (
    <div className="lab-card" aria-label="互动越位模拟器">
      <div className="lab-head">
        <strong>🚩 互动越位模拟器（进攻方向：从左 → 右攻门）</strong>
        <button
          type="button"
          className={`lab-moment-btn ${afterKick ? 'is-after' : ''}`}
          onClick={() => setAfterKick((v) => !v)}
        >
          {afterKick ? '⏪ 切回「传球脚触球瞬间」（判罚基准帧）' : '▶️ 播放「球踢出后前插接球」'}
        </button>
      </div>

      <div className="lab-tabs" role="tablist">
        {SCENARIOS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`lab-tab ${i === idx ? 'is-active' : ''}`}
            onClick={() => {
              setIdx(i);
              setAfterKick(false);
            }}
          >
            {item.badge}
          </button>
        ))}
      </div>

      <svg className="pitch-svg" viewBox="0 0 600 280" role="img" aria-label={sc.title}>
        {[0, 1, 2, 3, 4, 5].map((stripe) => (
          <rect
            key={stripe}
            x={stripe * 100}
            y="0"
            width="100"
            height="280"
            fill={stripe % 2 === 0 ? '#3da65c' : '#46b266'}
          />
        ))}
        {/* 外框、中线(x=140)、大禁区、小禁区、球门 */}
        <rect x="30" y="22" width="530" height="236" fill="none" stroke="#fff" strokeWidth="2.5" />
        <line x1="140" y1="22" x2="140" y2="258" stroke="#fff" strokeWidth="2.5" strokeDasharray="6 4" />
        <circle cx="140" cy="140" r="32" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" />
        <text x="146" y="38" fontSize="11" fill="rgba(255,255,255,0.9)" fontWeight="700">
          中线（左为本方半场）
        </text>
        <rect x="455" y="64" width="105" height="152" fill="none" stroke="#fff" strokeWidth="2.5" />
        <rect x="522" y="104" width="38" height="72" fill="none" stroke="#fff" strokeWidth="2" />
        <rect x="560" y="116" width="16" height="48" fill="rgba(255,255,255,0.28)" stroke="#fff" strokeWidth="3" />

        {/* 越位判定基准黄线 */}
        {!sc.exemptLine && (
          <g>
            <line
              x1={refLineX}
              y1="22"
              x2={refLineX}
              y2="258"
              stroke="#ffe066"
              strokeWidth="3"
              strokeDasharray="7 5"
            />
            <rect x={refLineX - 58} y="24" width="116" height="20" rx="10" fill="#233127" opacity="0.88" />
            <text x={refLineX} y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffe066">
              越位判定线
            </text>
          </g>
        )}

        {/* 传球虚线 */}
        <line
          x1={sc.passerX}
          y1={sc.passerY}
          x2={sc.receiverAfterX}
          y2={sc.receiverAfterY}
          stroke="#fff8d6"
          strokeWidth="2.4"
          strokeDasharray="6 5"
        />

        {/* 蓝队门将 + 2名防守队员 */}
        <g transform={`translate(${sc.gkX}, ${sc.gkY})`}>
          <circle r="13" fill="#1d4ed8" stroke="#fff" strokeWidth="2.5" />
          <text y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">GK</text>
        </g>
        <g transform={`translate(${sc.def2X}, ${sc.def2Y})`}>
          <circle r="13" fill="#3b82f6" stroke="#ffe066" strokeWidth="3" />
          <text y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">后卫</text>
        </g>
        <g transform={`translate(${sc.def3X}, ${sc.def3Y})`}>
          <circle r="13" fill="#3b82f6" stroke="#fff" strokeWidth="2.2" />
          <text y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">后卫</text>
        </g>

        {/* 红队10号传球人 */}
        <g transform={`translate(${sc.passerX}, ${sc.passerY})`}>
          <circle r="13" fill="#ff6b4a" stroke="#fff" strokeWidth="2.5" />
          <text y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">10</text>
        </g>

        {/* 红队9号接球前锋 */}
        <g
          style={{ transition: 'transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          transform={`translate(${recX}, ${recY})`}
        >
          <circle
            r="14"
            fill={sc.verdict === 'offside' ? '#ef4444' : '#ff8a3d'}
            stroke={sc.verdict === 'offside' ? '#fef08a' : '#fff'}
            strokeWidth="3"
          />
          <text y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">9</text>
        </g>

        {/* 足球 */}
        <g
          style={{ transition: 'transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          transform={`translate(${ballX}, ${ballY})`}
        >
          <circle r="7" fill="#fff" stroke="#1f2937" strokeWidth="2" />
          <circle r="2.5" fill="#1f2937" />
        </g>
      </svg>

      <div className={`lab-verdict is-${sc.verdict}`}>
        <strong>{sc.verdictText}</strong>
        <p>{sc.explain}</p>
      </div>
    </div>
  );
}
