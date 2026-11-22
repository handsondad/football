import { useState } from 'react';

/**
 * 长列表分批显示：先给 pageSize 条，点「再看」再追加一批。
 * resetKey 变化（换筛选、改搜索词）时回到第一批；minCount 保证深链接指向的那条一定在可见范围内。
 */
export function usePaged(total: number, pageSize: number, resetKey: string, minCount = 0) {
  const [state, setState] = useState({ key: resetKey, count: pageSize });
  if (state.key !== resetKey) setState({ key: resetKey, count: pageSize });
  const base = state.key === resetKey ? state.count : pageSize;
  const shown = Math.min(total, Math.max(base, minCount));
  return {
    shown,
    more: () => setState({ key: resetKey, count: shown + pageSize }),
    all: () => setState({ key: resetKey, count: total }),
  };
}

export function LoadMore({
  shown,
  total,
  step,
  unit,
  onMore,
  onAll,
}: {
  shown: number;
  total: number;
  step: number;
  unit: string;
  onMore: () => void;
  onAll?: () => void;
}) {
  const rest = total - shown;
  if (rest <= 0) return null;
  return (
    <div className="load-more">
      <button type="button" className="load-more-btn" onClick={onMore}>
        再看 {Math.min(step, rest)} {unit} ▾
      </button>
      {onAll && rest > step && (
        <button type="button" className="load-more-all" onClick={onAll}>
          全部展开（还有 {rest} {unit}）
        </button>
      )}
      <small className="load-more-meta">
        已显示 {shown} / {total}
      </small>
    </div>
  );
}
