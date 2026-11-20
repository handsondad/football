import type { FootballQuestion, FootballTopic, TopicId } from '../data/types.ts';
import raw from './catalog.json';

/**
 * 轻量目录（由 `npm run content:index` 从各领域包生成 `catalog.json`）
 *
 * 首页、分类页、学习路线与导航只需要题目卡片信息，不必加载全部问答正文；
 * 打开问题时再由 `load.ts` 按领域加载完整内容。
 * 新增或修改领域内容后运行 `npm run content:index`，`npm run check` 会拦截过期目录。
 */
export type CatalogTopic = FootballTopic & { readonly folder: string };

export type QuestionCard = Pick<
  FootballQuestion,
  'id' | 'topic' | 'difficulty' | 'tags' | 'title' | 'proSubtitle' | 'trigger'
> & {
  readonly relatedIds: readonly string[];
  /** 亲子对话轮数 */
  readonly turns: number;
  /** 对话中用到的图解类型 */
  readonly shows: readonly string[];
};

type CatalogData = {
  readonly counts: {
    readonly drills: number;
    readonly lexicon: number;
    readonly videos: number;
    readonly hlg: number;
  };
  readonly topics: readonly CatalogTopic[];
  readonly questions: readonly QuestionCard[];
};

const data = raw as unknown as CatalogData;

export const resourceCounts = data.counts;
export const footballTopics: readonly CatalogTopic[] = data.topics;
export const footballQuestions: readonly QuestionCard[] = data.questions;

const TOPIC_MAP = new Map<string, CatalogTopic>(footballTopics.map((t) => [t.id, t]));
const QUESTION_MAP = new Map<string, QuestionCard>(footballQuestions.map((q) => [q.id, q]));

/** 由每篇文章的 `relatedIds` 自动构建无向双向知识图谱（无需手工维护冗余配对表） */
const ADJACENCY = new Map<string, Set<string>>();
for (const q of footballQuestions) {
  if (!ADJACENCY.has(q.id)) ADJACENCY.set(q.id, new Set());
  for (const targetId of q.relatedIds) {
    if (!QUESTION_MAP.has(targetId) || targetId === q.id) continue;
    ADJACENCY.get(q.id)!.add(targetId);
    if (!ADJACENCY.has(targetId)) ADJACENCY.set(targetId, new Set());
    ADJACENCY.get(targetId)!.add(q.id);
  }
}

const byDifficulty = (a: QuestionCard, b: QuestionCard) => a.difficulty - b.difficulty;

export function topicById(id: string): CatalogTopic | undefined {
  return TOPIC_MAP.get(id);
}

export function questionsIn(topic: TopicId): QuestionCard[] {
  return footballQuestions.filter((q) => q.topic === topic).sort(byDifficulty);
}

export function questionById(id: string): QuestionCard | undefined {
  return QUESTION_MAP.get(id);
}

type QuestionRef = Pick<QuestionCard, 'id' | 'topic' | 'difficulty'>;

export function nextQuestions(question: QuestionRef, count = 3): QuestionCard[] {
  const list = questionsIn(question.topic).filter((item) => item.id !== question.id);
  const after = list.filter((item) => item.difficulty >= question.difficulty);
  return [...after, ...list.filter((item) => !after.includes(item))].slice(0, count);
}

export function linkedQuestions(question: QuestionRef, count = 4): QuestionCard[] {
  const neighbors = [...(ADJACENCY.get(question.id) ?? [])]
    .map((id) => QUESTION_MAP.get(id))
    .filter((x): x is QuestionCard => x !== undefined && x.topic !== question.topic);
  return neighbors.slice(0, count);
}

export function pickRandomQuestion(
  heard: readonly string[] = [],
  excludeId?: string
): QuestionCard {
  const openPool = footballQuestions.filter((item) => item.id !== excludeId);
  const unheard = openPool.filter((item) => !heard.includes(item.id));
  const pool = unheard.length > 0 ? unheard : openPool.length > 0 ? openPool : footballQuestions;
  return pool[Math.floor(Math.random() * pool.length)];
}

export * from '../data/types.ts';
