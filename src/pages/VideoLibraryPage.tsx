import { useEffect, useMemo, useState } from 'react';
import { questionById } from '../content/catalog.ts';
import { VIDEO_RESOURCES } from '../content/videos/videos.ts';
import type { VideoAudience, VideoCategory, VideoKind } from '../data/types.ts';
import { LoadMore, usePaged } from '../components/LoadMore.tsx';

const PAGE_SIZE = 12;

const CATEGORIES: readonly { id: VideoCategory; emoji: string; hint: string }[] = [
  { id: '规则与裁判', emoji: '🟨', hint: '规则原文配合判罚讲解' },
  { id: '个人技术教学', emoji: '⚽', hint: '传接、盘带、射门、守门' },
  { id: '青训与亲子训练', emoji: '🧒', hint: '小场地游戏与在家练习' },
  { id: '运动医学与防伤', emoji: '🩹', hint: '热身、脑震荡识别、防伤' },
  { id: '战术分析', emoji: '♟️', hint: '阵型、跑位与比赛结构' },
  { id: '经典比赛', emoji: '🏟️', hint: '全场回放与官方集锦' },
  { id: '纪录片与人物', emoji: '🎞️', hint: '球队与球星的幕后故事' },
];

const AUDIENCES: readonly VideoAudience[] = ['亲子', '教练', '裁判', '球迷'];

const KIND_LABEL: Record<VideoKind, string> = {
  video: '单个视频',
  playlist: '播放列表',
  channel: '官方频道',
  'channel-search': '官方频道内检索',
  course: '免费课程',
  archive: '视频档案',
  documentary: '纪录片',
};

export function VideoLibraryPage({
  initialVideoId,
  onOpenQuestion,
  onBackHome,
}: {
  initialVideoId?: string;
  onOpenQuestion: (id: string) => void;
  onBackHome: () => void;
}) {
  const [cat, setCat] = useState<VideoCategory | 'all'>('all');
  const [audience, setAudience] = useState<VideoAudience | 'all'>('all');
  const [query, setQuery] = useState('');
  const [highlightId] = useState(initialVideoId);

  useEffect(() => {
    if (!highlightId) return;
    document.getElementById(`video-${highlightId}`)?.scrollIntoView({ block: 'center' });
  }, [highlightId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VIDEO_RESOURCES.filter((v) => {
      if (cat !== 'all' && v.category !== cat) return false;
      if (audience !== 'all' && !v.audience.includes(audience)) return false;
      if (!q) return true;
      return `${v.title} ${v.publisher} ${v.platform} ${v.summary} ${v.howToWatch} ${v.year ?? ''}`
        .toLowerCase()
        .includes(q);
    });
  }, [cat, audience, query]);

  // 按页面上的分组顺序排好再分批，分组标题跟着已显示的条目出现
  const ordered = useMemo(
    () => CATEGORIES.flatMap((c) => filtered.filter((v) => v.category === c.id)),
    [filtered]
  );
  const highlightAt = highlightId ? ordered.findIndex((v) => v.id === highlightId) + 1 : 0;
  const paged = usePaged(ordered.length, PAGE_SIZE, `${cat}|${audience}|${query.trim()}`, highlightAt);
  const visible = ordered.slice(0, paged.shown);

  const groups = CATEGORIES.map((c) => ({
    ...c,
    total: filtered.filter((v) => v.category === c.id).length,
    items: visible.filter((v) => v.category === c.id),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="subpage">
      <header className="page-top">
        <button type="button" className="back-pill" onClick={onBackHome}>
          ← 回到首页
        </button>
        <div className="page-head-meta">
          <span>
            教学视频 · 经典比赛 · 纪录片 · 共收录 {VIDEO_RESOURCES.length} 个视频资料
          </span>
          <h1>🎬 足球视频资料库</h1>
          <p className="page-sub">
            只收官方或版权方发布的视频，每条都写明适合谁看、看的时候盯住什么，并能跳回对应的问题接着读
          </p>
        </div>
      </header>

      <p className="video-access-note">
        🌐 YouTube 等境外平台在中国大陆可能无法直接打开；经典比赛和纪录片条目另附「B站搜索」入口，便于找到国内可看的版本；标注「免费注册」的需要先注册免费账号。
      </p>

      <div className="home-finder-bar">
        <label className="home-search">
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索视频：如 越位、FIFA 11+、伊斯坦布尔、梅西、守门员……"
            aria-label="搜索视频资料"
          />
          {query && (
            <button type="button" className="home-search-clear" onClick={() => setQuery('')}>
              ✕
            </button>
          )}
        </label>
      </div>

      <div className="age-filter-bar" role="group" aria-label="视频类别筛选">
        <button
          type="button"
          className={`age-pill ${cat === 'all' ? 'is-active' : ''}`}
          onClick={() => setCat('all')}
        >
          📚 全部 ({VIDEO_RESOURCES.length})
        </button>
        {CATEGORIES.map((c) => {
          const cnt = VIDEO_RESOURCES.filter((v) => v.category === c.id).length;
          if (cnt === 0) return null;
          return (
            <button
              key={c.id}
              type="button"
              className={`age-pill ${cat === c.id ? 'is-active' : ''}`}
              onClick={() => setCat(cat === c.id ? 'all' : c.id)}
            >
              {c.emoji} {c.id} ({cnt})
            </button>
          );
        })}
      </div>

      <div className="age-filter-bar" role="group" aria-label="适合人群筛选">
        <span className="video-filter-label">适合：</span>
        <button
          type="button"
          className={`age-pill ${audience === 'all' ? 'is-active' : ''}`}
          onClick={() => setAudience('all')}
        >
          所有人
        </button>
        {AUDIENCES.map((a) => (
          <button
            key={a}
            type="button"
            className={`age-pill ${audience === a ? 'is-active' : ''}`}
            onClick={() => setAudience(audience === a ? 'all' : a)}
          >
            {a}
          </button>
        ))}
      </div>

      {groups.length === 0 && <p className="video-empty">没有找到符合条件的视频，换个关键词试试。</p>}

      {groups.map((g) => (
        <section key={g.id} className="video-group" aria-label={g.id}>
          <h2 className="video-group-title">
            {g.emoji} {g.id}
            <small>
              {g.hint} · {g.total} 个
            </small>
          </h2>
          <div className="lexicon-grid">
            {g.items.map((v) => (
              <article
                key={v.id}
                id={`video-${v.id}`}
                className={`lex-card video-card ${highlightId === v.id ? 'is-highlighted' : ''}`}
              >
                <div className="lex-top">
                  <span className="lex-cat">{KIND_LABEL[v.kind]}</span>
                  <small className="lex-origin">
                    {v.level} · {v.access}
                  </small>
                </div>
                <h3>{v.title}</h3>
                <p className="video-meta">
                  {[v.publisher, v.platform, v.lang, v.year ? `${v.year} 年` : '', v.duration ?? '']
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                <p className="lex-detail">{v.summary}</p>
                <div className="lex-sign">
                  <strong>👀 怎么看：</strong>
                  {v.howToWatch}
                </div>
                <div className="video-actions">
                  <a className="video-watch-btn" href={v.url} target="_blank" rel="noopener noreferrer">
                    ▶ 打开（{v.platform}）
                  </a>
                  {v.altUrl && (
                    <a
                      className="video-watch-btn is-alt"
                      href={v.altUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔎 {v.altLabel ?? '备用入口'}
                    </a>
                  )}
                  <span className="video-audience">适合：{v.audience.join(' / ')}</span>
                </div>
                <div className="drill-links-row">
                  {v.relatedArticleIds.map((aid) => {
                    const q = questionById(aid);
                    if (!q) return null;
                    return (
                      <button
                        key={aid}
                        type="button"
                        className="mini-link-chip"
                        title={q.title}
                        onClick={() => onOpenQuestion(aid)}
                      >
                        📖 {q.title.length > 22 ? `${q.title.slice(0, 22)}…` : q.title}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <LoadMore
        shown={paged.shown}
        total={ordered.length}
        step={PAGE_SIZE}
        unit="个视频"
        onMore={paged.more}
        onAll={paged.all}
      />
    </div>
  );
}
