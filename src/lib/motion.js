import { useSyncExternalStore } from "react";

export const EASE = [0.22, 1, 0.36, 1];

function subscribeReducedMotion(callback) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

// Fade + rise, the standard scroll-reveal used across the site.
export const fadeRise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const fadeRiseReduced = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

export function staggerContainer(stagger = 0.08, delayChildren = 0) {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

export const viewportOnce = { once: true, margin: "-100px" };

// Direction-aware slide used by the onboarding wizard.
export function stepVariants(direction) {
  return {
    enter: { opacity: 0, x: direction > 0 ? 24 : -24 },
    center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
    exit: { opacity: 0, x: direction > 0 ? -24 : 24, transition: { duration: 0.3, ease: EASE } },
  };
}
