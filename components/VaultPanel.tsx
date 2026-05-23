"use client";

import { useState } from "react";
import { SCENES_BY_ID } from "@/data/scenes";
import { fullLabel } from "@/lib/game-utils";
import type { NounStats } from "@/lib/player-progress";
import type { Article } from "@/lib/types";

const ARTICLES: { value: Article; label: string; bg: string; text: string }[] = [
  { value: "der", label: "der", bg: "bg-icy-blue", text: "text-sky-900" },
  { value: "die", label: "die", bg: "bg-pink-mist", text: "text-pink-950" },
  { value: "das", label: "das", bg: "bg-vanilla-custard", text: "text-amber-950" },
];

type Props = {
  weakNouns: NounStats[];
  onPracticeAnswer: (stats: NounStats, article: Article) => void;
  feedback: "correct" | "wrong" | null;
  lastAnswered: NounStats | null;
};

export function VaultPanel({
  weakNouns,
  onPracticeAnswer,
  feedback,
  lastAnswered,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, Math.max(0, weakNouns.length - 1));
  const current = weakNouns[safeIndex] ?? null;

  if (weakNouns.length === 0) {
    return (
      <div className="rounded-3xl bg-white/70 p-10 text-center shadow-lg backdrop-blur-sm">
        <p className="text-4xl">✨</p>
        <h2 className="mt-3 text-xl font-bold text-zinc-800">Vault is empty</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Nouns you struggle with (low accuracy or repeated misses) appear here for
          extra practice.
        </p>
      </div>
    );
  }

  const scene = current ? SCENES_BY_ID[current.sceneId] : null;
  const accuracy =
    current && current.correct + current.wrong > 0
      ? Math.round((current.correct / (current.correct + current.wrong)) * 100)
      : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-3xl bg-white/70 p-5 shadow-lg backdrop-blur-sm">
        <h2 className="text-lg font-bold text-zinc-900">Weak nouns</h2>
        <p className="mt-1 text-sm text-zinc-600">
          {weakNouns.length} to review — sorted by most misses
        </p>
        <ul className="mt-4 max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {weakNouns.map((item, i) => {
            const sc = SCENES_BY_ID[item.sceneId];
            const total = item.correct + item.wrong;
            const acc =
              total > 0 ? Math.round((item.correct / total) * 100) : 0;
            const active = i === safeIndex;
            return (
              <li key={`${item.sceneId}:${item.objectId}`}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition ${
                    active
                      ? "border-mauve bg-mauve/10"
                      : "border-transparent bg-white/80 hover:border-mauve/20"
                  }`}
                >
                  <span className="text-lg">{sc?.emoji ?? "📦"}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-zinc-800">
                      {item.noun}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {sc?.name ?? item.sceneId} · {acc}% accuracy
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {current && (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl bg-white/70 p-8 shadow-lg backdrop-blur-sm">
          <p className="text-sm text-zinc-500">
            {scene?.emoji} {scene?.name}
          </p>
          <p className="mt-4 text-center text-2xl font-bold text-zinc-800">
            {current.noun}
          </p>
          <p className="mt-1 text-sm text-zinc-500">{current.english}</p>
          <p className="mt-2 text-xs text-zinc-400">
            Your accuracy so far: {accuracy}% ({current.wrong} miss
            {current.wrong === 1 ? "" : "es"})
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {ARTICLES.map(({ value, label, bg, text }) => (
              <button
                key={value}
                type="button"
                onClick={() => onPracticeAnswer(current, value)}
                className={`flex h-24 w-24 items-center justify-center rounded-2xl text-2xl font-bold shadow-md transition-transform hover:scale-105 active:scale-95 ${bg} ${text}`}
              >
                {label}
              </button>
            ))}
          </div>

          {feedback === "correct" && lastAnswered?.objectId === current.objectId && (
            <p className="mt-4 text-sm font-medium text-emerald-600">
              Correct — {fullLabel(current.article, current.noun)}
            </p>
          )}
          {feedback === "wrong" && lastAnswered?.objectId === current.objectId && (
            <p className="mt-4 text-sm text-zinc-500">Not quite — try again.</p>
          )}

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              disabled={safeIndex === 0}
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              className="rounded-lg bg-zinc-200 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={safeIndex >= weakNouns.length - 1}
              onClick={() =>
                setActiveIndex((i) => Math.min(weakNouns.length - 1, i + 1))
              }
              className="rounded-lg bg-zinc-200 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
