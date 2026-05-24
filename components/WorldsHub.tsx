"use client";

import { useCallback, useMemo, useState } from "react";
import { SCENES } from "@/data/scenes";
import { useEntranceReady } from "@/hooks/useEntranceReady";
import { usePlayerProgress } from "@/hooks/usePlayerProgress";
import { useGameAudio } from "@/hooks/useGameAudio";
import { NounSenseLoader } from "./NounSenseLoader";
import { getScene } from "@/data/scenes";
import {
  getWeakNouns,
  recordNounAttempt,
  type NounStats,
} from "@/lib/player-progress";
import { levelFromXp } from "@/lib/game-constants";
import type { Article } from "@/lib/types";
import { AppHeader } from "./AppHeader";
import { FloatingToast } from "./FloatingToast";
import { GameHUD } from "./GameHUD";
import { HomeTabs } from "./HomeTabs";
import { VaultPanel } from "./VaultPanel";
import { WorldGrid } from "./WorldGrid";

type Tab = "worlds" | "vault";

export function WorldsHub() {
  const { progress, updateProgress, hydrated } = usePlayerProgress();
  const entranceReady = useEntranceReady(hydrated);
  const [tab, setTab] = useState<Tab>("worlds");
  const [vaultFeedback, setVaultFeedback] = useState<"correct" | "wrong" | null>(
    null,
  );
  const [vaultLastAnswered, setVaultLastAnswered] = useState<NounStats | null>(
    null,
  );
  const [toast, setToast] = useState<{ message: string; sub?: string } | null>(
    null,
  );
  const audio = useGameAudio();

  const completedScenes = useMemo(
    () => new Set(progress.completedSceneIds),
    [progress.completedSceneIds],
  );
  const weakNouns = useMemo(() => getWeakNouns(progress), [progress]);
  const isFirstVisit = hydrated && !progress.hasPlayed;
  const level = levelFromXp(progress.xp);

  const handleFirstInteraction = useCallback(() => {
    if (!audio.ready) void audio.init();
  }, [audio]);

  const handleVaultAnswer = useCallback(
    (stats: NounStats, article: Article) => {
      handleFirstInteraction();
      const sceneObj = getScene(stats.sceneId).objects.find(
        (o) => o.id === stats.objectId,
      );
      if (!sceneObj) return;

      const correct = article === stats.article;
      setVaultLastAnswered(stats);
      updateProgress((p) => {
        const next = recordNounAttempt(p, stats.sceneId, sceneObj, correct);
        if (correct) {
          return {
            ...next,
            xp: next.xp + 5,
            hasPlayed: true,
          };
        }
        return { ...next, hasPlayed: true };
      });

      if (correct) {
        setVaultFeedback("correct");
        audio.play("correct");
        setToast({ message: "+5 XP", sub: "Vault review" });
      } else {
        setVaultFeedback("wrong");
        audio.play("wrong");
      }
      setTimeout(() => {
        setVaultFeedback(null);
        setToast(null);
      }, 2200);
    },
    [handleFirstInteraction, updateProgress, audio],
  );

  if (!entranceReady) {
    return <NounSenseLoader />;
  }

  return (
    <div
      className="mx-auto max-w-6xl px-4 pb-10 pt-6"
      onClick={handleFirstInteraction}
      onKeyDown={handleFirstInteraction}
    >
      <AppHeader musicOn={audio.musicOn} onToggleMusic={audio.toggleMusic} />

      <GameHUD
        xp={progress.xp}
        level={level}
        streak={0}
        bestStreak={progress.bestStreak}
        accuracy={100}
        comboMultiplier={1}
      />

      <HomeTabs
        active={tab}
        vaultCount={weakNouns.length}
        onChange={setTab}
      />

      {tab === "worlds" ? (
        <>
          {isFirstVisit && (
            <div className="mb-4 rounded-2xl border border-mauve/30 bg-mauve/10 px-4 py-3 text-sm text-zinc-700">
              <span className="font-semibold text-mauve">Welcome!</span> Tap{" "}
              <strong>Living Room</strong> to start — label objects with{" "}
              <strong>der</strong>, <strong>die</strong>, or <strong>das</strong>.
            </div>
          )}
          <WorldGrid
            scenes={SCENES}
            completedSceneIds={completedScenes}
            recommendedId="living-room"
          />
        </>
      ) : (
        <VaultPanel
          weakNouns={weakNouns}
          onPracticeAnswer={handleVaultAnswer}
          feedback={vaultFeedback}
          lastAnswered={vaultLastAnswered}
        />
      )}

      {toast && (
        <FloatingToast
          message={toast.message}
          sub={toast.sub}
          variant="success"
        />
      )}
    </div>
  );
}
