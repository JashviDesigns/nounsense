export const XP_PER_CORRECT = 10;
export const STREAK_MILESTONES = [3, 5, 7, 10] as const;
export const STREAK_BONUS_XP = 5;
export const COMBO_MULTIPLIER_AT = 3;

export const PERSONALITY_LINES: Record<number, string> = {
  3: "Der approves 👍 — 3 in a row!",
  5: "Die agrees 🌿 — you're on fire!",
  7: "Das is proud ✨ — unstoppable!",
  10: "Legendary streak! Grammar hero 🏆",
};

export function comboMultiplier(streak: number): number {
  if (streak >= 7) return 3;
  if (streak >= 5) return 2;
  if (streak >= COMBO_MULTIPLIER_AT) return 1.5;
  return 1;
}

export function xpForCorrect(streak: number): number {
  const mult = comboMultiplier(streak);
  return Math.round((XP_PER_CORRECT + (streak > 1 ? STREAK_BONUS_XP : 0)) * mult);
}

export function levelFromXp(xp: number): number {
  return Math.floor(xp / 100) + 1;
}
