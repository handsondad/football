import { useState } from 'react';

type AnalyticsMode = 'xg' | 'xt';

const SHOT_SPOTS = [
  {
    id: 'tap-in',
    label: '小禁区中路推空门',
    x: 528,
    y: 138,
    xg: '0.68',
    rate: '约 68% 概率破门',
    color: '#ef4444',
    note: '横传倒三角喂到门前 4 米黄金点：张角极大且门将移动不及，属于全队战术配合追求的终极高 xG 射门！',
  },
  {
    id: 'penalty',
    label: '11米点球点单挑',
    x: 492,
    y: 138,
    xg: '0.78',
    rate: '约 78% 概率破门',
    color: '#dc2626',
    note: '无防守队员遮挡，11 米直面 7.32×2.44m 球门，全球职业联赛点球历史转化率稳定在 76%–79%。',
  },
  {
    id: 'halfspace',
    label: '禁区左肋14米斜射',
    x: 468,
    y: 86,
    xg: '0.19',
    rate: '约 19% 概率破门',
    color: '#f59e0b',
    note: '黄金肋部内切或直塞单刀区：平均每 5 脚进 1 球，若横传给包抄到中路的队友则可将 xG 放大 3 倍！',
  },
  {
    id: 'tight-angle',
    label: '底线零度角强射',
    x: 545,
    y: 48,
    xg: '0.04',
    rate: '仅约 4% 概率破门',
    color: '#60a5fa',
    note: '虽然离门很近，但可见球门张角几乎被近门柱和门将封死，此时强行闷射不如倒三角回传点球点！',
  },
  {
    id: 'long-shot',
    label: '30米外远射浪射',
    x: 355,
    y: 165,
    xg: '0.02',
    rate: '仅约 2% 概率破门',
    color: '#93c5fd',
    note: '隔着两层后卫防线 30 米盲目起脚，平均 50 脚才蒙进 1 球，在现代位置战中等同于无谓丢失球权。',
  },
] as const;

// 6列 × 4行半场简化 xT 热力值（越靠近小禁区与肋部越高）
const XT_GRID: readonly (readonly number[])[] = [
  [0.01, 0.02, 0.03, 0.04, 0.06, 0.08],
  [0.01, 0.02, 0.04, 0.07, 0.14, 0.28],
  [0.01, 0.02, 0.04, 0.07, 0.14, 0.28],
  [0.01, 0.02, 0.03, 0.04, 0.06, 0.08],
];

export function AnalyticsLab() {
  const [mode, setMode] = useState<AnalyticsMode>('xg');
  const [shotIdx, setShotIdx] = useState(0);
  const [penetratingPass, setPenetratingPass] = useState(true);

  const shot = SHOT_SPOTS[shotIdx];

  return (
    <div className="lab-card" aria-label="现代足球数据科学 xG 与 xT 模拟器">
      <div className="lab-head">
        <strong>📊 数据球探沙盘：xG（射门期望进球）与 xT / Packing（破线威胁模型）</strong>
        <div className="lab-inline-btns">
          <button
            type="button"
            className={`lab-tab ${mode === 'xg' ? 'is-active' : ''}`}
            onClick={() => setMode('xg')}
          >
            🎯 xG 射门质量热图
          </button>
          <button
            type="button"
            className={`lab-tab ${mode === 'xt' ? 'is-active' : ''}`}
            onClick={() => setMode('xt')}
          >
            ⚡ xT 期望威胁与 Packing 破线
          </button>
        </div>
      </div>

      {mode === 'xg' ? (
        <>
          <div className="lab-tabs">
            {SHOT_SPOTS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`lab-tab ${i === shotIdx ? 'is-active' : ''}`}
                onClick={() => setShotIdx(i)}
              >
                {s.label} ({s.xg})
              </button>
            ))}
          </div>

          <svg className="pitch-svg" viewBox="0 0 600 276" role="img" aria-label="xG射门位置概率模型">
            <rect width="600" height="276" fill="#2f7d4a" />
            <rect x="180" y="20" width="380" height="236" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.4" />
            <rect x="445" y="56" width="115" height="164" fill="none" stroke="rgba(255,255,255,0.82)" strokeWidth="2.2" />
            <rect x="520" y="96" width="40" height="84" fill="none" stroke="rgba(255,255,255,0.82)" strokeWidth="2" />
            <rect x="560" y="114" width="14" height="48" fill="rgba(255,255,255,0.3)" stroke="#fff" strokeWidth="2.8" />

            {/* 高xG扇形热区示意 */}
            <circle cx="545" cy="138" r="36" fill="rgba(239,68,68,0.32)" />
            <circle cx="520" cy="138" r="68" fill="rgba(245,158,11,0.22)" />

            {/* 当前射门可见球门张角锥 */}
            <polygon
              points={`${shot.x},${shot.y} 560,114 560,162`}
              fill="rgba(255, 224, 102, 0.34)"
              stroke="#ffe066"
              strokeWidth="2"
              strokeDasharray="5 4"
            />

            {SHOT_SPOTS.map((pt, i) => {
              const sel = i === shotIdx;
              return (
                <g
                  key={pt.id}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShotIdx(i)}
                >
                  <circle
                    r={sel ? 16 : 11.5}
                    fill={pt.color}
                    stroke={sel ? '#ffe066' : '#fff'}
                    strokeWidth={sel ? 3.4 : 2}
                  />
                  <text y="4" textAnchor="middle" fontSize={sel ? '10.5' : '9'} fontWeight="700" fill="#fff">
                    {pt.xg}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="lab-verdict is-ok">
            <strong>
              🎯 {shot.label} · 单脚期望进球 xG = {shot.xg}（{shot.rate}）
            </strong>
            <p>{shot.note}</p>
          </div>
        </>
      ) : (
        <>
          <div className="lab-tabs">
            <button
              type="button"
              className={`lab-tab ${penetratingPass ? 'is-active' : ''}`}
              onClick={() => setPenetratingPass(true)}
            >
              ✅ 6号纵向破线直塞肋部（ΔxT +0.11 · Packing 绕过 5 人！）
            </button>
            <button
              type="button"
              className={`lab-tab ${!penetratingPass ? 'is-active' : ''}`}
              onClick={() => setPenetratingPass(false)}
            >
              ❌ 后场安全横传刷成功率（ΔxT +0.00 · Packing 绕过 0 人）
            </button>
          </div>

          <svg className="pitch-svg" viewBox="0 0 600 264" role="img" aria-label="xT期望威胁网格与Packing破线">
            <rect width="600" height="264" fill="#2c6e43" />
            {/* 绘制 6×4 期望威胁网格 */}
            {XT_GRID.map((row, rIdx) =>
              row.map((val, cIdx) => {
                const gx = 60 + cIdx * 82;
                const gy = 20 + rIdx * 56;
                const alpha = Math.min(0.62, val * 2.1);
                return (
                  <g key={`${rIdx}-${cIdx}`}>
                    <rect
                      x={gx}
                      y={gy}
                      width="82"
                      height="56"
                      fill={`rgba(251, 146, 60, ${alpha})`}
                      stroke="rgba(255,255,255,0.32)"
                      strokeWidth="1.2"
                    />
                    <text
                      x={gx + 41}
                      y={gy + 32}
                      textAnchor="middle"
                      fontSize="11"
                      fill="rgba(255,255,255,0.82)"
                      fontWeight="700"
                    >
                      xT {val.toFixed(2)}
                    </text>
                  </g>
                );
              })
            )}
            <rect x="552" y="108" width="14" height="48" fill="rgba(255,255,255,0.35)" stroke="#fff" strokeWidth="2.5" />

            {/* 蓝队 5 名中前场防守队员 */}
            {[
              [275, 102],
              [275, 162],
              [365, 68],
              [365, 132],
              [365, 196],
            ].map(([dx, dy], idx) => (
              <circle
                key={idx}
                cx={dx}
                cy={dy}
                r="10.5"
                fill="#2563eb"
                stroke="#fff"
                strokeWidth="2"
                opacity={penetratingPass ? 0.95 : 0.6}
              />
            ))}

            {/* 持球6号与接应队友 */}
            <circle cx="185" cy="148" r="13.5" fill="#ff6b35" stroke="#ffe066" strokeWidth="3" />
            <text x="185" y="152" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
              6
            </text>

            {penetratingPass ? (
              <g>
                <line
                  x1="198"
                  y1="144"
                  x2="416"
                  y2="98"
                  stroke="#ffe066"
                  strokeWidth="4"
                  strokeDasharray="8 4"
                />
                <circle cx="430" cy="96" r="14" fill="#ef4444" stroke="#ffe066" strokeWidth="3" />
                <text x="430" y="100" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
                  10
                </text>
              </g>
            ) : (
              <g>
                <line x1="185" y1="162" x2="185" y2="212" stroke="#cbd5e1" strokeWidth="3.5" strokeDasharray="6 4" />
                <circle cx="185" cy="222" r="13" fill="#ff9f43" stroke="#fff" strokeWidth="2.2" />
                <text x="185" y="226" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
                  3
                </text>
              </g>
            )}
          </svg>

          <div className={`lab-verdict ${penetratingPass ? 'is-ok' : 'is-offside'}`}>
            <strong>
              {penetratingPass
                ? '✅ 高价值渐进破线传球：从 xT=0.03 格直刺肋部 xT=0.14 格（ΔxT = +0.11），且一脚甩掉蓝队 5 名中前场（Packing = +5）！'
                : '❌ 无效控球横倒脚：虽然传球成功率 100%，但起终点都在 xT=0.02 格（ΔxT = 0），绕过对手 0 人，未对防线制造任何实质威胁。'}
            </strong>
          </div>
        </>
      )}
    </div>
  );
}
