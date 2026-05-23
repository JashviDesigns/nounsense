"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChiptuneEngine, playChipSfx } from "@/lib/chiptune-engine";

type SoundName = "correct" | "wrong" | "streak" | "complete";

const MUSIC_VOLUME = 0.14;

export function useGameAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const sfxGainRef = useRef<GainNode | null>(null);
  const engineRef = useRef<ChiptuneEngine | null>(null);
  const [musicOn, setMusicOn] = useState(true);
  const [sfxOn, setSfxOn] = useState(true);
  const [ready, setReady] = useState(false);
  const musicOnRef = useRef(musicOn);
  const sfxOnRef = useRef(sfxOn);

  musicOnRef.current = musicOn;
  sfxOnRef.current = sfxOn;

  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
      musicGainRef.current = ctxRef.current.createGain();
      sfxGainRef.current = ctxRef.current.createGain();
      musicGainRef.current.connect(ctxRef.current.destination);
      sfxGainRef.current.connect(ctxRef.current.destination);
      musicGainRef.current.gain.value = MUSIC_VOLUME;
      sfxGainRef.current.gain.value = 0.3;
    }
    return ctxRef.current;
  }, []);

  const startChiptune = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || !musicGainRef.current || engineRef.current?.isRunning) return;
    engineRef.current = new ChiptuneEngine(ctx, musicGainRef.current);
    engineRef.current.setVolume(MUSIC_VOLUME);
    engineRef.current.start();
  }, [getCtx]);

  const stopChiptune = useCallback(() => {
    engineRef.current?.stop();
    engineRef.current = null;
  }, []);

  const init = useCallback(async () => {
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") await ctx.resume();
    setReady(true);
    if (musicOnRef.current) startChiptune();
  }, [getCtx, startChiptune]);

  const play = useCallback(
    (name: SoundName) => {
      if (!ready || !sfxOnRef.current) return;
      const ctx = getCtx();
      if (!ctx || !sfxGainRef.current) return;
      playChipSfx(ctx, sfxGainRef.current, name);
    },
    [ready, getCtx],
  );

  const toggleMusic = useCallback(() => {
    setMusicOn((on) => {
      const next = !on;
      if (musicGainRef.current) {
        musicGainRef.current.gain.value = next ? MUSIC_VOLUME : 0;
      }
      if (next && ready) startChiptune();
      else stopChiptune();
      return next;
    });
  }, [ready, startChiptune, stopChiptune]);

  const toggleSfx = useCallback(() => {
    setSfxOn((on) => !on);
  }, []);

  useEffect(() => {
    return () => stopChiptune();
  }, [stopChiptune]);

  return {
    ready,
    musicOn,
    sfxOn,
    init,
    play,
    toggleMusic,
    toggleSfx,
  };
}
