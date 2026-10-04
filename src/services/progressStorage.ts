import type { Progress } from '../types/progress';

export const STORAGE_KEY = 'ippm-learning-v1';
export const emptyProgress: Progress = { version: 1, bookmarks: [], read: [], passed: [] };

export function validateProgress(value: unknown): value is Progress {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<Progress>;
  return (
    data.version === 1 &&
    [data.bookmarks, data.read, data.passed].every(
      (list) => Array.isArray(list) && list.every((id) => typeof id === 'string'),
    )
  );
}

export function loadProgress(): { progress: Progress; error: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { progress: emptyProgress, error: '' };
    const data: unknown = JSON.parse(raw);
    if (!validateProgress(data)) throw new Error('Invalid storage');
    return { progress: data, error: '' };
  } catch {
    return {
      progress: emptyProgress,
      error:
        'Ihr lokaler Speicher konnte nicht gelesen werden. Änderungen bleiben bis zur erfolgreichen Speicherung nur für diese Sitzung erhalten.',
    };
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// Visibility is a presentation concern. Never discard archived or unknown v1 IDs.
export function mergeProgress(current: Progress, incoming: Progress): Progress {
  return {
    version: 1,
    bookmarks: [...new Set([...current.bookmarks, ...incoming.bookmarks])],
    read: [...new Set([...current.read, ...incoming.read])],
    passed: [...new Set([...current.passed, ...incoming.passed])],
  };
}
