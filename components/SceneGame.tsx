"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SCENES, getScene } from "@/data/scenes";
import { usePlayerProgress } from "@/hooks/usePlayerProgress";
import { hintForNoun } from "@/lib/game-utils";
import type { ArticleHint } from "@/lib/article-hints";
import { markSceneCompleted, recordNounAttempt } from "@/lib/player-progress";
import {
  PERSONALITY_LINES,
  STREAK_MILESTONES,
  comboMultiplier,
  levelFromXp,
  xpForCorrect,
} from "@/lib/game-constants";
import type { Article, GameMode } from "@/lib/types";
import { useGameAudio } from "@/hooks/useGameAudio";
import { AppHeader } from "./AppHeader";
import { FloatingToast } from "./FloatingToast";
import { GameHUD } from "./GameHUD";
import { GamePanel } from "./GamePanel";
import { SceneView } from "./SceneView";
import { SuccessOverlay } from "./SuccessOverlay";

type Toast = {
  id: number;
  message: string;
  sub?: string;
  variant: "success" | "streak" | "milestone";
};

type Props = {
  sceneId: string;
};

export function SceneGame({ sceneId }: Props) {
  const router = useRouter();
  const { progress, updateProgress, hydrated } = usePlayerProgress();
  const scene = useMemo(() => getScene(sceneId), [sceneId]);
  const objects = scene.objects;

  const [mode] = useState<GameMode>("chill");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [labeledIds, setLabeledIds] = useState<Set<string>>(new Set());
  const [wrongAttempts, setWrongAttempts] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [hint, setHint] = useState<ArticleHint | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [shake, setShake] = useState(false);
  const [lastXpGain, setLastXpGain] = useState<number | null>(null);
  const completePlayedRef = useRef(false);
  const audio = useGameAudio();

  const completedScenes = useMemo(
    () => new Set(progress.completedSceneIds),
    [progress.completedSceneIds],
  );

  useEffect(() => {
    if (!hydrated) return;
    setXp(progress.xp);
    setBestStreak(progress.bestStreak);
  }, [hydrated, progress.xp, progress.bestStreak]);

  useEffect(() => {
    if (!hydrated) return;
    updateProgress((p) => ({ ...p, lastSceneId: sceneId, hasPlayed: true }));
  }, [hydrated, sceneId, updateProgress]);

  useEffect(() => {
    setSelectedId(objects[0]?.id ?? null);
    setLabeledIds(new Set());
    setWrongAttempts({});
    setStreak(0);
    setFeedback(null);
    setHint(null);
    setShowComplete(false);
    setSessionXp(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    completePlayedRef.current = false;
  }, [sceneId, objects]);

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

  const persistXp = useCallback(
    (nextXp: number, nextBest: number) => {
      updateProgress((p) => ({
        ...p,
        xp: nextXp,
        bestStreak: Math.max(p.bestStreak, nextBest),
        hasPlayed: true,
      }));
    },
    [updateProgress],
  );

  useEffect(() => {
    if (isComplete && !completePlayedRef.current) {
      completePlayedRef.current = true;
      updateProgress((p) => markSceneCompleted(p, sceneId));
      audio.play("complete");
      setShowComplete(true);
    }
  }, [isComplete, audio, sceneId, updateProgress]);

  const resetGame = useCallback(() => {
    setSelectedId(objects[0]?.id ?? null);
    setLabeledIds(new Set());
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
      const correct = article === selected.article;

      updateProgress((p) => recordNounAttempt(p, sceneId, selected, correct));

      if (correct) {
        const newStreak = streak + 1;
        const gain = xpForCorrect(newStreak);
        setLabeledIds((prev) => new Set([...prev, selected.id]));
        setStreak(newStreak);
        const newBest = Math.max(bestStreak, newStreak);
        setBestStreak(newBest);
        const newXp = xp + gain;
        setXp(newXp);
        persistXp(newXp, newBest);
        setSessionXp((x) => x + gain);
        setCorrectAttempts((n) => n + 1);
        setLastXpGain(gain);
        setFeedback("correct");
        setHint(null);
        audio.play("correct");

        if (STREAK_MILESTONES.some((m) => m === newStreak)) {
          audio.play("streak");
          pushToast(`${newStreak} streak!`, PERSONALITY_LINES[newStreak], "milestone");
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
        if (mode !== "exam" && attempts >= 1) {
          setHint(hintForNoun(selected.noun));
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
      sceneId,
      updateProgress,
      xp,
      bestStreak,
      persistXp,
    ],
  );

  const nextScene = SCENES.find(
    (s) => !completedScenes.has(s.id) && s.id !== sceneId,
  );

  if (!hydrated) {
    return null;
  }

  return (
    <div
      className={`mx-auto max-w-6xl px-4 pb-10 pt-6 ${shake ? "animate-shake" : ""}`}
      onClick={handleFirstInteraction}
      onKeyDown={handleFirstInteraction}
    >
      <AppHeader
        musicOn={audio.musicOn}
        onToggleMusic={audio.toggleMusic}
        backHref="/"
        backLabel="← Worlds"
        title={`${scene.emoji} ${scene.name}`}
      />

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

      <div className="mt-4 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <section className="rounded-3xl bg-white/60 p-4 shadow-xl backdrop-blur-sm">
          <SceneView
            key={scene.id}
            scene={scene}
            selectedId={selectedId}
            labeledIds={labeledIds}
            onSelect={handleSelect}
            showTooltips={showTooltips}
          />
        </section>

        <section className="min-h-[480px]">
          <GamePanel
            objects={objects}
            selected={
              selected && !labeledIds.has(selected.id) ? selected : null
            }
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
          sceneName={scene.name}
          sceneEmoji={scene.emoji}
          xp={sessionXp}
          bestStreak={bestStreak}
          accuracy={accuracy}
          totalAttempts={totalAttempts}
          nextSceneId={nextScene?.id}
          nextSceneName={nextScene?.name}
          onPlayAgain={resetGame}
          onBackToWorlds={() => router.push("/")}
        />
      )}
    </div>
  );
}
