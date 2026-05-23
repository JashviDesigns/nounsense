"use client";

import Image from "next/image";
import Link from "next/link";
import type { SceneDefinition } from "@/lib/types";

type Props = {
  scenes: SceneDefinition[];
  completedSceneIds: Set<string>;
  recommendedId?: string;
};

export function WorldGrid({
  scenes,
  completedSceneIds,
  recommendedId = "living-room",
}: Props) {
  const masteredCount = completedSceneIds.size;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-zinc-900">Choose a world</h2>
        {masteredCount > 0 && (
          <p className="text-sm text-zinc-500">
            {masteredCount}/{scenes.length} mastered
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {scenes.map((scene) => {
          const mastered = completedSceneIds.has(scene.id);
          const recommended = scene.id === recommendedId;

          return (
            <Link
              key={scene.id}
              href={`/play/${scene.id}`}
              className={`group relative overflow-hidden rounded-2xl border-2 bg-white/80 shadow-md transition hover:scale-[1.02] hover:shadow-lg ${
                recommended
                  ? "border-mauve ring-2 ring-mauve/30"
                  : mastered
                    ? "border-emerald-300/70"
                    : "border-transparent hover:border-mauve/40"
              }`}
            >
              <div className="relative aspect-square bg-[#f5d0dc]">
                <Image
                  src={scene.image}
                  alt={scene.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
                {mastered && (
                  <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-sm text-white shadow">
                    ✓
                  </span>
                )}
                {recommended && !mastered && (
                  <span className="absolute left-2 top-2 rounded-full bg-mauve px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    Start here
                  </span>
                )}
              </div>
              <div className="px-3 py-2.5">
                <p className="font-semibold text-zinc-800">
                  {scene.emoji} {scene.name}
                </p>
                <p className="text-xs text-zinc-500">10 objects</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
