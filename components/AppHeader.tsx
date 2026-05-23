"use client";

import Link from "next/link";
import { AudioControls } from "./AudioControls";

type Props = {
  musicOn: boolean;
  onToggleMusic: () => void;
  backHref?: string;
  backLabel?: string;
  title?: string;
};

export function AppHeader({
  musicOn,
  onToggleMusic,
  backHref,
  backLabel = "← Worlds",
  title,
}: Props) {
  return (
    <header className="mb-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        {backHref ? (
          <Link
            href={backHref}
            className="text-sm font-medium text-mauve hover:underline"
          >
            {backLabel}
          </Link>
        ) : (
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-zinc-900 hover:text-mauve"
          >
            NounSense
          </Link>
        )}
        {title && (
          <h1 className="truncate text-lg font-semibold text-zinc-800">{title}</h1>
        )}
      </div>
      <AudioControls musicOn={musicOn} onToggleMusic={onToggleMusic} />
    </header>
  );
}
