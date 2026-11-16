import { useState, type CSSProperties } from 'react';
import { SourcesList } from '../components/Cite.tsx';
import {
  BEIJING_CALENDAR,
  BJ_HIGHSCHOOL_TEST_SPECS,
  GRADE_MATRIX,
  STAGE_SPECS,
} from '../data/pathway-atlas.ts';
import { questionById, topicById } from '../content/registry.ts';
import { SOURCE_BY_ID, SOURCES } from '../data/sources.ts';
import type { Source } from '../data/types.ts';

export function PathwayPage({
  heard,
  onOpenQuestion,
  onBackHome,
}: {
  heard: readonly string[];
  onOpenQuestion: (id: string) => void;
  onBackHome: () => void;
}) {
  const [stageIdx, setStageIdx] = useState(0);
  const stage = STAGE_SPECS[stageIdx];

  const sources: readonly Source[] = SOURCES;
  void SOURCE_BY_ID;

  return (
    <div className="subpage">
      <header className="page-top">
        <button type="button" className="back-pill" onClick={onBackHome}>
          ← 回到首页
        </button>
        <div className="page-head-meta">
          <span>训练大纲参数 · 北京全年赛历 · 运动员技术等级 · 职业/体教/留洋三线对照</span>
          <h1>🏆 青训标准与职业通路全书</h1>
          <p className="page-sub">
            汇总《中国足协青少年训练大纲》、北京市足协竞赛注册规程、国家运动员技术等级标准与国际足联转会法规核心数据
          </p>
        </div>
      </header>

      {/* 一、U5 → U21 各年龄段训练与竞赛国家标准 */}
      <section className="atlas-section" aria-labelledby="sec-stages">
        <h2 id="sec-stages" className="atlas-h2">
          一、U5 → U21 各年龄段训练与比赛国家标准（点击年龄段切换详情）
        </h2>

        <div className="roadmap-stepper four-cols" role="tablist">
          {STAGE_SPECS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={idx === stageIdx}
              className={`step-tab ${idx === stageIdx ? 'is-active' : ''}`}
              style={{ '--c': item.color } as CSSProperties}
              onClick={() => setStageIdx(idx)}
            >
              <span className="step-age">{item.ageLabel}</span>
              <strong>{item.uGroup}</strong>
              <small>
                {item.ball.slice(0, 4)} · {item.format.split('（')[0]}
              </small>
            </button>
          ))}
        </div>

        <article className="stage-detail" style={{ '--c': stage.color } as CSSProperties}>
          <div className="stage-banner">
            <div>
              <span className="stage-years">{stage.uGroup} · {stage.ageLabel}</span>
              <h3>{stage.stageTitle}</h3>
              <div className="stage-redlines">
                <strong>⚠️ 本阶段核心禁忌与防伤红线：</strong>
                <ul>
                  {stage.redLines.map((rl) => (
                    <li key={rl}>{rl}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="stage-specs">
              <div>
                <small>⚽ 标准用球</small>
                <strong>{stage.ball}</strong>
              </div>
              <div>
                <small>👥 竞赛赛制</small>
                <strong>{stage.format}</strong>
              </div>
              <div>
                <small>📐 场地与球门规格</small>
                <strong>
                  {stage.pitchSize} ｜ 球门 {stage.goalSize}
                </strong>
              </div>
              <div>
                <small>⏱️ 比赛时长与周训练频次</small>
                <strong>
                  {stage.matchTime} ｜ {stage.trainFreq}
                </strong>
              </div>
            </div>
          </div>

          <div className="stage-two-col">
            <div className="stage-box">
              <h3>🦶 技术与战术培养核心</h3>
              <ul className="milestone-list">
                {stage.techTacticFocus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="stage-box">
              <h3>🦁 身体、心智与赛事衔接节点</h3>
              <ul className="milestone-list">
                {stage.bodyMindFocus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="stage-questions">
            <h3>📖 延伸阅读问答</h3>
            <div className="qlist-grid">
              {stage.questionIds.map((qid) => {
                const q = questionById(qid);
                if (!q) return null;
                const tp = topicById(q.topic);
                const isRead = heard.includes(q.id);
                return (
                  <button
                    key={q.id}
                    type="button"
                    className={`qlist-card ${isRead ? 'is-heard' : ''}`}
                    style={{ '--bubble': tp?.color ?? stage.color } as CSSProperties}
                    onClick={() => onOpenQuestion(q.id)}
                  >
                    <strong>{q.title}</strong>
                    <span className="qlist-badges">
                      {tp && (
                        <em>
                          {tp.emoji} {tp.short}
                        </em>
                      )}
                      {isRead ? <em className="is-star">⭐ 看过</em> : <em>打开详解 →</em>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </article>
      </section>

      {/* 二、北京青少年足球全年竞赛与注册日历 */}
      <section className="atlas-section" aria-labelledby="sec-calendar">
        <h2 id="sec-calendar" className="atlas-h2">
          二、北京青少年足球全年赛事与注册日历（1月 → 12月）
        </h2>
        <div className="calendar-list">
          {BEIJING_CALENDAR.map((row) => (
            <div key={row.months} className="cal-row">
              <div className="cal-time">
                <strong>{row.months}</strong>
                <span>{row.season}</span>
              </div>
              <div className="cal-body">
                <div className="cal-head">
                  <strong>{row.event}</strong>
                  <em className="cal-group">{row.group}</em>
                </div>
                <p>{row.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 三、运动员技术等级标准速查矩阵 */}
      <section className="atlas-section" aria-labelledby="sec-grades">
        <h2 id="sec-grades" className="atlas-h2">
          三、《中国足球协会足球运动员技术等级标准（2025版及2026调整）》核心速查
        </h2>
        <div className="grade-cards">
          {GRADE_MATRIX.map((g) => (
            <div
              key={g.level}
              className="grade-card"
              style={{ '--c': g.badgeColor } as CSSProperties}
            >
              <span className="grade-badge">{g.level}</span>
              <p>
                <strong>🏟️ 达标核心赛事：</strong>
                {g.coreEvents}
              </p>
              <p>
                <strong>📊 授予名额规则：</strong>
                {g.quotaRule}
              </p>
              <p>
                <strong>🎓 升学与职业价值：</strong>
                {g.valueUse}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 四、北京中考足球特长生区级统测 100 分项目拆解 */}
      <section className="atlas-section" aria-labelledby="sec-hs-test">
        <h2 id="sec-hs-test" className="atlas-h2">
          四、北京高中阶段足球特长生统一测试 100 分标准拆解（素质60分 + 技术40分）
        </h2>
        <div className="calendar-list">
          {BJ_HIGHSCHOOL_TEST_SPECS.map((sp) => (
            <div key={sp.part} className="cal-row">
              <div className="cal-time">
                <strong>{sp.part}</strong>
                <span>{sp.weight}</span>
              </div>
              <div className="cal-body">
                <div className="cal-head">
                  <strong>{sp.item}</strong>
                </div>
                <p>{sp.ruleAndFullScore}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 五、三条成才通路全景对照 */}
      <section className="atlas-section" aria-labelledby="sec-tracks">
        <h2 id="sec-tracks" className="atlas-h2">
          五、青少年足球三条发展通路对照
        </h2>
        <div className="workbench-grid">
          <div className="track-card">
            <h3>🦁 通路一：职业俱乐部青训梯队</h3>
            <p>
              <strong>典型路径：</strong>U8–U11 社会/校园强队打京少甲级与百队杯 → U12 选拔进入<strong>北京国安南北走训梯队</strong>（兼顾原中学学业）或鲁能/浙江等全日制足校 → U15–U20 全国精英联赛/中青赛 → <strong>U21 升入中乙 B 队（具备冲甲资格）</strong> → 中超/中甲一线队职业合同。
            </p>
          </div>
          <div className="track-card">
            <h3>🎓 通路二：体教融合名校双轨</h3>
            <p>
              <strong>典型路径：</strong>全国校园足球特色小学（育翔回龙观/育新科星路等）→ 足球传统初高中（昌平一中/清华附昌平/一〇一，或海淀学籍考人大附三高/八一）→ 打中青赛/三大球/希望杯获<strong>国家一级运动员</strong> → 考取重点大学高水平运动队或体育单招 → 踢大学联赛/U20再冲职业或深造足球产业。
            </p>
          </div>
          <div className="track-card">
            <h3>🌍 通路三：国际交流与合规留洋</h3>
            <p>
              <strong>典型路径：</strong>严格遵守 <strong>FIFA《球员身份与转会规定》第19条（未满18周岁禁止跨国转会注册）</strong>：U10–U16 利用寒暑假参加欧洲/日本高水平邀请赛与海外短期访学（保留国内正式联赛出场率）→ <strong>年满 18 周岁</strong>凭中青赛/国青表现正式签约欧洲或亚洲职业俱乐部留洋。
            </p>
          </div>
        </div>
      </section>

      <SourcesList sources={sources} />
    </div>
  );
}
