import { motion } from "framer-motion";
import clsx from "clsx";

export default function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <label
      className={clsx(
        "flex items-center justify-between gap-4 min-h-[44px]",
        disabled && "opacity-50"
      )}
    >
      {label && <span className="text-[15px] text-ink">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 cursor-pointer",
          checked ? "bg-teal" : "bg-mist"
        )}
      >
        <motion.span
          className="absolute top-1 left-1 h-5 w-5 rounded-full bg-paper shadow-sm"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </button>
    </label>
  );
}
