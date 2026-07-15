import { motion } from "framer-motion";
import clsx from "clsx";

export default function Stepper({ steps, currentIndex }) {
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-mist">
        <motion.div
          className="h-full rounded-full bg-teal"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-3 flex justify-between">
        {steps.map((step, i) => (
          <span
            key={step}
            className={clsx(
              "text-xs font-medium tracking-wide",
              i <= currentIndex ? "text-teal" : "text-slate"
            )}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
