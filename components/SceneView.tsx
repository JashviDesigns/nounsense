"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fullLabel } from "@/lib/game-utils";
import type { SceneDefinition } from "@/lib/types";

type Props = {
  scene: SceneDefinition;
  selectedId: string | null;
  labeledIds: Set<string>;
  onSelect: (id: string) => void;
  showTooltips: boolean;
};

function articleLabelStyle(article: SceneDefinition["objects"][0]["article"]) {
  return {
    backgroundColor:
      article === "der"
        ? "#a9def9"
        : article === "die"
          ? "#f694c1"
          : "#ede7b1",
    color:
      article === "das"
        ? "#5c4d00"
        : article === "der"
          ? "#0c4a6e"
          : "#831843",
  };
}

function ObjectHighlight({
  obj,
  isSelected,
  isLabeled,
  showTooltips,
  onSelect,
}: {
  obj: SceneDefinition["objects"][0];
  isSelected: boolean;
  isLabeled: boolean;
  showTooltips: boolean;
  onSelect: (id: string) => void;
}) {
  const round = obj.highlightRound ?? false;

  return (
    <button
      type="button"
      aria-label={obj.noun}
      aria-pressed={isSelected}
      disabled={isLabeled}
      onClick={() => onSelect(obj.id)}
      className={`absolute z-[5] -translate-x-1/2 -translate-y-1/2 border-0 bg-transparent p-0 focus:outline-none ${
        isSelected ? "z-30" : ""
      }`}
      style={{
        top: obj.highlight.top,
        left: obj.highlight.left,
        width: obj.highlightW,
        height: obj.highlightH,
      }}
    >
      {isSelected && !isLabeled && (
        <span
          className={`pointer-events-none block h-full w-full border-[2.5px] border-white shadow-[0_0_12px_rgba(255,255,255,0.75)] ${
            round ? "rounded-full" : "rounded-md"
          }`}
          aria-hidden
        />
      )}

      {showTooltips && isSelected && !isLabeled && (
        <span className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-800 shadow">
          {obj.noun}
        </span>
      )}
    </button>
  );
}

function LabeledSticky({
  obj,
  dimmed,
}: {
  obj: SceneDefinition["objects"][0];
  dimmed?: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-opacity ${
        dimmed ? "opacity-45" : ""
      }`}
      style={{ top: obj.marker.top, left: obj.marker.left }}
      aria-label={fullLabel(obj.article, obj.noun)}
    >
      <span
        className="label-stick whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-bold shadow ring-2 ring-white/80"
        style={articleLabelStyle(obj.article)}
      >
        {fullLabel(obj.article, obj.noun)}
      </span>
    </div>
  );
}

export function SceneView({
  scene,
  selectedId,
  labeledIds,
  onSelect,
  showTooltips,
}: Props) {
  const [imageOk, setImageOk] = useState(true);

  useEffect(() => {
    setImageOk(true);
  }, [scene.id, scene.image]);

  const focusActive = selectedId != null;

  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-2xl bg-[#f5d0dc] p-3 shadow-inner">
      {imageOk ? (
        <div className="relative aspect-square w-full max-w-[min(100%,440px)]">
          <Image
            src={scene.image}
            alt={`${scene.name} scene`}
            width={1200}
            height={1200}
            className="block h-auto w-full rounded-lg select-none"
            priority
            draggable={false}
            onError={() => setImageOk(false)}
          />

          <div className="absolute inset-0">
            {scene.objects.map((obj) => {
              const isSelected = selectedId === obj.id;
              const isLabeled = labeledIds.has(obj.id);

              return (
                <ObjectHighlight
                  key={`hl-${obj.id}`}
                  obj={obj}
                  isSelected={isSelected}
                  isLabeled={isLabeled}
                  showTooltips={showTooltips}
                  onSelect={onSelect}
                />
              );
            })}
            {scene.objects.map((obj) => {
              if (!labeledIds.has(obj.id)) return null;
              const dimmed = focusActive && selectedId !== obj.id;

              return (
                <LabeledSticky
                  key={`label-${obj.id}`}
                  obj={obj}
                  dimmed={dimmed}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex max-w-xs flex-col items-center justify-center gap-2 p-6 text-center">
          <p className="text-sm font-medium text-zinc-700">
            {scene.emoji} {scene.name}
          </p>
          <p className="text-xs text-zinc-500">
            Add scene art at{" "}
            <code className="rounded bg-white/80 px-1 py-0.5">
              public{scene.image}
            </code>
          </p>
          <p className="text-xs text-zinc-500">
            Then calibrate at{" "}
            <code className="rounded bg-white/80 px-1 py-0.5">
              /calibrate?scene={scene.id}
            </code>
          </p>
        </div>
      )}
    </div>
  );
}
