import type { Progress } from "./storage";
import { completedLevels } from "./storage";

export interface Achievement {
  id: string;
  title: string;
  emoji: string;
  description: string;
  earned: (p: Progress) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-star",
    title: "First Star",
    emoji: "🌟",
    description: "Earn your very first star",
    earned: (p) => p.stars >= 1,
  },
  {
    id: "color-master",
    title: "Color Master",
    emoji: "🏆",
    description: "Finish 3 Colors levels",
    earned: (p) => (p.completed["colors"] ?? 0) >= 3,
  },
  {
    id: "abc-explorer",
    title: "ABC Explorer",
    emoji: "🔤",
    description: "Finish 3 ABC levels",
    earned: (p) => (p.completed["abc"] ?? 0) >= 3,
  },
  {
    id: "number-hero",
    title: "Number Hero",
    emoji: "🔢",
    description: "Finish 3 Numbers levels",
    earned: (p) => (p.completed["numbers"] ?? 0) >= 3,
  },
  {
    id: "animal-expert",
    title: "Animal Expert",
    emoji: "🐾",
    description: "Finish 3 Animals levels",
    earned: (p) => (p.completed["animals"] ?? 0) >= 3,
  },
  {
    id: "shape-master",
    title: "Shape Master",
    emoji: "🎨",
    description: "Finish 3 Shapes levels",
    earned: (p) => (p.completed["shapes"] ?? 0) >= 3,
  },
  {
    id: "super-learner",
    title: "Super Learner",
    emoji: "🏅",
    description: "Finish 5 levels anywhere",
    earned: (p) => completedLevels(p) >= 5,
  },
  {
    id: "star-collector",
    title: "Star Collector",
    emoji: "⭐",
    description: "Collect 50 stars",
    earned: (p) => p.stars >= 50,
  },
  {
    id: "halfway-hero",
    title: "Halfway Hero",
    emoji: "🚀",
    description: "Reach level 10 in any game",
    earned: (p) => Object.values(p.completed).some((v) => v >= 10),
  },
  {
    id: "level-master",
    title: "Master Explorer",
    emoji: "👑",
    description: "Reach level 20 in any game",
    earned: (p) => Object.values(p.completed).some((v) => v >= 20),
  },
  {
    id: "grand-champion",
    title: "Grand Champion",
    emoji: "🏆",
    description: "Complete all 25 levels in a game",
    earned: (p) => Object.values(p.completed).some((v) => v >= 25),
  },
];

/** Returns the achievements newly earned by this progress state. */
export function newlyEarned(p: Progress): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.earned(p) && !p.achievements.includes(a.id));
}
