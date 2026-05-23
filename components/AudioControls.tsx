"use client";

type Props = {
  musicOn: boolean;
  onToggleMusic: () => void;
};

export function AudioControls({ musicOn, onToggleMusic }: Props) {
  return (
    <button
      type="button"
      onClick={onToggleMusic}
      aria-label={musicOn ? "Mute music" : "Unmute music"}
      className="rounded-full bg-white/80 px-3 py-1.5 text-sm shadow-sm transition hover:bg-white"
    >
      {musicOn ? "🎵" : "🔇"} Music
    </button>
  );
}
