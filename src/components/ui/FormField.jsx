import { useId, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

// Inputs whose browser chrome always shows intrinsic placeholder-like
// content (e.g. "mm/dd/yyyy"), so their label must stay floated even
// when empty and unfocused — otherwise it collides with that text.
const ALWAYS_FLOAT_TYPES = new Set(["date", "time", "month", "week", "color"]);

export default function FormField({ label, type = "text", value, onChange, error, ...rest }) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const floated = focused || Boolean(value) || ALWAYS_FLOAT_TYPES.has(type);

  return (
    <motion.div
      animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={clsx(
            "peer min-h-[52px] w-full rounded-sm border bg-paper px-3.5 pt-4 pb-1.5 text-[15px] text-ink outline-none transition-shadow duration-200",
            error
              ? "border-coral focus:shadow-[0_0_0_3px_rgba(228,87,46,0.12)]"
              : "border-mist focus:border-teal focus:shadow-[0_0_0_3px_rgba(14,79,69,0.12)]"
          )}
          {...rest}
        />
        <label
          htmlFor={id}
          className={clsx(
            "pointer-events-none absolute left-3.5 text-slate transition-all duration-200",
            floated ? "top-1.5 text-[11px]" : "top-1/2 -translate-y-1/2 text-[15px]"
          )}
        >
          {label}
        </label>
      </div>
      {error && <p className="mt-1.5 text-xs text-coral">{error}</p>}
    </motion.div>
  );
}
