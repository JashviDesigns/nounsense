import type { SceneObject } from "@/lib/types";

type NounSeed = {
  id: string;
  article: SceneObject["article"];
  noun: string;
  english: string;
  category: string;
  highlightRound?: boolean;
  highlightW?: number;
  highlightH?: number;
};

/** Grid placeholders until you calibrate at /calibrate?scene=… */
export function buildSceneObjects(seeds: NounSeed[]): SceneObject[] {
  const cols = 3;
  return seeds.map((seed, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const left = 22 + col * 28;
    const top = 28 + row * 20;
    return {
      ...seed,
      number: i + 1,
      highlight: { top: `${top}%`, left: `${left}%` },
      marker: { top: `${top - 4}%`, left: `${left + 3}%` },
      highlightW: seed.highlightW ?? 44,
      highlightH: seed.highlightH ?? 40,
      highlightRound: seed.highlightRound,
    };
  });
}
