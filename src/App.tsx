import { useEffect, useRef, useState } from 'react';
import {
  footballQuestions,
  questionById,
  topicById,
  type TopicId,
} from './content/registry.ts';
import { useHeardQuestions } from './hooks/useHeardQuestions.ts';
import { useReadLens } from './hooks/useReadLens.ts';
import { CategoryPage } from './pages/CategoryPage.tsx';
import { DrillsBenchPage } from './pages/DrillsBenchPage.tsx';
import { HlgMapPage } from './pages/HlgMapPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { LexiconPage } from './pages/LexiconPage.tsx';
import { PathwayPage } from './pages/PathwayPage.tsx';
import { QuestionPage } from './pages/QuestionPage.tsx';
import { TacticsLabPage } from './pages/TacticsLabPage.tsx';

type Route =
  | { page: 'home' }
  | { page: 'topic'; topicId: TopicId }
  | { page: 'question'; id: string }
  | { page: 'lab' }
  | { page: 'drills'; drillId?: string }
  | { page: 'lexicon'; termId?: string }
  | { page: 'map' }
  | { page: 'pathway' };

function parseRoute(hash: string): Route {
  const [, rawPage, rawParam] = hash.replace(/^#/, '').split('/');
  const param = rawParam ? decodeURIComponent(rawParam) : undefined;
  if (rawPage === 'topic' && param && topicById(param)) {
    return { page: 'topic', topicId: param };
  }
  if (rawPage === 'q' && param && questionById(param)) {
    return { page: 'question', id: param };
  }
  if (rawPage === 'lab') return { page: 'lab' };
  if (rawPage === 'drills') return { page: 'drills', drillId: param };
  if (rawPage === 'lexicon') return { page: 'lexicon', termId: param };
  if (rawPage === 'map' || rawPage === 'hlg') return { page: 'map' };
  if (rawPage === 'pathway' || rawPage === 'roadmap') return { page: 'pathway' };
  return { page: 'home' };
}

export default function App() {
  const { heard, markHeard } = useHeardQuestions();
  const { lens, setLens } = useReadLens();
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));
  const lastTopicRef = useRef<TopicId | null>(null);
  const lastHubRef = useRef<string | null>(null);

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (route.page === 'home') {
      lastTopicRef.current = null;
      lastHubRef.current = null;
    } else if (route.page === 'topic') {
      lastTopicRef.current = route.topicId;
      lastAtlasCleanup();
    } else if (route.page !== 'question') {
      lastHubRef.current = `#/${route.page}`;
    }
    window.scrollTo(0, 0);
    function lastAtlasCleanup() {
      lastHubRef.current = null;
    }
  }, [route]);

  const go = (hash: string) => {
    window.location.hash = hash;
  };
  const goHome = () => go('#/');
  const openTopic = (id: TopicId) => go(`#/topic/${id}`);
  const openQuestion = (id: string) => go(`#/q/${id}`);
  const openDrill = (drillId: string) => go(`#/drills/${drillId}`);
  const openTerm = (termId: string) => go(`#/lexicon/${termId}`);

  const seenCount = footballQuestions.filter((q) => heard.includes(q.id)).length;

  const activeNav =
    route.page === 'lab'
      ? 'lab'
      : route.page === 'drills'
        ? 'drills'
        : route.page === 'lexicon'
          ? 'lexicon'
          : route.page === 'map'
            ? 'map'
            : route.page === 'pathway'
              ? 'pathway'
              : 'home';

  return (
    <div className="site-shell">
      <nav className="global-nav" aria-label="主导航">
        <div className="global-nav-inner">
          <button type="button" className="brand-pill" onClick={goHome}>
            <span aria-hidden="true">⚽</span>
            <strong>足球奇遇记</strong>
            <small>小念 × 爸爸</small>
          </button>

          <div className="nav-links">
            <button
              type="button"
              className={`nav-tab ${activeNav === 'home' ? 'is-current' : ''}`}
              onClick={goHome}
            >
              🏠 足球分类
              {seenCount > 0 && (
                <span className="nav-badge">
                  {seenCount}/{footballQuestions.length}
                </span>
              )}
            </button>
            <button
              type="button"
              className={`nav-tab ${activeNav === 'lab' ? 'is-current' : ''}`}
              onClick={() => go('#/lab')}
            >
              🎛️ 战术沙盘
            </button>
            <button
              type="button"
              className={`nav-tab ${activeNav === 'drills' ? 'is-current' : ''}`}
              onClick={() => go('#/drills')}
            >
              📋 教案与体测
            </button>
            <button
              type="button"
              className={`nav-tab ${activeNav === 'lexicon' ? 'is-current' : ''}`}
              onClick={() => go('#/lexicon')}
            >
              📖 专业词典
            </button>
            <button
              type="button"
              className={`nav-tab ${activeNav === 'map' ? 'is-current' : ''}`}
              onClick={() => go('#/map')}
            >
              📍 回龙观地图
            </button>
            <button
              type="button"
              className={`nav-tab ${activeNav === 'pathway' ? 'is-current' : ''}`}
              onClick={() => go('#/pathway')}
            >
              🏆 赛事与通路
            </button>
          </div>
        </div>
      </nav>

      {route.page === 'question' && (() => {
        const q = questionById(route.id);
        if (!q) return null;
        const handleBack = () => {
          if (lastHubRef.current) {
            go(lastHubRef.current);
          } else {
            openTopic(lastTopicRef.current ?? q.topic);
          }
        };
        return (
          <QuestionPage
            key={q.id}
            question={q}
            heard={heard}
            lens={lens}
            onChangeLens={setLens}
            onHeard={markHeard}
            onBack={handleBack}
            onOpenQuestion={openQuestion}
            onOpenDrill={openDrill}
            onOpenTerm={openTerm}
          />
        );
      })()}

      {route.page === 'topic' && (
        <CategoryPage
          key={route.topicId}
          topicId={route.topicId}
          heard={heard}
          onBack={goHome}
          onOpenQuestion={openQuestion}
          onSelectTopic={openTopic}
        />
      )}

      {route.page === 'lab' && (
        <TacticsLabPage onOpenQuestion={openQuestion} onBackHome={goHome} />
      )}

      {route.page === 'drills' && (
        <DrillsBenchPage
          key={route.drillId ?? 'all'}
          initialDrillId={route.drillId}
          onOpenQuestion={openQuestion}
          onBackHome={goHome}
        />
      )}

      {route.page === 'lexicon' && (
        <LexiconPage
          key={route.termId ?? 'all'}
          initialTermId={route.termId}
          onOpenQuestion={openQuestion}
          onBackHome={goHome}
        />
      )}

      {route.page === 'map' && (
        <HlgMapPage onOpenQuestion={openQuestion} onBackHome={goHome} />
      )}

      {route.page === 'pathway' && (
        <PathwayPage
          heard={heard}
          onOpenQuestion={openQuestion}
          onBackHome={goHome}
        />
      )}

      {route.page === 'home' && (
        <HomePage
          heard={heard}
          onTopic={openTopic}
          onOpenQuestion={openQuestion}
          onNavigate={go}
        />
      )}
    </div>
  );
}
