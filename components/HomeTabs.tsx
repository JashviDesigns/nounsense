"use client";

export type HubTab = "worlds" | "vault";

type Props = {
  active: HubTab;
  vaultCount: number;
  onChange: (tab: HubTab) => void;
};

export function HomeTabs({ active, vaultCount, onChange }: Props) {
  return (
    <div className="mb-4 flex gap-1 rounded-2xl bg-white/60 p-1 shadow-sm">
      <button
        type="button"
        onClick={() => onChange("worlds")}
        className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
          active === "worlds"
            ? "bg-mauve text-white shadow"
            : "text-zinc-600 hover:bg-white/80"
        }`}
      >
        Worlds
      </button>
      <button
        type="button"
        onClick={() => onChange("vault")}
        className={`relative flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
          active === "vault"
            ? "bg-mauve text-white shadow"
            : "text-zinc-600 hover:bg-white/80"
        }`}
      >
        Vault
        {vaultCount > 0 && (
          <span
            className={`ml-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              active === "vault"
                ? "bg-white/25 text-white"
                : "bg-pink-mist text-pink-950"
            }`}
          >
            {vaultCount}
          </span>
        )}
      </button>
    </div>
  );
}
