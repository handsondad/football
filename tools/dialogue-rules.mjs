// 足球奇遇记 · 全站双层知识库、教案库、双语词典与跨模块引用完整性检查器
// 运行：npm run check
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { TRAINING_DRILLS } from '../src/content/drills/drills.ts';
import { LEXICON_TERMS } from '../src/content/lexicon/terms.ts';
import { SOURCES } from '../src/data/sources.ts';

const domainsDir = new URL('../src/content/domains/', import.meta.url);
const domainFolders = readdirSync(domainsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const bundles = [];
for (const folder of domainFolders) {
  const mod = await import(pathToFileURL(new URL(`${folder}/domain.ts`, domainsDir).pathname.replace(/^\/([A-Za-z]:)/, '$1')).href);
  bundles.push(mod.default);
}

const filler = new Set('的了吗呢吧呀啊哦嘛是我你他她它们这那就也都还又在有和么什怎为个一不没会要说想看能可以得很太好真再');
// 严禁把用户对话背景说明或空洞包装口号写入网站文案
const forbiddenMeta = /两岁|(?<!\d)2岁|先行做功课|先行备好|为其做职业准备|爸爸功课|十六年计划|深潜内参|筑根基|双层知识引擎|模块化可扩展架构/;

function topicWords(line) {
  const words = new Set();
  const chars = [...line];
  for (let i = 0; i < chars.length - 1; i += 1) {
    const [a, b] = [chars[i], chars[i + 1]];
    if (!/\p{Script=Han}/u.test(a) || !/\p{Script=Han}/u.test(b)) continue;
    if (filler.has(a) || filler.has(b)) continue;
    words.add(a + b);
  }
  return words;
}

const sharedWords = (question, answer) => [...topicWords(question)].filter((w) => answer.includes(w));

const knownSources = new Set(SOURCES.map((s) => s.id));
const knownTopics = new Set(bundles.map((b) => b.meta.id));
const allQuestions = bundles.flatMap((b) => b.articles);
const knownQuestions = new Set(allQuestions.map((q) => q.id));
const knownDrills = new Set(TRAINING_DRILLS.map((d) => d.id));
const knownLexicon = new Set(LEXICON_TERMS.map((t) => t.id));

const problems = [];
const say = (scope, msg) => problems.push(`${scope}: ${msg}`);

if (knownTopics.size !== bundles.length) say('DOMAINS', 'duplicate domain topic IDs');
if (knownQuestions.size !== allQuestions.length) say('QUESTIONS', 'duplicate question IDs');
if (knownDrills.size !== TRAINING_DRILLS.length) say('DRILLS', 'duplicate drill IDs');
if (knownLexicon.size !== LEXICON_TERMS.length) say('LEXICON', 'duplicate lexicon term IDs');

for (const b of bundles) {
  for (const q of b.articles) {
    if (q.topic !== b.meta.id) say(q.id, `topic ${q.topic} does not match domain ${b.meta.id}`);
    if (!/？/.test(q.title)) say(q.id, 'title must be a question containing ？');
    if (!q.proSubtitle) say(q.id, 'missing proSubtitle');
    if (!q.trigger) say(q.id, 'missing trigger');

    // 检查第二层 ProDeepDive 专业深潜完整性
    const pro = q.proDeepDive;
    if (!pro) {
      say(q.id, 'missing proDeepDive');
      continue;
    }
    if (!pro.thesis || pro.thesis.length < 20) say(q.id, 'proDeepDive.thesis too short');
    if (!pro.sections || pro.sections.length < 2) say(q.id, 'proDeepDive needs ≥2 structured sections');
    if (!pro.kpis || pro.kpis.length < 2) say(q.id, 'proDeepDive needs ≥2 quantitative KPIs');
    if (!pro.prescription?.name || !pro.prescription?.method) say(q.id, 'proDeepDive missing prescription');
    if (!pro.pitfalls || pro.pitfalls.length < 1) say(q.id, 'proDeepDive needs ≥1 pitfall warning');

    for (const lid of pro.lexiconIds ?? []) {
      if (!knownLexicon.has(lid)) say(q.id, `unknown lexiconId ${lid}`);
    }
    for (const did of pro.drillIds ?? []) {
      if (!knownDrills.has(did)) say(q.id, `unknown drillId ${did}`);
    }
    for (const cid of pro.citeIds ?? []) {
      if (!knownSources.has(cid)) say(q.id, `unknown proDeepDive citeId ${cid}`);
    }
    for (const rid of q.relatedIds ?? []) {
      if (!knownQuestions.has(rid)) say(q.id, `unknown relatedId ${rid}`);
    }

    const fullText = JSON.stringify(q);
    if (forbiddenMeta.test(fullText)) {
      say(q.id, `contains forbidden meta phrasing (${fullText.match(forbiddenMeta)?.[0]})`);
    }

    // 检查第一层父子追问链
    const turns = q.dialogue;
    const totalCites =
      turns.reduce(
        (acc, t) =>
          acc +
          (t.cite?.length ?? 0) +
          (t.show?.kind === 'ruler' ? t.show.marks.reduce((mAcc, m) => mAcc + (m.cite?.length ?? 0), 0) : 0),
        0
      ) + (pro.citeIds?.length ?? 0);
    if (totalCites === 0) say(q.id, 'must include at least 1 verified source citation');
    if (turns.length < 5 || turns.length > 8) say(q.id, `dialogue needs 5–8 turns, got ${turns.length}`);

    turns.forEach((turn, idx) => {
      const last = idx === turns.length - 1;
      if (!turn.nian || !turn.dad) say(q.id, `turn ${idx + 1} missing nian or dad`);
      if (!last && !/？/.test(turn.nian)) say(q.id, `turn ${idx + 1}: 小念 must ask with ？`);
      if (last && !/^(我懂了|我明白了)/.test(turn.nian)) {
        say(q.id, `last turn: 小念 must start with 我懂了 or 我明白了`);
      }
      if (idx > 0 && sharedWords(turn.nian, turns[idx - 1].dad).length === 0) {
        say(q.id, `turn ${idx + 1}: 小念 must pick up a topic word from 爸爸's previous answer`);
      }
      if (turn.dad.length < 25 || turn.dad.length > 205) {
        say(q.id, `turn ${idx + 1}: 爸爸 length is ${turn.dad.length} (expected 25–205)`);
      }
      for (const srcId of turn.cite ?? []) {
        if (!knownSources.has(srcId)) say(q.id, `turn ${idx + 1}: unknown source ${srcId}`);
      }
    });
  }
}

for (const d of TRAINING_DRILLS) {
  for (const aid of d.relatedArticleIds) {
    if (!knownQuestions.has(aid)) say(d.id, `drill references unknown article ${aid}`);
  }
}

for (const t of LEXICON_TERMS) {
  for (const aid of t.relatedArticleIds) {
    if (!knownQuestions.has(aid)) say(t.id, `lexicon term references unknown article ${aid}`);
  }
}

for (const p of problems) console.log(p);
console.log(
  problems.length
    ? `❌ ${problems.length} problem(s) found`
    : `✅ Verified ${bundles.length} domains, ${allQuestions.length} dual-layer lessons (${allQuestions.reduce((n, q) => n + q.dialogue.length, 0)} turns + ${allQuestions.length} ProDeepDives), ${TRAINING_DRILLS.length} drills, ${LEXICON_TERMS.length} lexicon terms & ${SOURCES.length} sources!`
);
process.exitCode = problems.length ? 1 : 0;
