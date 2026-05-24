"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/lib/types";

/** Board first, then NounSense title (~6s total). */
const BOARD_FADE_MS = 400;
const STICKY_STAGGER_MS = 380;
const FOOTER_HOLD_MS = 500;

type Sticky = {
  article: Article;
  noun: string;
  rotate: number;
};

const STICKIES: Sticky[] = [
  { article: "der", noun: "Hund", rotate: -4 },
  { article: "die", noun: "Katze", rotate: 5 },
  { article: "das", noun: "Buch", rotate: -3 },
  { article: "der", noun: "Tisch", rotate: 4 },
  { article: "die", noun: "Stadt", rotate: -5 },
  { article: "das", noun: "Haus", rotate: 3 },
  { article: "der", noun: "Baum", rotate: 5 },
];

const BOARD_TO_TITLE_MS =
  BOARD_FADE_MS +
  (STICKIES.length - 1) * STICKY_STAGGER_MS +
  200 +
  FOOTER_HOLD_MS;

function stickyColors(article: Article) {
  if (article === "der") {
    return { bg: "#a9def9", text: "#1e3a5f", articleText: "#0c4a6e" };
  }
  if (article === "die") {
    return { bg: "#f694c1", text: "#831843", articleText: "#9d174d" };
  }
  return { bg: "#ede7b1", text: "#5c4d00", articleText: "#713f12" };
}

function ArticleChip({ article }: { article: Article }) {
  const colors = stickyColors(article);
  return (
    <span
      className="rounded-xl px-5 py-2 text-base font-bold shadow-sm"
      style={{ backgroundColor: colors.bg, color: "#4c1d95" }}
    >
      {article}
    </span>
  );
}

function StickyNote({
  article,
  noun,
  rotate,
  visible,
}: Sticky & { visible: boolean }) {
  const colors = stickyColors(article);
  return (
    <div
      className={`splash-sticky flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.12)] sm:h-20 sm:w-20 ${
        visible ? "splash-sticky-visible" : ""
      }`}
      style={{
        backgroundColor: colors.bg,
        ["--sticky-rotate" as string]: `${rotate}deg`,
      }}
    >
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: colors.articleText }}
      >
        {article}
      </span>
      <span className="text-lg font-bold leading-tight" style={{ color: colors.text }}>
        {noun}
      </span>
    </div>
  );
}

export function NounSenseLoader() {
  const [phase, setPhase] = useState<"board" | "title">("board");
  const [visibleCount, setVisibleCount] = useState(0);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const staggerTimers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < STICKIES.length; i++) {
      staggerTimers.push(
        setTimeout(
          () => setVisibleCount(i + 1),
          BOARD_FADE_MS + i * STICKY_STAGGER_MS,
        ),
      );
    }

    const tFooter = setTimeout(
      () => setShowFooter(true),
      BOARD_FADE_MS + (STICKIES.length - 1) * STICKY_STAGGER_MS + 200,
    );

    const tTitle = setTimeout(() => setPhase("title"), BOARD_TO_TITLE_MS);

    return () => {
      staggerTimers.forEach(clearTimeout);
      clearTimeout(tFooter);
      clearTimeout(tTitle);
    };
  }, []);

  return (
    <div
      className="nounsense-splash fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading NounSense"
    >
      {phase === "board" && (
        <div className="splash-board-wrap w-full max-w-2xl">
          <div className="splash-board relative rounded-3xl border-2 border-[#d8ccf5] bg-[#faf9fc] px-6 py-8 shadow-[0_16px_48px_rgba(91,33,149,0.12)] sm:px-10 sm:py-10">
            <span
              className="absolute left-4 top-3 h-2.5 w-2.5 rounded-full bg-[#9b7fd4]"
              aria-hidden
            />
            <span
              className="absolute right-4 top-3 h-2.5 w-2.5 rounded-full bg-[#9b7fd4]"
              aria-hidden
            />

            <div className="flex flex-col gap-5 sm:gap-6">
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {STICKIES.slice(0, 4).map((sticky, i) => (
                  <StickyNote
                    key={`${sticky.noun}-top`}
                    {...sticky}
                    visible={i < visibleCount}
                  />
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {STICKIES.slice(4).map((sticky, i) => (
                  <StickyNote
                    key={`${sticky.noun}-bottom`}
                    {...sticky}
                    visible={i + 4 < visibleCount}
                  />
                ))}
              </div>
            </div>

            <p
              className={`splash-footer mt-8 text-center text-sm font-medium text-[#b39ddb] ${
                showFooter ? "splash-footer-visible" : ""
              }`}
            >
              der · die · das
            </p>
          </div>
        </div>
      )}

      {phase === "title" && (
        <div className="splash-title flex flex-col items-center text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-[#4c1d95] sm:text-6xl">
            NounSense
          </h1>
          <div className="mt-8 flex items-center gap-3 sm:gap-4">
            <ArticleChip article="der" />
            <ArticleChip article="die" />
            <ArticleChip article="das" />
          </div>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.28em] text-[#a78bfa] sm:text-sm">
            Master German Gender
          </p>
        </div>
      )}
    </div>
  );
}
