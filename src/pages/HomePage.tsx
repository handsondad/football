import { useMemo, useState, type CSSProperties } from 'react';
import { HeroPitchStage } from '../components/HeroPitchStage.tsx';
import {
  LEXICON_TERMS,
  TRAINING_DRILLS,
  difficultyLabel,
  footballQuestions,
  footballTopics,
  pickRandomQuestion,
  questionsIn,
  searchQuestions,
  topicById,
  type TopicId,
} from '../content/registry.ts';
import { HLG_RESOURCES } from '../data/hlg-resources.ts';

type Props = {
  heard: readonly string[];
  onTopic: (id: TopicId) => void;
  onOpenQuestion: (id: string) => void;
  onNavigate: (hash: string) => void;
};

export function HomePage({
  heard,
  onTopic,
  onOpenQuestion,
  onNavigate,
}: Props) {
  const [query, setQuery] = useState('');

  const trimmed = query.trim();
  const matches = useMemo(() => (trimmed ? searchQuestions(trimmed) : []), [trimmed]);
  const totalHeard = useMemo(
    () => footballQuestions.filter((q) => heard.includes(q.id)).length,
    [heard]
  );

  return (
    <div className="home">
      <header className="home-title">
        <h1>
          <span aria-hidden="true">⚽</span> 足球奇遇记
        </h1>
        <p>小念一问，爸爸一答，把足球世界的门道摸个透彻</p>
      </header>

      <section aria-label="绿茵对话舞台">
        <HeroPitchStage />
      </section>

      <section className="home-finder" aria-label="搜索足球问题与资料">
        <div className="home-finder-bar">
          <label className="home-search">
            <span aria-hidden="true">🔍</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜一搜：比如 小罗、亚马尔、梅西餐巾纸、圆月弯刀、越位、青训、世界杯、回超……"
              aria-label="搜索足球问题"
            />
            {query && (
              <button
                type="button"
                className="home-search-clear"
                onClick={() => setQuery('')}
                aria-label="清空搜索"
              >
                ✕
              </button>
            )}
          </label>
          <button
            type="button"
            className="home-random"
            onClick={() => onOpenQuestion(pickRandomQuestion(heard).id)}
          >
            🎲 随便问一题
          </button>
        </div>

        {trimmed && (
          <div className="home-results" aria-live="polite">
            <p className="home-results-meta">
              {matches.length > 0
                ? `找到 ${matches.length} 个相关问题：`
                : '没搜到这个词，试试「越位」「角球」「界外球」「xG」「骨骺」「箭头跑」「特长生」「回超」？'}
            </p>
            {matches.length > 0 && (
              <div className="qlist-grid">
                {matches.map((question) => {
                  const tp = topicById(question.topic);
                  const isDone = heard.includes(question.id);
                  return (
                    <button
                      key={question.id}
                      type="button"
                      className={`qlist-card ${isDone ? 'is-heard' : ''}`}
                      style={{ '--bubble': tp?.color ?? '#2fb36d' } as CSSProperties}
                      onClick={() => onOpenQuestion(question.id)}
                    >
                      <strong>{question.title}</strong>
                      <span className="qcard-pro-line">{question.proSubtitle}</span>
                      <span className="qlist-badges">
                        {tp && (
                          <em>
                            {tp.emoji} {tp.short}
                          </em>
                        )}
                        <em>{difficultyLabel[question.difficulty]}</em>
                        {isDone && <em className="is-star">⭐ 看过</em>}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      <section aria-labelledby="home-topics-title">
        <div className="home-section-head">
          <h2 id="home-topics-title" className="home-section-title">
            足球分类
          </h2>
          <span className="home-total">
            共 {footballQuestions.length} 个问题
            {totalHeard > 0 && ` · ⭐ 看过 ${totalHeard}`}
          </span>
        </div>

        <div className="home-systems">
          {footballTopics.map((topic) => {
            const list = questionsIn(topic.id);
            const done = list.filter((q) => heard.includes(q.id)).length;
            return (
              <button
                key={topic.id}
                type="button"
                className="system-card"
                style={{ '--bubble': topic.color } as CSSProperties}
                onClick={() => onTopic(topic.id)}
              >
                <span className="system-emoji" aria-hidden="true">
                  {topic.emoji}
                </span>
                <div>
                  <strong>{topic.title}</strong>
                </div>
                <small>{topic.kidHook}</small>
                <span className="sys-pro-lens">{topic.dadLens}</span>
                <span className="system-count">
                  {list.length} 个问题{done > 0 && ` · ⭐ 看过 ${done}`} →
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="home-atlas-title" className="home-workbench">
        <div className="home-section-head">
          <h2 id="home-atlas-title" className="home-section-title">
            工具与资料汇编
          </h2>
        </div>

        <div className="workbench-grid five-tools">
          <button
            type="button"
            className="wb-card"
            style={{ '--bubble': '#16a34a' } as CSSProperties}
            onClick={() => onNavigate('#/mastery')}
          >
            <span className="wb-icon" aria-hidden="true">🎓</span>
            <div>
              <strong>小白爸爸 → 足球专家通关路线</strong>
              <p>五阶系统学习地图、补齐书本外 20% 的 10 项草坪触球与读赛打卡、12 道临场判罚与防伤闯关考场。</p>
              <span className="wb-meta">5 阶课表 · 实操打卡 · 闯关自测 →</span>
            </div>
          </button>

          <button
            type="button"
            className="wb-card"
            style={{ '--bubble': '#9b6bff' } as CSSProperties}
            onClick={() => onNavigate('#/lab')}
          >
            <span className="wb-icon" aria-hidden="true">🎛️</span>
            <div>
              <strong>战术与规则沙盘</strong>
              <p>越位定格、1–11号热区、3-2-5攻防变阵、CLA场地配平与客串裁判跑位、xG/xT模型、FUNiño四球门与风洞。</p>
              <span className="wb-meta">12 台交互模拟器 →</span>
            </div>
          </button>

          <button
            type="button"
            className="wb-card"
            style={{ '--bubble': '#14b8a6' } as CSSProperties}
            onClick={() => onNavigate('#/drills')}
          >
            <span className="wb-icon" aria-hidden="true">📋</span>
            <div>
              <strong>训练教案与 2026 体测标准</strong>
              <p>{TRAINING_DRILLS.length} 套带场地布置图的分级教案 + 足协×体科所 2026 版四分位体测评估器 + PHV 生长速率监测。</p>
              <span className="wb-meta">教案图卡 + 体测计算 →</span>
            </div>
          </button>

          <button
            type="button"
            className="wb-card"
            style={{ '--bubble': '#4d96ff' } as CSSProperties}
            onClick={() => onNavigate('#/lexicon')}
          >
            <span className="wb-icon" aria-hidden="true">📖</span>
            <div>
              <strong>中英双语足球术语词典</strong>
              <p>收录 Juego de Posición、Half-Space、La Pausa、PPDA、Bio-banding、DOGSO 等核心概念。</p>
              <span className="wb-meta">{LEXICON_TERMS.length} 个术语词条 →</span>
            </div>
          </button>

          <button
            type="button"
            className="wb-card"
            style={{ '--bubble': '#ff6b6b' } as CSSProperties}
            onClick={() => onNavigate('#/map')}
          >
            <span className="wb-icon" aria-hidden="true">📍</span>
            <div>
              <strong>回龙观与京北足球地图</strong>
              <p>回龙观体育中心/奥北上东/西三旗/肖家河球场、昌平39所全国特色校名录、1+3直升与特长生学校。</p>
              <span className="wb-meta">{HLG_RESOURCES.length} 处实地资料 →</span>
            </div>
          </button>

          <button
            type="button"
            className="wb-card"
            style={{ '--bubble': '#f59e0b' } as CSSProperties}
            onClick={() => onNavigate('#/pathway')}
          >
            <span className="wb-icon" aria-hidden="true">🏆</span>
            <div>
              <strong>青训标准、中考统测与职业通路</strong>
              <p>U5→U21 国标参数、北京全年赛历、北京中考足球特长生100分评分标准、一级运动员与职业/留洋通路。</p>
              <span className="wb-meta">赛制 · 统测 · 等级标准 →</span>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
