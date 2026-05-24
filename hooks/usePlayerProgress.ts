"use client";

import { useCallback, useEffect, useState } from "react";
import {
  defaultProgress,
  loadProgress,
  saveProgress,
  type PlayerProgress,
} from "@/lib/player-progress";

export function usePlayerProgress() {
  const [progress, setProgress] = useState<PlayerProgress>(defaultProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setProgress(loadProgress());
    } finally {
      setHydrated(true);
    }
  }, []);

  const updateProgress = useCallback((updater: (prev: PlayerProgress) => PlayerProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  return { progress, updateProgress, hydrated };
}
