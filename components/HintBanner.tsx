"use client";

type Props = {
  text: string;
};

export function HintBanner({ text }: Props) {
  return (
    <div
      role="status"
      className="hint-banner mt-5 w-full max-w-sm rounded-2xl border-2 border-amber-400/80 bg-gradient-to-br from-amber-50 via-white to-vanilla-custard px-4 py-3.5 shadow-lg shadow-amber-200/40"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/25 text-xl"
          aria-hidden
        >
          💡
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Hint
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-amber-950">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
