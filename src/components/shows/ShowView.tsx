import { useState, type CSSProperties } from 'react';
import { Cite } from '../Cite.tsx';
import type { Show } from '../../data/types.ts';
import { AnalyticsLab } from './AnalyticsLab.tsx';
import { BallCurveLab } from './BallCurveLab.tsx';
import { FormationsLab } from './FormationsLab.tsx';
import { FuninoLab } from './FuninoLab.tsx';
import { HistoryPyramidLab } from './HistoryPyramidLab.tsx';
import { OffsideLab } from './OffsideLab.tsx';
import { PitchAnatomyLab } from './PitchAnatomyLab.tsx';
import { PitchLab } from './PitchLab.tsx';
import { RefereeClaLab } from './RefereeClaLab.tsx';

export function ScanningLab() {
  const [scanned, setScanned] = useState(true);
  const [playedNext, setPlayedNext] = useState(false);

  const ballX = !playedNext ? 205 : scanned ? 420 : 335;
  const ballY = !playedNext ? 125 : scanned ? 62 : 148;
  const defX = !playedNext ? 348 : scanned ? 312 : 302;
  const defY = !playedNext ? 152 : scanned ? 136 : 132;

  return (
    <div className="lab-card" aria-label="抬头扫描视野模拟器">
      <div className="lab-head">
        <strong>👀 抬头扫描视野模拟器：接球前那 0.5 秒有无回头观察的空间盲区差异</strong>
        <button
          type="button"
          className={`lab-moment-btn ${playedNext ? 'is-after' : ''}`}
          onClick={() => setPlayedNext((v) => !v)}
        >
          {playedNext ? '⏪ 重置到「来球滚动途中」' : '▶️ 模拟「接球转身下一秒」结果'}
        </button>
      </div>
      <div className="lab-tabs">
        <button
          type="button"
          className={`lab-tab ${scanned ? 'is-active' : ''}`}
          onClick={() => {
            setScanned(true);
            setPlayedNext(false);
          }}
        >
          ✅ 接球前回头扫描 2 次（360° 全景活地图）
        </button>
        <button
          type="button"
          className={`lab-tab ${!scanned ? 'is-active' : ''}`}
          onClick={() => {
            setScanned(false);
            setPlayedNext(false);
          }}
        >
          ❌ 死盯来球不回头（身后 180° 全是黑盲区）
        </button>
      </div>

      <svg className="pitch-svg" viewBox="0 0 600 240">
        <rect width="600" height="240" fill="#3da65c" />
        {!scanned && !playedNext && (
          <rect x="285" y="0" width="315" height="240" fill="rgba(18, 24, 20, 0.78)" />
        )}
        {scanned && (
          <circle
            cx="285"
            cy="125"
            r="105"
            fill="rgba(255, 236, 153, 0.22)"
            stroke="#ffe066"
            strokeWidth="2.5"
            strokeDasharray="6 5"
          />
        )}

        {/* 左路传球边卫 */}
        <circle cx="115" cy="125" r="13" fill="#ff9f43" stroke="#fff" strokeWidth="2.4" />
        <text x="115" y="129" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
          边卫
        </text>
        <line x1="130" y1="125" x2="268" y2="125" stroke="#fff" strokeWidth="2.5" strokeDasharray="6 4" />

        {/* 10号接球中场 */}
        <circle cx="285" cy="125" r="15" fill="#ff6b4a" stroke="#ffe066" strokeWidth="3" />
        <text x="285" y="129" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
          10
        </text>

        {/* 身后逼抢对手 + 左肋部空当队友 */}
        <g opacity={scanned || playedNext ? 1 : 0.22}>
          <g
            style={{ transition: 'transform 360ms cubic-bezier(0.34, 1.4, 0.64, 1)' }}
            transform={`translate(${defX}, ${defY})`}
          >
            <circle r="13" fill={playedNext && !scanned ? '#dc2626' : '#2563eb'} stroke="#fff" strokeWidth="2.2" />
            <text y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
              {playedNext && !scanned ? '断球!' : '逼抢'}
            </text>
          </g>

          <circle cx="435" cy="58" r="14" fill="#ff9f43" stroke="#fff" strokeWidth="2.5" />
          <text x="435" y="62" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
            肋部!
          </text>
          {scanned && (
            <path
              d="M298 114 Q360 72 418 60"
              fill="none"
              stroke="#ffe066"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
          )}
        </g>

        {/* 滚动的足球 */}
        <g
          style={{ transition: 'transform 380ms cubic-bezier(0.34, 1.4, 0.64, 1)' }}
          transform={`translate(${ballX}, ${ballY})`}
        >
          <circle r="6.8" fill="#fff" stroke="#111" strokeWidth="1.8" />
        </g>

        {!scanned && !playedNext && (
          <text x="445" y="128" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fde68a">
            ❓ 身后盲区：不知追兵与肋部空当
          </text>
        )}
      </svg>

      <div className={`lab-verdict ${scanned ? 'is-ok' : 'is-offside'}`}>
        <strong>
          {scanned
            ? playedNext
              ? '✅ 一脚打穿！因提前拍下身后全景照，10号顺势往左上领球直接塞给肋部空当队友！'
              : '✅ 趁球在路上滚已瞥见右后方逼抢和左肋部空当（点击右上按钮看接球下一秒结果）'
            : playedNext
              ? '❌ 盲目转身撞枪口！10号没看身后，停球往右一转直接被扑上来的防守队员断走打反击！'
              : '❌ 全程死盯来球，脑海里身后一片漆黑（点击右上按钮看盲目转身后果）'}
        </strong>
      </div>
    </div>
  );
}

function RulerView({ show }: { show: Extract<Show, { kind: 'ruler' }> }) {
  const [idx, setIdx] = useState(0);
  const marks = show.marks;
  const active = marks[idx] ?? marks[0];
  const min = marks[0].at;
  const max = marks[marks.length - 1].at;

  const posOf = (i: number, at: number) => {
    if (show.even || max === min) {
      return marks.length === 1 ? 50 : 8 + (i / (marks.length - 1)) * 84;
    }
    return 8 + ((at - min) / (max - min)) * 84;
  };

  return (
    <div className="show-ruler" aria-label="标尺图解">
      <div className="ruler-track">
        <div className="ruler-bar" />
        {marks.map((m, i) => (
          <button
            key={`${m.at}-${m.name}`}
            type="button"
            className={`ruler-pin ${i === idx ? 'is-active' : ''}`}
            style={{ left: `${posOf(i, m.at)}%` }}
            onClick={() => setIdx(i)}
          >
            <span className="ruler-icon" aria-hidden="true">
              {m.icon}
            </span>
            <span className="ruler-at">
              {m.at}
              {show.unit}
            </span>
          </button>
        ))}
      </div>
      <div className="ruler-card">
        <strong>
          {active.icon} {active.at}
          {show.unit} · {active.name}
        </strong>
        <p>
          {active.text}
          <Cite ids={active.cite} />
        </p>
      </div>
    </div>
  );
}

export function ShowView({ show }: { show: Show }) {
  switch (show.kind) {
    case 'steps':
      return (
        <ol className="qa-steps" aria-label="步骤图解">
          {show.frames.map((frame, index) => (
            <li key={frame.label} style={{ '--i': index } as CSSProperties}>
              <span aria-hidden="true">{frame.icon}</span>
              <small>{frame.label}</small>
            </li>
          ))}
        </ol>
      );

    case 'numbers':
      return (
        <div className="show-numbers">
          {show.items.map((item) => (
            <div key={item.label} className="num-card">
              <div className="num-val">
                <b>{item.value}</b>
                <span>{item.unit}</span>
              </div>
              <small>{item.label}</small>
            </div>
          ))}
        </div>
      );

    case 'bars': {
      const maxVal = Math.max(...show.items.map((x) => x.value), 1);
      return (
        <div className="show-bars">
          {show.items.map((item) => (
            <div key={item.label} className="bar-row">
              <div className="bar-head">
                <span>
                  {item.icon} {item.label}
                </span>
                <b>{item.text ?? `${item.value} ${show.unit}`}</b>
              </div>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${Math.max(6, (item.value / maxVal) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    case 'compare':
      return (
        <div className="show-compare">
          <div className="cmp-head">
            <span className="is-bad">{show.badTitle}</span>
            <span className="is-good">{show.goodTitle}</span>
          </div>
          {show.rows.map((row, idx) => (
            <div key={idx} className="cmp-row">
              <div className="cmp-cell is-bad">{row.bad}</div>
              <div className="cmp-cell is-good">{row.good}</div>
            </div>
          ))}
        </div>
      );

    case 'ruler':
      return <RulerView show={show} />;

    case 'pitch-anatomy':
      return <PitchAnatomyLab />;

    case 'pitch-formats':
      return <PitchLab mode="formats" />;

    case 'pitch-roles':
      return <PitchLab mode="roles" />;

    case 'offside':
      return <OffsideLab />;

    case 'formations':
      return <FormationsLab />;

    case 'triangles':
      return <PitchLab mode="triangles" />;

    case 'scanning':
      return <ScanningLab />;

    case 'ball-curve':
      return <BallCurveLab />;

    case 'analytics-xg':
      return <AnalyticsLab />;

    case 'funino':
      return <FuninoLab />;

    case 'history-pyramid':
      return <HistoryPyramidLab />;

    case 'referee-cla':
      return <RefereeClaLab />;
  }
}
