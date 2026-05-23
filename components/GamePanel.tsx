"use client";

import type { Article, SceneObject } from "@/lib/types";

const ARTICLES: { value: Article; label: string; bg: string; text: string }[] = [
  { value: "der", label: "der", bg: "bg-icy-blue", text: "text-sky-900" },
  { value: "die", label: "die", bg: "bg-pink-mist", text: "text-pink-950" },
  { value: "das", label: "das", bg: "bg-vanilla-custard", text: "text-amber-950" },
];

type Props = {
  objects: SceneObject[];
  selected: SceneObject | null;
  labeledIds: Set<string>;
  labeledCount: number;
  total: number;
  hint: string | null;
  feedback: "correct" | "wrong" | null;
  lastXpGain: number | null;
  onSelectObject: (id: string) => void;
  onAnswer: (article: Article) => void;
};

export function GamePanel({
  objects,
  selected,
  labeledIds,
  labeledCount,
  total,
  hint,
  feedback,
  lastXpGain,
  onSelectObject,
  onAnswer,
}: Props) {
  const remaining = total - labeledCount;
  const progress = total > 0 ? (labeledCount / total) * 100 : 0;

  return (
    <div className="flex h-full flex-col gap-5 rounded-2xl bg-white/70 p-5 shadow-lg backdrop-blur-sm">
      <p className="text-sm text-zinc-600">
        <span className="mr-1">📍</span>
        Tap an object number on the scene, or tap a name below:
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {objects.map((obj) => {
          const isSelected = selected?.id === obj.id;
          const isLabeled = labeledIds.has(obj.id);
          return (
            <button
              key={obj.id}
              type="button"
              disabled={isLabeled}
              onClick={() => onSelectObject(obj.id)}
              className={`rounded-xl border-2 px-3 py-2.5 text-left text-sm font-medium transition-all ${
                isLabeled
                  ? "border-frosted-mint bg-frosted-mint/40 text-emerald-800 opacity-80"
                  : isSelected
                    ? "border-mauve bg-mauve/15 text-mauve shadow-sm"
                    : "border-transparent bg-white/80 text-zinc-700 hover:border-mauve/30 hover:bg-white"
              }`}
            >
              <span
                className={`mr-1.5 font-bold ${isSelected ? "text-mauve" : "text-zinc-400"}`}
              >
                {obj.number}
              </span>
              {obj.noun}
            </button>
          );
        })}
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{labeledCount} labeled</span>
          <span>{remaining} remaining</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-mauve transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-white/50 px-4 py-8">
        {selected ? (
          <>
            <p className="mb-6 text-center text-lg text-zinc-700">
              What is the article for{" "}
              <span className="font-bold text-mauve">{selected.noun}</span>?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {ARTICLES.map(({ value, label, bg, text }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onAnswer(value)}
                  className={`flex h-24 w-24 items-center justify-center rounded-2xl text-2xl font-bold shadow-md transition-transform hover:scale-105 active:scale-95 ${bg} ${text}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {hint && (
              <p className="mt-4 max-w-xs text-center text-sm text-zinc-500">{hint}</p>
            )}
            {feedback === "correct" && (
              <p className="mt-3 animate-[pop-in_0.3s_ease-out] text-sm font-medium text-emerald-600">
                Sticks! ✓ {selected.article} {selected.noun}
                {lastXpGain != null && (
                  <span className="ml-2 font-bold text-mauve">+{lastXpGain} XP</span>
                )}
              </p>
            )}
            {feedback === "wrong" && (
              <p className="mt-3 animate-[wiggle_0.4s_ease-out] text-sm text-zinc-500">
                Not quite — try again.
              </p>
            )}
            <p className="mt-6 text-xs text-zinc-400">Tap or drag onto the object</p>
          </>
        ) : (
          <p className="text-center text-zinc-500">
            Select an object in the room to label it with der, die, or das.
          </p>
        )}
      </div>
    </div>
  );
}
