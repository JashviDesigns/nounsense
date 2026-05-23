"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LIVING_ROOM_OBJECTS } from "@/data/living-room";
import { categoryHint } from "@/lib/game-utils";
import {
  PERSONALITY_LINES,
  STREAK_MILESTONES,
  comboMultiplier,
  levelFromXp,
  xpForCorrect,
} from "@/lib/game-constants";
import type { Article, GameMode } from "@/lib/types";
import { useGameAudio } from "@/hooks/useGameAudio";
import { AudioControls } from "./AudioControls";
import { FloatingToast } from "./FloatingToast";
import { GameHUD } from "./GameHUD";
import { GamePanel } from "./GamePanel";
import { LivingRoomScene } from "./LivingRoomScene";
import { SuccessOverlay } from "./SuccessOverlay";

type Toast = {
  id: number;
  message: string;
  sub?: string;
  variant: "success" | "streak" | "milestone";
};

export function NounSenseGame() {
  const objects = LIVING_ROOM_OBJECTS;
  const [mode] = useState<GameMode>("chill");
  const [selectedId, setSelectedId] = useState<string | null>(objects[3]?.id ?? null);
  const [labeledIds, setLabeledIds] = useState<Set<string>>(new Set());
  const [wrongAttempts, setWrongAttempts] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [shake, setShake] = useState(false);
  const [lastXpGain, setLastXpGain] = useState<number | null>(null);
  const completePlayedRef = useRef(false);
  const audio = useGameAudio();

  const selected = useMemo(
    () => objects.find((o) => o.id === selectedId) ?? null,
    [objects, selectedId],
  );

  const showTooltips = mode !== "exam";
  const isComplete = labeledIds.size === objects.length;
  const accuracy =
    totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;
  const level = levelFromXp(xp);
  const mult = comboMultiplier(streak);

  const pushToast = useCallback(
    (message: string, sub?: string, variant: Toast["variant"] = "success") => {
      const id = Date.now();
      setToasts((t) => [...t, { id, message, sub, variant }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 2200);
    },
    [],
  );

  const handleFirstInteraction = useCallback(() => {
    if (!audio.ready) void audio.init();
  }, [audio]);

  useEffect(() => {
    if (isComplete && !completePlayedRef.current) {
      completePlayedRef.current = true;
      audio.play("complete");
      setShowComplete(true);
    }
  }, [isComplete, audio]);

  const resetGame = useCallback(() => {
    setLabeledIds(new Set());
    setSelectedId(objects[0]?.id ?? null);
    setWrongAttempts({});
    setStreak(0);
    setFeedback(null);
    setHint(null);
    setShowComplete(false);
    setSessionXp(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    completePlayedRef.current = false;
  }, [objects]);

  const handleSelect = useCallback(
    (id: string) => {
      handleFirstInteraction();
      if (labeledIds.has(id)) return;
      setSelectedId(id);
      setFeedback(null);
      setHint(null);
    },
    [labeledIds, handleFirstInteraction],
  );

  const handleAnswer = useCallback(
    (article: Article) => {
      handleFirstInteraction();
      if (!selected || labeledIds.has(selected.id)) return;

      setTotalAttempts((n) => n + 1);

      if (article === selected.article) {
        const newStreak = streak + 1;
        const gain = xpForCorrect(newStreak);
        setLabeledIds((prev) => new Set([...prev, selected.id]));
        setStreak(newStreak);
        setBestStreak((b) => Math.max(b, newStreak));
        setXp((x) => x + gain);
        setSessionXp((x) => x + gain);
        setCorrectAttempts((n) => n + 1);
        setLastXpGain(gain);
        setFeedback("correct");
        setHint(null);
        audio.play("correct");

        if (STREAK_MILESTONES.some((m) => m === newStreak)) {
          audio.play("streak");
          const line = PERSONALITY_LINES[newStreak];
          pushToast(`${newStreak} streak!`, line, "milestone");
        } else if (newStreak >= 2) {
          pushToast(`+${gain} XP`, `${newStreak} in a row`, "streak");
        } else {
          pushToast(`+${gain} XP`, "Sticks!", "success");
        }

        setWrongAttempts((prev) => {
          const next = { ...prev };
          delete next[selected.id];
          return next;
        });
        setTimeout(() => {
          setFeedback(null);
          setLastXpGain(null);
        }, 1200);

        const willComplete = labeledIds.size + 1 === objects.length;
        if (!willComplete) {
          const next = objects.find(
            (o) => !labeledIds.has(o.id) && o.id !== selected.id,
          );
          if (next) setTimeout(() => setSelectedId(next.id), 400);
        }
      } else {
        const attempts = (wrongAttempts[selected.id] ?? 0) + 1;
        setWrongAttempts((prev) => ({ ...prev, [selected.id]: attempts }));
        setStreak(0);
        setFeedback("wrong");
        audio.play("wrong");
        setShake(true);
        setTimeout(() => setShake(false), 400);
        if (mode !== "exam" && attempts >= 2) {
          setHint(categoryHint(selected.category));
        }
        setTimeout(() => setFeedback(null), 900);
      }
    },
    [
      selected,
      labeledIds,
      wrongAttempts,
      objects,
      mode,
      streak,
      audio,
      pushToast,
      handleFirstInteraction,
    ],
  );

  return (
    <div
      className={`mx-auto max-w-6xl px-4 pb-10 pt-6 ${shake ? "animate-shake" : ""}`}
      onClick={handleFirstInteraction}
      onKeyDown={handleFirstInteraction}
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">NounSense</h1>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white/80 px-3 py-1 text-sm shadow-sm">
            🏠 Living Room
          </span>
          <AudioControls
            musicOn={audio.musicOn}
            onToggleMusic={audio.toggleMusic}
          />
        </div>
      </header>

      <GameHUD
        xp={xp}
        level={level}
        streak={streak}
        bestStreak={bestStreak}
        accuracy={accuracy}
        comboMultiplier={mult}
      />

      {!audio.ready && (
        <p className="mb-4 text-center text-sm text-zinc-500">
          Tap anywhere to enable sound 🎵
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <section className="rounded-3xl bg-white/60 p-4 shadow-xl backdrop-blur-sm">
          <LivingRoomScene
            objects={objects}
            selectedId={selectedId}
            labeledIds={labeledIds}
            onSelect={handleSelect}
            showTooltips={showTooltips}
          />
        </section>

        <section className="min-h-[480px]">
          <GamePanel
            objects={objects}
            selected={selected && !labeledIds.has(selected.id) ? selected : null}
            labeledIds={labeledIds}
            labeledCount={labeledIds.size}
            total={objects.length}
            hint={hint}
            feedback={feedback}
            lastXpGain={lastXpGain}
            onSelectObject={handleSelect}
            onAnswer={handleAnswer}
          />
        </section>
      </div>

      {toasts.map((t) => (
        <FloatingToast
          key={t.id}
          message={t.message}
          sub={t.sub}
          variant={t.variant}
        />
      ))}

      {showComplete && (
        <SuccessOverlay
          xp={sessionXp}
          bestStreak={bestStreak}
          accuracy={accuracy}
          totalAttempts={totalAttempts}
          onPlayAgain={resetGame}
        />
      )}
    </div>
  );
}
