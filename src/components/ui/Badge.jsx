import clsx from "clsx";

const TONES = {
  neutral: "bg-mist text-ink",
  teal: "bg-teal-light text-teal",
  coral: "bg-coral/10 text-coral",
  outline: "bg-transparent text-slate border border-mist",
};

export default function Badge({ tone = "neutral", className, children, dot = false }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        TONES[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
