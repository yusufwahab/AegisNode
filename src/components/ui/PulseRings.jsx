import { useEffect } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../lib/motion";

/**
 * The core "sonar ping" motif: a tap-point dot with concentric rings
 * emanating outward, fading as they expand. Used ambiently (looping) in the
 * hero, and one-shot (loop=false) in the scan demo.
 */
export default function PulseRings({
  ringCount = 3,
  duration = 2.5,
  loop = true,
  color = "var(--color-teal)",
  dotSize = 14,
  onComplete,
  className,
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (loop || !onComplete) return;
    const lastDelay = ((ringCount - 1) * duration) / ringCount;
    const timer = setTimeout(() => onComplete(), (lastDelay + duration) * 1000);
    return () => clearTimeout(timer);
  }, [loop, onComplete, ringCount, duration]);

  if (reduced) {
    return (
      <div className={className} style={{ position: "relative" }}>
        <span
          className="absolute inset-0 m-auto rounded-full"
          style={{ width: dotSize, height: dotSize, backgroundColor: color }}
        />
        <motion.span
          className="absolute inset-0 m-auto rounded-full border-2"
          style={{ width: dotSize * 4, height: dotSize * 4, borderColor: color }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1.2, repeat: loop ? Infinity : 0, repeatType: "reverse" }}
        />
      </div>
    );
  }

  return (
    <div className={className} style={{ position: "relative" }}>
      {Array.from({ length: ringCount }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute inset-0 m-auto rounded-full border-2"
          style={{ width: dotSize, height: dotSize, borderColor: color }}
          initial={{ scale: 1, opacity: 0.65 }}
          animate={{ scale: 9, opacity: 0 }}
          transition={{
            duration,
            ease: [0.22, 1, 0.36, 1],
            repeat: loop ? Infinity : 0,
            delay: (i * duration) / ringCount,
          }}
        />
      ))}
      <span
        className="absolute inset-0 m-auto rounded-full"
        style={{ width: dotSize, height: dotSize, backgroundColor: color }}
      />
    </div>
  );
}
