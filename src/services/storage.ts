import { useEffect, useState } from "react";
import { CATEGORIES } from "../game/content";

const KEY = "kids-pop-learn:v1";

/** Learning language: English or Hindi. */
export type Lang = "en" | "hi";

export interface Progress {
  stars: number;
  /** number of completed levels per category */
  completed: Record<string, number>;
  achievements: string[];
  correct: number;
  correctByCategory: Record<string, number>;
  settings: { sound: boolean; music: boolean; lang: Lang };
  lastDailyReward: string | null;
  /** consecutive days played, for the streak card on the home screen */
  streak: number;
  lastPlayedDay: string | null;
}

export const defaultProgress: Progress = {
  stars: 0,
  completed: {},
  achievements: [],
  correct: 0,
  correctByCategory: {},
  settings: { sound: true, music: false, lang: "en" },
  lastDailyReward: null,
  streak: 0,
  lastPlayedDay: null,
};

let cache: Progress = defaultProgress;
let loaded = false;
const listeners = new Set<(p: Progress) => void>();

function read(): Progress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    
    // Migrate legacy 'both' lang setting to 'en'
    let langSetting: Lang = "en";
    if (parsed.settings?.lang === "hi") {
      langSetting = "hi";
    }

    return {
      ...defaultProgress,
      ...parsed,
      completed: { ...parsed.completed },
      correctByCategory: { ...parsed.correctByCategory },
      achievements: parsed.achievements ?? [],
      settings: { 
        sound: parsed.settings?.sound ?? defaultProgress.settings.sound, 
        music: parsed.settings?.music ?? defaultProgress.settings.music, 
        lang: langSetting 
      },
    };
  } catch {
    return defaultProgress;
  }
}

function persist(p: Progress) {
  cache = p;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable — game keeps working in memory */
  }
  listeners.forEach((l) => l(p));
}

export function getProgress(): Progress {
  if (!loaded && typeof window !== "undefined") {
    cache = read();
    loaded = true;
  }
  return cache;
}

export function updateProgress(fn: (p: Progress) => Progress) {
  persist(fn(getProgress()));
}

export function resetProgress() {
  persist({ ...defaultProgress, completed: {}, correctByCategory: {}, achievements: [] });
}

export function useProgress(): Progress {
  const [state, setState] = useState<Progress>(defaultProgress);
  useEffect(() => {
    setState(getProgress());
    const listener = (p: Progress) => setState({ ...p });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return state;
}

export function isLevelUnlocked(categoryId: string, levelIndex: number, p: Progress) {
  return levelIndex <= (p.completed[categoryId] ?? 0);
}

export function totalLevels() {
  return CATEGORIES.reduce((sum, c) => sum + c.levels.length, 0);
}

export function completedLevels(p: Progress) {
  return CATEGORIES.reduce(
    (sum, c) => sum + Math.min(p.completed[c.id] ?? 0, c.levels.length),
    0,
  );
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
