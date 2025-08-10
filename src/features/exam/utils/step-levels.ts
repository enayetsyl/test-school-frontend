// src/features/exam/utils/step-levels.ts
export type QuestionLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export function levelsForStep(step: 1 | 2 | 3): [QuestionLevel, QuestionLevel] {
  if (step === 1) return ["A1", "A2"];
  if (step === 2) return ["B1", "B2"];
  return ["C1", "C2"];
}
