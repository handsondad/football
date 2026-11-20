// 足球奇遇记 · 轻量目录生成器
// 运行：npm run content:index
// 把 24 个领域包里首页、分类页、导航与图谱需要的字段抽成 src/content/catalog.json，
// 让页面首屏不必加载全部问答正文；正文按领域在打开问题时再按需加载。
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { TRAINING_DRILLS } from '../src/content/drills/drills.ts';
import { LEXICON_TERMS } from '../src/content/lexicon/terms.ts';
import { VIDEO_RESOURCES } from '../src/content/videos/videos.ts';
import { HLG_RESOURCES } from '../src/data/hlg-resources.ts';

const domainsDir = new URL('../src/content/domains/', import.meta.url);
export const catalogFile = fileURLToPath(new URL('../src/content/catalog.json', import.meta.url));

export async function loadBundles() {
  const folders = readdirSync(domainsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  const bundles = [];
  for (const folder of folders) {
    const mod = await import(pathToFileURL(fileURLToPath(new URL(`${folder}/domain.ts`, domainsDir))).href);
    bundles.push({ folder, bundle: mod.default });
  }
  // 与浏览器端保持同一顺序：按文件夹名读入，再按 meta.order 稳定排序
  return bundles.sort((a, b) => a.bundle.meta.order - b.bundle.meta.order);
}

export async function buildIndex() {
  const bundles = await loadBundles();
  const topics = bundles.map(({ folder, bundle }) => ({ ...bundle.meta, folder }));
  const questions = bundles.flatMap(({ bundle }) =>
    bundle.articles.map((q) => ({
      id: q.id,
      topic: q.topic,
      difficulty: q.difficulty,
      tags: q.tags,
      title: q.title,
      proSubtitle: q.proSubtitle,
      trigger: q.trigger,
      relatedIds: q.relatedIds ?? [],
      turns: q.dialogue.length,
      shows: [...new Set(q.dialogue.flatMap((t) => (t.show ? [t.show.kind] : [])))],
    }))
  );
  const counts = {
    drills: TRAINING_DRILLS.length,
    lexicon: LEXICON_TERMS.length,
    videos: VIDEO_RESOURCES.length,
    hlg: HLG_RESOURCES.length,
  };
  const lines = (items) => items.map((item) => `    ${JSON.stringify(item)}`).join(',\n');
  return `{\n  "counts": ${JSON.stringify(counts)},\n  "topics": [\n${lines(topics)}\n  ],\n  "questions": [\n${lines(questions)}\n  ]\n}\n`;
}

/** 目录与领域包不一致时返回 true（npm run check 会据此报错） */
export async function staleIndex() {
  let current = '';
  try {
    current = readFileSync(catalogFile, 'utf8').replace(/\r\n/g, '\n');
  } catch {
    return true;
  }
  return current !== (await buildIndex());
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const text = await buildIndex();
  writeFileSync(catalogFile, text);
  const data = JSON.parse(text);
  console.log(`✅ 已生成 src/content/catalog.json：${data.topics.length} 个领域、${data.questions.length} 个问题`);
}
