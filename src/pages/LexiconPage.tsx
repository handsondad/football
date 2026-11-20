import { useMemo, useState } from 'react';
import { LEXICON_TERMS } from '../content/lexicon/terms.ts';
import type { LexiconCategory } from '../data/types.ts';

const CATEGORIES: readonly LexiconCategory[] = [
  '战术模型与位置战',
  '数据球探与分析',
  '技术与运动生物力学',
  '青训教学法',
  '运动生理与医学',
  '规则与国际转会法',
  '足球历史与国际治理',
];

export function LexiconPage({
  initialTermId,
  onOpenQuestion,
  onBackHome,
}: {
  initialTermId?: string;
  onOpenQuestion: (id: string) => void;
  onBackHome: () => void;
}) {
  const [cat, setCat] = useState<LexiconCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const [highlightId] = useState(initialTermId);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LEXICON_TERMS.filter((item) => {
      if (cat !== 'all' && item.category !== cat) return false;
      if (!q) return true;
      return `${item.zh} ${item.en} ${item.summary} ${item.detail} ${item.origin ?? ''}`
        .toLowerCase()
        .includes(q);
    });
  }, [cat, query]);

  return (
    <div className="subpage">
      <header className="page-top">
        <button type="button" className="back-pill" onClick={onBackHome}>
          ← 回到首页
        </button>
        <div className="page-head-meta">
          <span>打通欧足联/拉玛西亚/英超原版术语壁垒 · 共收录 {LEXICON_TERMS.length} 个核心概念</span>
          <h1>📖 现代足球中英双语专业词典</h1>
          <p className="page-sub">
            每个词条不仅给出中英文精准定义与流派渊源，更标明「在球场看台上如何一眼认出它」并直连深度课题
          </p>
        </div>
      </header>

      <div className="home-finder-bar">
        <label className="home-search">
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="检索中英文术语：如 Half-Space、Scanning、xT、Packing、FUNiño、PHV、Article 19……"
            aria-label="检索专业术语"
          />
          {query && (
            <button type="button" className="home-search-clear" onClick={() => setQuery('')}>
              ✕
            </button>
          )}
        </label>
      </div>

      <div className="age-filter-bar" role="group" aria-label="术语领域筛选">
        <button
          type="button"
          className={`age-pill ${cat === 'all' ? 'is-active' : ''}`}
          onClick={() => setCat('all')}
        >
          📚 全部词条 ({LEXICON_TERMS.length})
        </button>
        {CATEGORIES.map((c) => {
          const cnt = LEXICON_TERMS.filter((t) => t.category === c).length;
          return (
            <button
              key={c}
              type="button"
              className={`age-pill ${cat === c ? 'is-active' : ''}`}
              onClick={() => setCat(cat === c ? 'all' : c)}
            >
              {c} ({cnt})
            </button>
          );
        })}
      </div>

      <div className="lexicon-grid">
        {filtered.map((term) => (
          <article
            key={term.id}
            id={`term-${term.id}`}
            className={`lex-card ${highlightId === term.id ? 'is-highlighted' : ''}`}
          >
            <div className="lex-top">
              <span className="lex-cat">{term.category}</span>
              {term.origin && <small className="lex-origin">{term.origin}</small>}
            </div>
            <h3>
              {term.zh}
              <span className="lex-en">{term.en}</span>
            </h3>
            <p className="lex-sum">{term.summary}</p>
            <p className="lex-detail">{term.detail}</p>
            <div className="lex-sign">
              <strong>👁️ 赛场识别信号：</strong>
              {term.onPitchSign}
            </div>
            <div className="drill-links-row">
              {term.relatedArticleIds.map((aid) => (
                <button
                  key={aid}
                  type="button"
                  className="mini-link-chip"
                  onClick={() => onOpenQuestion(aid)}
                >
                  📖 关联课题 #{aid} →
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
