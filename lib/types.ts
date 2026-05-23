export type Article = "der" | "die" | "das";

export type GameMode = "chill" | "focus" | "exam";

export type SceneObject = {
  id: string;
  number: number;
  article: Article;
  noun: string;
  english: string;
  category: string;
  highlight: { top: string; left: string };
  highlightW: number;
  highlightH: number;
  highlightRound?: boolean;
  marker: { top: string; left: string };
};

export type SceneDefinition = {
  id: string;
  name: string;
  emoji: string;
  /** Path under public/, e.g. /scenes/kitchen.jpg */
  image: string;
  objects: SceneObject[];
};
