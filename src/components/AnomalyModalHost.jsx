import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { useVitalsStore } from "../store/useVitalsStore";
import { useHealthStore } from "../store/useHealthStore";
import { useToast } from "../lib/toastContext";

// Mounted once at the App root so "Simulate HRV anomaly" (Settings > Demo
// tools) surfaces this modal no matter which page is currently open.
export default function AnomalyModalHost() {
  const open = useVitalsStore((s) => s.anomalyModalOpen);
  const addInsight = useHealthStore((s) => s.addInsight);
  const navigate = useNavigate();
  const pushToast = useToast();
  const toasted = useRef(false);

  useEffect(() => {
    if (open && !toasted.current) {
      toasted.current = true;
      pushToast?.("Unusual heart rhythm pattern detected.");
    }
    if (!open) toasted.current = false;
  }, [open, pushToast]);

  function recordInsight() {
    addInsight({
      id: `live-anomaly-${Date.now()}`,
      type: "warning",
      metric: "hrv",
      headline: "A change in your heart rate variability",
      preview: "Helix noticed a brief HRV drop during live monitoring just now.",
      explanation:
        "This can sometimes precede a rise in blood pressure. Not a diagnosis — consult a doctor if you feel unwell.",
      action: { label: "Log a BP reading now", to: "/dashboard/log" },
      date: new Date().toISOString().slice(0, 10),
      chartData: [],
    });
  }

  function handleLogNow() {
    useVitalsStore.getState().dismissAnomalyModal();
    recordInsight();
    navigate("/dashboard/log");
  }

  function handleDismiss() {
    useVitalsStore.getState().dismissAnomalyModal();
    recordInsight();
  }

  return (
    <Modal open={open} onClose={handleDismiss} title="Heart rhythm change detected">
      <p className="text-[15px] leading-relaxed text-slate">
        We've noticed a change in your heart rate variability. This can sometimes precede a rise in blood
        pressure.
      </p>
      <p className="mt-2 text-xs text-slate/70">Not a diagnosis — consult a doctor if you feel unwell.</p>
      <div className="mt-6 flex flex-col gap-3">
        <Button variant="primary" onClick={handleLogNow}>
          Log a BP reading now
        </Button>
        <Button variant="ghost-ink" onClick={handleDismiss}>
          Dismiss
        </Button>
      </div>
    </Modal>
  );
}
