import { useCallback, useState } from 'react';

const KEY = 'football-heard-v1';

function readHeard(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function useHeardQuestions() {
  const [heard, setHeard] = useState<readonly string[]>(readHeard);

  const markHeard = useCallback((id: string) => {
    setHeard((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // ignore storage quota errors
      }
      return next;
    });
  }, []);

  return { heard, markHeard };
}
