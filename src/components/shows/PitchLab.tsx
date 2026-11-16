import { useState } from 'react';

type PitchMode = 'formats' | 'roles' | 'triangles';

const FORMAT_ITEMS = [
  {
    id: '5v5',
    badge: '🧒 U6–U8 五人制',
    size: '约 25×35 米 · 3号球 · 2×3米小门',
    box: { x: 40, y: 150, w: 195, h: 130 },
    desc: '只有标准场六分之一大！没有越位，球每几秒就滚到脚下，专练 1v1 突破过人与基础控球勇气。',
    dots: [
      [58, 215],
      [105, 215],
      [148, 178],
      [148, 252],
      [198, 215],
    ],
  },
  {
    id: '8v8',
    badge: '⚡ U9–U12 八人制',
    size: '约 50×70 米 · 4号球 · 2×5米中门',
    box: { x: 40, y: 80, w: 385, h: 200 },
    desc: '黄金过渡桥梁！常用 1-3-3-1 阵型，既有完整的后中前三条线与三个菱形，又不会让小球员跑断腿。',
    dots: [
      [62, 180],
      [135, 118],
      [125, 180],
      [135, 242],
      [238, 118],
      [228, 180],
      [238, 242],
      [335, 180],
    ],
  },
  {
    id: '11v11',
    badge: '🔥 U13+ 十一人制标准场',
    size: '68×105 米 · 5号球 · 2.44×7.32米标准大门',
    box: { x: 40, y: 24, w: 520, h: 256 },
    desc: '《青训大纲》规定满 12 岁后才开始过渡！空间辽阔，全面考验无球跑动、长传转移与四个时刻整体协同。',
    dots: [
      [66, 152],
      [150, 58],
      [138, 120],
      [138, 184],
      [150, 246],
      [255, 152],
      [325, 98],
      [325, 206],
      [435, 64],
      [455, 152],
      [435, 240],
    ],
  },
] as const;

type RoleGroup = {
  readonly id: string;
  readonly badge: string;
  readonly name: string;
  readonly duty: string;
  readonly archetypes: string;
  readonly zone: { x: number; y: number; w: number; h: number };
  readonly players: readonly { num: string; x: number; y: number }[];
};

const ROLE_GROUPS: readonly RoleGroup[] = [
  {
    id: 'gk',
    badge: '1号 门卫',
    name: '1号 现代清道夫门将（Goalkeeper）',
    duty: '不仅是最后一道扑救铁闸，更是进攻第一发起点！防线前提时还要冲出禁区解围身后球。',
    archetypes: '代表模板：诺伊尔、阿利松、埃德森',
    zone: { x: 42, y: 92, w: 96, h: 116 },
    players: [{ num: '1', x: 68, y: 150 }],
  },
  {
    id: 'cb',
    badge: '4·5号 中卫 + 2·3号 边卫',
    name: '后防四人组：出球中卫（4/5）与翼卫（2/3）',
    duty: '4号和5号坐镇中路防空卡位、冷静短传破逼抢；2号右后卫与3号左后卫上下往返百米走廊助攻回防。',
    archetypes: '代表模板：范戴克、鲁本·迪亚斯、阿什拉夫',
    zone: { x: 108, y: 30, w: 112, h: 240 },
    players: [
      { num: '2', x: 162, y: 244 },
      { num: '4', x: 142, y: 184 },
      { num: '5', x: 142, y: 116 },
      { num: '3', x: 162, y: 56 },
    ],
  },
  {
    id: 'dm',
    badge: '6号 后腰大脑',
    name: '6号 单后腰 / 节拍器（Pivot）',
    duty: '全队战术心脏！站在中卫身前扫荡拦截，接球前高频扫描全场，决定一脚转移快攻还是稳住节奏。',
    archetypes: '代表模板：罗德里、布斯克茨、皮尔洛',
    zone: { x: 205, y: 86, w: 115, h: 128 },
    players: [{ num: '6', x: 256, y: 150 }],
  },
  {
    id: 'cm',
    badge: '8·10号 双中前卫',
    name: '8号 全能B2B中场 & 10号 组织核心',
    duty: '8号覆盖两个禁区之间攻守兼备；10号游弋在对方防线肋部空当，用想象力送出致命直塞与远射。',
    archetypes: '代表模板：莫德里奇、德布劳内、梅西、贝林厄姆',
    zone: { x: 290, y: 54, w: 135, h: 192 },
    players: [
      { num: '8', x: 342, y: 202 },
      { num: '10', x: 356, y: 98 },
    ],
  },
  {
    id: 'fw',
    badge: '7·9·11号 锋线三叉戟',
    name: '7/11号 爆点边锋 & 9号 支点射手',
    duty: '7号和11号拉开宽度1v1突破内切射门；9号顶在最前牵制中卫、背身做球并完成门前一击，丢球后第一时间领头压迫！',
    archetypes: '代表模板：姆巴佩、亚马尔、孙兴慜、哈兰德、莱万',
    zone: { x: 400, y: 32, w: 152, h: 236 },
    players: [
      { num: '7', x: 448, y: 236 },
      { num: '9', x: 486, y: 150 },
      { num: '11', x: 448, y: 64 },
    ],
  },
];

const ALL_ROLE_PLAYERS = ROLE_GROUPS.flatMap((g) => g.players.map((p) => ({ ...p, groupId: g.id })));

const DIAMOND_NODES = [
  { label: '4号拖后', x: 150, y: 130, defX: 245, defY: 122 },
  { label: '11号左翼', x: 295, y: 52, defX: 280, defY: 96 },
  { label: '7号右翼', x: 295, y: 208, defX: 280, defY: 164 },
  { label: '9号纵深', x: 435, y: 130, defX: 355, defY: 130 },
] as const;

export function PitchLab({ mode }: { mode: PitchMode }) {
  const [fmtIdx, setFmtIdx] = useState(1);
  const [roleIdx, setRoleIdx] = useState(2);
  const [goodTriangle, setGoodTriangle] = useState(true);
  const [holderIdx, setHolderIdx] = useState(0);

  if (mode === 'formats') {
    const active = FORMAT_ITEMS[fmtIdx];
    return (
      <div className="lab-card" aria-label="五人制、八人制与十一人制球场比例对比">
        <div className="lab-head">
          <strong>📐 绿茵战术板：球场跟着腿长一起长大（按真实比例同屏叠放）</strong>
        </div>
        <div className="lab-tabs">
          {FORMAT_ITEMS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`lab-tab ${i === fmtIdx ? 'is-active' : ''}`}
              onClick={() => setFmtIdx(i)}
            >
              {item.badge}
            </button>
          ))}
        </div>

        <svg className="pitch-svg" viewBox="0 0 600 300">
          <rect width="600" height="300" fill="#3ea85d" />
          {FORMAT_ITEMS.map((item, i) => {
            const isSel = i === fmtIdx;
            return (
              <rect
                key={item.id}
                x={item.box.x}
                y={item.box.y}
                width={item.box.w}
                height={item.box.h}
                fill={isSel ? 'rgba(255, 248, 214, 0.16)' : 'none'}
                stroke={isSel ? '#ffe066' : 'rgba(255,255,255,0.45)'}
                strokeWidth={isSel ? 3.5 : 1.8}
                strokeDasharray={isSel ? undefined : '5 4'}
                rx="4"
              />
            );
          })}
          {active.dots.map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="9" fill="#ff7a45" stroke="#fff" strokeWidth="2.2" />
          ))}
          <text x={active.box.x + 10} y={active.box.y + 22} fontSize="13" fontWeight="700" fill="#ffe066">
            {active.badge} · {active.size}
          </text>
        </svg>

        <div className="lab-verdict is-ok">
          <strong>{active.size}</strong>
          <p>{active.desc}</p>
        </div>
      </div>
    );
  }

  if (mode === 'roles') {
    const activeRole = ROLE_GROUPS[roleIdx];
    return (
      <div className="lab-card" aria-label="1-4-3-3 球衣号码与位置职责热区板">
        <div className="lab-head">
          <strong>📐 绿茵战术板：点击 1–11 号球衣号码，查看现代位置职责热区与球星模板</strong>
        </div>
        <div className="lab-tabs">
          {ROLE_GROUPS.map((g, i) => (
            <button
              key={g.id}
              type="button"
              className={`lab-tab ${i === roleIdx ? 'is-active' : ''}`}
              onClick={() => setRoleIdx(i)}
            >
              {g.badge}
            </button>
          ))}
        </div>

        <svg className="pitch-svg" viewBox="0 0 600 300">
          <rect width="600" height="300" fill="#3da65c" />
          <rect x="40" y="24" width="520" height="252" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
          <line x1="300" y1="24" x2="300" y2="276" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
          <circle cx="300" cy="150" r="38" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
          <rect x="40" y="84" width="76" height="132" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
          <rect x="484" y="84" width="76" height="132" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />

          {/* 高亮当前位置活动热区 */}
          <rect
            x={activeRole.zone.x}
            y={activeRole.zone.y}
            width={activeRole.zone.w}
            height={activeRole.zone.h}
            rx="18"
            fill="rgba(255, 224, 102, 0.24)"
            stroke="#ffe066"
            strokeWidth="2.5"
            strokeDasharray="7 5"
          />

          {ALL_ROLE_PLAYERS.map((p) => {
            const lit = p.groupId === activeRole.id;
            return (
              <g
                key={p.num}
                transform={`translate(${p.x}, ${p.y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const found = ROLE_GROUPS.findIndex((g) => g.id === p.groupId);
                  if (found >= 0) setRoleIdx(found);
                }}
              >
                <circle
                  r={lit ? 16 : 13}
                  fill={lit ? '#ff7a3d' : '#23533a'}
                  stroke={lit ? '#ffe066' : '#fff'}
                  strokeWidth={lit ? 3.2 : 2}
                />
                <text y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
                  {p.num}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="lab-verdict is-ok">
          <strong>{activeRole.name}</strong>
          <p>
            {activeRole.duty}（{activeRole.archetypes}）
          </p>
        </div>
      </div>
    );
  }

  // mode === 'triangles'
  const holder = DIAMOND_NODES[holderIdx];
  return (
    <div className="lab-card" aria-label="三角形与菱形传球接应战术对比">
      <div className="lab-head">
        <strong>📐 绿茵战术板：切换「菱形双三角 vs 扁平一字站位」（点击菱形队友可传球遛猴！）</strong>
      </div>
      <div className="lab-tabs">
        <button
          type="button"
          className={`lab-tab ${goodTriangle ? 'is-active' : ''}`}
          onClick={() => setGoodTriangle(true)}
        >
          ✅ 菱形与双三角站位（点任意队友传球）
        </button>
        <button
          type="button"
          className={`lab-tab ${!goodTriangle ? 'is-active' : ''}`}
          onClick={() => setGoodTriangle(false)}
        >
          ❌ 扁平一字站位（被1人锁死）
        </button>
      </div>

      <svg className="pitch-svg" viewBox="0 0 600 260">
        <rect width="600" height="260" fill="#3da65c" />
        <rect x="30" y="20" width="540" height="220" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />

        {goodTriangle ? (
          <g>
            {/* 菱形四点 = 两个小三角形 */}
            <polygon
              points="150,130 295,52 435,130 295,208"
              fill="rgba(255, 244, 180, 0.18)"
              stroke="#ffe066"
              strokeWidth="3"
              strokeDasharray="7 5"
            />
            <line x1="295" y1="52" x2="295" y2="208" stroke="#ffe066" strokeWidth="2.4" strokeDasharray="5 5" />

            {/* 蓝队抢球人跟着球跑但永远顾此失彼 */}
            <g
              style={{ transition: 'transform 360ms cubic-bezier(0.34, 1.4, 0.64, 1)' }}
              transform={`translate(${holder.defX}, ${holder.defY})`}
            >
              <circle r="13" fill="#2563eb" stroke="#fff" strokeWidth="2.2" />
              <text y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
                抢球
              </text>
            </g>

            {DIAMOND_NODES.map((pt, i) => {
              const hasBall = i === holderIdx;
              return (
                <g
                  key={pt.label}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setHolderIdx(i)}
                >
                  {hasBall && <circle r="21" fill="#ffe066" opacity="0.3" />}
                  <circle
                    r={hasBall ? 15 : 13.5}
                    fill={hasBall ? '#ff6b4a' : '#ff9f43'}
                    stroke={hasBall ? '#ffe066' : '#fff'}
                    strokeWidth="2.6"
                  />
                  <text y="29" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#fff8e7">
                    {pt.label}
                  </text>
                </g>
              );
            })}

            {/* 跟着点击传递的足球 */}
            <g
              style={{ transition: 'transform 340ms cubic-bezier(0.34, 1.4, 0.64, 1)' }}
              transform={`translate(${holder.x + 14}, ${holder.y - 8})`}
            >
              <circle r="6.5" fill="#fff" stroke="#111" strokeWidth="1.8" />
            </g>
          </g>
        ) : (
          <g>
            <line x1="220" y1="55" x2="220" y2="205" stroke="#fca5a5" strokeWidth="3.5" strokeDasharray="6 5" />
            <circle cx="220" cy="112" r="14" fill="#dc2626" stroke="#fff" strokeWidth="2.5" />
            <text x="220" y="116" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
              断球!
            </text>
            {[
              { label: '持球人', x: 220, y: 55 },
              { label: '平排队友A', x: 220, y: 158 },
              { label: '平排队友B', x: 220, y: 212 },
            ].map((pt) => (
              <g key={pt.label} transform={`translate(${pt.x}, ${pt.y})`}>
                <circle r="13" fill="#ff8a5c" stroke="#fff" strokeWidth="2.2" />
                <text x="48" y="4" fontSize="12" fontWeight="700" fill="#fff">
                  {pt.label}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>

      <div className={`lab-verdict ${goodTriangle ? 'is-ok' : 'is-offside'}`}>
        <strong>
          {goodTriangle
            ? `✅ 当前 ${holder.label} 持球：点任意队友试试！无论抢球人扑向哪边，另外两个角永远空着！`
            : '❌ 站成一条平线：1 个对手卡在中间就能同时遮死传球线，一旦被断身后全空！'}
        </strong>
      </div>
    </div>
  );
}
