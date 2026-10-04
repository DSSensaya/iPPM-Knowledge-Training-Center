import { useEffect, useState } from 'react';
import { loadProgress, mergeProgress, saveProgress } from '../services/progressStorage';
import type { Progress } from '../types/progress';

export default function useLearningProgress() {
  const [initial] = useState(loadProgress);
  const [progress, setProgress] = useState(initial.progress);
  const [storageError, setStorageError] = useState(initial.error);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function update(next: Progress, message: string) {
    setProgress(next);
    try {
      saveProgress(next);
      setStorageError('');
    } catch {
      setStorageError(
        'Speicherung nicht möglich. Ihre Änderungen bleiben nur in dieser Sitzung erhalten. Exportieren Sie eine Sicherung unter „Mein Lernbereich“.',
      );
    }
    setNotice(message);
  }

  function toggleSave(id: string) {
    const saved = progress.bookmarks.includes(id);
    update(
      {
        ...progress,
        bookmarks: saved
          ? progress.bookmarks.filter((bookmarkId) => bookmarkId !== id)
          : [...progress.bookmarks, id],
      },
      saved ? 'Beitrag aus der Merkliste entfernt.' : 'Beitrag zur Merkliste hinzugefügt.',
    );
  }

  function toggleRead(id: string) {
    const read = progress.read.includes(id);
    update(
      {
        ...progress,
        read: read ? progress.read.filter((readId) => readId !== id) : [...progress.read, id],
      },
      read
        ? 'Lesemarkierung entfernt.'
        : 'Als gelesen markiert. Ihr Lernfortschritt wurde aktualisiert.',
    );
  }

  function importProgress(data: Progress) {
    update(mergeProgress(progress, data), 'Sicherung importiert.');
  }

  return { progress, storageError, notice, toggleSave, toggleRead, importProgress };
}
