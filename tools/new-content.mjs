/**
 * 足球奇遇记 · 持续扩容脚手架工具（CLI Scaffolder）
 *
 * 用法示例：
 *   npm run new-content -- domain 10-set-pieces "定位球战术工程"
 *   npm run new-content -- article 04-tactics-analytics pressing-traps "边线压迫陷阱怎么设？"
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , kind, arg1, arg2, arg3] = process.argv;

if (!kind || (kind !== 'domain' && kind !== 'article')) {
  console.log(`用法：
  1. 新增整个足球专业领域包（自动被 registry 发现挂载，无需改任何页面代码）：
     npm run new-content -- domain <序号-目录名> "<领域中文标题>"
     示例：npm run new-content -- domain 10-set-pieces "定位球攻防工程"

  2. 生成单篇双层课题标准模板骨架：
     npm run new-content -- article <topicId> <articleId> "<小念问题标题？>"
`);
  process.exit(0);
}

if (kind === 'domain') {
  const folder = arg1 || '10-new-domain';
  const title = arg2 || '新足球专业领域';
  const slug = folder.replace(/^\d+-/, '');
  const orderMatch = folder.match(/^(\d+)/);
  const order = orderMatch ? Number(orderMatch[1]) : 99;
  const targetDir = resolve('src/content/domains', folder);
  const targetFile = resolve(targetDir, 'domain.ts');

  if (existsSync(targetFile)) {
    console.error(`⚠️ 文件已存在：${targetFile}`);
    process.exit(1);
  }
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(
    targetFile,
    `import type { DomainBundle } from '../../../data/types.ts';

const bundle: DomainBundle = {
  meta: {
    id: '${slug}',
    order: ${order},
    emoji: '⚽',
    title: '${title}',
    short: '${title.slice(0, 5)}',
    color: '#2fb36d',
    moduleCode: 'MOD-${String(order).padStart(2, '0')} · Custom Domain',
    kidHook: '在这里写一句吸引孩子好奇心的球场现象提问？',
    dadLens: '在这里写该模块面向爸爸/教练的核心科学理论与实操范畴',
  },
  articles: [],
};

export default bundle;
`,
    'utf8'
  );
  console.log(`✅ 已创建新领域插件：${targetFile}\n重启或保存后全站自动发现并挂载该板块！`);
} else if (kind === 'article') {
  const topicId = arg1 || 'tactics-board';
  const articleId = arg2 || 'new-lesson';
  const title = arg3 || '为什么会出现这个球场现象？';
  console.log(`// 将以下双层课题对象粘贴至对应领域的 articles 数组中，运行 npm run check 校验：
{
  id: '${articleId}',
  topic: '${topicId}',
  difficulty: 2,
  tags: ['战术', '科学'],
  title: '${title}',
  proSubtitle: '专业课题副标题（理论模型与机制名称）',
  trigger: '在球场或转播中观察到的具体一幕真实场景。',
  dialogue: [
    { nian: '爸爸，首轮从现象出发提问？', dad: '第一句先给明确结论，再用比方拆解原理（25–205字）。', cite: ['cfa-syllabus-2022'] },
    { nian: '接住上一句里的关键词追问第2轮？', dad: '深入一层解释谁在管、怎么发生。' },
    { nian: '接住上一句里的关键词追问第3轮？', dad: '拆解一步步的力学或博弈过程。' },
    { nian: '接住上一句里的关键词追问第4轮？', dad: '澄清常见误区或特殊边界情况。' },
    { nian: '接住上一句里的关键词追问第5轮？', dad: '落回场上实操方法。' },
    { nian: '我懂了！接住上一句关键词并用自己的话完整总结因果链！', dad: '肯定总结并给出一条场上好习惯！' },
  ],
  proDeepDive: {
    thesis: '一句话提炼面向教练与爸爸的硬核核心论断。',
    sections: [
      { heading: '1. 理论机制拆解', content: '详述运动科学或欧足联战术机制。' },
      { heading: '2. 实战博弈应用', content: '详述高水平比赛中的具体执行细节。' },
    ],
    kpis: [
      { metric: '核心量化指标1', target: '达标区间', meaning: '球探或体能评估含义' },
      { metric: '核心量化指标2', target: '达标区间', meaning: '实战检验意义' },
    ],
    prescription: {
      name: '配套落地训练处方名称',
      spec: '适用年龄 · 场地大小 · 组数负荷',
      method: '具体训练操作步骤与规则约束。',
      cues: ['关键指导要点1', '关键指导要点2'],
    },
    pitfalls: ['常见认知误区与红线提醒'],
    citeIds: ['cfa-syllabus-2022'],
  },
}`);
}
