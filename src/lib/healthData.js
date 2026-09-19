// Synthetic ~6-month daily health history for the demo profile. The shape is
// deliberately authored, not random: 8 weeks of normal baseline, a gradual
// upward BP drift over the next 6 weeks, one sharp anomalous spike near the
// end of that drift, then a partial recovery over the remaining ~12 weeks.
// Random jitter is layered on top for texture, but never drives the story.

const TOTAL_DAYS = 182;
const BASELINE_DAYS = 56;
const DRIFT_DAYS = 42;
const ANOMALY_INDEX = 90;

function addDaysLocal(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatShortDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function jitter(magnitude) {
  return (Math.random() - 0.5) * 2 * magnitude;
}

function clampRound(value, min, max) {
  return Math.round(Math.min(max, Math.max(min, value)));
}

function phaseProgress(i) {
  if (i < BASELINE_DAYS) return { phase: "baseline", t: i / BASELINE_DAYS };
  if (i < BASELINE_DAYS + DRIFT_DAYS) return { phase: "drift", t: (i - BASELINE_DAYS) / DRIFT_DAYS };
  return { phase: "recovery", t: (i - BASELINE_DAYS - DRIFT_DAYS) / (TOTAL_DAYS - BASELINE_DAYS - DRIFT_DAYS) };
}

function baseSystolic(i) {
  const { phase, t } = phaseProgress(i);
  if (phase === "baseline") return 118 + Math.sin(i / 4) * 2;
  if (phase === "drift") return 120 + t * 24; // 120 -> 144
  return 138 - t * 14; // 138 -> 124 (partial recovery, not back to 118)
}

const ACTIVITY_LEVELS = ["none", "light", "moderate", "intense"];

function pickActivity(phase) {
  const weights =
    phase === "drift" ? [0.4, 0.35, 0.2, 0.05] : phase === "baseline" ? [0.15, 0.35, 0.35, 0.15] : [0.2, 0.35, 0.3, 0.15];
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (r <= acc) return ACTIVITY_LEVELS[i];
  }
  return "light";
}

export function generateHealthHistory() {
  const today = new Date();
  const start = addDaysLocal(today, -(TOTAL_DAYS - 1));
  const logs = [];

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const { phase } = phaseProgress(i);
    const isAnomaly = i === ANOMALY_INDEX;
    const nearAnomaly = Math.abs(i - ANOMALY_INDEX) <= 1;

    let systolic = clampRound(baseSystolic(i) + jitter(3), 105, 180);
    let diastolic = clampRound(systolic * 0.63 + jitter(2), 65, 115);
    let heartRate = clampRound(70 + (systolic - 118) * 0.3 + jitter(3), 58, 145);
    let hrv = clampRound(65 - (systolic - 118) * 0.45 + jitter(3), 22, 74);
    let stressLevel = clampRound(2 + (systolic - 118) * 0.08 + jitter(0.5), 1, 5);
    let sleepQuality = clampRound(4.2 - (systolic - 118) * 0.06 + jitter(0.4), 1, 5);
    let symptoms = ["None"];

    if (isAnomaly) {
      systolic = 176;
      diastolic = 108;
      heartRate = 141;
      hrv = 24;
      stressLevel = 5;
      sleepQuality = 2;
      symptoms = ["Dizziness", "Chest discomfort"];
    } else if (nearAnomaly) {
      symptoms = ["Headache"];
    } else if (phase === "drift" && Math.random() < 0.12) {
      symptoms = ["Headache"];
    }

    logs.push({
      date: toISODate(addDaysLocal(start, i)),
      systolic,
      diastolic,
      heartRate,
      hrv,
      sleepQuality,
      stressLevel,
      activity: pickActivity(phase),
      symptoms,
      isAnomaly,
      source: "seed",
    });
  }

  return logs;
}

function avg(values) {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function getRiskLevel({ heartRate, hrv, systolic, elevated }) {
  if (elevated || heartRate >= 130 || systolic >= 160) return "high";
  if (heartRate >= 95 || hrv <= 40 || systolic >= 135) return "elevated";
  return "normal";
}

export const RISK_COPY = {
  normal: {
    label: "Normal",
    tone: "teal",
    message: "Your cardiovascular health looks stable.",
  },
  elevated: {
    label: "Elevated",
    tone: "amber",
    message: "We've noticed a rising trend worth keeping an eye on.",
  },
  high: {
    label: "High",
    tone: "coral",
    message: "Immediate attention needed — see the guidance below.",
  },
};

export function buildSeedInsights(logs) {
  const anomalyIndex = logs.findIndex((l) => l.isAnomaly);
  const anomalyLog = logs[anomalyIndex];
  const priorWeekLog = logs[Math.max(0, anomalyIndex - 7)];

  const baselineSlice = logs.slice(0, 56);
  const driftSlice = logs.slice(56, 98);
  const recoverySlice = logs.slice(98);
  const driftTail = driftSlice.slice(-14);
  const recoveryTail = recoverySlice.slice(-14);

  const baselineAvgSys = Math.round(avg(baselineSlice.map((l) => l.systolic)));
  const driftAvgSys = Math.round(avg(driftTail.map((l) => l.systolic)));
  const driftAvgDia = Math.round(avg(driftTail.map((l) => l.diastolic)));
  const peakAvgSys = Math.round(avg(driftSlice.slice(-7).map((l) => l.systolic)));
  const recoveryAvgSys = Math.round(avg(recoveryTail.map((l) => l.systolic)));

  const driftStress = avg(driftSlice.map((l) => l.stressLevel));
  const recoveryStress = avg(recoverySlice.map((l) => l.stressLevel));
  const driftSleep = avg(driftSlice.map((l) => l.sleepQuality));
  const recoverySleep = avg(recoverySlice.map((l) => l.sleepQuality));

  return [
    {
      id: "seed-hrv-drop",
      type: "warning",
      metric: "hrv",
      headline: "Unusual drop in your heart rate variability",
      preview: `Your HRV dropped to ${anomalyLog.hrv}ms on ${formatShortDate(anomalyLog.date)} — a sharp change from your typical ${priorWeekLog.hrv}ms.`,
      explanation:
        "Helix doesn't measure blood pressure directly from your wearable — but a sudden HRV drop like this is an early-warning signal worth checking manually. This can sometimes precede a rise in blood pressure. Not a diagnosis — consult a doctor if this persists.",
      action: { label: "Log a BP reading now", to: "/dashboard/log" },
      date: anomalyLog.date,
      chartData: logs.slice(Math.max(0, anomalyIndex - 4), anomalyIndex + 5),
    },
    {
      id: "seed-bp-drift",
      type: "warning",
      metric: "systolic",
      headline: "Your blood pressure has been trending upward",
      preview: `Averaging ${driftAvgSys}/${driftAvgDia} over the last two weeks, up from ${baselineAvgSys} systolic in your baseline.`,
      explanation:
        "Over the past several weeks your logged readings have climbed gradually rather than all at once. Small, steady increases like this are exactly the kind of pattern Helix is built to flag early. Not a diagnosis — consult a doctor about this trend.",
      action: { label: "View full trend", to: "/dashboard/trends" },
      date: driftTail[driftTail.length - 1].date,
      chartData: driftTail,
    },
    {
      id: "seed-recovery",
      type: "improvement",
      metric: "systolic",
      headline: "Your readings have been improving",
      preview: `Averaging ${recoveryAvgSys} systolic over the last two weeks — down from the ${peakAvgSys} peak after your elevated period.`,
      explanation:
        "Since your elevated period, your readings have been gradually coming back down. Keep up whatever changed — Helix will keep watching for the trend to continue.",
      action: null,
      date: recoveryTail[recoveryTail.length - 1].date,
      chartData: recoverySlice.slice(-21),
    },
    {
      id: "seed-sleep",
      type: "improvement",
      metric: "sleepQuality",
      headline: "Sleep quality back on track",
      preview: `Averaging ${recoverySleep.toFixed(1)}/5 for sleep recently, up from ${driftSleep.toFixed(1)}/5 during your elevated period.`,
      explanation: `Stress levels have also eased, from an average of ${driftStress.toFixed(1)}/5 to ${recoveryStress.toFixed(1)}/5 over the same period. Sleep and stress both feed into your cardiovascular baseline — this is a good direction.`,
      action: null,
      date: recoveryTail[recoveryTail.length - 2].date,
      chartData: recoveryTail,
    },
  ];
}

export const COMMON_FOODS = [
  { name: "Jollof Rice", sodium: "high", sugar: "low" },
  { name: "Suya", sodium: "high", sugar: "low" },
  { name: "Egusi Soup", sodium: "medium", sugar: "low" },
  { name: "Moin Moin", sodium: "medium", sugar: "low" },
  { name: "Akara", sodium: "low", sugar: "low" },
  { name: "Pounded Yam & Egusi", sodium: "medium", sugar: "low" },
  { name: "Chin Chin", sodium: "low", sugar: "high" },
  { name: "Zobo Drink", sodium: "low", sugar: "medium" },
  { name: "Puff Puff", sodium: "low", sugar: "high" },
  { name: "Pepper Soup", sodium: "high", sugar: "low" },
  { name: "Beans & Plantain", sodium: "low", sugar: "medium" },
  { name: "Ofada Rice & Sauce", sodium: "high", sugar: "low" },
];

const SODIUM_HINTS = ["suya", "soup", "rice", "stew", "sauce", "salt", "stock", "seasoning"];
const SUGAR_HINTS = ["chin chin", "puff", "zobo", "cake", "soda", "drink", "sugar", "sweet", "chocolate"];

function guessLevel(query, hints) {
  const q = query.toLowerCase();
  return hints.some((h) => q.includes(h)) ? "medium" : "low";
}

export function analyzeFood(query, profile, logs) {
  const trimmed = query.trim();
  const match = COMMON_FOODS.find((f) => f.name.toLowerCase() === trimmed.toLowerCase());
  const sodium = match?.sodium ?? guessLevel(trimmed, SODIUM_HINTS);
  const sugar = match?.sugar ?? guessLevel(trimmed, SUGAR_HINTS);

  const conditions = (profile.conditions || []).join(" ").toLowerCase();
  const hasHypertensionRisk = /hypertension|blood pressure/.test(conditions);
  const hasDiabetesRisk = /diabetes/.test(conditions);

  const recent7 = logs?.slice(-7) ?? [];
  const recentAvgSystolic = recent7.length ? Math.round(avg(recent7.map((l) => l.systolic))) : null;
  const bpTrendingUp = recentAvgSystolic !== null && recentAvgSystolic >= 130;

  let verdict = "green";
  if ((sodium === "high" && (hasHypertensionRisk || bpTrendingUp)) || (sugar === "high" && hasDiabetesRisk)) {
    verdict = "red";
  } else if (sodium === "high" || sugar === "high" || sodium === "medium" || sugar === "medium") {
    verdict = "amber";
  }

  const parts = [];
  if (sodium === "high") {
    parts.push(
      bpTrendingUp
        ? `Given your recent BP trend (averaging ${recentAvgSystolic} systolic), this meal's sodium content is worth limiting today.`
        : "This meal runs high in sodium — fine occasionally, but worth balancing with lower-sodium meals today."
    );
  } else if (sodium === "medium") {
    parts.push("Moderate sodium — reasonable as part of a balanced day.");
  } else {
    parts.push("Low sodium impact.");
  }

  if (sugar === "high" && hasDiabetesRisk) {
    parts.push("With your diabetes noted on your profile, the sugar content here is worth watching closely.");
  } else if (sugar === "high") {
    parts.push("It's also relatively high in sugar.");
  }

  return {
    name: trimmed,
    sodium,
    sugar,
    verdict,
    message: parts.join(" "),
  };
}
