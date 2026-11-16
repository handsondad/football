import type {
  DomainBundle,
  FootballQuestion,
  FootballTopic,
  TopicId,
} from '../data/types.ts';
import { DRILL_BY_ID, TRAINING_DRILLS } from './drills/drills.ts';
import { LEXICON_BY_ID, LEXICON_TERMS } from './lexicon/terms.ts';

/**
 * 插件化知识库自动发现注册中心（Auto-Discovery Registry）
 *
 * 扩容方式：
 * - 新增知识领域：只需在 `src/content/domains/` 下新建文件夹并导出 `default: DomainBundle`，
 *   构建时 Vite `import.meta.glob` 会自动挂载并按 `order` 排序，全站导航、搜索、双向图谱零代码修改自动生效！
 */
const domainModules = import.meta.glob<{ default: DomainBundle }>(
  './domains/*/domain.ts',
  { eager: true }
);

export const DOMAIN_BUNDLES: readonly DomainBundle[] = Object.values(domainModules)
  .map((m) => m.default)
  .sort((a, b) => a.meta.order - b.meta.order);

export const footballTopics: readonly FootballTopic[] = DOMAIN_BUNDLES.map((b) => b.meta);

export const footballQuestions: readonly FootballQuestion[] = DOMAIN_BUNDLES.flatMap(
  (b) => b.articles
);

const TOPIC_MAP = new Map<string, FootballTopic>(footballTopics.map((t) => [t.id, t]));
const QUESTION_MAP = new Map<string, FootballQuestion>(footballQuestions.map((q) => [q.id, q]));

/** 由每篇文章的 `relatedIds` 自动构建无向双向知识图谱（无需手工维护冗余配对表） */
const ADJACENCY = new Map<string, Set<string>>();
for (const q of footballQuestions) {
  if (!ADJACENCY.has(q.id)) ADJACENCY.set(q.id, new Set());
  for (const targetId of q.relatedIds ?? []) {
    if (!QUESTION_MAP.has(targetId) || targetId === q.id) continue;
    ADJACENCY.get(q.id)!.add(targetId);
    if (!ADJACENCY.has(targetId)) ADJACENCY.set(targetId, new Set());
    ADJACENCY.get(targetId)!.add(q.id);
  }
}

const byDifficulty = (a: FootballQuestion, b: FootballQuestion) => a.difficulty - b.difficulty;

export function topicById(id: string): FootballTopic | undefined {
  return TOPIC_MAP.get(id);
}

export function questionsIn(topic: TopicId): FootballQuestion[] {
  return footballQuestions.filter((q) => q.topic === topic).sort(byDifficulty);
}

export function questionById(id: string): FootballQuestion | undefined {
  return QUESTION_MAP.get(id);
}

export function nextQuestions(question: FootballQuestion, count = 3): FootballQuestion[] {
  const list = questionsIn(question.topic).filter((item) => item.id !== question.id);
  const after = list.filter((item) => item.difficulty >= question.difficulty);
  return [...after, ...list.filter((item) => !after.includes(item))].slice(0, count);
}

export function linkedQuestions(question: FootballQuestion, count = 4): FootballQuestion[] {
  const neighbors = [...(ADJACENCY.get(question.id) ?? [])]
    .map((id) => QUESTION_MAP.get(id))
    .filter((x): x is FootballQuestion => x !== undefined && x.topic !== question.topic);
  return neighbors.slice(0, count);
}

/** 全文跨层智能检索：同时匹配亲子问答、专业深潜副标题、理论拆解、KPI 与训练处方 */
export function searchQuestions(rawQuery: string): FootballQuestion[] {
  const tokens = rawQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  const scored: { question: FootballQuestion; score: number }[] = [];
  for (const question of footballQuestions) {
    const topicTitle = topicById(question.topic)?.title.toLowerCase() ?? '';
    const title = question.title.toLowerCase();
    const proSub = question.proSubtitle.toLowerCase();
    const trigger = question.trigger.toLowerCase();
    const tags = question.tags.join(' ').toLowerCase();
    const dialogueText = question.dialogue.map((t) => `${t.nian} ${t.dad}`).join(' ').toLowerCase();
    const proText = [
      question.proDeepDive.thesis,
      ...question.proDeepDive.sections.map((s) => `${s.heading} ${s.content}`),
      ...question.proDeepDive.kpis.map((k) => `${k.metric} ${k.target} ${k.meaning}`),
      question.proDeepDive.prescription.name,
      question.proDeepDive.prescription.method,
    ]
      .join(' ')
      .toLowerCase();

    const allIn = (text: string) => tokens.every((token) => text.includes(token));
    if (!allIn(`${title} ${proSub} ${trigger} ${topicTitle} ${tags} ${dialogueText} ${proText}`)) {
      continue;
    }
    const score = allIn(`${title} ${proSub}`)
      ? 5
      : allIn(`${title} ${proSub} ${tags} ${topicTitle}`)
        ? 4
        : allIn(`${title} ${proSub} ${proText}`)
          ? 3
          : 2;
    scored.push({ question, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.question.difficulty - b.question.difficulty)
    .map((entry) => entry.question);
}

export function pickRandomQuestion(
  heard: readonly string[] = [],
  excludeId?: string
): FootballQuestion {
  const openPool = footballQuestions.filter((item) => item.id !== excludeId);
  const unheard = openPool.filter((item) => !heard.includes(item.id));
  const pool = unheard.length > 0 ? unheard : openPool.length > 0 ? openPool : footballQuestions;
  return pool[Math.floor(Math.random() * pool.length)];
}

export { TRAINING_DRILLS, DRILL_BY_ID, LEXICON_TERMS, LEXICON_BY_ID };
export * from '../data/types.ts';
