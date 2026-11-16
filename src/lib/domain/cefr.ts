import { CEFR_LEVELS, type CefrLevel, type Difficulty, type LearningMethod } from "@/types/domain";

export const CEFR_LABELS: Record<CefrLevel, string> = {
  A1: "Mới bắt đầu",
  A2: "Sơ cấp",
  B1: "Trung cấp",
  B2: "Trung cao cấp",
  C1: "Cao cấp",
  C2: "Thành thạo",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Dễ",
  medium: "Vừa",
  hard: "Khó",
};

export const METHOD_LABELS: Record<LearningMethod, string> = {
  dictation: "Nghe chép",
  shadowing: "Shadowing",
};

export function levelIndex(level: CefrLevel): number {
  return CEFR_LEVELS.indexOf(level);
}

/** Levels within `radius` steps of `level`, e.g. B1 ±1 → A2, B1, B2. */
export function nearbyLevels(level: CefrLevel, radius = 1): CefrLevel[] {
  const i = levelIndex(level);
  return CEFR_LEVELS.filter((_, j) => Math.abs(j - i) <= radius);
}
