import type { FootballQuestion } from '../data/types.ts';
import { footballQuestions, topicById, type QuestionCard } from './catalog.ts';

/**
 * 全文跨层智能检索：同时匹配亲子问答、专业深潜副标题、理论拆解、KPI 与训练处方
 *
 * 打分：标题+副标题全中 5 分；再加标签/分类名 4 分；再加专业深潜正文 3 分；其余（对话、场景）2 分。
 * 未加载正文时先用目录字段（标题、副标题、标签、分类、场景）给出即时结果，正文加载后按同一规则重排。
 */
type SearchDoc = {
  readonly id: string;
  readonly difficulty: number;
  readonly head: string;
  readonly meta: string;
  readonly pro: string;
  readonly rest: string;
};

function topicTitle(topic: string): string {
  return topicById(topic)?.title ?? '';
}

function cardDoc(card: QuestionCard): SearchDoc {
  return {
    id: card.id,
    difficulty: card.difficulty,
    head: `${card.title} ${card.proSubtitle}`.toLowerCase(),
    meta: `${card.tags.join(' ')} ${topicTitle(card.topic)}`.toLowerCase(),
    pro: '',
    rest: card.trigger.toLowerCase(),
  };
}

function questionDoc(question: FootballQuestion): SearchDoc {
  const pro = question.proDeepDive;
  return {
    id: question.id,
    difficulty: question.difficulty,
    head: `${question.title} ${question.proSubtitle}`.toLowerCase(),
    meta: `${question.tags.join(' ')} ${topicTitle(question.topic)}`.toLowerCase(),
    pro: [
      pro.thesis,
      ...pro.sections.map((s) => `${s.heading} ${s.content}`),
      ...pro.kpis.map((k) => `${k.metric} ${k.target} ${k.meaning}`),
      pro.prescription.name,
      pro.prescription.method,
    ]
      .join(' ')
      .toLowerCase(),
    rest: `${question.trigger} ${question.dialogue.map((t) => `${t.nian} ${t.dad}`).join(' ')}`.toLowerCase(),
  };
}

function rank(docs: readonly SearchDoc[], rawQuery: string): string[] {
  const tokens = rawQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  const scored: { doc: SearchDoc; score: number }[] = [];
  for (const doc of docs) {
    const allIn = (...parts: string[]) => tokens.every((token) => parts.some((p) => p.includes(token)));
    if (!allIn(doc.head, doc.meta, doc.pro, doc.rest)) continue;
    const score = allIn(doc.head)
      ? 5
      : allIn(doc.head, doc.meta)
        ? 4
        : allIn(doc.head, doc.pro)
          ? 3
          : 2;
    scored.push({ doc, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.doc.difficulty - b.doc.difficulty)
    .map((entry) => entry.doc.id);
}

let cardDocs: SearchDoc[] | null = null;
let fullDocs: { source: readonly FootballQuestion[]; docs: SearchDoc[] } | null = null;

/** 只用目录字段的即时检索（正文尚未加载时使用） */
export function searchCards(rawQuery: string): string[] {
  cardDocs ??= footballQuestions.map(cardDoc);
  return rank(cardDocs, rawQuery);
}

/** 加载全部正文后的完整检索，`questions` 须按目录顺序排列 */
export function searchQuestions(questions: readonly FootballQuestion[], rawQuery: string): string[] {
  if (fullDocs?.source !== questions) fullDocs = { source: questions, docs: questions.map(questionDoc) };
  return rank(fullDocs.docs, rawQuery);
}
