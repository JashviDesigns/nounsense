"use client";

type Props = {
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  accuracy: number;
  comboMultiplier: number;
};

function HudPill({
  label,
  value,
  className = "bg-white/80",
  valueClassName = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div
      className={`flex h-14 flex-col justify-center rounded-xl px-4 py-2 shadow-sm ${className}`}
    >
      <span className="text-xs leading-none text-zinc-500">{label}</span>
      <span
        className={`mt-1 text-lg font-bold leading-none ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

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

      <HudPill
        label="Accuracy"
        value={`${accuracy}%`}
        valueClassName="text-emerald-700"
      />

      {streak >= 2 && (
        <HudPill
          label="Combo"
          value={
            <>
              🔥 {streak}x {comboMultiplier > 1 && `(×${comboMultiplier})`}
            </>
          }
          className={
            streak >= 5
              ? "animate-pulse bg-gradient-to-r from-orange-400 to-pink-500 text-white [&_span:first-child]:text-white/90"
              : "bg-mauve/30 text-purple-900 [&_span:first-child]:text-purple-800/80"
          }
        />
      )}

      {bestStreak > 0 && (
        <HudPill
          label="Best streak"
          value={`${bestStreak}🔥`}
          className="bg-vanilla-custard/60 text-amber-950 [&_span:first-child]:text-amber-900/70"
        />
      )}
    </div>
  );
}
