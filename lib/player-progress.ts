import type { Article, SceneObject } from "@/lib/types";

const STORAGE_KEY = "nounsense-progress-v1";

export type NounStats = {
  sceneId: string;
  objectId: string;
  noun: string;
  article: Article;
  english: string;
  correct: number;
  wrong: number;
};

export type PlayerProgress = {
  version: 1;
  hasPlayed: boolean;
  lastSceneId: string;
  completedSceneIds: string[];
  xp: number;
  bestStreak: number;
  nouns: Record<string, NounStats>;
};

export function nounKey(sceneId: string, objectId: string): string {
  return `${sceneId}:${objectId}`;
}

export function defaultProgress(): PlayerProgress {
  return {
    version: 1,
    hasPlayed: false,
    lastSceneId: "living-room",
    completedSceneIds: [],
    xp: 0,
    bestStreak: 0,
    nouns: {},
  };
}

export function loadProgress(): PlayerProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as PlayerProgress;
    if (parsed.version !== 1) return defaultProgress();
    return { ...defaultProgress(), ...parsed, nouns: parsed.nouns ?? {} };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: PlayerProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore quota errors
  }
}

export function isWeakNoun(stats: NounStats): boolean {
  const total = stats.correct + stats.wrong;
  if (stats.wrong >= 2 && stats.correct === 0) return true;
  if (total >= 2 && stats.wrong / total >= 0.5) return true;
  return false;
}

export function getWeakNouns(progress: PlayerProgress): NounStats[] {
  return Object.values(progress.nouns)
    .filter(isWeakNoun)
    .sort((a, b) => b.wrong - a.wrong || a.noun.localeCompare(b.noun));
}

export function recordNounAttempt(
  progress: PlayerProgress,
  sceneId: string,
  obj: SceneObject,
  correct: boolean,
): PlayerProgress {
  const key = nounKey(sceneId, obj.id);
  const prev = progress.nouns[key] ?? {
    sceneId,
    objectId: obj.id,
    noun: obj.noun,
    article: obj.article,
    english: obj.english,
    correct: 0,
    wrong: 0,
  };

  const nouns = {
    ...progress.nouns,
    [key]: {
      ...prev,
      noun: obj.noun,
      article: obj.article,
      english: obj.english,
      correct: prev.correct + (correct ? 1 : 0),
      wrong: prev.wrong + (correct ? 0 : 1),
    },
  };

  return { ...progress, nouns, hasPlayed: true };
}

export function markSceneCompleted(
  progress: PlayerProgress,
  sceneId: string,
): PlayerProgress {
  const completed = new Set(progress.completedSceneIds);
  completed.add(sceneId);
  return {
    ...progress,
    completedSceneIds: [...completed],
    hasPlayed: true,
  };
}
