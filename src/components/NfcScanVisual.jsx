import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UnsplashImage from "./ui/UnsplashImage";
import PulseRings from "./ui/PulseRings";
import NfcMark from "./ui/NfcMark";
import { useReducedMotion } from "../lib/motion";

/**
 * The phone-tap + sonar-ring + data-readout composite. Ambient/looping in
 * the hero, one-shot (loop=false + onComplete) when triggered from the
 * scan demo — same visual language, two playback modes.
 *
 * No stock photo shows "phone tapping our tag" (it's not a real product
 * yet), so the tag itself is an illustrated card — inset the phone photo
 * so the card can peek out from behind its bottom-right edge, right where
 * the pulse rings fire.
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
      {/* The Aegis Node tag, peeking out from behind the phone's lower-right edge */}
      <div
        className="absolute bottom-[9%] right-0 z-0 flex h-[24%] w-[42%] items-end justify-start rounded-card p-3 shadow-lg"
        style={{
          background: "linear-gradient(150deg, #0E4F45 0%, #0B0F10 100%)",
          transform: "rotate(-9deg)",
        }}
      >
        <NfcMark className="h-4 w-4" color="#FAF9F6" />
      </div>

      {/* Phone photo, inset from the right so the tag shows beside/behind it */}
      <div className="absolute inset-y-0 left-0 z-10 w-[80%]">
        <UnsplashImage
          query="smartphone hand dark background"
          orientation="portrait"
          className="h-full w-full rounded-lg"
          imgClassName="[filter:saturate(0.7)_brightness(0.85)]"
          showAttribution={loop}
        />
      </div>

      {/* Tap point sits at the seam between phone and tag */}
      <div className="absolute z-20" style={{ left: "76%", top: "68%", transform: "translate(-50%, -50%)" }}>
        <PulseRings
          loop={loop}
          onComplete={onComplete}
          dotSize={14}
          ringCount={reducedMotion ? 1 : 3}
          duration={2.5}
        />
      </div>

      {showCaptureCard && (
        <div
          className="absolute z-20 hidden -translate-x-1/2 md:block"
          style={{ left: "40%", top: "26%" }}
        >
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
