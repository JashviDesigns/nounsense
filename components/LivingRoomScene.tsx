"use client";

import Image from "next/image";
import { useState } from "react";
import { LIVING_ROOM_IMAGE } from "@/data/living-room";
import { fullLabel } from "@/lib/game-utils";
import type { SceneObject } from "@/lib/types";

type Props = {
  objects: SceneObject[];
  selectedId: string | null;
  labeledIds: Set<string>;
  onSelect: (id: string) => void;
  showTooltips: boolean;
};

export function LivingRoomScene({
  objects,
  selectedId,
  labeledIds,
  onSelect,
  showTooltips,
}: Props) {
  const [imageOk, setImageOk] = useState(true);

  return (
    <div className="relative aspect-[4/3] w-full min-h-[360px] overflow-hidden rounded-2xl bg-gradient-to-br from-frosted-mint/40 to-icy-blue/30 shadow-inner">
      {imageOk ? (
        <Image
          src={LIVING_ROOM_IMAGE}
          alt="Living room scene"
          fill
          className="object-cover"
          priority
          onError={() => setImageOk(false)}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#b8e6c8] via-[#e8f4fc] to-[#fce8f3] p-6 text-center">
          <p className="text-sm font-medium text-zinc-700">Living room scene</p>
          <p className="max-w-xs text-xs text-zinc-500">
            Add your image at{" "}
            <code className="rounded bg-white/80 px-1 py-0.5">public/scenes/living-room.png</code>
          </p>
        </div>
      )}

      {objects.map((obj) => {
        const isSelected = selectedId === obj.id;
        const isLabeled = labeledIds.has(obj.id);
        const tooltipText = isLabeled
          ? fullLabel(obj.article, obj.noun)
          : obj.noun;

        return (
          <button
            key={obj.id}
            type="button"
            aria-label={`Object ${obj.number}: ${obj.noun}`}
            aria-pressed={isSelected}
            disabled={isLabeled}
            onClick={() => onSelect(obj.id)}
            className={`absolute z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-bold shadow-md transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve ${
              isSelected
                ? "scale-110 bg-mauve text-white ring-2 ring-white"
                : isLabeled
                  ? "bg-frosted-mint text-emerald-800 ring-1 ring-emerald-300"
                  : "bg-white text-zinc-800 hover:scale-105"
            }`}
            style={{ top: obj.hotspot.top, left: obj.hotspot.left }}
          >
            {isLabeled ? "✓" : obj.number}
            {showTooltips && !isLabeled && isSelected && (
              <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-800 shadow">
                {tooltipText}
              </span>
            )}
          </button>
        );
      })}

      {objects
        .filter((o) => labeledIds.has(o.id))
        .map((obj) => (
          <div
            key={`label-${obj.id}`}
            className="label-stick pointer-events-none absolute z-20 -translate-x-1/2 rounded px-1.5 py-0.5 text-[10px] font-bold shadow"
            style={{
              top: `calc(${obj.hotspot.top} - 22px)`,
              left: obj.hotspot.left,
              backgroundColor:
                obj.article === "der"
                  ? "#a9def9"
                  : obj.article === "die"
                    ? "#f694c1"
                    : "#ede7b1",
              color:
                obj.article === "das"
                  ? "#5c4d00"
                  : obj.article === "der"
                    ? "#0c4a6e"
                    : "#831843",
            }}
          >
            {obj.article}
          </div>
        ))}
    </div>
  );
}
