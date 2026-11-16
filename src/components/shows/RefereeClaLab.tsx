import { useState } from 'react';

type LabMode = 'cla' | 'referee';
type BoxScale = 'tight' | 'sweet' | 'wide';
type AgeBand = 'u8' | 'u11' | 'pro';
type RefScene = 'bad-middle' | 'diagonal-good' | 'advantage';

const CLA_CONFIG: Record<
  AgeBand,
  {
    label: string;
    sweetSide: number;
    tightSide: number;
    wideSide: number;
  }
> = {
  u8: { label: '👦 U7–U9 启蒙娃', sweetSide: 12, tightSide: 7, wideSide: 18 },
  u11: { label: '⚡ U10–U12 进阶娃', sweetSide: 10, tightSide: 6.5, wideSide: 16 },
  pro: { label: '🏆 成人 / 职业梯队', sweetSide: 8, tightSide: 5.5, wideSide: 14 },
};

export function RefereeClaLab() {
  const [mode, setMode] = useState<LabMode>('cla');
  const [age, setAge] = useState<AgeBand>('u8');
  const [scale, setScale] = useState<BoxScale>('sweet');
  const [refScene, setRefScene] = useState<RefScene>('diagonal-good');

  const cfg = CLA_CONFIG[age];
  const sideMeters =
    scale === 'tight' ? cfg.tightSide : scale === 'sweet' ? cfg.sweetSide : cfg.wideSide;
  const areaPerPlayer = Math.round(((sideMeters * sideMeters) / 6) * 10) / 10;

  // Map 5.5m..18m -> SVG half-size 44..102 around (300, 122)
  const halfPx = 40 + ((sideMeters - 5) / 13) * 64;
  const cx = 300;
  const cy = 122;

  return (
    <div className="lab-card" aria-label="草坪控场配平与裁判对角线跑位沙盘">
      <div className="lab-head">
        <strong>
          {mode === 'cla'
            ? '📐 训练框动态配平器（CLA）：挪两步标志盘如何瞬间救活 4v2 抢圈'
            : '🧑‍⚖️ 客串裁判实操沙盘：S 型对角线跑位、越位齐平视线与进攻有利'}
        </strong>
        <button
          type="button"
          className={`lab-moment-btn ${mode === 'referee' ? 'is-after' : ''}`}
          onClick={() => setMode((m) => (m === 'cla' ? 'referee' : 'cla'))}
        >
          {mode === 'cla' ? '🔀 切换到「客串裁判跑位沙盘」' : '🔀 切换到「训练框尺寸调节器」'}
        </button>
      </div>

      {mode === 'cla' ? (
        <>
          <div className="lab-tabs" aria-label="选择年龄段">
            {(Object.keys(CLA_CONFIG) as AgeBand[]).map((key) => (
              <button
                key={key}
                type="button"
                className={`lab-tab ${age === key ? 'is-active' : ''}`}
                onClick={() => setAge(key)}
              >
                {CLA_CONFIG[key].label}
              </button>
            ))}
          </div>

          <div className="lab-tabs" aria-label="调节标志盘间距">
            <button
              type="button"
              className={`lab-tab ${scale === 'tight' ? 'is-active' : ''}`}
              onClick={() => setScale('tight')}
            >
              ❌ 照搬过窄（{cfg.tightSide}×{cfg.tightSide}m）
            </button>
            <button
              type="button"
              className={`lab-tab ${scale === 'sweet' ? 'is-active' : ''}`}
              onClick={() => setScale('sweet')}
            >
              ✅ 黄金甜点尺寸（{cfg.sweetSide}×{cfg.sweetSide}m）
            </button>
            <button
              type="button"
              className={`lab-tab ${scale === 'wide' ? 'is-active' : ''}`}
              onClick={() => setScale('wide')}
            >
              ⚠️ 摆得过宽（{cfg.wideSide}×{cfg.wideSide}m）
            </button>
          </div>

          <svg className="pitch-svg" viewBox="0 0 600 244">
            <rect width="600" height="244" fill="#3da65c" />
            <rect
              x="16"
              y="14"
              width="568"
              height="216"
              rx="10"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="2"
            />

            {/* 动态缩放训练方框 */}
            <rect
              x={cx - halfPx}
              y={cy - halfPx}
              width={halfPx * 2}
              height={halfPx * 2}
              fill={
                scale === 'sweet'
                  ? 'rgba(254, 240, 138, 0.16)'
                  : scale === 'tight'
                    ? 'rgba(239, 68, 68, 0.22)'
                    : 'rgba(59, 130, 246, 0.18)'
              }
              stroke="#fde047"
              strokeWidth="2.8"
              strokeDasharray="7 5"
              style={{ transition: 'all 260ms ease' }}
            />

            {/* 四个角标志碟 */}
            {[
              [cx - halfPx, cy - halfPx],
              [cx + halfPx, cy - halfPx],
              [cx - halfPx, cy + halfPx],
              [cx + halfPx, cy + halfPx],
            ].map(([px, py], idx) => (
              <polygon
                key={idx}
                points={`${px},${py - 6} ${px + 7},${py + 5} ${px - 7},${py + 5}`}
                fill="#fb923c"
                stroke="#fff"
                strokeWidth="1.4"
              />
            ))}

            {/* 传球三角形连线 */}
            <line
              x1={cx - halfPx}
              y1={cy}
              x2={cx}
              y2={cy - halfPx}
              stroke="#fff"
              strokeWidth="2.2"
              strokeDasharray="5 4"
            />
            <line
              x1={cx - halfPx}
              y1={cy}
              x2={cx}
              y2={cy + halfPx}
              stroke="#fff"
              strokeWidth="2.2"
              strokeDasharray="5 4"
            />

            {/* 四边外围传球球员 */}
            {[
              { x: cx - halfPx, y: cy, label: '持球' },
              { x: cx, y: cy - halfPx, label: '左翼' },
              { x: cx + halfPx, y: cy, label: '远端' },
              { x: cx, y: cy + halfPx, label: '右翼' },
            ].map((p) => (
              <g key={p.label}>
                <circle cx={p.x} cy={p.y} r="12" fill="#f97316" stroke="#fff" strokeWidth="2.2" />
                <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#fff">
                  {p.label}
                </text>
              </g>
            ))}

            {/* 中央2名抢球防守人 */}
            <circle
              cx={scale === 'tight' ? cx - halfPx + 22 : cx - 18}
              cy={cy - 10}
              r="11.5"
              fill="#2563eb"
              stroke="#fff"
              strokeWidth="2"
            />
            <text
              x={scale === 'tight' ? cx - halfPx + 22 : cx - 18}
              y={cy - 6.5}
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="700"
              fill="#fff"
            >
              抢1
            </text>
            <circle cx={cx + 18} cy={cy + 14} r="11.5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
            <text x={cx + 18} y={cy + 17.5} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#fff">
              抢2
            </text>

            {/* 足球 */}
            <circle cx={cx - halfPx + 14} cy={cy - 4} r="5.8" fill="#fff" stroke="#111" strokeWidth="1.6" />

            {/* 右侧实时遥测面板 */}
            <g transform="translate(432, 34)">
              <rect width="140" height="174" rx="10" fill="rgba(15, 23, 42, 0.82)" />
              <text x="12" y="26" fontSize="10.5" fontWeight="700" fill="#fde047">
                📊 场地实时参数
              </text>
              <text x="12" y="52" fontSize="11" fill="#e2e8f0">
                边长：{sideMeters}m × {sideMeters}m
              </text>
              <text x="12" y="76" fontSize="11" fill="#e2e8f0">
                人均面积：{areaPerPlayer} m²/人
              </text>
              <text x="12" y="102" fontSize="11" fontWeight="700" fill="#86efac">
                预计连传：
                {scale === 'tight' ? '1–2 脚即断' : scale === 'sweet' ? '6–10 脚甜点!' : '20+ 脚无压力'}
              </text>
              <text x="12" y="130" fontSize="10" fill="#cbd5e1">
                {scale === 'tight'
                  ? '👉 处方：四角各向外退2步'
                  : scale === 'sweet'
                    ? '👉 处方：保持! 鼓励抬头扫描'
                    : '👉 处方：缩窄3米或限两脚出球'}
              </text>
            </g>
          </svg>

          <div className={`lab-verdict ${scale === 'sweet' ? 'is-ok' : 'is-offside'}`}>
            <strong>
              {scale === 'sweet'
                ? `✅ 黄金配平（${sideMeters}×${sideMeters}m，人均 ${areaPerPlayer}m²）：既给该年龄段孩子留出半秒抬头扫描窗口，又逼迫接应队友跑出菱形角度，连续传出 6–10 脚最涨球！`
                : scale === 'tight'
                  ? `❌ 场地过窄（人均仅 ${areaPerPlayer}m²）：防守人迈一步就撞到脸上，孩子被迫低头乱捅 2 秒必丢！别批评孩子，把四个标志碟往外挪大两步立刻盘活！`
                  : `⚠️ 场地过宽（人均达 ${areaPerPlayer}m²）：外圈站桩不动也能随便传 20 脚，中间两名防守娃跑断腿也摸不到球，失去实战压迫意义——请往内缩碟或限制最多两脚触球！`}
            </strong>
          </div>
        </>
      ) : (
        <>
          <div className="lab-tabs" aria-label="选择执裁场景">
            <button
              type="button"
              className={`lab-tab ${refScene === 'diagonal-good' ? 'is-active' : ''}`}
              onClick={() => setRefScene('diagonal-good')}
            >
              ✅ 标准对角线 + 边裁齐平线
            </button>
            <button
              type="button"
              className={`lab-tab ${refScene === 'bad-middle' ? 'is-active' : ''}`}
              onClick={() => setRefScene('bad-middle')}
            >
              ❌ 新手大忌：站中路追球挡道
            </button>
            <button
              type="button"
              className={`lab-tab ${refScene === 'advantage' ? 'is-active' : ''}`}
              onClick={() => setRefScene('advantage')}
            >
              🙌 进攻有利：双臂前伸不吹停
            </button>
          </div>

          <svg className="pitch-svg" viewBox="0 0 600 244">
            <rect width="600" height="244" fill="#3da65c" />
            <rect x="24" y="16" width="552" height="212" fill="none" stroke="#fff" strokeWidth="2.2" />
            <line x1="300" y1="16" x2="300" y2="228" stroke="#fff" strokeWidth="2" />
            <circle cx="300" cy="122" r="34" fill="none" stroke="#fff" strokeWidth="2" />
            <rect x="24" y="64" width="76" height="116" fill="none" stroke="#fff" strokeWidth="2" />
            <rect x="500" y="64" width="76" height="116" fill="none" stroke="#fff" strokeWidth="2" />

            {/* 标准 S 型主裁对角线虚线走廊 */}
            <path
              d="M 110 36 Q 280 95 490 206"
              fill="none"
              stroke="rgba(253, 224, 71, 0.65)"
              strokeWidth="8"
              strokeDasharray="10 7"
            />

            {/* 倒数第二名防守人越位线 */}
            <line
              x1="448"
              y1="16"
              x2="448"
              y2="228"
              stroke="#38bdf8"
              strokeWidth="2.2"
              strokeDasharray="6 4"
            />

            {/* 远端边裁 AR1（严格齐平倒数第二名防守队员 x=448） */}
            <circle cx="448" cy="14" r="10" fill="#facc15" stroke="#111" strokeWidth="2" />
            <text x="448" y="17.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="#111">
              边裁
            </text>

            {/* 进攻方与防守方球员 */}
            <circle cx="328" cy="118" r="12.5" fill="#f97316" stroke="#fff" strokeWidth="2.2" />
            <text x="328" y="122" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#fff">
              10号
            </text>

            <circle cx="448" cy="96" r="12.5" fill="#2563eb" stroke="#fff" strokeWidth="2.2" />
            <text x="448" y="100" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
              后卫
            </text>

            <circle cx="442" cy="142" r="12.5" fill="#f97316" stroke="#fff" strokeWidth="2.2" />
            <text x="442" y="146" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#fff">
              9号
            </text>

            {/* 直塞传球路线 */}
            <line
              x1="341"
              y1="120"
              x2="428"
              y2="140"
              stroke={refScene === 'bad-middle' ? '#ef4444' : '#fff'}
              strokeWidth="2.8"
              strokeDasharray="6 4"
            />

            {/* 主裁判位置 */}
            {refScene === 'bad-middle' ? (
              <g>
                <circle cx="382" cy="129" r="14" fill="#ef4444" stroke="#fde047" strokeWidth="3" />
                <text x="382" y="133" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff">
                  挡球!
                </text>
              </g>
            ) : (
              <g>
                <circle cx="368" cy="176" r="14" fill="#fde047" stroke="#111" strokeWidth="2.5" />
                <text x="368" y="180" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#111">
                  主裁
                </text>
                {/* 主裁斜侧视线夹住争抢点与远端边裁 */}
                <line
                  x1="368"
                  y1="162"
                  x2="334"
                  y2="128"
                  stroke="#fde047"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />
                <line
                  x1="374"
                  y1="162"
                  x2="446"
                  y2="26"
                  stroke="#fde047"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />
              </g>
            )}

            {refScene === 'advantage' && (
              <g transform="translate(238, 194)">
                <rect width="265" height="28" rx="8" fill="rgba(15, 23, 42, 0.86)" />
                <text x="132" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fde047">
                  🙌 主裁双臂前伸喊「继续！」死球后再补黄牌
                </text>
              </g>
            )}
          </svg>

          <div className={`lab-verdict ${refScene === 'bad-middle' ? 'is-offside' : 'is-ok'}`}>
            <strong>
              {refScene === 'diagonal-good'
                ? '✅ 黄金正交视野：主裁判沿黄色对角线保持距球 12 米斜侧角，既完全让开中路直塞高速路，又能一眼同时把「身体拉拽接触面」与「远端边裁旗语」收进同一画面！'
                : refScene === 'bad-middle'
                  ? '❌ 业余客串头号错误：傻跑在中轴线跟在球正后方，不仅一脚把 10 号的妙传挡了回来，而且视线被球员后背挡死，根本看不见前面的手部推拉和边裁举旗！'
                  : '✅ 进攻有利精髓：10 号虽被拉拽球衣但仍成功把单刀塞给 9 号，此时若急着吹哨停球反而帮了犯规方大忙！双臂前平伸高喊继续，等这波射门结束死球后再回头补发黄牌！'}
            </strong>
          </div>
        </>
      )}
    </div>
  );
}
