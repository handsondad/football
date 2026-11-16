import type { CSSProperties } from 'react';
import { Avatar } from '../components/Avatar.tsx';
import {
  difficultyHint,
  difficultyLabel,
  footballTopics,
  questionsIn,
  topicById,
  type Difficulty,
  type FootballQuestion,
  type TopicId,
} from '../content/registry.ts';

type Props = {
  topicId: TopicId;
  heard: readonly string[];
  onBack: () => void;
  onOpenQuestion: (id: string) => void;
  onSelectTopic: (id: TopicId) => void;
};

const LEVELS: readonly Difficulty[] = [1, 2, 3];

const INTERACTIVE_SHOWS = new Set([
  'pitch-anatomy',
  'pitch-formats',
  'pitch-roles',
  'offside',
  'formations',
  'triangles',
  'scanning',
  'ball-curve',
  'analytics-xg',
  'funino',
]);

function QuestionCard({
  question,
  heard,
  color,
  onOpen,
}: {
  question: FootballQuestion;
  heard: boolean;
  color: string;
  onOpen: () => void;
}) {
  const hasLab = question.dialogue.some((t) => t.show && INTERACTIVE_SHOWS.has(t.show.kind));
  return (
    <button
      type="button"
      className={`qlist-card ${heard ? 'is-heard' : ''}`}
      style={{ '--bubble': color } as CSSProperties}
      onClick={onOpen}
    >
      <strong>{question.title}</strong>
      <span className="qcard-pro-line">{question.proSubtitle}</span>
      <small className="qlist-trigger">📍 {question.trigger}</small>
      <span className="qlist-badges">
        <em>
          💬 {question.dialogue.length} 问 {question.dialogue.length} 答 + 深度详解
        </em>
        {question.tags.map((tag) => (
          <em key={tag} className="is-ring">
            {tag}
          </em>
        ))}
        {hasLab && <em className="is-lab">🎛️ 互动图解</em>}
        {heard && <em className="is-star">⭐ 看过</em>}
      </span>
    </button>
  );
}

export function CategoryPage({
  topicId,
  heard,
  onBack,
  onOpenQuestion,
  onSelectTopic,
}: Props) {
  const topic = topicById(topicId);
  const questions = questionsIn(topicId);
  if (!topic) return null;

  const heardCount = questions.filter((q) => heard.includes(q.id)).length;

  return (
    <div className="qlist">
      <header className="page-top">
        <button type="button" className="back-pill" onClick={onBack}>
          ← 回到足球分类
        </button>
        <div className="page-head-meta">
          <span>
            {questions.length} 个问题 · 看过 {heardCount} 个
          </span>
          <h1>
            {topic.emoji} {topic.title}
          </h1>
        </div>
      </header>

      <div className="qlist-intro" style={{ '--bubble': topic.color } as CSSProperties}>
        <p>
          <Avatar who="nian" />
          <strong>小念：</strong>
          {topic.kidHook}
        </p>
        <p>
          <Avatar who="dad" />
          <strong>爸爸：</strong>
          这一块重点围绕{topic.dadLens}展开。
        </p>
      </div>

      {LEVELS.map((level) => {
        const group = questions.filter((q) => q.difficulty === level);
        if (group.length === 0) return null;
        return (
          <section key={level} className="qlist-group" aria-label={difficultyLabel[level]}>
            <h2>
              {'⭐'.repeat(level)} {difficultyLabel[level]}
              <small>{difficultyHint[level]}</small>
            </h2>
            <div className="qlist-grid">
              {group.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  heard={heard.includes(q.id)}
                  color={topic.color}
                  onOpen={() => onOpenQuestion(q.id)}
                />
              ))}
            </div>
          </section>
        );
      })}

      <nav className="qlist-other" aria-label="换一个足球分类">
        <h2>换一个分类</h2>
        <div className="qlist-chips">
          {footballTopics.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={item.id === topicId ? 'true' : undefined}
              onClick={() => onSelectTopic(item.id)}
            >
              {item.emoji} {item.title}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
