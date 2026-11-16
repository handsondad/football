import { useState } from 'react';

type ZoneId = 'arc' | 'penalty' | 'goal-area' | 'center' | 'goal' | 'corner';

const ZONES: readonly {
  readonly id: ZoneId;
  readonly badge: string;
  readonly title: string;
  readonly metric: string;
  readonly desc: string;
}[] = [
  {
    id: 'arc',
    badge: '🌙 罚球弧',
    title: '罚球弧（Penalty Arc · 禁区顶小半圆）',
    metric: '以 11 米点球点为圆心、半径 9.15 米（10码）',
    desc: '专门在主罚点球时使用！确保除主罚球员和对方门将外，所有球员不仅站在大禁区外，且距离足球至少 9.15 米远。平时比赛门将不能在弧内用手触球。',
  },
  {
    id: 'penalty',
    badge: '🔲 大禁区',
    title: '罚球区（Penalty Area · 大禁区）',
    metric: '深 16.5 米（18码） × 宽 40.32 米',
    desc: '球场最敏感的核心区：① 本方守门员在区内可用手触球；② 防守方在区内犯下直接任意球犯规（拉推绊铲手球），一律判罚 11 米点球！',
  },
  {
    id: 'goal-area',
    badge: '▫️ 小禁区',
    title: '球门区（Goal Area · 小禁区）',
    metric: '深 5.5 米（6码） × 宽 18.32 米',
    desc: '开球门球时足球可摆在小禁区内任意位置；发生在小禁区内的攻方间接任意球，须退到平行于球门线最近的小禁区线上主罚。',
  },
  {
    id: 'center',
    badge: '⭕ 中圈与中线',
    title: '中线与中圈（Center Circle）',
    metric: '球场全长 105 米 × 宽 68 米 | 中圈半径 9.15 米',
    desc: '上下半场开球及每次进球后重新开球时，对方全体队员必须退到中圈以外（距球 9.15 米）；另外「处于本方半场」永远不构成越位！',
  },
  {
    id: 'goal',
    badge: '🥅 标准球门',
    title: '球门与球门线（Goal & Goal Line）',
    metric: '两柱内侧宽 7.32 米（8码） × 横梁下沿高 2.44 米（8英尺）',
    desc: '整颗足球的100%体积完全越过两门柱之间的球门线整体宽度，才算有效进球！压线哪怕一毫米都未进（门线鹰眼技术专门监测此线）。',
  },
  {
    id: 'corner',
    badge: '🚩 角球弧',
    title: '角球区与角旗杆（Corner Area）',
    metric: '四角各画半径 1 米的四分之一圆弧，旗杆高 ≥1.5 米',
    desc: '防守方最后触球出底线判角球。主罚时球只要有一部分压在 1 米弧线上空即合法；角球可以直接旋进球门得分，且接角球没有越位！',
  },
];

export function PitchAnatomyLab() {
  const [active, setActive] = useState<ZoneId>('arc');
  const info = ZONES.find((z) => z.id === active) ?? ZONES[0];

  return (
    <div className="lab-card" aria-label="105×68米标准足球场尺寸解剖图">
      <div className="lab-head">
        <strong>📐 105 × 68 米国际标准球场标线密码（点击标签高亮对应区域）</strong>
      </div>

      <div className="lab-tabs">
        {ZONES.map((z) => (
          <button
            key={z.id}
            type="button"
            className={`lab-tab ${z.id === active ? 'is-active' : ''}`}
            onClick={() => setActive(z.id)}
          >
            {z.badge}
          </button>
        ))}
      </div>

      {/* 按 105×68 精确比例缩放：525 × 340，外加边距 = 585 × 380 */}
      <svg className="pitch-svg" viewBox="0 0 585 380" role="img" aria-label={info.title}>
        <rect width="585" height="380" fill="#3da65c" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <rect
            key={i}
            x={30 + i * 52.5}
            y="20"
            width="52.5"
            height="340"
            fill={i % 2 === 0 ? '#44b064' : '#3ca35a'}
          />
        ))}

        {/* 高亮层 */}
        {active === 'penalty' && (
          <>
            <rect x="30" y="89" width="82.5" height="202" fill="rgba(255,224,102,0.34)" />
            <rect x="472.5" y="89" width="82.5" height="202" fill="rgba(255,224,102,0.34)" />
          </>
        )}
        {active === 'goal-area' && (
          <>
            <rect x="30" y="144" width="27.5" height="92" fill="rgba(255,224,102,0.42)" />
            <rect x="527.5" y="144" width="27.5" height="92" fill="rgba(255,224,102,0.42)" />
          </>
        )}
        {active === 'center' && (
          <>
            <circle cx="292.5" cy="190" r="45.75" fill="rgba(255,224,102,0.34)" />
            <line x1="292.5" y1="20" x2="292.5" y2="360" stroke="#ffe066" strokeWidth="5" />
          </>
        )}

        {/* 基础白色球场线（1米 = 5px） */}
        <rect x="30" y="20" width="525" height="340" fill="none" stroke="#fff" strokeWidth="2.5" />
        <line x1="292.5" y1="20" x2="292.5" y2="360" stroke="#fff" strokeWidth="2.2" />
        <circle cx="292.5" cy="190" r="45.75" fill="none" stroke="#fff" strokeWidth="2.2" />
        <circle cx="292.5" cy="190" r="3.5" fill="#fff" />

        {/* 左右大禁区 16.5m(82.5px) × 40.32m(201.6px) */}
        <rect x="30" y="89.2" width="82.5" height="201.6" fill="none" stroke="#fff" strokeWidth="2.2" />
        <rect x="472.5" y="89.2" width="82.5" height="201.6" fill="none" stroke="#fff" strokeWidth="2.2" />

        {/* 左右小禁区 5.5m(27.5px) × 18.32m(91.6px) */}
        <rect x="30" y="144.2" width="27.5" height="91.6" fill="none" stroke="#fff" strokeWidth="2" />
        <rect x="527.5" y="144.2" width="27.5" height="91.6" fill="none" stroke="#fff" strokeWidth="2" />

        {/* 点球点 11m(55px)：x=85 与 x=500 */}
        <circle cx="85" cy="190" r="3.5" fill={active === 'arc' ? '#ffe066' : '#fff'} />
        <circle cx="500" cy="190" r="3.5" fill={active === 'arc' ? '#ffe066' : '#fff'} />

        {/* 罚球弧：圆心(85,190) 半径45.75，与x=112.5交于 dy=±36.56 */}
        <path
          d="M 112.5 153.4 A 45.75 45.75 0 0 1 112.5 226.6"
          fill={active === 'arc' ? 'rgba(255,224,102,0.45)' : 'none'}
          stroke={active === 'arc' ? '#ffe066' : '#fff'}
          strokeWidth={active === 'arc' ? 4 : 2.2}
        />
        <path
          d="M 472.5 153.4 A 45.75 45.75 0 0 0 472.5 226.6"
          fill={active === 'arc' ? 'rgba(255,224,102,0.45)' : 'none'}
          stroke={active === 'arc' ? '#ffe066' : '#fff'}
          strokeWidth={active === 'arc' ? 4 : 2.2}
        />
        {active === 'arc' && (
          <g>
            <circle
              cx="85"
              cy="190"
              r="45.75"
              fill="none"
              stroke="#ffe066"
              strokeWidth="2"
              strokeDasharray="5 4"
            />
            <line x1="85" y1="190" x2="130.75" y2="190" stroke="#ffe066" strokeWidth="2.5" />
            <text x="155" y="194" fontSize="12" fontWeight="700" fill="#ffe066">
              半径 9.15m (10码)
            </text>
          </g>
        )}

        {/* 球门 7.32m(36.6px) */}
        <rect
          x="16"
          y="171.7"
          width="14"
          height="36.6"
          fill={active === 'goal' ? '#ffe066' : 'rgba(255,255,255,0.28)'}
          stroke={active === 'goal' ? '#ffe066' : '#fff'}
          strokeWidth="2.5"
        />
        <rect
          x="555"
          y="171.7"
          width="14"
          height="36.6"
          fill={active === 'goal' ? '#ffe066' : 'rgba(255,255,255,0.28)'}
          stroke={active === 'goal' ? '#ffe066' : '#fff'}
          strokeWidth="2.5"
        />

        {/* 四角角球弧 */}
        {[
          [30, 20],
          [555, 20],
          [30, 360],
          [555, 360],
        ].map(([cx, cy], idx) => (
          <circle
            key={idx}
            cx={cx}
            cy={cy}
            r={active === 'corner' ? 12 : 6}
            fill={active === 'corner' ? 'rgba(255,224,102,0.5)' : 'none'}
            stroke={active === 'corner' ? '#ffe066' : '#fff'}
            strokeWidth={active === 'corner' ? 3 : 1.8}
          />
        ))}
      </svg>

      <div className="lab-verdict is-ok">
        <strong>
          {info.title} · {info.metric}
        </strong>
        <p>{info.desc}</p>
      </div>
    </div>
  );
}
