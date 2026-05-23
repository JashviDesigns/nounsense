import type { Article } from "@/lib/types";

export function fullLabel(article: Article, noun: string): string {
  return `${article} ${noun}`;
}

export function categoryHint(category: string): string | null {
  const hints: Record<string, string> = {
    furniture: "Tip: furniture gender varies — think of how you'd say it in a sentence.",
    architecture: "Tip: many building parts use das, but doors are often die.",
    electronics: "Tip: tech nouns don't follow one rule — recall the full phrase.",
    decoration: "Tip: decoration words split across der, die, and das.",
  };
  return hints[category] ?? "Tip: try remembering a short phrase with this noun.";
}
