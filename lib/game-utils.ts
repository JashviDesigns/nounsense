import { getArticleHint, type ArticleHint } from "@/lib/article-hints";
import type { Article } from "@/lib/types";

export function fullLabel(article: Article, noun: string): string {
  return `${article} ${noun}`;
}

export function hintForNoun(noun: string): ArticleHint {
  return getArticleHint(noun);
}
