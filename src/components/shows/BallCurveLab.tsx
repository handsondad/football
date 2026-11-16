import { useState } from 'react';

type ShotType = 'banana' | 'knuckle' | 'power';

const SHOTS: readonly {
  readonly id: ShotType;
  readonly badge: string;
  readonly title: string;
  readonly footSpot: string;
  readonly physics: string;
}[] = [
  {
    id: 'banana',
    badge: '🍌 内脚背弧线香蕉球',
    title: '马格努斯效应（Magnus Effect）：高速自转产生横向压强差',
    footSpot: '触球部位：大脚趾根斜上方「内脚背」快速搓擦足球外侧',
    physics: '球逆时针高速自转飞行：球左侧顺迎面气流加速→气压降低；球右侧逆气流减速→气压升高。高压把球推向低压侧，绕过人墙弯入死角！',
  },
  {
    id: 'knuckle',
    badge: '⚡ 无旋转飘忽电梯球',
    title: '卡门涡街与边界层乱流（Knuckleball）：零旋转引发尾流摆动与急坠',
    footSpot: '触球部位：锁死脚踝，用正脚背最硬楔骨短促击穿球心后瞬间收腿',
    physics: '球几乎不自转！空气流过球面拼块接缝时，球尾交替脱落不对称小气旋，推着球在空中左右诡异晃动并在门前突然下坠，门将极难判断手型！',
  },
  {
    id: 'power',
    badge: '🚀 正脚背直线重炮',
    title: '最高初速度动量传递：踝关节刚性锁死如铁锤击球',
    footSpot: '触球部位：脚尖竖直朝下绷紧，系鞋带正中央撞击足球正后方中心',
    physics: '大腿带动小腿快速鞭打，触球瞬间脚腕纹丝不动不泄力，皮球获得超百公里时速直线轰门，不给守门员留扑救反应时间！',
  },
];

export function BallCurveLab() {
  const [idx, setIdx] = useState(0);
  const shot = SHOTS[idx];

  return (
    <div className="lab-card" aria-label="足球飞行空气动力学风洞">
      <div className="lab-head">
        <strong>🌬️ 俯视空气动力学风洞：三种射门为什么走出完全不同的轨迹？</strong>
      </div>

      <div className="lab-tabs">
        {SHOTS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`lab-tab ${i === idx ? 'is-active' : ''}`}
            onClick={() => setIdx(i)}
          >
            {s.badge}
          </button>
        ))}
      </div>

      <svg className="pitch-svg" viewBox="0 0 600 245" role="img" aria-label={shot.title}>
        <rect width="600" height="245" fill="#2b6e44" />
        {/* 禁区与球门俯视图（右侧为球门） */}
        <rect x="440" y="32" width="125" height="181" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="2" />
        <rect x="565" y="88" width="16" height="69" fill="rgba(255,255,255,0.3)" stroke="#fff" strokeWidth="3" />

        {/* 四人防守人墙 */}
        {[112, 128, 144, 160].map((wy, i) => (
          <circle key={i} cx="285" cy={wy} r="9" fill="#2563eb" stroke="#fff" strokeWidth="2" />
        ))}
        <text x="285" y="184" textAnchor="middle" fontSize="11" fill="#dbeafe" fontWeight="700">
          9.15m人墙
        </text>

        {/* 门将 */}
        <circle cx="548" cy="128" r="10.5" fill="#f59e0b" stroke="#fff" strokeWidth="2.2" />
        <text x="548" y="132" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">GK</text>

        {/* 主罚点 */}
        <circle cx="95" cy="142" r="9" fill="#fff" stroke="#111" strokeWidth="2" />

        {shot.id === 'banana' && (
          <g>
            {/* 右侧绕过人墙再大幅左拐钻入上角 */}
            <path
              d="M 104 142 Q 305 225 562 96"
              fill="none"
              stroke="#ffe066"
              strokeWidth="4"
              strokeDasharray="9 5"
            />
            <circle cx="355" cy="176" r="13" fill="#fff" stroke="#111" strokeWidth="2" />
            <path d="M 342 162 A 18 18 0 1 0 368 190" fill="none" stroke="#ff6b6b" strokeWidth="2.5" />
            <text x="355" y="148" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#bbf7d0">
              低压区（流速快）↑ 推球拐弯
            </text>
            <text x="355" y="212" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#fecaca">
              高压区（迎风受阻）
            </text>
          </g>
        )}

        {shot.id === 'knuckle' && (
          <g>
            {/* 越过人墙顶左右S摆动飘忽入网 */}
            <path
              d="M 104 142 C 210 126, 285 92, 365 118 S 475 74, 562 104"
              fill="none"
              stroke="#67e8f9"
              strokeWidth="4"
              strokeDasharray="8 5"
            />
            <circle cx="385" cy="112" r="12" fill="#fff" stroke="#111" strokeWidth="2" />
            <circle cx="356" cy="103" r="6" fill="none" stroke="#a5f3fc" strokeWidth="2" strokeDasharray="3 2" />
            <circle cx="342" cy="120" r="7.5" fill="none" stroke="#a5f3fc" strokeWidth="2" strokeDasharray="3 2" />
            <text x="385" y="76" textAnchor="middle" fontSize="12" fontWeight="700" fill="#cffafe">
              球体近乎不转 · 尾部涡街交替脱落使球左右乱飘急坠！
            </text>
          </g>
        )}

        {shot.id === 'power' && (
          <g>
            {/* 从人墙外侧缝隙笔直爆射远角 */}
            <line
              x1="104"
              y1="142"
              x2="562"
              y2="148"
              stroke="#fb923c"
              strokeWidth="4.5"
            />
            <circle cx="370" cy="145" r="12" fill="#fff" stroke="#111" strokeWidth="2" />
            <text x="370" y="122" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fed7aa">
              锁死脚踝正击球心 · 初速超 100 km/h 贴地斩/重炮！
            </text>
          </g>
        )}
      </svg>

      <div className="lab-verdict is-ok">
        <strong>{shot.title}</strong>
        <p>{shot.footSpot}</p>
        <p className="lab-sub-note">{shot.physics}</p>
      </div>
    </div>
  );
}
