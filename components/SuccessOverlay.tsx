"use client";

type Props = {
  xp: number;
  bestStreak: number;
  accuracy: number;
  totalAttempts: number;
  onPlayAgain: () => void;
};

export function SuccessOverlay({
  xp,
  bestStreak,
  accuracy,
  totalAttempts,
  onPlayAgain,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-title"
    >
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-md" />

      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className="confetti-piece absolute block h-3 w-2 rounded-sm"
            style={{
              left: `${(i * 17) % 100}%`,
              top: "-10%",
              backgroundColor: ["#e4c1f9", "#f694c1", "#a9def9", "#d3f8e2", "#ede7b1"][
                i % 5
              ],
              animationDelay: `${(i % 12) * 0.08}s`,
              animationDuration: `${2.2 + (i % 5) * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="success-card relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-2 text-center text-5xl">🏆</div>
        <h2
          id="success-title"
          className="text-center text-2xl font-bold text-zinc-900"
        >
          Room Mastered!
        </h2>
        <p className="mt-2 text-center text-zinc-600">
          Every object in the living room is labeled. Die agrees 🌿
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat label="XP earned" value={String(xp)} />
          <Stat label="Best streak" value={`${bestStreak}🔥`} />
          <Stat label="Accuracy" value={`${accuracy}%`} />
        </div>

        <p className="mt-4 text-center text-xs text-zinc-400">
          {totalAttempts} total attempts · Kitchen world unlocks next
        </p>

        <button
          type="button"
          onClick={onPlayAgain}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-mauve to-pink-mist py-3.5 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
        >
          Play again
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-frosted-mint/50 px-3 py-3 text-center">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-zinc-800">{value}</p>
    </div>
  );
}
