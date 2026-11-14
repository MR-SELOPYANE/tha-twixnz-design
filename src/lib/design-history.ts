export type HistoryTransition<T> = {
  current: T;
  undo: T[];
  redo: T[];
};

export function pushHistorySnapshot<T>(stack: T[], snapshot: T, limit = 50): T[] {
  return [...stack, snapshot].slice(-limit);
}

export function undoHistory<T>(
  current: T,
  undo: T[],
  redo: T[],
  limit = 50,
): HistoryTransition<T> | null {
  const previous = undo.at(-1);
  if (previous === undefined) return null;
  return {
    current: previous,
    undo: undo.slice(0, -1),
    redo: pushHistorySnapshot(redo, current, limit),
  };
}

export function redoHistory<T>(
  current: T,
  undo: T[],
  redo: T[],
  limit = 50,
): HistoryTransition<T> | null {
  const next = redo.at(-1);
  if (next === undefined) return null;
  return {
    current: next,
    undo: pushHistorySnapshot(undo, current, limit),
    redo: redo.slice(0, -1),
  };
}