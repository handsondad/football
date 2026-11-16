import { useState } from 'react';

type PlayerNode = {
  readonly num: string;
  readonly role: string;
  readonly duty: string;
  /** 进攻展开坐标 (0–600 × 0–320，从左向右进攻) */
  readonly atk: readonly [number, number];
  /** 防守落位坐标 */
  readonly def: readonly [number, number];
};

type FormationSpec = {
  readonly id: string;
  readonly name: string;
  readonly atkShape: string;
  readonly defShape: string;
  readonly summary: string;
  readonly players: readonly PlayerNode[];
};

const FORMATIONS: readonly FormationSpec[] = [
  {
    id: '433',
    name: '1-4-3-3（现代高压传控）',
    atkShape: '进攻展开变 3-2-5（边卫内收·占满五走廊）',
    defShape: '无球退防变 4-5-1（两翼回撤·锁死中路）',
    summary: '当代豪门最主流阵型：满场天然三角形，控球时一名边后卫内收到6号身旁，前场五人压制对方防线五个通道！',
    players: [
      { num: '1', role: '1号 清道夫门卫', duty: '进攻压上至大禁区外接应倒脚、防身后长传；防守镇守门线。', atk: [92, 160], def: [56, 160] },
      { num: '2', role: '2号 内收型右后卫', duty: '控球时斜向内收到后腰旁组成双支点防反击；无球退回右后卫。', atk: [248, 212], def: [145, 255] },
      { num: '4', role: '4号 右中后卫', duty: '防线定海神针，正面防空抗中锋，控球时拉开接应出球。', atk: [168, 224], def: [132, 192] },
      { num: '5', role: '5号 左中后卫', duty: '左路出球核心，随时补防左路身后空当。', atk: [168, 96], def: [132, 128] },
      { num: '3', role: '3号 留守型左后卫', duty: '控球时留在后场与双中卫形成稳固三后卫；无球保护左路。', atk: [182, 48], def: [145, 65] },
      { num: '6', role: '6号 单后腰节拍器', duty: '全队大脑！高频抬头扫描，衔接后场与前场肋部，拦截对方反击。', atk: [262, 134], def: [215, 160] },
      { num: '8', role: '8号 右肋部全能中场', duty: '进攻前插占领右肋部黄金走廊与边锋配合；防守退回中场线。', atk: [392, 206], def: [255, 212] },
      { num: '10', role: '10号 左肋部组织核心', duty: '游弋在左肋部两线之间转身送致命直塞或远射。', atk: [392, 114], def: [255, 108] },
      { num: '7', role: '7号 抱边爆点右翼', duty: '踩住右边线把对方防线拉宽，1v1单挑过人下底或内切射门。', atk: [452, 276], def: [272, 268] },
      { num: '11', role: '11号 抱边爆点左翼', duty: '踩住左边线拉开宽度，接大范围斜长传单挑对方右后卫。', atk: [452, 44], def: [272, 52] },
      { num: '9', role: '9号 支点突击中锋', duty: '牵制对方两名中卫、背身做墙并抢点终结；丢球第一时间领头压迫。', atk: [478, 160], def: [365, 160] },
    ],
  },
  {
    id: '4231',
    name: '1-4-2-3-1（攻守平衡之王）',
    atkShape: '进攻展开变 2-4-4 / 3-2-5（双翼卫压上）',
    defShape: '无球落位变 4-4-1-1（双后腰铁闸护禁区弧）',
    summary: '世界杯夺冠最多的稳健阵型：6号+8号双后腰筑起禁区前防波堤，彻底解放10号前腰自由组织！',
    players: [
      { num: '1', role: '1号 门将', duty: '指挥防线选位、高空摘球与快速手抛球发动反击。', atk: [78, 160], def: [56, 160] },
      { num: '2', role: '2号 助攻型右后卫', duty: '沿右路走廊套边叠瓦传中；防守回收四后卫线。', atk: [330, 278], def: [142, 255] },
      { num: '4', role: '4号 右中卫', duty: '中路盯防与地面短传发起。', atk: [168, 202], def: [132, 192] },
      { num: '5', role: '5号 左中卫', duty: '中路协防保护与斜长传调度。', atk: [168, 118], def: [132, 128] },
      { num: '3', role: '3号 助攻型左后卫', duty: '左路套边拉开宽度；无球迅速归位。', atk: [330, 42], def: [142, 65] },
      { num: '6', role: '6号 防守型后腰', duty: '专注扫荡拦截、填补助攻边卫留下的身后空当。', atk: [256, 192], def: [222, 192] },
      { num: '8', role: '8号 组织型后腰', duty: '由守转攻第一出球点，用长短传控制比赛快慢。', atk: [256, 128], def: [222, 128] },
      { num: '10', role: '10号 自由前腰', duty: '全队进攻灵魂，在对方后腰与中卫夹缝中自由接球送威胁传球。', atk: [398, 160], def: [315, 160] },
      { num: '7', role: '7号 内切右边锋', duty: '边后卫套边时顺势内切进入右肋部攻门。', atk: [435, 224], def: [248, 260] },
      { num: '11', role: '11号 内切左边锋', duty: '内切左肋部与10号、9号做撞墙二过一射门。', atk: [435, 96], def: [248, 60] },
      { num: '9', role: '9号 单箭头中锋', duty: '顶住防线纵深、反越位前插或头球攻门。', atk: [484, 160], def: [382, 160] },
    ],
  },
  {
    id: '442',
    name: '1-4-4-2（经典双排铁壁+双锋）',
    atkShape: '进攻两翼传中 + 双前锋一高一快包抄',
    defShape: '防守紧凑两条四人平行防线（间距仅12米）',
    summary: '层次最清晰的经典阵型：防守时两堵四人墙极难渗透，反击时9号支点摆渡、10号影锋前插一剑封喉！',
    players: [
      { num: '1', role: '1号 门将', duty: '稳健扑救与长传精准找前场高中锋。', atk: [72, 160], def: [56, 160] },
      { num: '2', role: '2号 右后卫', duty: '稳固右路防守，适时前插支援右前卫。', atk: [235, 266], def: [140, 252] },
      { num: '4', role: '4号 右中卫', duty: '区域联防核心，严守禁区中路高空球。', atk: [162, 196], def: [132, 190] },
      { num: '5', role: '5号 左中卫', duty: '与4号搭档保持防线平直造越位。', atk: [162, 124], def: [132, 130] },
      { num: '3', role: '3号 左后卫', duty: '稳固左路走廊并送出45度斜传。', atk: [235, 54], def: [140, 68] },
      { num: '6', role: '6号 中前卫（偏守）', duty: '中路绞杀屏障，保护防线身前。', atk: [285, 192], def: [228, 190] },
      { num: '8', role: '8号 中前卫（偏攻）', duty: '二线后排插上远射与分边。', atk: [315, 128], def: [228, 130] },
      { num: '7', role: '7号 右前卫', duty: '边路推进下底传中，防守落回四人中场线。', atk: [398, 272], def: [236, 256] },
      { num: '11', role: '11号 左前卫', duty: '左翼突破传中或内收协防中路。', atk: [398, 48], def: [236, 64] },
      { num: '9', role: '9号 高中锋支点', duty: '争顶第一落点摆渡，吸引两名中卫注意力。', atk: [478, 192], def: [345, 188] },
      { num: '10', role: '10号 灵巧影锋', duty: '围绕9号身旁捕捉二点球、反越位高速冲击身后。', atk: [452, 126], def: [325, 132] },
    ],
  },
  {
    id: '8v8',
    name: '8人制 1-3-3-1（U9–U12 青训黄金桥）',
    atkShape: '进攻拉开边后卫与边中场，构成三个菱形',
    defShape: '无球紧凑回撤保护门前两米中门',
    summary: '中国足协《青训大纲》标准过渡阵型：8名球员完整构建后、中、前三条线与三个菱形，无缝衔接未来11人制！',
    players: [
      { num: '1', role: '1号 少儿门将', duty: '大量参与后场脚下接应，练就现代门卫基本功。', atk: [92, 160], def: [64, 160] },
      { num: '2', role: '2号 右边后卫', duty: '拉开后场右侧宽度接球推进。', atk: [215, 246], def: [152, 232] },
      { num: '4', role: '4号 拖后中卫', duty: '后场菱形底角核心，指挥防线与左右转移。', atk: [168, 160], def: [136, 160] },
      { num: '3', role: '3号 左边后卫', duty: '拉开后场左侧宽度前插配合。', atk: [215, 74], def: [152, 88] },
      { num: '6', role: '6号 中路枢纽', duty: '全队衔接点！连接前后左右四个方向的队友，练习360度抬头扫描。', atk: [305, 160], def: [238, 160] },
      { num: '7', role: '7号 右前卫/边锋', duty: '右路1v1突破过人或与9号斜传直插。', atk: [398, 250], def: [262, 238] },
      { num: '11', role: '11号 左前卫/边锋', duty: '左路1v1突破内切射门，丢球反抢。', atk: [398, 70], def: [262, 82] },
      { num: '9', role: '9号 单前锋', duty: '学习卡在越位线边缘反越位启动，背身护球做墙。', atk: [468, 160], def: [358, 160] },
    ],
  },
];

export function FormationsLab() {
  const [fIdx, setFIdx] = useState(0);
  const [attacking, setAttacking] = useState(true);
  const [showLanes, setShowLanes] = useState(true);
  const [selNum, setSelNum] = useState('6');

  const fm = FORMATIONS[fIdx];
  const activePlayer = fm.players.find((p) => p.num === selNum) ?? fm.players[0];

  return (
    <div className="lab-card" aria-label="阵型动态推演与位置职责战术板">
      <div className="lab-head">
        <strong>🧠 互动阵型战术板（进攻方向：左 → 右 · 点击球员看职责）</strong>
        <div className="lab-inline-btns">
          <button
            type="button"
            className={`lab-moment-btn ${attacking ? '' : 'is-after'}`}
            onClick={() => setAttacking((v) => !v)}
          >
            {attacking ? '🟢 当前：控球进攻展开（点此切无球退防）' : '🛡️ 当前：无球防守落位（点此切控球展开）'}
          </button>
          <button
            type="button"
            className={`lab-tab ${showLanes ? 'is-active' : ''}`}
            onClick={() => setShowLanes((v) => !v)}
          >
            {showLanes ? '✨ 已开五走廊肋部线' : '显示五走廊肋部线'}
          </button>
        </div>
      </div>

      <div className="lab-tabs">
        {FORMATIONS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`lab-tab ${idx === fIdx ? 'is-active' : ''}`}
            onClick={() => {
              setFIdx(idx);
              if (!item.players.some((p) => p.num === selNum)) {
                setSelNum(item.players[0].num);
              }
            }}
          >
            {item.name}
          </button>
        ))}
      </div>

      <svg className="pitch-svg" viewBox="0 0 600 320" role="img" aria-label={fm.name}>
        <rect width="600" height="320" fill="#3da65c" />

        {/* 五条纵向走廊（含左右黄金肋部 Half-spaces） */}
        {showLanes && (
          <g>
            {/* 左肋部 y=76..132, 右肋部 y=188..244 */}
            <rect x="36" y="78" width="528" height="54" fill="rgba(255, 224, 102, 0.14)" />
            <rect x="36" y="188" width="528" height="54" fill="rgba(255, 224, 102, 0.14)" />
            {[78, 132, 188, 242].map((ly) => (
              <line
                key={ly}
                x1="36"
                y1={ly}
                x2="564"
                y2={ly}
                stroke="rgba(255,248,196,0.48)"
                strokeWidth="1.4"
                strokeDasharray="6 5"
              />
            ))}
            <text x="515" y="108" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="rgba(255,244,179,0.9)">
              左肋部走廊
            </text>
            <text x="515" y="218" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="rgba(255,244,179,0.9)">
              右肋部走廊
            </text>
          </g>
        )}

        {/* 标准球场外框 */}
        <rect x="36" y="22" width="528" height="276" fill="none" stroke="rgba(255,255,255,0.82)" strokeWidth="2.4" />
        <line x1="300" y1="22" x2="300" y2="298" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
        <circle cx="300" cy="160" r="38" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
        <rect x="36" y="88" width="80" height="144" fill="none" stroke="rgba(255,255,255,0.78)" strokeWidth="2" />
        <rect x="484" y="88" width="80" height="144" fill="none" stroke="rgba(255,255,255,0.78)" strokeWidth="2" />

        {/* 阵型状态横幅 */}
        <rect x="44" y="28" width="248" height="22" rx="11" fill="rgba(22, 42, 30, 0.78)" />
        <text x="54" y="43" fontSize="11" fontWeight="700" fill="#ffe066">
          {attacking ? fm.atkShape : fm.defShape}
        </text>

        {/* 球员圆棋子平滑滑动 */}
        {fm.players.map((p) => {
          const [px, py] = attacking ? p.atk : p.def;
          const isSel = p.num === activePlayer.num;
          return (
            <g
              key={p.num}
              style={{
                cursor: 'pointer',
                transition: 'transform 460ms cubic-bezier(0.34, 1.4, 0.64, 1)',
              }}
              transform={`translate(${px}, ${py})`}
              onClick={() => setSelNum(p.num)}
            >
              {isSel && <circle r="22" fill="#ffe066" opacity="0.32" />}
              <circle
                r={isSel ? 15.5 : 13.5}
                fill={p.num === '1' ? '#2563eb' : isSel ? '#ff6b35' : '#e85d3f'}
                stroke={isSel ? '#ffe066' : '#ffffff'}
                strokeWidth={isSel ? 3.2 : 2.2}
              />
              <text y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
                {p.num}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="lab-verdict is-ok">
        <strong>
          👕 {activePlayer.role}（{fm.name}）
        </strong>
        <p>{activePlayer.duty}</p>
        <p className="lab-sub-note">💡 阵型要领：{fm.summary}</p>
      </div>
    </div>
  );
}
