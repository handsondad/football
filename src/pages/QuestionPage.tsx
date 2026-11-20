import { useEffect, useMemo, type CSSProperties, type ReactNode } from 'react';
import { Avatar, CHARACTER_NAMES, type CharacterId } from '../components/Avatar.tsx';
import { Cite, SourcesContext, SourcesList } from '../components/Cite.tsx';
import { ShowView } from '../components/shows/ShowView.tsx';
import {
  difficultyLabel,
  linkedQuestions,
  nextQuestions,
  questionsIn,
  topicById,
  type DialogueTurn,
  type FootballQuestion,
  type ReadLens,
} from '../content/catalog.ts';
import { DRILL_BY_ID } from '../content/drills/drills.ts';
import { LEXICON_BY_ID } from '../content/lexicon/terms.ts';
import { prefetchQuestion } from '../content/load.ts';
import { videosForArticle } from '../content/videos/videos.ts';
import { SOURCE_BY_ID } from '../data/sources.ts';
import type { Source } from '../data/types.ts';

type Props = {
  question: FootballQuestion;
  heard: readonly string[];
  lens: ReadLens;
  onChangeLens: (lens: ReadLens) => void;
  onHeard: (id: string) => void;
  onBack: () => void;
  onOpenQuestion: (id: string) => void;
  onOpenDrill: (drillId: string) => void;
  onOpenTerm: (termId: string) => void;
  onOpenVideo: (videoId: string) => void;
};

function collectTurnCites(turn: DialogueTurn): readonly string[] {
  const rulerCites =
    turn.show?.kind === 'ruler' ? turn.show.marks.flatMap((m) => m.cite ?? []) : [];
  return [...(turn.cite ?? []), ...rulerCites];
}

function resolveQuestionSources(question: FootballQuestion): readonly Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  const allIds = [
    ...question.dialogue.flatMap(collectTurnCites),
    ...(question.proDeepDive.citeIds ?? []),
  ];
  for (const id of allIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    const src = SOURCE_BY_ID.get(id);
    if (src) out.push(src);
  }
  return out;
}

function Bubble({
  who,
  index,
  children,
}: {
  who: CharacterId;
  index: number;
  children: ReactNode;
}) {
  return (
    <div className={`qa-line is-${who}`} style={{ '--i': index } as CSSProperties}>
      <span className="qa-avatar">
        <Avatar who={who} />
      </span>
      <div className="qa-bubble">
        <span className="qa-name">{CHARACTER_NAMES[who]}</span>
        {children}
      </div>
    </div>
  );
}

export function QuestionPage({
  question,
  heard,
  lens,
  onChangeLens,
  onHeard,
  onBack,
  onOpenQuestion,
  onOpenDrill,
  onOpenTerm,
  onOpenVideo,
}: Props) {
  const topic = topicById(question.topic);
  const siblings = useMemo(() => questionsIn(question.topic), [question.topic]);
  const curIdx = siblings.findIndex((q) => q.id === question.id);
  const prevQ = curIdx > 0 ? siblings[curIdx - 1] : undefined;
  const nextQ = curIdx >= 0 && curIdx < siblings.length - 1 ? siblings[curIdx + 1] : undefined;
  const sources = useMemo(() => resolveQuestionSources(question), [question]);

  useEffect(() => {
    onHeard(question.id);
  }, [question.id, onHeard]);

  const relatedSame = nextQuestions(question, 3);
  const relatedCross = linkedQuestions(question, 4);
  const pro = question.proDeepDive;

  const linkedTerms = (pro.lexiconIds ?? [])
    .map((id) => LEXICON_BY_ID.get(id))
    .filter((x) => Boolean(x));
  const linkedDrills = (pro.drillIds ?? [])
    .map((id) => DRILL_BY_ID.get(id))
    .filter((x) => Boolean(x));
  const linkedVideos = videosForArticle(question.id);

  const embeddedInteractiveShows = useMemo(
    () =>
      question.dialogue
        .map((t) => t.show)
        .filter(
          (s): s is NonNullable<typeof s> =>
            Boolean(s) && !['steps', 'numbers'].includes(s!.kind)
        ),
    [question]
  );

  return (
    <div className="qa" style={{ '--bubble': topic?.color ?? '#2fb36d' } as CSSProperties}>
      <div className="qa-topbar">
        <button type="button" className="back-pill" onClick={onBack}>
          ← {topic?.emoji} {topic?.title}
        </button>
        <div className="qa-topbar-actions">
          {prevQ && (
            <button
              type="button"
              className="nav-mini-btn"
              onClick={() => onOpenQuestion(prevQ.id)}
              title={prevQ.title}
            >
              ‹ 上一题
            </button>
          )}
          {nextQ && (
            <button
              type="button"
              className="nav-mini-btn"
              onClick={() => onOpenQuestion(nextQ.id)}
              title={nextQ.title}
            >
              下一题 ›
            </button>
          )}
        </div>
      </div>

      <header className="qa-header">
        <div className="qa-meta-row">
          <span className="meta-chip">{difficultyLabel[question.difficulty]}</span>
          {question.tags.map((tag) => (
            <span key={tag} className="meta-chip is-ring">
              {tag}
            </span>
          ))}
          {heard.includes(question.id) && <span className="meta-chip is-done">⭐ 看过</span>}
        </div>
        <h1>{question.title}</h1>
        <p className="qa-pro-subtitle">{question.proSubtitle}</p>

        <div className="lens-switcher" role="group" aria-label="显示内容切换">
          <span className="lens-label">内容显示：</span>
          <button
            type="button"
            className={`lens-btn ${lens === 'dual' ? 'is-active' : ''}`}
            onClick={() => onChangeLens('dual')}
          >
            全部内容
          </button>
          <button
            type="button"
            className={`lens-btn ${lens === 'pro' ? 'is-active' : ''}`}
            onClick={() => onChangeLens('pro')}
          >
            专业详解
          </button>
          <button
            type="button"
            className={`lens-btn ${lens === 'kid' ? 'is-active' : ''}`}
            onClick={() => onChangeLens('kid')}
          >
            父子问答
          </button>
        </div>
      </header>

      <SourcesContext.Provider value={sources}>
        <main className="qa-main">
          {lens !== 'pro' && (
            <section className="layer-kid" aria-label="小念和爸爸的问答">
              <p className="qa-scene">
                <span aria-hidden="true">📍</span>
                {question.trigger}
              </p>

              <div className="qa-chat">
                {question.dialogue.map((turn, index) => (
                  <div key={index} className="qa-turn">
                    <Bubble who="nian" index={index * 2}>
                      <p>{turn.nian}</p>
                    </Bubble>
                    <Bubble who="dad" index={index * 2 + 1}>
                      <p>
                        {turn.dad}
                        <Cite ids={turn.cite} />
                      </p>
                      {turn.show && <ShowView show={turn.show} />}
                    </Bubble>
                  </div>
                ))}
              </div>
            </section>
          )}

          {lens === 'pro' && embeddedInteractiveShows.length > 0 && (
            <div className="pro-embedded-labs">
              {embeddedInteractiveShows.map((sh, i) => (
                <ShowView key={i} show={sh} />
              ))}
            </div>
          )}

          {lens !== 'kid' && (
            <section className="pro-deep-panel" aria-labelledby="pro-deep-heading">
              <div className="pro-panel-banner">
                <div>
                  <h2 id="pro-deep-heading">📘 {question.proSubtitle}</h2>
                </div>
                <Cite ids={pro.citeIds} />
              </div>

              <blockquote className="pro-thesis">
                <strong>核心要点：</strong>
                {pro.thesis}
              </blockquote>

              <div className="pro-sections">
                {pro.sections.map((sec) => (
                  <div key={sec.heading} className="pro-sec-card">
                    <h3>{sec.heading}</h3>
                    <p>{sec.content}</p>
                  </div>
                ))}
              </div>

              <div className="pro-kpi-block">
                <h3>📊 关键数据与评估指标</h3>
                <div className="pro-kpi-grid">
                  {pro.kpis.map((k) => (
                    <div key={k.metric} className="kpi-card">
                      <small>{k.metric}</small>
                      <strong>{k.target}</strong>
                      <p>{k.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pro-rx-box">
                <div className="rx-head">
                  <h3>📋 训练与实操方法：{pro.prescription.name}</h3>
                  <span>{pro.prescription.spec}</span>
                </div>
                <p className="rx-method">{pro.prescription.method}</p>
                <ul className="rx-cues">
                  {pro.prescription.cues.map((c) => (
                    <li key={c}>💡 {c}</li>
                  ))}
                </ul>
              </div>

              <div className="pro-pitfalls">
                <h3>⚠️ 常见误区与注意事项</h3>
                <ul>
                  {pro.pitfalls.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>

              {(linkedDrills.length > 0 || linkedTerms.length > 0) && (
                <div className="pro-cross-chips">
                  {linkedDrills.map((d) =>
                    d ? (
                      <button
                        key={d.id}
                        type="button"
                        className="pro-link-pill is-drill"
                        onClick={() => onOpenDrill(d.id)}
                      >
                        📋 训练教案 {d.code}：{d.title} →
                      </button>
                    ) : null
                  )}
                  {linkedTerms.map((t) =>
                    t ? (
                      <button
                        key={t.id}
                        type="button"
                        className="pro-link-pill is-term"
                        onClick={() => onOpenTerm(t.id)}
                      >
                        📖 专业术语：{t.zh} ({t.en}) →
                      </button>
                    ) : null
                  )}
                </div>
              )}
            </section>
          )}

          <section className="qa-wrap" aria-label="延伸阅读">
            {linkedVideos.length > 0 && (
              <div className="qa-videos">
                <h3>🎬 配套视频</h3>
                <div className="pro-cross-chips">
                  {linkedVideos.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className="pro-link-pill is-video"
                      onClick={() => onOpenVideo(v.id)}
                    >
                      ▶ {v.title} · {v.publisher}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {relatedSame.length > 0 && (
              <div className="qa-related">
                <h3>
                  <Avatar who="nian" /> 小念还想问
                </h3>
                {relatedSame.map((item) => (
                  <button key={item.id} type="button" onClick={() => onOpenQuestion(item.id)}>
                    <div>
                      <strong>{item.title}</strong>
                      <small className="rel-sub">{item.proSubtitle}</small>
                    </div>
                    {heard.includes(item.id) && <em>⭐ 看过</em>}
                  </button>
                ))}
              </div>
            )}

            {relatedCross.length > 0 && (
              <div className="qa-related is-cross">
                <h3>🔗 关联足球问题</h3>
                {relatedCross.map((item) => {
                  const otherTopic = topicById(item.topic);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onOpenQuestion(item.id)}
                      onPointerEnter={() => prefetchQuestion(item.id)}
                      onFocus={() => prefetchQuestion(item.id)}
                    >
                      {otherTopic && (
                        <span className="qa-cross-tag">
                          {otherTopic.emoji} {otherTopic.short}
                        </span>
                      )}
                      <div>
                        <strong>{item.title}</strong>
                        <small className="rel-sub">{item.proSubtitle}</small>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <SourcesList sources={sources} />
        </main>
      </SourcesContext.Provider>
    </div>
  );
}
