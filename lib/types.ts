export type Article = "der" | "die" | "das";

export type GameMode = "chill" | "focus" | "exam";

export type SceneObject = {
  id: string;
  number: number;
  article: Article;
  noun: string;
  english: string;
  category: string;
  /** Hotspot on scene image (% of container) */
  hotspot: { top: string; left: string };
};
