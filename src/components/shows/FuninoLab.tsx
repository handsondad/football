import { useState } from 'react';

export function FuninoLab() {
  const [switched, setSwitched] = useState(false);

  return (
    <div className="lab-card" aria-label="Horst Wein FUNiño 四球门 3v3 智能沙盘">
      <div className="lab-head">
        <strong>🎯 Horst Wein「FUNiño 四球门 3v3」：为什么四个小门天然逼出球商？</strong>
        <button
          type="button"
          className={`lab-moment-btn ${switched ? 'is-after' : ''}`}
          onClick={() => setSwitched((v) => !v)}
        >
          {switched ? '⏪ 回到「右门受阻拥挤态」' : '▶️ 一键执行「抬头转移打左路空门！」'}
        </button>
      </div>

      <svg className="pitch-svg" viewBox="0 0 600 280" role="img" aria-label="22×32米四球门3v3场地模型">
        <rect width="600" height="280" fill="#3da65c" />
        {/* 32m × 22m 球场外框 */}
        <rect x="60" y="24" width="480" height="232" fill="none" stroke="#fff" strokeWidth="2.5" />

        {/* 左右两端 6 米射门区虚线 */}
        <line x1="150" y1="24" x2="150" y2="256" stroke="#ffe066" strokeWidth="2.4" strokeDasharray="7 5" />
        <line x1="450" y1="24" x2="450" y2="256" stroke="#ffe066" strokeWidth="2.4" strokeDasharray="7 5" />
        <rect x="450" y="24" width="90" height="232" fill="rgba(255, 224, 102, 0.14)" />
        <text x="495" y="42" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffe066">
          6m 射门区
        </text>

        {/* 四座 2m 迷你球门（无守门员） */}
        {[
          [46, 56],
          [46, 188],
          [540, 56],
          [540, 188],
        ].map(([gx, gy], i) => (
          <rect
            key={i}
            x={gx}
            y={gy}
            width="14"
            height="36"
            fill={i === 2 && switched ? '#fde047' : 'rgba(255,255,255,0.32)'}
            stroke="#fff"
            strokeWidth="2.8"
          />
        ))}

        {/* 蓝队 3 名防守人被吸在下方右球门侧 */}
        {[
          switched ? [435, 148] : [445, 195],
          switched ? [468, 178] : [482, 212],
          switched ? [405, 165] : [412, 180],
        ].map(([bx, by], idx) => (
          <g
            key={idx}
            style={{ transition: 'transform 400ms cubic-bezier(0.34, 1.4, 0.64, 1)' }}
            transform={`translate(${bx}, ${by})`}
          >
            <circle r="12.5" fill="#2563eb" stroke="#fff" strokeWidth="2.2" />
            <text y="4" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#fff">
              防
            </text>
          </g>
        ))}

        {/* 红队 3 人呈天然三角形站开宽度 */}
        <g transform="translate(385, 206)">
          <circle r="13.5" fill="#ff6b35" stroke="#fff" strokeWidth="2.5" />
          <text y="4" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#fff">
            A
          </text>
        </g>
        <g transform="translate(332, 136)">
          <circle r="13.5" fill="#ff8a3d" stroke="#fff" strokeWidth="2.5" />
          <text y="4" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#fff">
            B
          </text>
        </g>
        <g
          style={{ transition: 'transform 400ms cubic-bezier(0.34, 1.4, 0.64, 1)' }}
          transform={`translate(${switched ? 472 : 395}, ${switched ? 74 : 68})`}
        >
          <circle r="14" fill="#ef4444" stroke="#ffe066" strokeWidth="3" />
          <text y="4" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#fff">
            C
          </text>
        </g>

        {/* 转移球轨迹与足球 */}
        {switched ? (
          <g>
            <path
              d="M 385 206 L 332 136 L 472 74 L 540 74"
              fill="none"
              stroke="#ffe066"
              strokeWidth="3.5"
              strokeDasharray="7 4"
            />
            <circle cx="526" cy="74" r="7" fill="#fff" stroke="#111" strokeWidth="1.8" />
          </g>
        ) : (
          <g>
            <circle cx="465" cy="74" r="24" fill="rgba(255,244,179,0.25)" stroke="#ffe066" strokeDasharray="4 4" />
            <text x="465" y="78" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffe066">
              弱侧空门!
            </text>
            <circle cx="398" cy="202" r="7" fill="#fff" stroke="#111" strokeWidth="1.8" />
          </g>
        )}
      </svg>

      <div className="lab-verdict is-ok">
        <strong>
          {switched
            ? '✅ 漂亮的三角转移！A 不硬往蓝队三个人堆里扎，回敲中枢 B 再顺传给拉开宽度的 C，轻松杀入 6m 射门区推空门！'
            : '💡 观察局面：蓝队 3 名防守人全被吸引在右下角球门前，上方左侧小门完全空虚——不用教练喊，孩子抬头一看自然懂换边！'}
        </strong>
      </div>
    </div>
  );
}
