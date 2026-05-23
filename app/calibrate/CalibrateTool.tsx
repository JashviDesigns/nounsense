"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { SCENES, getScene } from "@/data/scenes";
import type { SceneObject } from "@/lib/types";

function cloneObjects(objects: SceneObject[]): SceneObject[] {
  return objects.map((o) => ({
    ...o,
    highlight: { ...o.highlight },
    marker: { ...o.marker },
  }));
}

type Props = {
  initialSceneId: string;
};

export function CalibrateTool({ initialSceneId }: Props) {
  const [sceneId, setSceneId] = useState(initialSceneId);
  const scene = useMemo(() => getScene(sceneId), [sceneId]);

  const [objects, setObjects] = useState<SceneObject[]>(() =>
    cloneObjects(getScene(initialSceneId).objects),
  );
  const [activeId, setActiveId] = useState(
    () => getScene(initialSceneId).objects[0]?.id ?? "",
  );
  const [mode, setMode] = useState<"highlight" | "marker">("highlight");
  const [copied, setCopied] = useState(false);

  const switchScene = (id: string) => {
    const next = getScene(id);
    setSceneId(id);
    setObjects(cloneObjects(next.objects));
    setActiveId(next.objects[0]?.id ?? "");
  };

  const active = objects.find((o) => o.id === activeId);

  const onImageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!active) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const left = ((e.clientX - rect.left) / rect.width) * 100;
      const top = ((e.clientY - rect.top) / rect.height) * 100;
      const point = {
        left: `${left.toFixed(1)}%`,
        top: `${top.toFixed(1)}%`,
      };

      setObjects((prev) =>
        prev.map((o) => (o.id === activeId ? { ...o, [mode]: point } : o)),
      );
    },
    [active, activeId, mode],
  );

  const exportBlock = useMemo(() => {
    const lines = objects.map((o) => {
      const round = o.highlightRound ? "\n    highlightRound: true," : "";
      return `  {
    id: "${o.id}",
    number: ${o.number},
    article: "${o.article}",
    noun: "${o.noun}",
    english: "${o.english}",
    category: "${o.category}",
    highlight: { top: "${o.highlight.top}", left: "${o.highlight.left}" },
    highlightW: ${o.highlightW},
    highlightH: ${o.highlightH},${round}
    marker: { top: "${o.marker.top}", left: "${o.marker.left}" },
  },`;
    });
    return `// Paste into data/scenes/${sceneId}.ts objects array\n${lines.join("\n")}`;
  }, [objects, sceneId]);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-xl font-bold">Hotspot calibrator</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Scene: <strong>{scene.emoji} {scene.name}</strong> — image:{" "}
        <code>public{scene.image}</code>
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {SCENES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => switchScene(s.id)}
            className={`rounded-full px-3 py-1 text-sm ${
              sceneId === s.id ? "bg-mauve text-white" : "bg-white shadow"
            }`}
          >
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {objects.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setActiveId(o.id)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              activeId === o.id ? "bg-zinc-900 text-white" : "bg-zinc-200"
            }`}
          >
            {o.number} {o.noun}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("highlight")}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            mode === "highlight" ? "bg-zinc-900 text-white" : "bg-zinc-200"
          }`}
        >
          Place highlight (object)
        </button>
        <button
          type="button"
          onClick={() => setMode("marker")}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            mode === "marker" ? "bg-zinc-900 text-white" : "bg-zinc-200"
          }`}
        >
          Place marker (number)
        </button>
      </div>

      <div
        className="relative mx-auto mt-4 aspect-square w-full max-w-md cursor-crosshair overflow-hidden rounded-xl bg-[#f5d0dc]"
        onClick={onImageClick}
        role="presentation"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={scene.image}
          alt="Calibrate"
          className="pointer-events-none block h-auto w-full select-none"
          draggable={false}
        />
        {objects.map((o) => (
          <div key={o.id}>
            <span
              className="pointer-events-none absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-mauve/80"
              style={{ top: o.highlight.top, left: o.highlight.left }}
            />
            <span
              className="pointer-events-none absolute z-20 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[8px] font-bold"
              style={{ top: o.marker.top, left: o.marker.left }}
            >
              {o.number}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white"
          onClick={() => {
            void navigator.clipboard.writeText(exportBlock);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          {copied ? "Copied!" : "Copy TS snippet"}
        </button>
        <Link href="/" className="rounded-lg bg-zinc-200 px-4 py-2 text-sm">
          Back to game
        </Link>
      </div>

      <pre className="mt-4 max-h-64 overflow-auto rounded-lg bg-zinc-100 p-3 text-xs">
        {exportBlock}
      </pre>
    </main>
  );
}
