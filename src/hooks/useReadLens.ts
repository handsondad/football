import { useCallback, useState } from 'react';
import type { ReadLens } from '../data/types.ts';

const LENS_KEY = 'football-read-lens-v2';

function readInitialLens(): ReadLens {
  try {
    const raw = window.localStorage.getItem(LENS_KEY);
    if (raw === 'dual' || raw === 'pro' || raw === 'kid') return raw;
    return 'dual';
  } catch {
    return 'dual';
  }
}

export function useReadLens() {
  const [lens, setLensState] = useState<ReadLens>(readInitialLens);

  const setLens = useCallback((next: ReadLens) => {
    setLensState(next);
    try {
      window.localStorage.setItem(LENS_KEY, next);
    } catch {
      // ignore storage errors
    }
  }, []);

  return { lens, setLens };
}
