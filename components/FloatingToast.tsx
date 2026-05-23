"use client";

type Props = {
  message: string;
  sub?: string;
  variant?: "success" | "streak" | "milestone";
};

export function FloatingToast({ message, sub, variant = "success" }: Props) {
  const styles = {
    success: "from-frosted-mint to-icy-blue text-emerald-900",
    streak: "from-mauve to-pink-mist text-purple-900",
    milestone: "from-vanilla-custard to-pink-mist text-amber-950",
  };

  return (
    <div
      className={`pointer-events-none fixed left-1/2 top-24 z-40 -translate-x-1/2 animate-[toast-in_0.4s_ease-out] rounded-2xl bg-gradient-to-r px-6 py-3 shadow-xl ${styles[variant]}`}
      role="status"
    >
      <p className="text-center font-bold">{message}</p>
      {sub && <p className="mt-0.5 text-center text-sm opacity-90">{sub}</p>}
    </div>
  );
}
