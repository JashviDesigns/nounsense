"use client";

type Props = {
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  accuracy: number;
  comboMultiplier: number;
};

export function GameHUD({
  xp,
  level,
  streak,
  bestStreak,
  accuracy,
  comboMultiplier,
}: Props) {
  const xpIntoLevel = xp % 100;
  const xpProgress = (xpIntoLevel / 100) * 100;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="flex min-w-[140px] flex-col rounded-xl bg-white/80 px-4 py-2 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Level {level}
          </span>
          <span className="text-sm font-bold text-mauve">{xp} XP</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-mauve to-pink-mist transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl bg-white/80 px-4 py-2 shadow-sm">
        <span className="text-xs text-zinc-500">Accuracy</span>
        <p className="text-lg font-bold text-emerald-700">{accuracy}%</p>
      </div>

      {streak >= 2 && (
        <div
          className={`rounded-xl px-4 py-2 shadow-sm transition-all ${
            streak >= 5
              ? "animate-pulse bg-gradient-to-r from-orange-400 to-pink-500 text-white"
              : "bg-mauve/30 text-purple-900"
          }`}
        >
          <span className="text-xs font-medium uppercase">Combo</span>
          <p className="text-lg font-bold">
            🔥 {streak}x {comboMultiplier > 1 && `(×${comboMultiplier})`}
          </p>
        </div>
      )}

      {bestStreak > 0 && (
        <div className="rounded-xl bg-vanilla-custard/60 px-3 py-2 text-sm text-amber-950">
          Best: {bestStreak}🔥
        </div>
      )}
    </div>
  );
}
