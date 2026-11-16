import { useState } from 'react';
import { AnalyticsLab } from '../components/shows/AnalyticsLab.tsx';
import { BallCurveLab } from '../components/shows/BallCurveLab.tsx';
import { FormationsLab } from '../components/shows/FormationsLab.tsx';
import { FuninoLab } from '../components/shows/FuninoLab.tsx';
import { OffsideLab } from '../components/shows/OffsideLab.tsx';
import { PitchAnatomyLab } from '../components/shows/PitchAnatomyLab.tsx';
import { PitchLab } from '../components/shows/PitchLab.tsx';
import { HistoryPyramidLab } from '../components/shows/HistoryPyramidLab.tsx';
import { RefereeClaLab } from '../components/shows/RefereeClaLab.tsx';
import { ScanningLab } from '../components/shows/ShowView.tsx';

type LabTabId =
  | 'offside'
  | 'roles'
  | 'formations'
  | 'analytics'
  | 'funino'
  | 'referee-cla'
  | 'scanning'
  | 'triangles'
  | 'formats'
  | 'anatomy'
  | 'curve'
  | 'history';

const LAB_ITEMS: readonly {
  readonly id: LabTabId;
  readonly badge: string;
  readonly title: string;
  readonly relatedQid: string;
  readonly relatedLabel: string;
}[] = [
  {
    id: 'offside',
    badge: '🚩 互动越位模拟器',
    title: '切换「反越位好球 / 经典越位 / 球后横传 / 本方半场启动 / 界外球豁免」五种情景，一键对比「传球触球瞬间定格帧」与「出球后前插」',
    relatedQid: 'offside-rule',
    relatedLabel: '打开关联问题：IFAB 第11章越位空间压缩机制与 SAOT',
  },
  {
    id: 'roles',
    badge: '👕 1–11号位置职责热区',
    title: '绿茵战术板（角色模式）：点击 1-4-3-3 球衣号码，查看现代清道夫门卫、出球中卫、6号单枢纽、8/10号与锋线三叉戟活动热区',
    relatedQid: 'numbers-roles',
    relatedLabel: '打开关联问题：1–11号职能谱系与现代混合角色演进',
  },
  {
    id: 'formations',
    badge: '🧠 阵型动态攻防推演',
    title: '切换 1-4-3-3 / 1-4-2-3-1 / 1-4-4-2 / 8人制，观察控球展开变 3-2-5 占满五走廊肋部与无球 4-5-1 落位变形',
    relatedQid: 'formations-war',
    relatedLabel: '打开关联问题：静态阵型与动态比赛结构博弈',
  },
  {
    id: 'analytics',
    badge: '📊 xG 与 xT/Packing 沙盘',
    title: '现代数据球探实验台：对比不同射门点期望进球概率（xG），直观计算破线直塞的期望威胁增量（ΔxT）与绕过防守人数（Packing）',
    relatedQid: 'football-analytics',
    relatedLabel: '打开关联问题：xG、xT、Packing 与 PPDA 数据科学',
  },
  {
    id: 'funino',
    badge: '🎯 FUNiño 四球门3v3',
    title: 'Horst Wein 儿童比赛智能模型：观察四座宽球门与 6m 射门区如何无需教练吼叫天然逼出宽度利用与弱侧转移',
    relatedQid: 'funino-session',
    relatedLabel: '打开关联问题：FUNiño 四球门与 GAG 三明治课表设计',
  },
  {
    id: 'referee-cla',
    badge: '🧑‍⚖️ 场地配平与客串裁判',
    title: '草坪实操双模沙盘：动态调节不同年龄段 4v2 抢圈标志盘边长（CLA 6–10脚甜点区），并演练主裁 S 型对角线跑位与边裁越位齐平视线',
    relatedQid: 'drill-space-tuning',
    relatedLabel: '打开关联问题：CLA 场地人数动态配平与客串裁判对角线跑位',
  },
  {
    id: 'scanning',
    badge: '👀 抬头扫描视野模拟器',
    title: '对比接球前有无回头观察带来的 360° 空间盲区差异，一键播放「接球转身下一秒」直塞肋部或迎头被断结果',
    relatedQid: 'spaces-scan',
    relatedLabel: '打开关联问题：英超视觉扫描（Scanning）实证与五走廊肋部',
  },
  {
    id: 'triangles',
    badge: '🔺 菱形双三角抢圈板',
    title: '绿茵战术板（接应模式）：对比「扁平站位被防守阴影锁死」与「菱形双三角支援」，点击任意队友即可传球遛猴！',
    relatedQid: 'triangles-rondo',
    relatedLabel: '打开关联问题：防守阴影几何学、第三人跑位与 La Pausa',
  },
  {
    id: 'formats',
    badge: '📐 5v5 / 8v8 / 11v11 叠放',
    title: '绿茵战术板（赛制模式）：按真实比例同屏叠放对比三个年龄段的球场面积、球号与球门高宽缩放',
    relatedQid: 'golden-age',
    relatedLabel: '打开关联问题：U9–U12 神经敏感期与赛制几何同构过渡',
  },
  {
    id: 'anatomy',
    badge: '🏟️ 105×68m 球场标线密码',
    title: '点击罚球弧（9.15m）、大小禁区、中圈、标准球门与角球弧，查看英制几何推导与门线正交投影判据',
    relatedQid: 'pitch-lines',
    relatedLabel: '打开关联问题：IFAB 第1章球场几何工程与整体越线',
  },
  {
    id: 'history',
    badge: '🏛️ 倒转金字塔',
    title: '从 1872 年苏格兰 2-2-6 到 2026 年动态 3-2-5：点选年代，看前锋一层层撤回来，后场人数怎样变厚',
    relatedQid: 'pyramid-inversion',
    relatedLabel: '打开关联问题：百年阵型倒转金字塔',
  },
  {
    id: 'curve',
    badge: '🍌 香蕉球与电梯球风洞',
    title: '空气动力学俯视风洞：对比高速自转马格努斯弧线球、无旋转卡门涡街电梯球与锁踝重炮轨迹',
    relatedQid: 'ball-flight',
    relatedLabel: '打开关联问题：马格努斯升力、阻力危机与无旋电梯球力学',
  },
];

export function TacticsLabPage({
  onOpenQuestion,
  onBackHome,
}: {
  onOpenQuestion: (id: string) => void;
  onBackHome: () => void;
}) {
  const [tab, setTab] = useState<LabTabId>('offside');
  const active = LAB_ITEMS.find((x) => x.id === tab) ?? LAB_ITEMS[0];

  return (
    <div className="subpage">
      <header className="page-top">
        <button type="button" className="back-pill" onClick={onBackHome}>
          ← 回到首页
        </button>
        <div className="page-head-meta">
          <span>规则边界 · 位置战几何 · 草坪配平与执裁 · 数据球探模型 · 空气动力学 — 共 12 台交互绿茵模拟器</span>
          <h1>🎛️ 绿茵战术、规则与数据沙盘</h1>
        </div>
      </header>

      <div className="age-filter-bar" role="tablist" aria-label="选择沙盘模拟器">
        {LAB_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === tab}
            className={`age-pill ${item.id === tab ? 'is-active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.badge}
          </button>
        ))}
      </div>

      <section className="sandbox-panel">
        <p className="sandbox-desc">{active.title}</p>

        {tab === 'offside' && <OffsideLab />}
        {tab === 'roles' && <PitchLab mode="roles" />}
        {tab === 'formations' && <FormationsLab />}
        {tab === 'analytics' && <AnalyticsLab />}
        {tab === 'funino' && <FuninoLab />}
        {tab === 'referee-cla' && <RefereeClaLab />}
        {tab === 'scanning' && <ScanningLab />}
        {tab === 'triangles' && <PitchLab mode="triangles" />}
        {tab === 'formats' && <PitchLab mode="formats" />}
        {tab === 'anatomy' && <PitchAnatomyLab />}
        {tab === 'curve' && <BallCurveLab />}
        {tab === 'history' && <HistoryPyramidLab />}

        <div className="sandbox-foot">
          <button
            type="button"
            className="spot-go-btn"
            onClick={() => onOpenQuestion(active.relatedQid)}
          >
            🎓 {active.relatedLabel} →
          </button>
        </div>
      </section>
    </div>
  );
}
