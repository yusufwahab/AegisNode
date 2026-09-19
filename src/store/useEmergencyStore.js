import { create } from "zustand";
import { mockProfile } from "../lib/mockData";

const CONTACT_STAGGER_MS = 800;

// Drives the full-screen Emergency Trigger takeover (updatedPrompt.md
// section 8). Three entry points all call trigger(): a threshold-breaching
// Daily Log reading, "Simulate emergency" in Settings > Demo tools, and the
// Live Sensor anomaly escalation.
export const useEmergencyStore = create((set, get) => ({
  active: false,
  stage: "alerting", // alerting | guidance
  reason: "",
  notifiedCount: 0,
  showProfile: false,

  trigger(reason) {
    if (get().active) return;
    set({ active: true, stage: "alerting", reason, notifiedCount: 0, showProfile: false });

    const total = mockProfile.emergencyContacts.length;
    const notifyNext = (i) => {
      setTimeout(() => {
        if (!get().active) return;
        set({ notifiedCount: i });
        if (i >= total) {
          set({ stage: "guidance" });
        } else {
          notifyNext(i + 1);
        }
      }, CONTACT_STAGGER_MS);
    };
    notifyNext(1);
  },

  toggleProfile(show) {
    set({ showProfile: show });
  },

  resolve() {
    set({ active: false, stage: "alerting", notifiedCount: 0, showProfile: false });
  },
}));
