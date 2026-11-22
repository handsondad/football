import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * 顶部导航一行排开、不换行：放不下就横着滑，不露滚动条。
 * 哪边还有就在哪边淡出、露一个箭头；鼠标滚轮、按住拖都能左右走。
 */
export function NavStrip({ children }: { children: ReactNode }) {
  const strip = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = strip.current;
    if (!el) return;
    const left = el.scrollLeft > 2;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    setEdges((e) => (e.left === left && e.right === right ? e : { left, right }));
  }, []);

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);

    // 竖着滚轮也能左右走；走到头了就还给页面
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0 || (e.deltaY < 0 && el.scrollLeft <= 0) || (e.deltaY > 0 && el.scrollLeft >= max - 1)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    // 按住鼠标拖着滚；拖过再松手不算点击。手指在触屏上本来就能滑
    let start: { x: number; left: number; id: number } | null = null;
    let dragged = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      start = { x: e.clientX, left: el.scrollLeft, id: e.pointerId };
      dragged = false;
    };
    const move = (e: PointerEvent) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      if (!dragged && Math.abs(dx) > 6) {
        dragged = true;
        el.setPointerCapture(start.id);
        el.classList.add('dragging');
      }
      if (dragged) el.scrollLeft = start.left - dx;
    };
    const up = () => {
      start = null;
      el.classList.remove('dragging');
    };
    const click = (e: MouseEvent) => {
      if (!dragged) return;
      e.preventDefault();
      e.stopPropagation();
      dragged = false;
    };

    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('click', click, true);
    return () => {
      ro.disconnect();
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('click', click, true);
    };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = strip.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' });
  };

  return (
    <div className="nav-strip-wrap">
      <div
        ref={strip}
        className={`nav-links${edges.left ? ' fade-left' : ''}${edges.right ? ' fade-right' : ''}`}
        onScroll={update}
      >
        {children}
      </div>
      <button type="button" className="nav-arrow left" hidden={!edges.left} tabIndex={-1} aria-label="往前看导航" onClick={() => page(-1)}>
        ‹
      </button>
      <button type="button" className="nav-arrow right" hidden={!edges.right} tabIndex={-1} aria-label="往后看导航" onClick={() => page(1)}>
        ›
      </button>
    </div>
  );
}
