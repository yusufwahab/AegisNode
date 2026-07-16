import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeartPulse, ArrowUp, ArrowDown, Minus } from "lucide-react";
import clsx from "clsx";
import Badge from "./ui/Badge";

function stepToward(value, [min, max], jitter) {
  const target = min + Math.random() * (max - min);
  const next = value + (target - value) * 0.35 + (Math.random() - 0.5) * jitter;
  return next;
}

function clampRound(value, min, max) {
  return Math.round(Math.min(max, Math.max(min, value)));
}

// One beat unit spans 200 SVG units (baseline, small P-wave bump, sharp QRS
// spike, small T-wave bump); the path holds two units back-to-back (0-400)
// so translating the whole trace by exactly -400 loops seamlessly.
const BEAT_UNIT = "L40,30 L50,20 L60,40 L70,5 L80,55 L90,30 L120,30 L130,25 L140,30 L200,30";
const ECG_PATH = `M0,30 ${BEAT_UNIT} ${BEAT_UNIT.replace(/(-?\d+(?:\.\d+)?),/g, (_, n) => `${Number(n) + 200},`)}`;

function EcgTrace({ heartRate, critical }) {
  const beatDuration = Math.min(3, Math.max(0.6, (60 / Math.max(heartRate, 30)) * 2));
  const color = critical ? "#E4572E" : "#2FBF8F";

  return (
    <div className="mt-4 overflow-hidden rounded-sm bg-ink-deep">
      <svg viewBox="0 0 400 60" className="h-16 w-full" preserveAspectRatio="none">
        <motion.g
          animate={{ x: [0, -400] }}
          transition={{ duration: beatDuration * 2, repeat: Infinity, ease: "linear" }}
        >
          <path d={ECG_PATH} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d={ECG_PATH}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(400,0)"
          />
        </motion.g>
      </svg>
    </div>
  );
}

function TrendIcon({ direction }) {
  if (direction === "up") return <ArrowUp size={11} strokeWidth={2.5} className="text-coral" />;
  if (direction === "down") return <ArrowDown size={11} strokeWidth={2.5} className="text-teal" />;
  return <Minus size={11} strokeWidth={2.5} className="text-slate/40" />;
}

function VitalStat({ label, value, unit, direction }) {
  return (
    <div>
      <div className="flex items-center gap-1">
        <p className="text-xs uppercase tracking-wider text-slate">{label}</p>
        <TrendIcon direction={direction} />
      </div>
      <p className="mt-1 whitespace-nowrap font-display text-3xl text-ink">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {value}
        </motion.span>
        <span className="text-sm text-slate"> {unit}</span>
      </p>
    </div>
  );
}

// Direction is derived during render (not in an effect) by comparing against
// the last-seen value — React's recommended pattern for "adjust state when a
// prop changes" rather than a useEffect + setState round trip.
function useTrend(value) {
  const [tracked, setTracked] = useState(value);
  const [direction, setDirection] = useState("flat");

  if (value !== tracked) {
    setDirection(value > tracked ? "up" : "down");
    setTracked(value);
  }

  return direction;
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
  const [systolic, setSystolic] = useState(118);
  const [diastolic, setDiastolic] = useState(76);
  const [respRate, setRespRate] = useState(15);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((hr) => clampRound(stepToward(hr, elevated ? [128, 148] : [68, 92], 3), 55, 160));
      setSpo2((s) => clampRound(stepToward(s, elevated ? [90, 94] : [96, 99], 0.6), 85, 100));
      setSystolic((sys) => clampRound(stepToward(sys, elevated ? [145, 165] : [110, 124], 2), 90, 180));
      setDiastolic((dia) => clampRound(stepToward(dia, elevated ? [92, 102] : [70, 80], 1.5), 55, 115));
      setRespRate((rr) => clampRound(stepToward(rr, elevated ? [24, 30] : [13, 17], 0.8), 8, 35));
    }, 2000);
    return () => clearInterval(interval);
  }, [elevated]);

  const heartRateTrend = useTrend(heartRate);
  const spo2Trend = useTrend(spo2);
  const systolicTrend = useTrend(systolic);
  const respRateTrend = useTrend(respRate);

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
        <Badge tone={isCritical ? "coral" : "teal"} dot className="whitespace-nowrap">
          {isCritical ? "Critical" : "Stable"}
        </Badge>
      </div>

      <EcgTrace heartRate={heartRate} critical={isCritical} />

      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <VitalStat label="Heart Rate" value={heartRate} unit="bpm" direction={heartRateTrend} />
        <VitalStat label="SpO2" value={spo2} unit="%" direction={spo2Trend} />
        <VitalStat label="Blood Pressure" value={`${systolic}/${diastolic}`} unit="mmHg" direction={systolicTrend} />
        <VitalStat label="Resp. Rate" value={respRate} unit="brpm" direction={respRateTrend} />
      </div>

      {isCritical && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-coral"
        >
          Recommend immediate ECG monitoring and cardiac evaluation on arrival.
        </motion.p>
      )}

      <button
        type="button"
        onClick={() => setElevated((e) => !e)}
        className="mt-4 text-xs text-slate underline-offset-4 hover:text-teal hover:underline"
      >
        {elevated ? "Reset to Normal" : "Simulate Cardiac Event"}
      </button>
      <p className="mt-2 text-[11px] text-slate/70">
        Simulated preview — live monitoring requires compatible wearable hardware.
      </p>
    </div>
  );
}
