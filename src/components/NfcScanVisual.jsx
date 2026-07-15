import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UnsplashImage from "./ui/UnsplashImage";
import PulseRings from "./ui/PulseRings";
import { useReducedMotion } from "../lib/motion";

/**
 * The phone-tap + sonar-ring + data-readout composite. Ambient/looping in
 * the hero, one-shot (loop=false + onComplete) when triggered from the
 * scan demo — same visual language, two playback modes.
 */
export default function NfcScanVisual({
  loop = true,
  showCaptureCard = true,
  onComplete,
  className,
}) {
  const [captured, setCaptured] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!loop) return;
    let hideTimer;
    const interval = setInterval(() => {
      setCaptured(true);
      hideTimer = setTimeout(() => setCaptured(false), 1200);
    }, 2500);
    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, [loop]);

  return (
    <div className={className} style={{ position: "relative" }}>
      <UnsplashImage
        query="smartphone hand dark background"
        orientation="portrait"
        className="h-full w-full rounded-lg"
        imgClassName="[filter:saturate(0.7)_brightness(0.85)]"
        showAttribution={loop}
      />

      <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2">
        <PulseRings
          loop={loop}
          onComplete={onComplete}
          dotSize={14}
          ringCount={reducedMotion ? 1 : 3}
          duration={2.5}
        />
      </div>

      {showCaptureCard && (
        <div className="absolute left-1/2 top-[28%] hidden -translate-x-1/2 md:block">
          <AnimatePresence>
            {captured && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="whitespace-nowrap rounded-card bg-paper px-4 py-3 shadow-lg"
              >
                <p className="text-sm font-medium text-ink">
                  Blood Type: <span className="text-teal">O−</span> · Allergy: Penicillin · Synced{" "}
                  <span className="text-teal">✓</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
