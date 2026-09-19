import { create } from "zustand";

function stepToward(value, [min, max], jitterAmount) {
  const target = min + Math.random() * (max - min);
  return value + (target - value) * 0.35 + (Math.random() - 0.5) * jitterAmount;
}

function clampRound(value, min, max) {
  return Math.round(Math.min(max, Math.max(min, value)));
}

const BASELINE = { heartRate: 76, hrv: 62, spo2: 98, systolic: 118, diastolic: 76, respRate: 15 };

// A single simulated "wearable" feed shared by the Dashboard mini-widget, the
// Live Sensor page, and the responder-facing scan view — one ticking interval
// (started once via useVitalsTicker) instead of each widget running its own,
// so "Simulate HRV anomaly" from anywhere affects every view at once.
export const useVitalsStore = create((set, get) => ({
  ...BASELINE,
  elevated: false,
  anomalyModalOpen: false,

  tick() {
    const { elevated } = get();
    set((s) => ({
      heartRate: clampRound(stepToward(s.heartRate, elevated ? [128, 148] : [68, 92], 3), 55, 160),
      hrv: clampRound(stepToward(s.hrv, elevated ? [20, 34] : [52, 70], 2), 16, 80),
      spo2: clampRound(stepToward(s.spo2, elevated ? [90, 94] : [96, 99], 0.6), 85, 100),
      systolic: clampRound(stepToward(s.systolic, elevated ? [145, 165] : [110, 124], 2), 90, 180),
      diastolic: clampRound(stepToward(s.diastolic, elevated ? [92, 102] : [70, 80], 1.5), 55, 115),
      respRate: clampRound(stepToward(s.respRate, elevated ? [24, 30] : [13, 17], 0.8), 8, 35),
    }));
  },

  toggleElevated() {
    set((s) => ({ elevated: !s.elevated }));
  },

  // The "hidden dev" trigger — reached from Settings > Demo tools, not a
  // visible button on the Live Sensor screen itself (see updatedPrompt.md
  // section 7). Goes elevated immediately; the modal follows after a beat so
  // the spike reads on-screen first.
  simulateAnomaly() {
    set({ elevated: true });
    setTimeout(() => set({ anomalyModalOpen: true }), 2000);
  },

  dismissAnomalyModal() {
    set({ anomalyModalOpen: false, elevated: false });
  },

  reset() {
    set({ ...BASELINE, elevated: false, anomalyModalOpen: false });
  },
}));
