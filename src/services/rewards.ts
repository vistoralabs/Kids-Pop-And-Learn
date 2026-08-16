import { getCategory } from "../game/content";
import { newlyEarned, type Achievement } from "./achievements";
import { getProgress, todayKey, updateProgress, type Lang, type Progress } from "./storage";

export const PRAISE = ["Great!", "Awesome!", "Well Done!", "Yay!", "Super!", "Nice one!"];
export const PRAISE_HI = ["शाबाश!", "बहुत बढ़िया!", "वाह!", "कमाल!", "सुपर!", "बहुत अच्छा!"];

export function randomPraise(lang: Lang = "en") {
  const list = lang === "hi" ? PRAISE_HI : PRAISE;
  return list[Math.floor(Math.random() * list.length)]!;
}

function syncAchievements(p: Progress): { progress: Progress; earned: Achievement[] } {
  const earned = newlyEarned(p);
  if (earned.length === 0) return { progress: p, earned };
  return {
    progress: { ...p, achievements: [...p.achievements, ...earned.map((a) => a.id)] },
    earned,
  };
}

function withStreak(p: Progress): Progress {
  const today = todayKey();
  if (p.lastPlayedDay === today) return p;
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const streak = p.lastPlayedDay === yesterday ? p.streak + 1 : 1;
  return { ...p, streak, lastPlayedDay: today };
}

/** 1 correct answer = 1 star. */
export function awardCorrect(categoryId: string): Achievement[] {
  let earned: Achievement[] = [];
  updateProgress((p) => {
    const next: Progress = {
      ...withStreak(p),
      stars: p.stars + 1,
      correct: p.correct + 1,
      correctByCategory: {
        ...p.correctByCategory,
        [categoryId]: (p.correctByCategory[categoryId] ?? 0) + 1,
      },
    };
    const result = syncAchievements(next);
    earned = result.earned;
    return result.progress;
  });
  return earned;
}

/** Completing a level unlocks the next one and grants bonus stars. */
export function completeLevel(categoryId: string, levelIndex: number, bonus = 3): Achievement[] {
  let earned: Achievement[] = [];
  const category = getCategory(categoryId);
  const maxLevels = category?.levels.length ?? 25;
  updateProgress((p) => {
    const unlocked = Math.min(Math.max(p.completed[categoryId] ?? 0, levelIndex + 1), maxLevels);
    const next: Progress = {
      ...p,
      stars: p.stars + bonus,
      completed: { ...p.completed, [categoryId]: unlocked },
    };
    const result = syncAchievements(next);
    earned = result.earned;
    return result.progress;
  });
  return earned;
}

export function dailyRewardAvailable() {
  return getProgress().lastDailyReward !== todayKey();
}

/** One fixed gift per calendar day — no randomness, no purchases. */
export function claimDailyReward(): number {
  if (!dailyRewardAvailable()) return 0;
  const bonus = 5;
  updateProgress((p) => ({ ...p, stars: p.stars + bonus, lastDailyReward: todayKey() }));
  return bonus;
}

export function setSetting(key: "sound" | "music", value: boolean) {
  updateProgress((p) => ({ ...p, settings: { ...p.settings, [key]: value } }));
}

export function setLang(lang: Lang) {
  updateProgress((p) => ({ ...p, settings: { ...p.settings, lang } }));
}
