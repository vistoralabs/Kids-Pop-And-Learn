export type ShapeName =
  | "circle"
  | "square"
  | "triangle"
  | "rectangle"
  | "star"
  | "heart"
  | "oval"
  | "diamond";

export interface GameOption {
  key: string;
  correct: boolean;
  /** color swatch (css color value from game content, not theming) */
  color?: string;
  emoji?: string;
  text?: string;
  shape?: ShapeName;
  shapeColor?: string;
  groupEmoji?: string;
  groupCount?: number;
}

export interface Question {
  id: string;
  prompt: string;
  speak: string;
  hint: string;
  promptHi: string;
  speakHi: string;
  hintHi: string;
  options: GameOption[];
}

export type LevelTier = "warmup" | "explorer" | "champion" | "master" | "challenge";

export interface LevelConfig {
  index: number;
  objects: number;
  questions: number;
  label: string;
  tier?: LevelTier;
}

export interface CategoryDef {
  id: string;
  title: string;
  titleHi: string;
  emoji: string;
  subtitle: string;
  subtitleHi: string;
  tone: string;
  levels: LevelConfig[];
}
