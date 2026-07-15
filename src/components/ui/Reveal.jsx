import { motion } from "framer-motion";
import { fadeRise, fadeRiseReduced, staggerContainer, viewportOnce, useReducedMotion } from "../../lib/motion";

export function Reveal({ as: Component = motion.div, className, children, delay = 0 }) {
  const reduced = useReducedMotion();
  const variants = reduced ? fadeRiseReduced : fadeRise;

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

export function RevealGroup({ className, children, stagger = 0.08 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={staggerContainer(stagger)}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ as: Component = motion.div, className, children }) {
  const reduced = useReducedMotion();
  const variants = reduced ? fadeRiseReduced : fadeRise;
  return (
    <Component className={className} variants={variants}>
      {children}
    </Component>
  );
}
