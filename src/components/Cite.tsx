import { createContext, useContext } from 'react';
import type { Source } from '../data/types.ts';

export const SourcesContext = createContext<readonly Source[]>([]);

let litTimer = 0;

function jumpToSource(id: string) {
  const el = document.getElementById(`src-${id}`);
  if (!el) return;
  document.querySelectorAll('.sources-list li.is-lit').forEach((n) => n.classList.remove('is-lit'));
  el.classList.add('is-lit');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.clearTimeout(litTimer);
  litTimer = window.setTimeout(() => el.classList.remove('is-lit'), 2400);
}

export function Cite({ ids }: { ids?: readonly string[] }) {
  const sources = useContext(SourcesContext);
  if (!ids?.length) return null;
  return (
    <>
      {ids.map((id) => {
        const idx = sources.findIndex((s) => s.id === id);
        if (idx < 0) return null;
        const n = idx + 1;
        const src = sources[idx];
        const tip = `${n}. ${src.title} · ${src.by}`;
        return (
          <button
            key={id}
            type="button"
            className="cite-badge"
            aria-label={`参考资料 ${n}：${src.title}`}
            title={tip}
            onClick={() => jumpToSource(id)}
          >
            {n}
          </button>
        );
      })}
    </>
  );
}

export function SourcesList({ sources }: { sources: readonly Source[] }) {
  if (sources.length === 0) return null;
  return (
    <section className="sources-box" aria-label="参考资料与政策出处">
      <h3>📚 本篇核实资料与官方出处</h3>
      <ol className="sources-list">
        {sources.map((src) => (
          <li key={src.id} id={`src-${src.id}`}>
            <a href={src.url} target="_blank" rel="noreferrer">
              {src.title}
            </a>
            <span className="source-by"> · {src.by}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
