import clsx from "clsx";

// The pulse-sweep skeleton used everywhere instead of spinners — a moving
// highlight sweeps across a Mist rectangle rather than a static pulse-opacity
// block, per the "pulse/signal" motif carried through the whole product.
export default function Skeleton({ className, rounded = "rounded-card" }) {
  return (
    <div className={clsx("relative overflow-hidden bg-mist", rounded, className)}>
      <div className="absolute inset-0 -translate-x-full animate-[pulse-sweep_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}
