import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";
import clsx from "clsx";
import Badge from "./ui/Badge";

function stepToward(value, [min, max], jitter) {
  const target = min + Math.random() * (max - min);
  const next = value + (target - value) * 0.35 + (Math.random() - 0.5) * jitter;
  return next;
}

/**
 * A simulated vitals readout — not connected to any real sensor (the tag has
 * none). Ticks on its own so it looks alive, plus a manual trigger so the
 * "elevated" moment happens on cue during a live demo rather than by chance.
 * Clearly labeled as a preview so it never implies it's reading anything real.
 */
export default function VitalsMonitor() {
  const [heartRate, setHeartRate] = useState(76);
  const [spo2, setSpo2] = useState(98);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((hr) => {
        const next = stepToward(hr, elevated ? [128, 148] : [68, 92], 3);
        return Math.round(Math.min(160, Math.max(55, next)));
      });
      setSpo2((s) => {
        const next = stepToward(s, elevated ? [90, 94] : [96, 99], 0.6);
        return Math.round(Math.min(100, Math.max(85, next)));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [elevated]);

  const isCritical = heartRate >= 120;

  return (
    <div
      className={clsx(
        "mt-4 rounded-card border p-5 transition-colors duration-500",
        isCritical ? "border-coral bg-coral/5" : "border-mist bg-paper"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: isCritical ? 0.5 : 0.9, repeat: Infinity, ease: "easeInOut" }}
          >
            <HeartPulse size={18} strokeWidth={1.5} className={isCritical ? "text-coral" : "text-teal"} />
          </motion.div>
          <span className="text-xs font-medium uppercase tracking-wider text-slate">Live Vitals</span>
        </div>
        {isCritical && (
          <Badge tone="coral" className="whitespace-nowrap">
            Elevated Heart Rate
          </Badge>
        )}
      </div>

      <div className="mt-4 flex gap-8">
        <div>
          <p className="font-display text-3xl text-ink">
            {heartRate}
            <span className="text-sm text-slate"> bpm</span>
          </p>
          <p className="text-xs text-slate">Heart Rate</p>
        </div>
        <div>
          <p className="font-display text-3xl text-ink">
            {spo2}
            <span className="text-sm text-slate">%</span>
          </p>
          <p className="text-xs text-slate">SpO2</p>
        </div>
      </div>

      {isCritical && (
        <p className="mt-3 text-sm text-coral">
          Recommend immediate ECG monitoring and cardiac evaluation on arrival.
        </p>
      )}

      <button
        type="button"
        onClick={() => setElevated((e) => !e)}
        className="mt-4 text-xs text-slate underline-offset-4 hover:text-teal hover:underline"
      >
        {elevated ? "Reset to normal (Demo)" : "Simulate Cardiac Event (Demo)"}
      </button>
      <p className="mt-2 text-[11px] text-slate/70">
        Simulated preview — live monitoring requires compatible wearable hardware.
      </p>
    </div>
  );
}
