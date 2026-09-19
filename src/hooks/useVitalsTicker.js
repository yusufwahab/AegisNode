import { useEffect } from "react";
import { useVitalsStore } from "../store/useVitalsStore";

// Mounted once (App.jsx) so the simulated wearable feed keeps updating no
// matter which route is active, instead of each widget owning its own timer.
export function useVitalsTicker() {
  useEffect(() => {
    const id = setInterval(() => useVitalsStore.getState().tick(), 2000);
    return () => clearInterval(id);
  }, []);
}
