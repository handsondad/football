import type { DomainBundle, FootballQuestion } from '../data/types.ts';
import { footballTopics, questionById } from './catalog.ts';

/**
 * 领域正文按需加载：每个 `domains/<序号>-<slug>/domain.ts` 打包成独立分块，
 * 打开某个问题时只下载它所在的领域；全文搜索时才加载全部领域（与问题页共用同一批分块与缓存）。
 */
const domainModules = import.meta.glob<{ default: DomainBundle }>('./domains/*/domain.ts');

const FOLDER_BY_TOPIC = new Map(footballTopics.map((t) => [t.id, t.folder]));
const pending = new Map<string, Promise<DomainBundle>>();
const loaded = new Map<string, DomainBundle>();
const questionCache = new Map<string, FootballQuestion>();

function loadDomain(topicId: string): Promise<DomainBundle> {
  const folder = FOLDER_BY_TOPIC.get(topicId);
  const importer = folder ? domainModules[`./domains/${folder}/domain.ts`] : undefined;
  if (!importer) return Promise.reject(new Error(`unknown topic ${topicId}`));
  let task = pending.get(topicId);
  if (!task) {
    task = importer().then(
      (mod) => {
        loaded.set(topicId, mod.default);
        for (const q of mod.default.articles) questionCache.set(q.id, q);
        return mod.default;
      },
      (err: unknown) => {
        pending.delete(topicId);
        throw err;
      }
    );
    pending.set(topicId, task);
  }
  return task;
}

/** 已加载过的问题同步返回，避免切换时闪出加载态 */
export function peekQuestion(id: string): FootballQuestion | undefined {
  return questionCache.get(id);
}

export async function loadQuestion(id: string): Promise<FootballQuestion | undefined> {
  const card = questionById(id);
  if (!card) return undefined;
  await loadDomain(card.topic);
  return questionCache.get(id);
}

/** 悬停/聚焦题目卡片时提前加载所在领域，失败静默（真正打开时会重试） */
export function prefetchQuestion(id: string): void {
  const card = questionById(id);
  if (card && !loaded.has(card.topic)) loadDomain(card.topic).catch(() => undefined);
}

let allTask: Promise<readonly FootballQuestion[]> | null = null;

/** 按目录顺序返回全部问题（用于全文搜索） */
export function loadAllQuestions(): Promise<readonly FootballQuestion[]> {
  allTask ??= Promise.all(footballTopics.map((t) => loadDomain(t.id))).then(
    (bundles) => bundles.flatMap((b) => b.articles),
    (err: unknown) => {
      allTask = null;
      throw err;
    }
  );
  return allTask;
}
