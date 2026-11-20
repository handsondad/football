import { useMemo, useState, type CSSProperties } from 'react';
import {
  footballQuestions,
  questionsIn,
  topicById,
  type TopicId,
} from '../content/catalog.ts';

type MasteryStage = {
  readonly id: string;
  readonly step: string;
  readonly emoji: string;
  readonly title: string;
  readonly badge: string;
  readonly color: string;
  readonly goal: string;
  readonly topicIds: readonly TopicId[];
};

const MASTERY_STAGES: readonly MasteryStage[] = [
  {
    id: 'stage-1',
    step: '第 1 阶',
    emoji: '🛡️',
    title: '安全与规则',
    badge: '零基础先读 · 先守住安全',
    color: '#16a34a',
    goal: '人工草选对鞋钉，认识长个子高峰期的膝下和脚跟疼痛，做 FIFA 11+ 热身，读懂越位、手球和 2025/26 门将 8 秒判角球。',
    topicIds: ['pitch-gear', 'rules-ref', 'body-health'],
  },
  {
    id: 'stage-2',
    step: '第 2 阶',
    emoji: '👟',
    title: '亲自触球与家庭陪练',
    badge: '自己有脚感 · 能给孩子喂好球',
    color: '#0d9488',
    goal: '对着一面墙练稳脚内侧推传，读懂半转身第一触球、假动作、五人制脚底控球、单刀推远角和点球意外双触的新规。',
    topicIds: ['skills-ball', 'coach-ref-practice', 'football-family', 'match-craft'],
  },
  {
    id: 'stage-3',
    step: '第 3 阶',
    emoji: '📋',
    title: '带孩子训练、心理与伤后回场',
    badge: '能带一小队孩子踢完一节课',
    color: '#2563eb',
    goal: 'FUNiño 四球门和提问式教学，赛后回家路上怎么说话，两分钟战术板，一天多场比赛中间吃什么，以及伤后为什么要先过医生和功能测试再回场。',
    topicIds: ['youth-science', 'mind-game', 'gk-rts-matchread'],
  },
  {
    id: 'stage-4',
    step: '第 4 阶',
    emoji: '🔭',
    title: '看懂战术与球探视角',
    badge: '看比赛时不只追着球',
    color: '#7c3aed',
    goal: '看懂 3-2-5 和肋部、四后卫怎样一起移动、无球跑位和背身护球、1v1 侧身延缓、球探为什么常看不拿球的人、xG/PSxG，以及开场 10 分钟先记哪几件事。',
    topicIds: ['tactics-board', 'defense-setpieces', 'offball-duels', 'scouting-tech'],
  },
  {
    id: 'stage-5',
    step: '第 5 阶',
    emoji: '🏆',
    title: '历史、世界与升学通路',
    badge: '把足球放回更长的时间和更大的地图',
    color: '#ea580c',
    goal: '百年阵型演变、经典比赛和球星、各国怎样把孩子培养到国家队、中国女足和村超，以及京北球场、中考足球测试和青少年注册与培训协议。',
    topicIds: [
      'football-history',
      'football-stories',
      'football-stars',
      'star-tales-magic',
      'world-football',
      'nation-pathways',
      'china-football',
      'season-map',
      'hlg-local',
      'pro-pathway',
    ],
  },
];

type FieldTask = {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly detail: string;
  readonly linkHash: string;
  readonly linkLabel: string;
};

const FIELD_TASKS: readonly FieldTask[] = [
  {
    id: 'ft-wall-200',
    icon: '🧱',
    title: '对着一面墙完成 200 脚左右脚推传',
    detail: '离墙约 4 米摆两个水瓶当小门，左右脚各推传 50 次，再接球转向 100 次，体会勾起脚尖、脚踝绷住的感觉。',
    linkHash: '#/drills/drill-dad-wall-200',
    linkLabel: '查看 DR-17 教案',
  },
  {
    id: 'ft-flashlight-line',
    icon: '🔦',
    title: '带孩子做一次「手电筒垂直投影压线球」实验',
    detail: '把球放在地板砖缝外侧边缘，分别从侧面平视和从正上方用手电照，体会「整个球越过整条线」才算出界或进球。',
    linkHash: '#/q/glt-var-saot-tech',
    linkLabel: '查看门线投影课',
  },
  {
    id: 'ft-phv-check',
    icon: '📏',
    title: '给孩子测一次季度身高增速并排查跟骨/膝下压痛',
    detail: '在站内体测页输入身高，养成每季度量一次的习惯；长得很快又喊膝下或脚跟疼时，先减量并去看医生。',
    linkHash: '#/drills',
    linkLabel: '打开 PHV 预警器',
  },
  {
    id: 'ft-5min-offball',
    icon: '👀',
    title: '看直播连续 5 分钟「完全不看球」只盯一名中场',
    detail: '让视线离开足球，专门数罗德里、佩德里这样的中场在没球时回头看了几次，又怎样躲开对手的身后。',
    linkHash: '#/q/live-scouting-eye',
    linkLabel: '查看球探之眼课',
  },
  {
    id: 'ft-10min-audit',
    icon: '📝',
    title: '用四格便签记下一场比赛的开场 10 分钟',
    detail: '第 10 分钟写下双方门球怎么出、逼抢站多高、哪一侧最空，然后看完整场比赛，核对自己的判断。',
    linkHash: '#/q/ninety-min-match-audit',
    linkLabel: '查看读赛清单课',
  },
  {
    id: 'ft-high-cam',
    icon: '🎥',
    title: '站看台高处横屏广角录 10 分钟比赛做「3:1 正向复盘」',
    detail: '别在场边追着孩子拍特写。剪出 3 段抬头接应的好镜头，再选 1 个画面暂停，问孩子「这时你看到了谁」。',
    linkHash: '#/q/video-analysis-cam',
    linkLabel: '查看视频复盘课',
  },
  {
    id: 'ft-nested-grid',
    icon: '⛳',
    title: '用「大框套小框」零排队带 6+ 个小朋友踢完 40 分钟',
    detail: '提前 10 分钟摆好内外两种颜色的标志碟，让孩子背对太阳、脚踩着球听 30 秒规则，尽量让大部分时间球都在滚。',
    linkHash: '#/drills/drill-u8-nested-grid',
    linkLabel: '查看 DR-18 控场课',
  },
  {
    id: 'ft-cla-tune',
    icon: '📐',
    title: '不靠喊，挪两步标志盘把抢圈调到能连传几脚',
    detail: '抢圈总是一两脚就丢时，把标志盘往外挪，或加一名穿黄背心的自由人，看场地大小怎样改变孩子的选择。',
    linkHash: '#/q/drill-space-tuning',
    linkLabel: '查看空间配平课',
  },
  {
    id: 'ft-referee-once',
    icon: '⚖️',
    title: '周末少儿赛客串一次主裁或边裁，练习对角线跑位',
    detail: '赛前检查球门有没有固定好、孩子有没有戴护腿板；比赛中站在球的斜侧，边裁与最后一名防守球员齐平，并用双臂前伸表示「有利继续」。',
    linkHash: '#/q/referee-positioning-signals',
    linkLabel: '查看客串裁判课',
  },
  {
    id: 'ft-cool-car',
    icon: '🚗',
    title: '连续 3 次赛后回家路上不复盘、不指责，只说「我喜欢看你踢球」',
    detail: '回家路上先让孩子放松，等第二天情绪平静了，再用「你觉得哪一脚最舒服」这样的问题聊比赛。',
    linkHash: '#/q/coach-style',
    linkLabel: '查看家长沟通课',
  },
];

type QuizItem = {
  readonly id: string;
  readonly tag: string;
  readonly question: string;
  readonly options: readonly string[];
  readonly answerIdx: number;
  readonly explanation: string;
  readonly relatedQid: string;
};

const QUIZ_ITEMS: readonly QuizItem[] = [
  {
    id: 'qz-1',
    tag: '2025/26 新规',
    question: '1. 比赛第 89 分钟领先方门将在禁区内抱住高空球后趴地拖延，主裁判高举手臂五指倒数完满 8 秒门将仍未把球发出，应如何判罚？',
    options: [
      'A. 判罚禁区内间接任意球（6秒违例老规矩）',
      'B. 判给对方一记角球（IFAB 2025/26 第 12 章新规）',
      'C. 只口头警告门将，伤停补时补回8秒即可',
    ],
    answerIdx: 1,
    explanation: '2025/26 起，门将在本方禁区内用手控球超过 8 秒，判对方角球，角球从离门将受罚位置较近的一侧踢。裁判举手用手指倒数最后 5 秒；不是反复违规，一般不出示黄牌。',
    relatedQid: 'no-hands',
  },
  {
    id: 'qz-2',
    tag: '点球新规',
    question: '2. 点球决胜中，主罚球员助跑时支撑脚在湿滑草皮打滑，右脚踢出的球意外蹭到左支撑脚折射飞进网窝，主裁判应怎么判？',
    options: [
      'A. 属于意外同时双脚触球且球进，判罚「重新主罚（Retake）」',
      'B. 算二次触球违例，进球直接取消记为罚失',
      'C. 既然不是故意的，进球直接有效不用重罚',
    ],
    answerIdx: 0,
    explanation: 'IFAB 第 31 号通告和第 14 章写明：意外双脚同时触球，或踢出后球立刻碰到支撑脚，罚进就重罚；没罚进时，比赛中判对方间接任意球，点球大战里记为罚失。故意二次触球仍判间接任意球。',
    relatedQid: 'penalty-craft',
  },
  {
    id: 'qz-3',
    tag: '骨骺防伤',
    question: '3. 11 岁男孩近三个月猛长高了 3.5 厘米，踢完球总指着脚后跟底部喊疼（早上起床第一步也疼），但没摔倒扭伤过，爸爸该怎么做？',
    options: [
      'A. 小孩生长痛很正常，买瓶红花油揉一揉继续练蛙跳冲刺',
      'B. 想到跟骨骨骺炎（Sever 病）的可能：先减少硬地跑跳和冲刺，带孩子看运动医学或骨科医生确认，按医生建议调整鞋和训练量',
      'C. 说明缺钙，多喝骨头汤周末杯赛绑紧鞋带照常踢满全场',
    ],
    answerIdx: 1,
    explanation: '长个子快的阶段，跟腱会反复牵拉还没闭合的脚跟生长区，跑跳多时容易疼。先减量、再请医生确认，比自己揉、继续蛙跳更稳妥；是不是骨骺炎，要由医生判断。',
    relatedQid: 'growth-plates',
  },
  {
    id: 'qz-4',
    tag: '带队调优',
    question: '4. 你周末带 8 岁孩子们玩 4v2 抢圈，照着成人教案摆了 7×7 米方格，结果外圈孩子每次传不过两脚就被断掉垂头丧气，最内行的即时调整是？',
    options: [
      'A. 吹哨集合严厉批评大家基本功太差，罚做十个俯卧撑',
      'B. 规定外圈必须全部一脚出球不许停球',
      'C. 一句话不骂，把四个标志碟各往外挪两三步，扩大方格，看能不能连传几脚',
    ],
    answerIdx: 2,
    explanation: '小孩子停球、抬头都比大人慢。把场地放大，给他们多一点时间，比批评更能改变动作；格子多大合适，按孩子当天的连传次数来调。',
    relatedQid: 'drill-space-tuning',
  },
  {
    id: 'qz-5',
    tag: '伤后复出',
    question: '5. 孩子两周前踢球崴了右脚踝，今天上下楼和慢跑已经完全不疼了，周六有一场区长杯淘汰赛，能不能让他首发踢全场？',
    options: [
      'B. 只要走路慢跑不疼就说明韧带长好了，缠两圈胶布首发没问题',
      'C. 歇够整整 14 天日历天数就自动达标可以踢满全场',
      'A. 先别急着首发：请医生或康复师检查，看单脚站稳、单腿跳、变向跑能不能和好腿差不多，第二天也不肿，再逐步加比赛时间',
    ],
    answerIdx: 2,
    explanation: '不疼不等于恢复好了，平衡和力量往往回来得更晚。重返比赛通常要看功能测试，而且由医生、康复师、教练和家长一起决定，不是只数日子。',
    relatedQid: 'return-to-play-rts',
  },
  {
    id: 'qz-6',
    tag: '界外球规则',
    question: '6. 十一人制正式比赛中掷界外球时，关于球员双脚动作的法定规则是哪一条？',
    options: [
      'A. 可以助跑单脚跳起在空中把球大力扔进场内',
      'B. 掷球瞬间双脚必须均有一部分触及边线或边线外地面（不得单脚或双脚腾空离地），双手从头后经头顶掷出',
      'C. 只要不踩进场内草皮就行，后脚抬起来离地完全合法',
    ],
    answerIdx: 1,
    explanation: 'IFAB 第 15 章明确规定：球离手瞬间掷球队员双脚均须有一部分接触边线或线外地面，后脚翘起腾空是少儿赛最常见的违例交换球权原因！',
    relatedQid: 'no-hands',
  },
  {
    id: 'qz-7',
    tag: '单兵防守',
    question: '7. 对方速度快、爱踩单车的边锋带球迎面冲向你家孩子（边后卫），你在看台上心里清楚最正确的单防动作应该是？',
    options: [
      'A. 趁他还没加速全速猛扑上去一脚把球捅走或果断倒地铲球',
      'B. 提前一米五碎步降速，45度侧身屈膝封住内切路线逼他走边线，眼睛死盯足球不看晃肩假动作',
      'C. 两脚平行站直张开双臂拦在正中间',
    ],
    answerIdx: 1,
    explanation: '1v1 单防铁律「快上—慢刹—45°侧封—盯球不盯人（Jockeying）」：鲁莽猛扑伸脚一旦被拨过身后即成空旷草原。',
    relatedQid: 'jockeying-1v1-def',
  },
  {
    id: 'qz-8',
    tag: '球探选材',
    question: '8. 职业青训球探去现场看 U11 比赛，除了进球，他更值得多看什么？',
    options: [
      'A. 球员没球时有没有回头看、被逼抢时第一脚能不能把球带向空当、丢球后是马上反抢还是停下来抱怨',
      'B. 谁长得最高最壮、这场比赛一共进了几个远射',
      'C. 谁在没人防守的时候能连续踩五个单车过人',
    ],
    answerIdx: 0,
    explanation: '小年龄段个子和发育早晚差别很大，身高优势以后可能被追上。接球前看没看、第一脚往哪儿带、丢球后的反应，更能看出一个孩子怎样理解比赛。',
    relatedQid: 'live-scouting-eye',
  },
  {
    id: 'qz-9',
    tag: '一日多赛',
    question: '9. 周末杯赛上午 10 点刚踢完第一场，下午 1 点半又要踢半决赛，中午这两小时给孩子怎么安排饮食恢复最科学？',
    options: [
      'A. 带全队去吃顿丰盛的炸鸡汉堡牛排大餐犒劳补充体力',
      'B. 赛后尽快吃好消化的碳水（香蕉、面包、米饭），少量多次喝水，换干衣服在阴凉处休息，下午赛前再做几分钟动态热身',
      'C. 给十岁孩子喝一罐冰镇提神功能饮料顶住困意',
    ],
    answerIdx: 1,
    explanation: '两场之间时间短，油炸和高脂食物消化慢，下午容易肚子不舒服。好消化的碳水、补水、休息和换干衣服更稳；含咖啡因的功能饮料不适合儿童。',
    relatedQid: 'youth-tournament-day',
  },
  {
    id: 'qz-10',
    tag: '女足科学',
    question: '10. 12 岁女孩进入青春期后热爱踢足球，为预防女足高发的前交叉韧带（ACL）损伤，装备与热身最关键的两件事是？',
    options: [
      'A. 买大一码的成人长刀钉（FG）球鞋抓地更牢，平时节食减重跑得轻',
      'B. 人工草穿适合人工草的短钉或碎钉鞋；热身时练落地时膝盖对着脚尖、不往里扣，并练臀部和大腿后侧力量，吃够饭',
      'C. 少踢对抗比赛，只站在原地练射门',
    ],
    answerIdx: 1,
    explanation: 'FIFA 11+ 这类神经肌肉热身坚持做，多项研究显示能明显降低膝伤风险。鞋钉要和场地匹配，节食减重反而会让身体更容易受伤。',
    relatedQid: 'female-athlete-science',
  },
  {
    id: 'qz-11',
    tag: '客串裁判',
    question: '11. 你客串少儿比赛主裁判，红队 10 号在中场被蓝队拉了一下球衣但没倒，顺势把球塞给了正单刀冲向球门的红队 9 号，此时你该怎么吹？',
    options: [
      'A. 有犯规必吹！立刻鸣哨停球判给红队中场任意球',
      'B. 执行「进攻有利」原则：不吹停单刀，双臂前平伸大喊「继续！」，等这波进攻死球后再回头处理刚才拉人的球员',
      'C. 既然红队拿到单刀了，刚才拉球衣就算一笔勾销不用管了',
    ],
    answerIdx: 1,
    explanation: '若吹停单刀判中场任意球，等于重罚了被犯规方！给有利让单刀继续，若拉拽本身达到破坏有希望进攻的黄牌标准，死球后须补亮黄牌。',
    relatedQid: 'referee-positioning-signals',
  },
  {
    id: 'qz-12',
    tag: '合同风控',
    question: '12. 10 岁孩子在区里踢得好，某青训机构拿出一份一签到 18 岁的独家《青少年培训协议》，称违约要赔 50 万培训费，爸爸该如何应对？',
    options: [
      'A. 说明机构看重孩子，赶紧签字锁定名额',
      'C. 先签了再说，反正未成年人合同以后随时能作废不用管',
      'B. 先不签：把协议带回家逐条看期限、排他条款、违约金和注册转会安排，向北京市足协或律师咨询，再决定',
    ],
    answerIdx: 2,
    explanation: '10 岁以后孩子的学校、住址和升学方向都可能变化。很长的排他期加上高额违约金，会让以后的转队和升学变得困难。签之前弄清条款，必要时请专业人士看。',
    relatedQid: 'beijing-pyramid',
  },
];

const FIELD_STORAGE_KEY = 'football-dad-field-tasks-v1';
const QUIZ_STORAGE_KEY = 'football-dad-quiz-v1';

function loadCheckedTasks(): string[] {
  try {
    const raw = window.localStorage.getItem(FIELD_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function loadQuizAnswers(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function DadMasteryPage({
  heard,
  onOpenQuestion,
  onNavigate,
  onBackHome,
}: {
  heard: readonly string[];
  onOpenQuestion: (id: string) => void;
  onNavigate: (hash: string) => void;
  onBackHome: () => void;
}) {
  const [stageIdx, setStageIdx] = useState(0);
  const [doneTasks, setDoneTasks] = useState<string[]>(() => loadCheckedTasks());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>(() => loadQuizAnswers());

  const toggleTask = (taskId: string) => {
    setDoneTasks((prev) => {
      const next = prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId];
      try {
        window.localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage quota errors
      }
      return next;
    });
  };

  const selectAnswer = (qid: string, optIdx: number) => {
    setQuizAnswers((prev) => {
      const next = { ...prev, [qid]: optIdx };
      try {
        window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage quota errors
      }
      return next;
    });
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    try {
      window.localStorage.removeItem(QUIZ_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const totalLessons = footballQuestions.length;
  const readCount = useMemo(
    () => footballQuestions.filter((q) => heard.includes(q.id)).length,
    [heard]
  );
  const correctQuizCount = useMemo(
    () => QUIZ_ITEMS.filter((item) => quizAnswers[item.id] === item.answerIdx).length,
    [quizAnswers]
  );

  const readPct = totalLessons > 0 ? readCount / totalLessons : 0;
  const taskPct = doneTasks.length / FIELD_TASKS.length;
  const quizPct = correctQuizCount / QUIZ_ITEMS.length;
  const overallScore = Math.round((readPct * 50 + taskPct * 25 + quizPct * 25));

  const rankInfo =
    overallScore >= 90
      ? { level: '🏆 第 5 级 · 五阶基本走完', hint: '想继续往前走，可以去了解足协的教练员和裁判员培训。' }
      : overallScore >= 70
        ? { level: '🔭 第 4 级 · 能看懂比赛结构', hint: '看比赛时试着先记开场 10 分钟，再核对后面的变化。' }
        : overallScore >= 45
          ? { level: '📋 第 3 级 · 能带孩子练一节课', hint: '多去球场实操，把打卡里的几项真正做一遍。' }
          : overallScore >= 20
            ? { level: '🛡️ 第 2 级 · 安全和规则心里有数', hint: '接下来读技术和陪练，开始自己碰球。' }
            : { level: '🌱 第 1 级 · 刚开始', hint: '从第 1 阶开始，按顺序读，再做几项球场打卡。' };

  const activeStage = MASTERY_STAGES[stageIdx] ?? MASTERY_STAGES[0];
  const stageQuestions = useMemo(
    () => activeStage.topicIds.flatMap((tid) => questionsIn(tid)),
    [activeStage]
  );
  const stageDoneCount = stageQuestions.filter((q) => heard.includes(q.id)).length;
  const nextUnreadInStage = stageQuestions.find((q) => !heard.includes(q.id));

  return (
    <div className="subpage">
      <header className="page-top">
        <button type="button" className="back-pill" onClick={onBackHome}>
          ← 回到首页
        </button>
        <div className="page-head-meta">
          <span>五阶课表 · 10 项球场实操 · 12 道情境自测</span>
          <h1>🎓 爸爸的五阶学习路线</h1>
          <p className="page-sub">
            把全站 {MASTERY_STAGES.reduce((n, s) => n + s.topicIds.length, 0)} 个分类、{totalLessons} 个问题排成五段，再配上需要亲自到球场做的事
          </p>
        </div>
      </header>

      {/* 顶部实时段位总览卡 */}
      <section className="mastery-hero-card" aria-label="学习总进度">
        <div className="mastery-hero-top">
          <div>
            <span className="mastery-rank-pill">{rankInfo.level}</span>
            <p className="mastery-rank-hint">{rankInfo.hint}</p>
          </div>
          <div className="mastery-score-box">
            <b>{overallScore}%</b>
            <small>总完成度</small>
          </div>
        </div>

        <div className="mastery-bar-track" aria-hidden="true">
          <div className="mastery-bar-fill" style={{ width: `${Math.max(4, overallScore)}%` }} />
        </div>

        <div className="mastery-metrics-row">
          <div className="mastery-metric-chip">
            <strong>📚 读问题（占50%）</strong>
            <span>已学 {readCount} / {totalLessons} 课</span>
          </div>
          <div className="mastery-metric-chip">
            <strong>🏟️ 球场实操（占25%）</strong>
            <span>已打卡 {doneTasks.length} / {FIELD_TASKS.length} 项</span>
          </div>
          <div className="mastery-metric-chip">
            <strong>⚡ 情境自测（占25%）</strong>
            <span>答对 {correctQuizCount} / {QUIZ_ITEMS.length} 题</span>
          </div>
        </div>
      </section>

      {/* 一、五阶系统学习路线图 */}
      <section className="atlas-section" aria-labelledby="sec-mastery-map">
        <h2 id="sec-mastery-map" className="atlas-h2">
          一、五阶学习路线
        </h2>

        <div className="mastery-stage-tabs" role="tablist">
          {MASTERY_STAGES.map((st, idx) => {
            const qs = st.topicIds.flatMap((tid) => questionsIn(tid));
            const done = qs.filter((q) => heard.includes(q.id)).length;
            return (
              <button
                key={st.id}
                type="button"
                role="tab"
                aria-selected={idx === stageIdx}
                className={`step-tab ${idx === stageIdx ? 'is-active' : ''}`}
                style={{ '--c': st.color } as CSSProperties}
                onClick={() => setStageIdx(idx)}
              >
                <span className="step-age">
                  {st.step} · {done}/{qs.length} 课
                </span>
                <strong>
                  {st.emoji} {st.title}
                </strong>
                <small>{st.badge}</small>
              </button>
            );
          })}
        </div>

        <article className="stage-detail" style={{ '--c': activeStage.color } as CSSProperties}>
          <div className="mastery-stage-head">
            <div>
              <h3>
                {activeStage.emoji} {activeStage.step}：{activeStage.title}（已完成 {stageDoneCount}/{stageQuestions.length} 课）
              </h3>
              <p>{activeStage.goal}</p>
            </div>
            {nextUnreadInStage ? (
              <button
                type="button"
                className="spot-go-btn"
                onClick={() => onOpenQuestion(nextUnreadInStage.id)}
              >
                🚀 学本阶下一课：{nextUnreadInStage.title.slice(0, 16)}… →
              </button>
            ) : (
              <span className="mastery-all-clear">🎉 这一阶的问题都读完了</span>
            )}
          </div>

          <div className="mastery-domain-blocks">
            {activeStage.topicIds.map((tid) => {
              const tp = topicById(tid);
              if (!tp) return null;
              const qs = questionsIn(tid);
              return (
                <div key={tid} className="mastery-domain-box">
                  <div className="mastery-domain-title">
                    <strong>
                      {tp.emoji} {tp.title}
                    </strong>
                    <span>{tp.moduleCode.split('·')[0]}</span>
                  </div>
                  <div className="mastery-lesson-pills">
                    {qs.map((q) => {
                      const isDone = heard.includes(q.id);
                      return (
                        <button
                          key={q.id}
                          type="button"
                          className={`mastery-lesson-btn ${isDone ? 'is-done' : ''}`}
                          onClick={() => onOpenQuestion(q.id)}
                        >
                          <span>{isDone ? '✅' : '⭕'}</span>
                          <span>{q.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      {/* 二、线下实操 20% 补完打卡表 */}
      <section className="atlas-section" aria-labelledby="sec-field-tasks">
        <h2 id="sec-field-tasks" className="atlas-h2">
          二、10 项球场实操打卡（进度自动保存）
        </h2>

        <div className="mastery-task-grid">
          {FIELD_TASKS.map((task) => {
            const checked = doneTasks.includes(task.id);
            return (
              <div key={task.id} className={`mastery-task-card ${checked ? 'is-checked' : ''}`}>
                <label className="mastery-task-check">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleTask(task.id)}
                  />
                  <strong>
                    <span aria-hidden="true">{task.icon}</span> {task.title}
                  </strong>
                </label>
                <p>{task.detail}</p>
                <button
                  type="button"
                  className="mastery-inline-link"
                  onClick={() => onNavigate(task.linkHash)}
                >
                  {task.linkLabel} →
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 三、12 道情境自测 */}
      <section className="atlas-section" aria-labelledby="sec-expert-quiz">
        <div className="mastery-quiz-header">
          <h2 id="sec-expert-quiz" className="atlas-h2">
            三、判罚、防伤与带队：12 道情境自测（答对 {correctQuizCount}/{QUIZ_ITEMS.length}）
          </h2>
          {Object.keys(quizAnswers).length > 0 && (
            <button type="button" className="back-pill" onClick={resetQuiz}>
              🔄 清空重测
            </button>
          )}
        </div>

        <div className="mastery-quiz-list">
          {QUIZ_ITEMS.map((item) => {
            const chosen = quizAnswers[item.id];
            const answered = chosen !== undefined;
            const isRight = chosen === item.answerIdx;

            return (
              <article key={item.id} className="mastery-quiz-card">
                <div className="mastery-quiz-qhead">
                  <span className="mastery-quiz-tag">{item.tag}</span>
                  <strong>{item.question}</strong>
                </div>

                <div className="mastery-quiz-opts">
                  {item.options.map((opt, oIdx) => {
                    let cls = 'mastery-opt-btn';
                    if (answered) {
                      if (oIdx === item.answerIdx) cls += ' is-correct';
                      else if (oIdx === chosen) cls += ' is-wrong';
                    }
                    return (
                      <button
                        key={opt}
                        type="button"
                        className={cls}
                        onClick={() => selectAnswer(item.id, oIdx)}
                      >
                        {'ABCD'[oIdx]}. {opt.replace(/^[A-D]\.\s*/, '')}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div className={`mastery-quiz-explain ${isRight ? 'is-ok' : 'is-err'}`}>
                    <p>
                      <strong>{isRight ? '✅ 答对了：' : '💡 正确做法：'}</strong>
                      {item.explanation}
                    </p>
                    <button
                      type="button"
                      className="mastery-inline-link"
                      onClick={() => onOpenQuestion(item.relatedQid)}
                    >
                      📖 打开对应的问题 →
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
