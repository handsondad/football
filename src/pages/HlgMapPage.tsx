import { useState, type CSSProperties } from 'react';
import { SourcesList } from '../components/Cite.tsx';
import {
  HLG_KIND_META,
  HLG_RESOURCES,
  type HlgResourceKind,
} from '../data/hlg-resources.ts';
import { SOURCE_BY_ID } from '../data/sources.ts';
import type { Source } from '../data/types.ts';

type Props = {
  onOpenQuestion: (id: string) => void;
  onBackHome: () => void;
};

export function HlgMapPage({ onOpenQuestion, onBackHome }: Props) {
  const [kindFilter, setKindFilter] = useState<HlgResourceKind | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string>(HLG_RESOURCES[0].id);

  const filtered =
    kindFilter === 'all' ? HLG_RESOURCES : HLG_RESOURCES.filter((r) => r.kind === kindFilter);

  const activeRes = HLG_RESOURCES.find((r) => r.id === selectedId) ?? HLG_RESOURCES[0];

  const pageSources: Source[] = [];
  const seenSrc = new Set<string>();
  for (const res of HLG_RESOURCES) {
    for (const cid of res.citeIds) {
      if (seenSrc.has(cid)) continue;
      seenSrc.add(cid);
      const found = SOURCE_BY_ID.get(cid);
      if (found) pageSources.push(found);
    }
  }

  return (
    <div className="subpage">
      <header className="page-top">
        <button type="button" className="back-pill" onClick={onBackHome}>
          ← 回到首页
        </button>
        <div className="page-head-meta">
          <span>回龙观 · 东小口/奥北 · 北清路 · 清河南岸肖家河与上地 20 分钟绿茵圈</span>
          <h1>📍 回龙观与京北足球资源地图</h1>
          <p className="page-sub">
            分类收录核实过的专业足球场、教育部全国校园足球特色学校、初高中足球特长生政策、青训基地与赛事注册信息
          </p>
        </div>
      </header>

      <div className="hlg-filter-row" role="group" aria-label="按资源类型筛选">
        <button
          type="button"
          className={`age-pill ${kindFilter === 'all' ? 'is-active' : ''}`}
          onClick={() => setKindFilter('all')}
        >
          🗺️ 全部收录（{HLG_RESOURCES.length}）
        </button>
        {(Object.keys(HLG_KIND_META) as HlgResourceKind[]).map((k) => {
          const meta = HLG_KIND_META[k];
          const cnt = HLG_RESOURCES.filter((r) => r.kind === k).length;
          return (
            <button
              key={k}
              type="button"
              className={`age-pill ${kindFilter === k ? 'is-active' : ''}`}
              style={{ '--pill-c': meta.color } as CSSProperties}
              onClick={() => setKindFilter(kindFilter === k ? 'all' : k)}
            >
              {meta.icon} {meta.label}（{cnt}）
            </button>
          );
        })}
      </div>

      {/* 回龙观—东小口—北清路—肖家河方位示意图 + 详情面板 */}
      <div className="hlg-radar-wrap">
        <div className="hlg-map-box">
          <svg
            className="hlg-map-svg"
            viewBox="0 0 1000 540"
            role="img"
            aria-label="回龙观及京北周边足球场地、特色学校与青训基地分布示意图"
          >
            <rect width="1000" height="540" rx="22" fill="#fbf5e8" />

            {/* 东侧东小口+奥北二期万亩森林绿楔 */}
            <path
              d="M665 180 Q830 155 950 225 Q965 385 845 430 Q685 435 655 320 Z"
              fill="#d8f3dc"
              stroke="#95d5b2"
              strokeWidth="2.5"
              strokeDasharray="8 6"
            />
            <text x="810" y="232" textAnchor="middle" fontSize="14.5" fontWeight="700" fill="#2d6a4f">
              🌲 东小口 · 奥北万亩森林球场群
            </text>

            {/* 回龙观中心公园绿块 */}
            <rect x="372" y="248" width="120" height="78" rx="16" fill="#d8f3dc" stroke="#74c69d" strokeWidth="2" />

            {/* 南侧清河水带（昌平回龙观 与 海淀上地/肖家河/奥森分界） */}
            <path
              d="M40 432 Q320 412 580 430 T960 442"
              fill="none"
              stroke="#90e0ef"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.7"
            />
            <text x="128" y="422" fontSize="12.5" fontWeight="700" fill="#0077b6">
              🌊 清河 / 北五环方向（南岸接海淀肖家河·上地·奥森）
            </text>

            {/* 主干路网：北清路、回龙观东西大街、G6京藏高速 */}
            <line x1="40" y1="95" x2="960" y2="95" stroke="#e9d8bc" strokeWidth="8" strokeLinecap="round" />
            <text x="860" y="82" fontSize="12.5" fill="#9c7e54" fontWeight="700">
              北清路 / 未来科学城方向
            </text>

            <line x1="60" y1="275" x2="920" y2="275" stroke="#eddcc4" strokeWidth="9" strokeLinecap="round" />
            <text x="505" y="266" fontSize="12.5" fill="#9c7e54" fontWeight="700">
              回龙观西大街 · 东大街
            </text>

            <path d="M115 24 L255 515" stroke="#f3c68f" strokeWidth="11" strokeLinecap="round" opacity="0.75" />
            <text x="108" y="54" fontSize="12.5" fill="#b46923" fontWeight="700">
              G6 京藏高速
            </text>

            {/* 地铁 13 号线 */}
            <path
              d="M145 408 Q280 368 455 372 T885 392"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4.5"
              strokeDasharray="11 6"
            />
            {[
              { name: '龙泽站', x: 205, y: 392 },
              { name: '回龙观站', x: 375, y: 373 },
              { name: '霍营站', x: 615, y: 376 },
            ].map((st) => (
              <g key={st.name} transform={`translate(${st.x}, ${st.y})`}>
                <circle r="5.5" fill="#fff" stroke="#d97706" strokeWidth="3" />
                <text y="18" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#92400e">
                  🚇 {st.name}
                </text>
              </g>
            ))}

            {/* 区域片区底纹 */}
            <text x="295" y="162" fontSize="20" fontWeight="700" fill="rgba(139,122,92,0.22)">
              龙域片区
            </text>
            <text x="530" y="148" fontSize="20" fontWeight="700" fill="rgba(139,122,92,0.22)">
              龙锦·科星片区
            </text>
            <text x="128" y="318" fontSize="19" fontWeight="700" fill="rgba(139,122,92,0.24)">
              二拨子
            </text>

            {/* 14个坐标泡泡 */}
            {HLG_RESOURCES.map((res) => {
              const meta = HLG_KIND_META[res.kind];
              const dimmed = kindFilter !== 'all' && res.kind !== kindFilter;
              const active = res.id === activeRes.id;
              return (
                <g
                  key={res.id}
                  transform={`translate(${res.mapX}, ${res.mapY})`}
                  style={{ cursor: 'pointer', opacity: dimmed ? 0.25 : 1 }}
                  onClick={() => setSelectedId(res.id)}
                >
                  {active && <circle r="28" fill={meta.color} opacity="0.24" />}
                  <circle
                    r={active ? 20 : 16.5}
                    fill="#ffffff"
                    stroke={meta.color}
                    strokeWidth={active ? 4 : 2.8}
                  />
                  <text y="5.5" textAnchor="middle" fontSize={active ? '17' : '14'}>
                    {res.emoji}
                  </text>
                  <rect
                    x={-66}
                    y={active ? 23 : 20}
                    width="132"
                    height="20"
                    rx="10"
                    fill={active ? meta.color : 'rgba(255,255,255,0.94)'}
                    stroke={meta.color}
                    strokeWidth="1.6"
                  />
                  <text
                    y={active ? 37 : 34}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={active ? '#ffffff' : '#4a3b2a'}
                  >
                    {res.short}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 右侧选中详情卡 */}
        <aside
          className="hlg-spot-card"
          style={{ '--c': HLG_KIND_META[activeRes.kind].color } as CSSProperties}
        >
          <span className="spot-badge">
            {HLG_KIND_META[activeRes.kind].icon} {HLG_KIND_META[activeRes.kind].label}
          </span>
          <h2>
            {activeRes.emoji} {activeRes.name}
          </h2>
          <p className="spot-area">📍 {activeRes.address}</p>
          <p className="spot-hi">📐 {activeRes.specs}</p>
          <p className="spot-summary">{activeRes.summary}</p>
          <ul className="spot-list">
            {activeRes.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <div className="spot-meta">
            <strong>📋 预约 / 政策要点：</strong>
            <span>{activeRes.bookingOrPolicy}</span>
          </div>
          <button
            type="button"
            className="spot-go-btn"
            onClick={() => onOpenQuestion(activeRes.relatedQuestionId)}
          >
            💬 阅读关联问答详解 →
          </button>
        </aside>
      </div>

      {/* 完整分类卡片清单 */}
      <section className="hlg-cards-sec" aria-label="回龙观与京北足球资源完整名录">
        <h2>🗂️ 完整资料名录（当前显示 {filtered.length} 项）</h2>
        <div className="qlist-grid">
          {filtered.map((res) => {
            const meta = HLG_KIND_META[res.kind];
            const isSel = res.id === activeRes.id;
            return (
              <button
                key={res.id}
                type="button"
                className={`qlist-card ${isSel ? 'is-selected-card' : ''}`}
                style={{ '--bubble': meta.color } as CSSProperties}
                onClick={() => setSelectedId(res.id)}
              >
                <strong>
                  {res.emoji} {res.name}
                </strong>
                <small className="qlist-trigger">📍 {res.address}</small>
                <small className="qlist-spec-line">{res.specs}</small>
                <span className="qlist-badges">
                  <em>
                    {meta.icon} {meta.label}
                  </em>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <SourcesList sources={pageSources} />
    </div>
  );
}
