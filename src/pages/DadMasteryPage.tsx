import { useMemo, useState, type CSSProperties } from 'react';
import {
  footballQuestions,
  questionsIn,
  topicById,
  type TopicId,
} from '../content/registry.ts';

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
    title: '安全护航与规则筑底',
    badge: '零基础必读 · 先守住不伤娃底线',
    color: '#16a34a',
    goal: '选对人工草 TF/AG 球鞋防膝伤，掌握生长突增期（PHV）骨骺炎预警与 FIFA 11+ 热身，吃透越位、手球及 2025/26 最新门将 8 秒角球规则。',
    topicIds: ['pitch-gear', 'rules-ref', 'body-health'],
  },
  {
    id: 'stage-2',
    step: '第 2 阶',
    emoji: '👟',
    title: '亲自触球与家庭陪练',
    badge: '建立脚感 · 能给孩子稳稳喂好球',
    color: '#0d9488',
    goal: '通过「一面墙 200 脚」练出锁死脚踝 90° 的稳准推传，搞懂半转身第一触球、假动作重心欺骗、五人制脚底控球、单刀推远角与点球意外双触新规。',
    topicIds: ['skills-ball', 'coach-ref-practice', 'football-family', 'match-craft'],
  },
  {
    id: 'stage-3',
    step: '第 3 阶',
    emoji: '📋',
    title: '青训教学与心理康复',
    badge: '校园助教级 · 能带十个娃流畅踢球',
    color: '#2563eb',
    goal: '掌握 FUNiño 四球门与引导式提问、回程车上清凉沟通边界、两分钟战术磁板、一日多赛快碳补给及伤后单腿跳 LSI≥90% 复出测试。',
    topicIds: ['youth-science', 'mind-game', 'gk-rts-matchread'],
  },
  {
    id: 'stage-4',
    step: '第 4 阶',
    emoji: '🔭',
    title: '战术解剖与球探之眼',
    badge: '战术参谋级 · 一眼看穿 90 分钟棋局',
    color: '#7c3aed',
    goal: '不再追着球看热闹：看懂 3-2-5 五走廊肋部、四后卫弹力绳、盲侧潜行与背身支点、1v1 侧身碎步延缓、球探 80% 无球考察法则、xG/PSxG 数据模型与开场 10 分钟四维审计。',
    topicIds: ['tactics-board', 'defense-setpieces', 'offball-duels', 'scouting-tech'],
  },
  {
    id: 'stage-5',
    step: '第 5 阶',
    emoji: '🏆',
    title: '宏大视野与升学通路',
    badge: '全科通识专家 · 贯通百年文化与长远规划',
    color: '#ea580c',
    goal: '贯通百年阵型倒转金字塔、传奇门神与球王战例、世界四大青训圣殿、铿锵玫瑰与村超文化、周微周期 ACWR 负荷管理，以及京北球场学区、中考统测与 10 岁注册合同风控。',
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
    title: '亲自完成「一面墙 200 脚」双足锁踝推传',
    detail: '穿碎钉鞋距墙 4 米摆两个水瓶当靶门，左右脚各定桩推传 50 次 + 领球转移 100 次，亲身体会勾脚尖锁脚腕的本体感觉。',
    linkHash: '#/drills/drill-dad-wall-200',
    linkLabel: '查看 DR-17 教案',
  },
  {
    id: 'ft-flashlight-line',
    icon: '🔦',
    title: '带孩子做一次「手电筒垂直投影压线球」实验',
    detail: '把球放在地板砖线外侧边缘，对比侧面平视空隙与头顶垂直光照投影，彻底搞懂 100% 整体越线规则。',
    linkHash: '#/q/glt-var-saot-tech',
    linkLabel: '查看门线投影课',
  },
  {
    id: 'ft-phv-check',
    icon: '📏',
    title: '给孩子测一次季度身高增速并排查跟骨/膝下压痛',
    detail: '在站内体测与生长监测台输入身高数据，建立每季度监测 PHV 生长突增红绿灯的防伤习惯。',
    linkHash: '#/drills',
    linkLabel: '打开 PHV 预警器',
  },
  {
    id: 'ft-5min-offball',
    icon: '👀',
    title: '看直播连续 5 分钟「完全不看球」只盯一名中场',
    detail: '强迫视线离开足球，专门数罗德里/佩德里等中场大师在无球时回头扫描了几次、怎么躲开防守阴影。',
    linkHash: '#/q/live-scouting-eye',
    linkLabel: '查看球探之眼课',
  },
  {
    id: 'ft-10min-audit',
    icon: '📝',
    title: '用四格便签纸完成一场比赛「开场 10 分钟战术审计」',
    detail: '在比赛第 10 分钟独立写下双方门球出球结构、压迫防线高度与最空虚的转换肋部，全场验证预判。',
    linkHash: '#/q/ninety-min-match-audit',
    linkLabel: '查看读赛清单课',
  },
  {
    id: 'ft-high-cam',
    icon: '🎥',
    title: '站看台高处横屏广角录 10 分钟比赛做「3:1 正向复盘」',
    detail: '戒掉草皮边追着孩子特写晃动拍摄，剪出 3 段抬头接应高光 + 1 个定格暂停提问陪孩子玩侦探游戏。',
    linkHash: '#/q/video-analysis-cam',
    linkLabel: '查看视频复盘课',
  },
  {
    id: 'ft-nested-grid',
    icon: '⛳',
    title: '用「大框套小框」零排队带 6+ 个小朋友踢完 40 分钟',
    detail: '提前 10 分钟铺好内外双色标志碟、让孩子背对太阳踩球听 30 秒规则，全程保持 70% 以上时间球在滚动。',
    linkHash: '#/drills/drill-u8-nested-grid',
    linkLabel: '查看 DR-18 控场课',
  },
  {
    id: 'ft-cla-tune',
    icon: '📐',
    title: '不靠嘴骂，亲手「挪两步标志盘」调出 6–10 脚抢圈甜点',
    detail: '在草坪抢圈频频丢球时，实践外扩标志盘或加入黄背心自由人，亲眼验证环境约束（CLA）的魔力。',
    linkHash: '#/q/drill-space-tuning',
    linkLabel: '查看空间配平课',
  },
  {
    id: 'ft-referee-once',
    icon: '⚖️',
    title: '周末少儿赛客串一次主裁或边裁，跑出 S 型对角线',
    detail: '赛前检查球门防倾倒配重与护腿板，实战演练斜侧 12 米观察走廊、与最后后卫齐平移动及双臂「进攻有利」手势。',
    linkHash: '#/q/referee-positioning-signals',
    linkLabel: '查看客串裁判课',
  },
  {
    id: 'ft-cool-car',
    icon: '🚗',
    title: '连续 3 次赛后回家车上守住「零复盘指责、只说喜欢看你踢球」',
    detail: '把车厢还给安全感与西瓜冷饮，等隔天情绪平静后再用开放式好奇提问交流。',
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
      'B. 直接判给对方一记角球（IFAB 2025/26 第12.2条新规）',
      'C. 只口头警告门将，伤停补时补回8秒即可',
    ],
    answerIdx: 1,
    explanation: '自 2025/26 赛季起 IFAB 正式实施门将 8 秒持球新规：主裁在最后 5 秒举手可视化倒数，超时直接判给对方角球！',
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
    explanation: '根据 IFAB 第 31 号通告及第 14 章修订：区分意外打滑与故意二触——意外双触且罚进判重新主罚；若未罚进则计罚失（常规时间判间接任意球）。',
    relatedQid: 'penalty-craft',
  },
  {
    id: 'qz-3',
    tag: '骨骺防伤',
    question: '3. 11 岁男孩近三个月猛长高了 3.5 厘米，踢完球总指着脚后跟底部喊疼（早上起床第一步也疼），但没摔倒扭伤过，爸爸该怎么做？',
    options: [
      'A. 小孩生长痛很正常，买瓶红花油揉一揉继续练蛙跳冲刺',
      'B. 高度警惕跟骨骨骺炎（Sever氏病）：立即停掉硬地跑跳冲刺，换厚底缓震鞋加硅胶跟垫，改练核心与坐姿球感',
      'C. 说明缺钙，多喝骨头汤周末杯赛绑紧鞋带照常踢满全场',
    ],
    answerIdx: 1,
    explanation: '年化身高增速 >7–8 cm/年即处于 PHV 身高突增高峰，跟腱牵拉未闭合跟骨生长板极易引发骨骺炎，硬顶蛙跳会导致骨突撕脱！',
    relatedQid: 'growth-plates',
  },
  {
    id: 'qz-4',
    tag: '带队调优',
    question: '4. 你周末带 8 岁孩子们玩 4v2 抢圈，照着成人教案摆了 7×7 米方格，结果外圈孩子每次传不过两脚就被断掉垂头丧气，最内行的即时调整是？',
    options: [
      'A. 吹哨集合严厉批评大家基本功太差，罚做十个俯卧撑',
      'B. 规定外圈必须全部一脚出球不许停球',
      'C. 一句话不骂，走过去把四个标志碟往外各挪大两三步扩成 12×12 米，立刻回到 6–10 脚连传甜点区',
    ],
    answerIdx: 2,
    explanation: '约束主导教学法（CLA）核心：U8 儿童停球观察耗时更长，需 18–25 m²/人空间；挪宽标志盘即可瞬间留出抬头扫描窗口！',
    relatedQid: 'drill-space-tuning',
  },
  {
    id: 'qz-5',
    tag: '伤后复出',
    question: '5. 孩子两周前踢球崴了右脚踝，今天上下楼和慢跑已经完全不疼了，周六有一场区长杯淘汰赛，能不能让他首发踢全场？',
    options: [
      'A. 不能拍脑袋放行！须测闭眼单脚站与单腿远跳对称指数（伤腿距离达到好腿 90% 以上）且次日零肿胀，首战从替补 15 分钟起',
      'B. 只要走路慢跑不疼就说明韧带长好了，缠两圈胶布首发没问题',
      'C. 歇够整整 14 天日历天数就自动达标可以踢满全场',
    ],
    answerIdx: 0,
    explanation: '痛觉消退远早于韧带本体感觉与离心肌力恢复！伯尔尼 RTS 共识要求单腿跳 LSI ≥90% 方可重返对抗，否则极易发展成习惯性崴脚。',
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
    question: '8. 职业青训球探去现场考察 U11 比赛，他的眼睛 80% 的时间主要在观察什么？',
    options: [
      'A. 谁长得最高最壮、这场比赛一共进了几个远射',
      'B. 球员无球时有没有提前回头扫描、受压下第一脚能否顺领向空当、以及丢球后 3 秒是反抢还是摊手抱怨',
      'C. 谁在没人防守的时候能连续踩五个单车过人',
    ],
    answerIdx: 1,
    explanation: '早熟身高优势在 15 岁后会拉平，而接球前扫描频率、受压定向第一触球与转换零延迟态度是跨年龄最稳定的球商基因。',
    relatedQid: 'live-scouting-eye',
  },
  {
    id: 'qz-9',
    tag: '一日多赛',
    question: '9. 周末杯赛上午 10 点刚踢完第一场，下午 1 点半又要踢半决赛，中午这两小时给孩子怎么安排饮食恢复最科学？',
    options: [
      'A. 带全队去吃顿丰盛的炸鸡汉堡牛排大餐犒劳补充体力',
      'B. 终场 20 分钟内先吃香蕉/蜂蜜白吐司配电解质水快补糖原，立刻换干衣袜去树荫垫高双腿休息，下午赛前重做 8 分钟动态唤醒',
      'C. 给十岁孩子喝一罐冰镇提神功能饮料顶住困意',
    ],
    answerIdx: 1,
    explanation: '高脂油炸食物需 4–5 小时排空会导致下午岔气腿软；抓住赛后 30 分钟糖原窗口补充高 GI 低脂碳水+换干衣袜才是职业队医方案。',
    relatedQid: 'youth-tournament-day',
  },
  {
    id: 'qz-10',
    tag: '女足科学',
    question: '10. 12 岁女孩进入青春期后热爱踢足球，为预防女足高发的前交叉韧带（ACL）损伤，装备与热身最关键的两件事是？',
    options: [
      'A. 买大一码的成人长刀钉（FG）球鞋抓地更牢，平时节食减重跑得轻',
      'B. 人工草穿短圆钉/碎钉防旋转锁死，每次热身必练单脚轻柔落地「膝盖对准脚尖不内扣」及臀腿后侧力量，吃足碳水与红肉补铁',
      'C. 少踢对抗比赛，只站在原地练射门',
    ],
    answerIdx: 1,
    explanation: '欧足联女足医学共识：每周 2–3 次防膝内扣神经肌肉热身与腘绳肌强化可砍掉 50%–65% 的 ACL 损伤，人工草严禁长刀钉锁死！',
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
      'B. 坚守中国足协与国际足联未成年保护底线：12岁以下坚持兴趣走训或「一年一签」，绝不盲目签署跨学段高额违约金卖身长约',
      'C. 先签了再说，反正未成年人合同以后随时能作废不用管',
    ],
    answerIdx: 1,
    explanation: 'U12 以前学业与升学学籍变数极大，长期排他培训协议一旦与初中特长生升学通道冲突，撤证注销纠纷极易耽误孩子两年黄金踢球期！',
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
      ? { level: '🏆 Lv.5 准持证足球专家', hint: '理论、实操与临场判罚全面通关，随时可报考足协 D 级教练或三级裁判班！' }
      : overallScore >= 70
        ? { level: '🔭 Lv.4 战术球探与读赛参谋', hint: '已具备超越 99% 球迷的全景拆解眼光与科学防护体系！' }
        : overallScore >= 45
          ? { level: '📋 Lv.3 校园足球金牌助教', hint: '既能带十几个孩子零排队踢出高质量训练课，又能稳稳守住安全红线！' }
          : overallScore >= 20
            ? { level: '🛡️ Lv.2 科学防伤护航员', hint: '已避开鞋钉、骨骺炎与场边瞎指挥三大新手深坑，继续解锁球感与战术！' }
            : { level: '🌱 Lv.1 绿茵见习球爸', hint: '欢迎启程！按下方「第1阶→第5阶」循序点亮课题并完成草坪打卡，稳步蜕变为专家！' };

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
          <span>五阶渐进课表 · 10 项草坪实操补完计划 · 12 道临场判罚与带队闯关真题</span>
          <h1>🎓 小白爸爸 → 足球专家通关中心</h1>
          <p className="page-sub">
            把全站 {MASTERY_STAGES.reduce((n, s) => n + s.topicIds.length, 0)} 大领域、{totalLessons} 课双层知识与「书本外那 20% 亲自触球及带队实操」串成一张清晰可追踪的进阶地图
          </p>
        </div>
      </header>

      {/* 顶部实时段位总览卡 */}
      <section className="mastery-hero-card" aria-label="专家成长总进度">
        <div className="mastery-hero-top">
          <div>
            <span className="mastery-rank-pill">{rankInfo.level}</span>
            <p className="mastery-rank-hint">{rankInfo.hint}</p>
          </div>
          <div className="mastery-score-box">
            <b>{overallScore}%</b>
            <small>综合专家完备度</small>
          </div>
        </div>

        <div className="mastery-bar-track" aria-hidden="true">
          <div className="mastery-bar-fill" style={{ width: `${Math.max(4, overallScore)}%` }} />
        </div>

        <div className="mastery-metrics-row">
          <div className="mastery-metric-chip">
            <strong>📚 理论认知（占50%）</strong>
            <span>已学 {readCount} / {totalLessons} 课</span>
          </div>
          <div className="mastery-metric-chip">
            <strong>🏟️ 草坪实操（占25%）</strong>
            <span>已打卡 {doneTasks.length} / {FIELD_TASKS.length} 项</span>
          </div>
          <div className="mastery-metric-chip">
            <strong>⚡ 临场考场（占25%）</strong>
            <span>答对 {correctQuizCount} / {QUIZ_ITEMS.length} 题</span>
          </div>
        </div>
      </section>

      {/* 一、五阶系统学习路线图 */}
      <section className="atlas-section" aria-labelledby="sec-mastery-map">
        <h2 id="sec-mastery-map" className="atlas-h2">
          一、五阶系统学习路线图（告别盲目乱翻，按科学顺序通关）
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
              <span className="mastery-all-clear">🎉 本阶段课题已 100% 通关！</span>
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
          二、补齐书本外那 20%：10 项线下触球、读赛与控场实操打卡（自动保存进度）
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

      {/* 三、12 道实战情境闯关考场 */}
      <section className="atlas-section" aria-labelledby="sec-expert-quiz">
        <div className="mastery-quiz-header">
          <h2 id="sec-expert-quiz" className="atlas-h2">
            三、临场判罚 · 防伤急救 · 带队调优 12 题实战考场（当前答对 {correctQuizCount}/{QUIZ_ITEMS.length}）
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
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div className={`mastery-quiz-explain ${isRight ? 'is-ok' : 'is-err'}`}>
                    <p>
                      <strong>{isRight ? '✅ 判断精准！' : '💡 专家纠偏：'}</strong>
                      {item.explanation}
                    </p>
                    <button
                      type="button"
                      className="mastery-inline-link"
                      onClick={() => onOpenQuestion(item.relatedQid)}
                    >
                      📖 打开对应课题深读原理 →
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
