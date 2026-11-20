import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  footballQuestions,
  questionById,
  topicById,
  type FootballQuestion,
  type TopicId,
} from './content/catalog.ts';
import { loadQuestion, peekQuestion } from './content/load.ts';
import { useHeardQuestions } from './hooks/useHeardQuestions.ts';
import { useReadLens } from './hooks/useReadLens.ts';
import { CategoryPage } from './pages/CategoryPage.tsx';
import { HomePage } from './pages/HomePage.tsx';

const loadQuestionPage = () => import('./pages/QuestionPage.tsx');
const QuestionPage = lazy(() => loadQuestionPage().then((m) => ({ default: m.QuestionPage })));
const DadMasteryPage = lazy(() =>
  import('./pages/DadMasteryPage.tsx').then((m) => ({ default: m.DadMasteryPage }))
);
const TacticsLabPage = lazy(() =>
  import('./pages/TacticsLabPage.tsx').then((m) => ({ default: m.TacticsLabPage }))
);
const DrillsBenchPage = lazy(() =>
  import('./pages/DrillsBenchPage.tsx').then((m) => ({ default: m.DrillsBenchPage }))
);
const LexiconPage = lazy(() =>
  import('./pages/LexiconPage.tsx').then((m) => ({ default: m.LexiconPage }))
);
const VideoLibraryPage = lazy(() =>
  import('./pages/VideoLibraryPage.tsx').then((m) => ({ default: m.VideoLibraryPage }))
);
const HlgMapPage = lazy(() =>
  import('./pages/HlgMapPage.tsx').then((m) => ({ default: m.HlgMapPage }))
);
const PathwayPage = lazy(() =>
  import('./pages/PathwayPage.tsx').then((m) => ({ default: m.PathwayPage }))
);

type Route =
  | { page: 'home' }
  | { page: 'topic'; topicId: TopicId }
  | { page: 'question'; id: string }
  | { page: 'mastery' }
  | { page: 'lab' }
  | { page: 'drills'; drillId?: string }
  | { page: 'lexicon'; termId?: string }
  | { page: 'videos'; videoId?: string }
  | { page: 'map' }
  | { page: 'pathway' };

const SITE_TITLE = '足球奇遇记';

const PAGE_TITLES: Partial<Record<Route['page'], string>> = {
  mastery: '学习路线',
  lab: '战术沙盘',
  drills: '教案与体测',
  lexicon: '专业词典',
  videos: '视频资料',
  map: '回龙观地图',
  pathway: '赛事与通路',
};

function parseRoute(hash: string): Route {
  const [, rawPage, rawParam] = hash.replace(/^#/, '').split('/');
  const param = rawParam ? decodeURIComponent(rawParam) : undefined;
  if (rawPage === 'topic' && param && topicById(param)) {
    return { page: 'topic', topicId: param };
  }
  if (rawPage === 'q' && param && questionById(param)) {
    return { page: 'question', id: param };
  }
  if (rawPage === 'mastery') return { page: 'mastery' };
  if (rawPage === 'lab') return { page: 'lab' };
  if (rawPage === 'drills') return { page: 'drills', drillId: param };
  if (rawPage === 'lexicon') return { page: 'lexicon', termId: param };
  if (rawPage === 'videos') return { page: 'videos', videoId: param };
  if (rawPage === 'map' || rawPage === 'hlg') return { page: 'map' };
  if (rawPage === 'pathway' || rawPage === 'roadmap') return { page: 'pathway' };
  return { page: 'home' };
}

function routeTitle(route: Route): string {
  const sub =
    route.page === 'topic'
      ? topicById(route.topicId)?.title
      : route.page === 'question'
        ? questionById(route.id)?.title
        : PAGE_TITLES[route.page];
  return sub ? `${sub} · ${SITE_TITLE}` : SITE_TITLE;
}

function PageStatus({ children }: { children: ReactNode }) {
  return (
    <div className="page-status" role="status" aria-live="polite">
      {children}
    </div>
  );
}

const loadingView = <PageStatus>⚽ 正在加载…</PageStatus>;

/** 分块下载失败（断网或站点刚更新）时给出重试入口，而不是整页空白 */
class ChunkErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <PageStatus>
        <p>页面没加载出来，可能是网络不稳。</p>
        <button type="button" className="back-pill" onClick={() => window.location.reload()}>
          🔄 重新加载
        </button>
      </PageStatus>
    );
  }
}

type LoadState = { id: string; question?: FootballQuestion; failed?: boolean };

/** 按需加载问题所在领域；`live` 标记丢弃切换路由后才返回的旧结果 */
function useQuestion(id: string | null) {
  const [state, setState] = useState<LoadState | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!id || peekQuestion(id)) return;
    let live = true;
    loadQuestion(id).then(
      (question) => {
        if (live) setState({ id, question, failed: !question });
      },
      () => {
        if (live) setState({ id, failed: true });
      }
    );
    return () => {
      live = false;
    };
  }, [id, attempt]);

  const current = state && state.id === id ? state : null;
  return {
    question: id ? (peekQuestion(id) ?? current?.question) : undefined,
    failed: Boolean(current?.failed),
    retry: () => {
      setState(null);
      setAttempt((n) => n + 1);
    },
  };
}

export default function App() {
  const { heard, markHeard } = useHeardQuestions();
  const { lens, setLens } = useReadLens();
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));
  const lastTopicRef = useRef<TopicId | null>(null);
  const lastHubRef = useRef<string | null>(null);
  const loaded = useQuestion(route.page === 'question' ? route.id : null);

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
      lastHubRef.current = null;
    } else if (route.page !== 'question') {
      lastHubRef.current = `#/${route.page}`;
    }
    document.title = routeTitle(route);
    window.scrollTo(0, 0);
  }, [route]);

  // 首屏空闲时预取问题页代码，点开第一题时只需等领域正文
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    idle(() => {
      loadQuestionPage().catch(() => undefined);
    });
  }, []);

  const go = (hash: string) => {
    window.location.hash = hash;
  };
  const goHome = () => go('#/');
  const openTopic = (id: TopicId) => go(`#/topic/${id}`);
  const openQuestion = (id: string) => go(`#/q/${id}`);
  const openDrill = (drillId: string) => go(`#/drills/${drillId}`);
  const openTerm = (termId: string) => go(`#/lexicon/${termId}`);
  const openVideo = (videoId: string) => go(`#/videos/${videoId}`);

  const seenCount = footballQuestions.filter((q) => heard.includes(q.id)).length;

  const activeNav =
    route.page === 'topic' || route.page === 'question' ? 'home' : route.page;

  const renderQuestion = (id: string) => {
    const card = questionById(id);
    if (!card) return null;
    const handleBack = () => {
      if (lastHubRef.current) {
        go(lastHubRef.current);
      } else {
        openTopic(lastTopicRef.current ?? card.topic);
      }
    };
    if (!loaded.question) {
      return loaded.failed ? (
        <PageStatus>
          <p>「{card.title}」没加载出来，可能是网络不稳。</p>
          <button type="button" className="back-pill" onClick={loaded.retry}>
            🔄 再试一次
          </button>
          <button type="button" className="back-pill" onClick={handleBack}>
            ← 返回
          </button>
        </PageStatus>
      ) : (
        loadingView
      );
    }
    return (
      <QuestionPage
        key={id}
        question={loaded.question}
        heard={heard}
        lens={lens}
        onChangeLens={setLens}
        onHeard={markHeard}
        onBack={handleBack}
        onOpenQuestion={openQuestion}
        onOpenDrill={openDrill}
        onOpenTerm={openTerm}
        onOpenVideo={openVideo}
      />
    );
  };

  return (
    <div className="site-shell">
      <nav className="global-nav" aria-label="主导航">
        <div className="global-nav-inner">
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
              className={`nav-tab ${activeNav === 'mastery' ? 'is-current' : ''}`}
              onClick={() => go('#/mastery')}
            >
              🎓 学习路线
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
              className={`nav-tab ${activeNav === 'videos' ? 'is-current' : ''}`}
              onClick={() => go('#/videos')}
            >
              🎬 视频资料
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

      <ChunkErrorBoundary key={route.page}>
        <Suspense fallback={loadingView}>
        {route.page === 'question' && renderQuestion(route.id)}

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

        {route.page === 'mastery' && (
          <DadMasteryPage
            heard={heard}
            onOpenQuestion={openQuestion}
            onNavigate={go}
            onBackHome={goHome}
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

        {route.page === 'videos' && (
          <VideoLibraryPage
            key={route.videoId ?? 'all'}
            initialVideoId={route.videoId}
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
        </Suspense>
      </ChunkErrorBoundary>
    </div>
  );
}
