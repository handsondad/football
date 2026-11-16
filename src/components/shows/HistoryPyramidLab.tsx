import { useState } from 'react';

type Era = {
  readonly id: string;
  readonly year: string;
  readonly name: string;
  readonly shape: string;
  /** 从门将到前锋，每条人数；渲染成「上宽下窄」的倒转金字塔 */
  readonly lines: readonly number[];
  readonly idea: string;
};

const ERAS: readonly Era[] = [
  {
    id: '1872',
    year: '1872',
    name: '苏格兰传球',
    shape: '2-2-6',
    lines: [1, 2, 2, 6],
    idea: '女王公园用短传代替英格兰的闷头带球。前锋仍然堆在最前面，但球开始找人。',
  },
  {
    id: 'pyramid',
    year: '1880s',
    name: '正金字塔',
    shape: '2-3-5',
    lines: [1, 2, 3, 5],
    idea: '古典默认阵型。两名后卫靠造越位（当时需要三名防守人）保护球门。',
  },
  {
    id: 'wm',
    year: '1925',
    name: '查普曼 WM',
    shape: '3-2-2-3',
    lines: [1, 3, 2, 2, 3],
    idea: '越位改为两名防守人后进球暴涨，中前卫撤回来当第三后卫，阵型看起来像 W 压着 M。',
  },
  {
    id: 'brazil',
    year: '1958',
    name: '巴西四后卫',
    shape: '4-2-4',
    lines: [1, 4, 2, 4],
    idea: '匈牙利伪九号打穿盯人 WM 之后，巴西用四名后卫加上两边的宽度拿下世界杯。',
  },
  {
    id: 'total',
    year: '1974',
    name: '全攻全守',
    shape: '4-3-3 流动',
    lines: [1, 4, 3, 3],
    idea: '人数看起来普通，人却不站死：谁前插，谁就补他的坑。空间在转，号码不转。',
  },
  {
    id: 'now',
    year: '2026',
    name: '动态位置战',
    shape: '3-2-5 / 4-4-2',
    lines: [1, 3, 2, 5],
    idea: '控球时边后卫内收，前场占满五条走廊；丢球则迅速收成两条四人线。同一套人，两张图。',
  },
];

export function HistoryPyramidLab() {
  const [eraId, setEraId] = useState<string>('now');
  const era = ERAS.find((item) => item.id === eraId) ?? ERAS[0];
  const maxLine = Math.max(...era.lines);

  return (
    <div className="history-pyramid">
      <div className="age-filter-bar" role="tablist" aria-label="选择战术年代">
        {ERAS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === era.id}
            className={`age-pill ${item.id === era.id ? 'is-active' : ''}`}
            onClick={() => setEraId(item.id)}
          >
            {item.year}
          </button>
        ))}
      </div>

      <div className="pyramid-stage" aria-label={`${era.year} ${era.name} ${era.shape}`}>
        {era.lines.map((count, lineIndex) => (
          <div key={`${era.id}-${lineIndex}`} className="pyramid-line">
            {Array.from({ length: count }, (_, playerIndex) => (
              <span
                key={playerIndex}
                className={`pyramid-dot ${lineIndex === 0 ? 'is-gk' : ''}`}
                style={{ opacity: 0.55 + (lineIndex / era.lines.length) * 0.45 }}
              />
            ))}
            <small>
              {count} 人
              {lineIndex === era.lines.length - 1 ? ' · 进攻方向 ↑' : ''}
            </small>
          </div>
        ))}
        <p className="pyramid-caption">
          最宽的一层有 {maxLine} 人。一百五十年里，最多的人从最前面慢慢撤到了中后场——所以叫「倒转金字塔」。
        </p>
      </div>

      <div className="pyramid-copy">
        <strong>
          {era.year} · {era.name} · {era.shape}
        </strong>
        <p>{era.idea}</p>
      </div>
    </div>
  );
}
