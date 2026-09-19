import { create } from "zustand";
import { generateHealthHistory, buildSeedInsights } from "../lib/healthData";

function seed() {
  const logs = generateHealthHistory();
  const insights = buildSeedInsights(logs);
  return { logs, insights };
}

// Holds the seeded 6-month synthetic history plus anything the demo adds on
// top (manual log entries, meals, live-triggered insights) — one store so
// the Dashboard, Trends, Insights, and Daily Log pages all stay in sync.
export const useHealthStore = create((set) => ({
  ...seed(),
  meals: [],

  addLog(entry) {
    set((s) => ({ logs: [...s.logs, entry] }));
  },

  addInsight(insight) {
    set((s) => ({ insights: [insight, ...s.insights] }));
  },

  addMeal(meal) {
    set((s) => ({ meals: [meal, ...s.meals].slice(0, 8) }));
  },

  resetDemoData() {
    set({ ...seed(), meals: [] });
  },
}));
