import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ChevronDown } from "lucide-react";
import clsx from "clsx";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Drawer from "../../components/ui/Drawer";
import { useHealthStore } from "../../store/useHealthStore";
import { useEmergencyStore } from "../../store/useEmergencyStore";
import { useToast } from "../../lib/toastContext";
import { formatShortDate } from "../../lib/healthData";

const SYMPTOM_OPTIONS = ["Headache", "Dizziness", "Chest discomfort", "None"];
const ACTIVITY_OPTIONS = [
  { value: "none", label: "None" },
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "intense", label: "Intense" },
];
const SLEEP_LABELS = ["Poor", "Fair", "Okay", "Good", "Excellent"];
const STRESS_LABELS = ["Very Low", "Low", "Moderate", "High", "Very High"];

// Hypertensive-crisis range — the one threshold in the whole app that opens
// the Reading Alert modal instead of saving silently (updatedPrompt.md
// section 3).
function crossesEmergencyThreshold({ systolic, diastolic }) {
  return systolic >= 180 || diastolic >= 120;
}

function NumberStepper({ label, value, onChange, min, max, unit }) {
  return (
    <div>
      <p className="text-sm font-medium text-ink">{label}</p>
      <div className="mt-2 flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-mist text-slate hover:border-teal hover:text-teal"
        >
          <Minus size={16} strokeWidth={1.5} />
        </button>
        <div className="flex min-w-[84px] flex-col items-center">
          <input
            type="number"
            inputMode="numeric"
            value={value}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (!Number.isNaN(next)) onChange(Math.min(max, Math.max(min, next)));
            }}
            className="w-full border-none bg-transparent text-center font-display text-3xl text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {unit && <span className="text-xs text-slate">{unit}</span>}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-mist text-slate hover:border-teal hover:text-teal"
        >
          <Plus size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "min-h-[40px] rounded-full border px-4 text-sm font-medium transition-colors",
        active ? "border-teal bg-teal-light text-teal" : "border-mist text-slate hover:border-teal hover:text-teal"
      )}
    >
      {children}
    </button>
  );
}

function SegmentedScale({ label, value, labels, onChange }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-ink">{label}</p>
        <span className="text-xs text-slate">{labels[value - 1]}</span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {labels.map((l, i) => {
          const n = i + 1;
          return (
            <button
              key={l}
              type="button"
              aria-label={l}
              onClick={() => onChange(n)}
              className={clsx(
                "h-9 flex-1 rounded-sm border transition-colors",
                n <= value ? "border-teal bg-teal" : "border-mist bg-paper hover:border-teal/50"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function DailyLog() {
  const navigate = useNavigate();
  const pushToast = useToast();
  const logs = useHealthStore((s) => s.logs);
  const addLog = useHealthStore((s) => s.addLog);
  const addInsight = useHealthStore((s) => s.addInsight);

  const [form, setForm] = useState({
    systolic: 120,
    diastolic: 80,
    heartRate: 72,
    symptoms: ["None"],
    sleepQuality: 4,
    stressLevel: 2,
    activity: "light",
  });
  const [saving, setSaving] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [expandedDate, setExpandedDate] = useState(null);

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
  }

  function toggleSymptom(opt) {
    setForm((f) => {
      if (opt === "None") return { ...f, symptoms: ["None"] };
      const withoutNone = f.symptoms.filter((s) => s !== "None");
      const exists = withoutNone.includes(opt);
      const next = exists ? withoutNone.filter((s) => s !== opt) : [...withoutNone, opt];
      return { ...f, symptoms: next.length ? next : ["None"] };
    });
  }

  function commitLog(extraInsight) {
    addLog({
      date: new Date().toISOString().slice(0, 10),
      systolic: form.systolic,
      diastolic: form.diastolic,
      heartRate: form.heartRate,
      hrv: null,
      sleepQuality: form.sleepQuality,
      stressLevel: form.stressLevel,
      activity: form.activity,
      symptoms: form.symptoms,
      isAnomaly: false,
      source: "manual",
    });
    if (extraInsight) addInsight(extraInsight);
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (crossesEmergencyThreshold(form)) {
        setAlertOpen(true);
        return;
      }
      commitLog();
      pushToast?.("Reading logged.");
      navigate("/dashboard");
    }, 600);
  }

  function handleAlertYes() {
    setAlertOpen(false);
    commitLog();
    useEmergencyStore
      .getState()
      .trigger("A manually logged reading was significantly outside your normal range.");
  }

  function handleAlertNo() {
    setAlertOpen(false);
    const today = new Date().toISOString().slice(0, 10);
    commitLog({
      id: `manual-elevated-${Date.now()}`,
      type: "warning",
      metric: "systolic",
      headline: "A recent reading was significantly elevated",
      preview: `Your ${form.systolic}/${form.diastolic} reading on ${formatShortDate(today)} was well outside your normal range.`,
      explanation:
        "You chose not to alert your contacts for this reading. Keep an eye on how you're feeling, and consider a follow-up reading soon. Not a diagnosis — consult a doctor if symptoms continue.",
      action: null,
      date: today,
      chartData: [],
    });
    pushToast?.("Reading logged.");
    navigate("/dashboard");
  }

  const recentLogs = [...logs].reverse().slice(0, 30);

  return (
    <div className="max-w-2xl pb-28">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-ink">Daily Log</h1>
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="text-sm font-medium text-teal hover:underline"
          >
            View past logs
          </button>
        </div>
        <p className="mt-1 text-[15px] text-slate">Takes under a minute — sliders and steppers over typing.</p>
      </motion.div>

      <div className="mt-8 flex flex-col gap-8">
        <Card className="flex flex-col gap-6 sm:flex-row sm:gap-10">
          <NumberStepper
            label="Systolic"
            unit="mmHg"
            value={form.systolic}
            min={70}
            max={220}
            onChange={(v) => update({ systolic: v })}
          />
          <NumberStepper
            label="Diastolic"
            unit="mmHg"
            value={form.diastolic}
            min={40}
            max={140}
            onChange={(v) => update({ diastolic: v })}
          />
        </Card>

        <Card>
          <NumberStepper
            label="Heart Rate"
            unit="bpm"
            value={form.heartRate}
            min={35}
            max={200}
            onChange={(v) => update({ heartRate: v })}
          />
        </Card>

        <div>
          <p className="text-sm font-medium text-ink">Symptoms</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SYMPTOM_OPTIONS.map((opt) => (
              <Chip key={opt} active={form.symptoms.includes(opt)} onClick={() => toggleSymptom(opt)}>
                {opt}
              </Chip>
            ))}
          </div>
        </div>

        <SegmentedScale
          label="Sleep Quality"
          labels={SLEEP_LABELS}
          value={form.sleepQuality}
          onChange={(v) => update({ sleepQuality: v })}
        />

        <SegmentedScale
          label="Stress Level"
          labels={STRESS_LABELS}
          value={form.stressLevel}
          onChange={(v) => update({ stressLevel: v })}
        />

        <div>
          <p className="text-sm font-medium text-ink">Activity</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ACTIVITY_OPTIONS.map((opt) => (
              <Chip key={opt.value} active={form.activity === opt.value} onClick={() => update({ activity: opt.value })}>
                {opt.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-20 border-t border-mist bg-paper p-4 md:sticky md:bottom-0 md:mt-8 md:border-t-0 md:p-0">
        <Button variant="primary" className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Log"}
        </Button>
      </div>

      <Modal open={alertOpen} onClose={() => setAlertOpen(false)} title="Reading outside your normal range">
        <p className="text-[15px] leading-relaxed text-slate">
          This reading ({form.systolic}/{form.diastolic}) is significantly outside your normal range. Would you
          like Helix to alert your emergency contacts?
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button variant="coral" onClick={handleAlertYes}>
            Yes, alert contacts
          </Button>
          <Button variant="ghost-ink" onClick={handleAlertNo}>
            No, just log it
          </Button>
        </div>
      </Modal>

      <Drawer open={historyOpen} onClose={() => setHistoryOpen(false)} title="Past logs">
        <div className="flex flex-col divide-y divide-mist">
          {recentLogs.map((log) => {
            const expanded = expandedDate === log.date;
            return (
              <div key={log.date}>
                <button
                  type="button"
                  onClick={() => setExpandedDate(expanded ? null : log.date)}
                  className="flex w-full items-center justify-between gap-3 py-4 text-left"
                >
                  <div>
                    <p className="text-[15px] font-medium text-ink">{formatShortDate(log.date)}</p>
                    <p className="text-xs text-slate">
                      {log.systolic}/{log.diastolic} mmHg · {log.heartRate} bpm
                    </p>
                  </div>
                  <ChevronDown
                    size={18}
                    strokeWidth={1.5}
                    className={clsx("shrink-0 text-slate transition-transform", expanded && "rotate-180 text-teal")}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 pb-4 text-sm">
                        <dt className="text-slate">Symptoms</dt>
                        <dd className="text-ink">{log.symptoms?.join(", ") || "None"}</dd>
                        <dt className="text-slate">Sleep quality</dt>
                        <dd className="text-ink">{SLEEP_LABELS[log.sleepQuality - 1]}</dd>
                        <dt className="text-slate">Stress level</dt>
                        <dd className="text-ink">{STRESS_LABELS[log.stressLevel - 1]}</dd>
                        <dt className="text-slate">Activity</dt>
                        <dd className="text-ink capitalize">{log.activity}</dd>
                      </dl>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
}
