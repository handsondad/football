/**
 * 青少年足球成长国家标准、北京全年赛历与职业/体教/留洋通路参考全书
 * 纯粹客观的知识与政策资料汇编
 */

export type StageSpec = {
  readonly id: string;
  readonly uGroup: string;
  readonly ageLabel: string;
  readonly stageTitle: string;
  readonly color: string;
  readonly ball: string;
  readonly format: string;
  readonly pitchSize: string;
  readonly goalSize: string;
  readonly matchTime: string;
  readonly trainFreq: string;
  readonly techTacticFocus: readonly string[];
  readonly bodyMindFocus: readonly string[];
  readonly redLines: readonly string[];
  readonly questionIds: readonly string[];
};

export const STAGE_SPECS: readonly StageSpec[] = [
  {
    id: 'u5-u8',
    uGroup: 'U5 – U8',
    ageLabel: '5–8 岁 · 启蒙与基础一阶',
    stageTitle: '兴趣点燃、基本动作技能（FMS）与五人制 1v1 球感',
    color: '#2fb36d',
    ball: '3 号足球（幼儿启蒙可用1–2号软球）',
    format: '3v3 / 4v4 / 5v5（无越位）',
    pitchSize: '5人制：宽 18–25 米 × 长 25–36 米',
    goalSize: '高 2.00 米 × 宽 3.00 米',
    matchTime: '15 分钟 × 2（重在人人轮换出场）',
    trainFreq: '每周 2–3 次，单课 30–45 分钟（尽量1人1球）',
    techTacticFocus: [
      '双脚球感熟悉（拉球、拨球、踩停、脚内侧推传）',
      '鼓励大胆 1v1 运球突破与射门，建立球门与方向概念',
      '5 人制基础 `1-1-2-1` 单菱形空间感知，攻防全员参与',
    ],
    bodyMindFocus: [
      '跑、跳、急停、变向、单腿平衡、翻滚缓冲等多元动作协调',
      '广泛采样游泳、攀爬、体操、球拍类运动，储备丰富神经通路',
      '在百队杯普及组（U6不计名次）与小回超中建立纯粹比赛快乐',
    ],
    redLines: [
      '严禁十几人排长队无对抗踢死桩、严禁单调绕操场长跑体罚',
      '严禁反复练习硬球争顶头球、严禁穿天然草 FG 长钉上人草',
    ],
    questionIds: ['fms-coordination', 'ball-sizes', 'cleats-choice', 'huichao-story'],
  },
  {
    id: 'u9-u12',
    uGroup: 'U9 – U12',
    ageLabel: '9–12 岁 · 技术黄金期（基础二阶）',
    stageTitle: '双足第一触球定型、抬头扫描习惯与八人制三角战术桥梁',
    color: '#4d96ff',
    ball: '4 号标准球',
    format: '8v8 为主（引入越位规则，U12末期可初识11v11）',
    pitchSize: '8人制：宽 42–55 米 × 长 60–75 米',
    goalSize: '高 2.00 米 × 宽 5.00 米',
    matchTime: '20–25 分钟 × 2（年正式比赛建议控制在 20–30 场）',
    trainFreq: '每周 3–4 次训练（60–80 分钟）+ 周末 1 场分级联赛',
    techTacticFocus: [
      '高压逼抢下「有方向的第一脚触球（First Touch）」与半转身打开身体',
      '神经髓鞘化黄金期攻克「逆足脚」均衡传射，消除单足短板',
      '养成接球前高频「抬头扫描（Scanning）」习惯，掌握 8 人制 `1-3-3-1` 三角与菱形支援及反越位前插',
      '10岁以前多位置轮换（含门将），11–12岁逐步观察位置特长',
    ],
    bodyMindFocus: [
      '灵敏步频、反应速度与核心自重稳定，执行全套《FIFA 11+ Kids》防伤热身',
      '10 岁起完成北京市足协年度球员注册，征战京少联赛甲/乙/丙级升降级',
      '8–12 岁进入职业俱乐部球探视野，12 岁衔接北京国安 U12 走训梯队或足球特色初中',
    ],
    redLines: [
      '严禁在 U9–U11 过早打 11 人制大场搞功利大脚冲吊掩盖脚下粗糙',
      '警惕「跟骨骨骺炎（8–11岁脚后跟痛）」与相对年龄效应（RAE）对晚熟技术苗子的误判',
    ],
    questionIds: ['first-touch', 'weak-foot', 'golden-age', 'spaces-scan', 'beijing-pyramid', 'guoan-academy'],
  },
  {
    id: 'u13-u16',
    uGroup: 'U13 – U16',
    ageLabel: '13–16 岁 · 发展转型期（初高中衔接）',
    stageTitle: '踏上十一人制标准大场、四个时刻高压对抗与安全度过身高突增期',
    color: '#9b6bff',
    ball: '5 号 FIFA 标准比赛球',
    format: '标准 11v11 全场十一人制',
    pitchSize: 'FIFA 标准：宽 68 米 × 长 105 米',
    goalSize: '标准大门：高 2.44 米 × 宽 7.32 米',
    matchTime: 'U13–14 为 35 分钟×2；U15–16 为 40 分钟×2',
    trainFreq: '每周 5–6 次专项训练（75–95 分钟）+ 周末正式联赛',
    techTacticFocus: [
      '11v11 阵型体系（`1-4-3-3` / `1-4-2-3-1`）、五条纵向走廊与肋部空间利用',
      '比赛四个主要时刻高速转换：丢球后黄金 5 秒就地反抢与断球纵向反击',
      '大空间长传转移、高速身体对抗下的护球摆脱、定位球攻防战术与合理头球',
    ],
    bodyMindFocus: [
      '每季度监测站高与坐高，平稳度过青春期身高最大增长速率峰值（PHV）',
      '出战全国「中青赛」U13/U15、北京市锦标赛、希望杯及全国青少年三大球运动会 U16',
      '初三中考衔接：职业梯队深入培养 vs 昌平一中/人大附中/八一学校等高中特长生通道',
    ],
    redLines: [
      'PHV 猛蹿期严防「胫骨结节骨软骨炎（膝下鼓包痛）」，骨骺闭合前禁做大重量杠铃负重深蹲',
      '严禁因短期足球集训彻底荒废初中文化课与外语底子，保留正规学籍双轨主动权',
    ],
    questionIds: ['formations-war', 'four-moments', 'growth-plates', 'changping-schools', 'rae-latebloom'],
  },
  {
    id: 'u17-u21',
    uGroup: 'U17 – U21',
    ageLabel: '17–21 岁 · 提高与职业过渡期',
    stageTitle: '成年职业节奏接轨：中乙 B 队历练、国家一级/健将认证与成年留洋',
    color: '#f59e0b',
    ball: '5 号 FIFA Quality Pro 比赛球',
    format: '标准 11v11 成年强度竞赛',
    pitchSize: '68 米 × 105 米',
    goalSize: '2.44 米 × 7.32 米',
    matchTime: '45 分钟 × 2（常规 90 分钟 + 伤停补时）',
    trainFreq: '每周 6–8 练（含力量爆发力、录像战术分析与恢复再生）',
    techTacticFocus: [
      '极高对抗节奏与极小空间下的零失误一脚处理球与个人位置绝活',
      '针对不同对手的赛前战术博弈执行、全场 90 分钟高强度反复冲刺恢复能力（RSA）',
    ],
    bodyMindFocus: [
      '职业通道 A：征战 U21 精英联赛及「中超 B 队打中乙（具备冲甲资格）」，竞争中超/中甲一线队合同',
      '体教通道 B：凭三大球/全运会/中青赛 U17·U20 前八战绩获评「国家一级运动员/运动健将」，升入重点高校高水平运动队或体育单招',
      '留洋通道 C：年满 18 周岁跨过 FIFA 第 19 条限制，合规签约欧洲或日韩职业俱乐部梯队/一线队',
    ],
    redLines: [
      '签署首份成年职业合同或经纪协议前，务必由专业体育法律人士审阅违约金、出场保障与肖像权条款',
    ],
    questionIds: ['energy-run', 'grade-college', 'fifa-overseas', 'pro-pyramid'],
  },
];

export const BEIJING_CALENDAR: readonly {
  readonly season: string;
  readonly months: string;
  readonly event: string;
  readonly group: string;
  readonly note: string;
}[] = [
  {
    season: '冬春之交',
    months: '1–3 月',
    event: '北京市足协青少年球员年度注册 & 冬训备战',
    group: 'U10 及以上全年龄段',
    note: '在中国足协智慧平台提交北京市学籍证明、年度培训协议并携身份证核验（中青赛北京赛区通常3月初截止注册）。',
  },
  {
    season: '春季学期',
    months: '3–6 月',
    event: '京少联赛春季赛 · 回超与小回超揭幕 · 校园班超与区赛',
    group: 'U6–U17',
    note: '周末主干分级赛开打；5月中旬各区高中（昌平一中、人大附中、八一等）举行中考体育特长生校测与区统测。',
  },
  {
    season: '盛夏暑期',
    months: '7–8 月',
    event: '北京晚报百队杯（普及组+竞技组） & 全国暑期杯赛/海外夏令营',
    group: 'U6 至高中组',
    note: '8月上中旬两万人足球盛会（普及组重兴趣，竞技组 U8–U17 强队交锋）；中青赛全国总决赛阶段密集展开。',
  },
  {
    season: '金秋赛季',
    months: '9–10 月',
    event: '北京市青少年足球锦标赛 & 京少联赛秋季赛',
    group: 'U7–U18',
    note: '市体育局与市教委联合主办的市锦标赛在肖家河绿动天地、瀛海、四季青等赛区打响，代表各区最高竞技水准。',
  },
  {
    season: '初冬收官',
    months: '11–12 月',
    event: '北京市「希望杯」足球赛 & 职业俱乐部选拔/U21决战',
    group: 'U15 / U17 / U21',
    note: '希望杯汇聚体校、特色名校与俱乐部梯队，具备申报中国足协运动员技术等级资质。',
  },
];

export const GRADE_MATRIX: readonly {
  readonly level: string;
  readonly badgeColor: string;
  readonly coreEvents: string;
  readonly quotaRule: string;
  readonly valueUse: string;
}[] = [
  {
    level: '运动健将',
    badgeColor: '#dc2626',
    coreEvents: '世界杯/奥运会亚洲区出线、U20/U17亚洲杯前8名、中超前8名、中甲/全运会U20及U18决赛前8名、中乙前8名',
    quotaRule: '中超冠军授10人；全运会U20/中甲冠军授5人；全运会U18/中乙冠军授4人（按名次递减）',
    valueUse: '国内顶尖竞技荣誉，符合多所顶尖高校保送录取或最高等级高水平运动队破格资格',
  },
  {
    level: '国家一级运动员',
    badgeColor: '#d97706',
    coreEvents: '全国青少年三大球运动会（男U18/2026新增男U16）、全运会（U16/U18/U20）、学青会、中国青少年足球联赛（男U17/2026升级男U20）、中国足协青少年锦标赛（U13–U18对应组）及分档省市最高水平赛事',
    quotaRule: '三大球U18/全运U16第1名授16人；三大球男U16第1名授11人（4–8名各8人）；中青赛男U17/U20第1名授10人（5–8名各6人）',
    valueUse: '核心通行证！2027年起报考重点高校「高水平运动队」必备门槛（须一级证+近三年全国赛前八），亦可报考全国百余所高校「体育单招」',
  },
  {
    level: '国家二级运动员',
    badgeColor: '#2563eb',
    coreEvents: '省/直辖市体育行政部门与重点城市足协主办的年度最高水平青少年锦标赛/希望杯等达标赛事前八名',
    quotaRule: '通常按省级/重点城市分档标准：第1名授予参赛6人，第2–4名授予4人，第5–8名授予2人',
    valueUse: '报考全国高校「运动训练专业单独招生（体育单招）」及部分省市高中体育特长生招生的核心资质',
  },
];

/**
 * 北京市高级中等学校招收体育特长生（足球项目）统一测试 100 分结构拆解
 * （各区参照原市级统一测试标准执行区级统测，总分 100 分 = 身体素质 60 分 + 专项技术 40 分，60 分合格）
 */
export const BJ_HIGHSCHOOL_TEST_SPECS: readonly {
  readonly part: string;
  readonly weight: string;
  readonly item: string;
  readonly ruleAndFullScore: string;
}[] = [
  {
    part: '非守门员·身体素质',
    weight: '60 分（5项）',
    item: '①身高(10分) · ②30米跑(12分) · ③10米×4往返跑(12.5分) · ④立定跳远(12.5分) · ⑤1分钟仰卧起坐(13分)',
    ruleAndFullScore: '15岁男子满分基准参考：身高≥172cm(10分)、30米跑≤4.10s(12分)、10m×4往返跑≤9.8s(12.5分)、立定跳远≥2.50m级、仰卧起坐高次标准',
  },
  {
    part: '非守门员·技术①',
    weight: '40 分之 踢远',
    item: '定位球双脚踢远（10米宽有效区域内丈量第一落点）',
    ruleAndFullScore: '硬考逆足脚！左、右脚各助跑踢 2 次，最终成绩 =「左脚最远距离 + 右脚最远距离」之和（出 10 米宽走廊记 0 分）！',
  },
  {
    part: '非守门员·技术②',
    weight: '40 分之 绕杆',
    item: '40 米往返不等距 10 杆 S 形运球绕杆',
    ruleAndFullScore: '单程20米设10杆，杆距不等（1m-2m-3m-2m-3m-2m-1m-2m-3m-1m），S形往返回到起点线人球均过线停表，碰倒杆或漏杆须补过',
  },
  {
    part: '非守门员·技术③',
    weight: '40 分之 射准',
    item: '11 米五区球门顺时针射准（14–16岁用5号球距门11米）',
    ruleAndFullScore: '7.32×2.44m球门设中区(1.5×1.5m)与四角(宽1.5×高0.8m)共五区：连踢5球须按「中区→下右→下左→上左→上右」顺时针依次命中（第一落点须在门内）',
  },
  {
    part: '守门员独立通道',
    weight: '100 分（素+技）',
    item: '素质：身高、立定跳远、纵跳摸高、仰卧起坐、引体向上 ｜ 技术：发球踢远、手掷球远度、1分钟连续扑接球',
    ruleAndFullScore: '守门员单独建项考评，重点考核站立/助跑摸高爆发力、侧扑连续反应敏捷度及手抛与脚发球的距离和落点准确度',
  },
];
