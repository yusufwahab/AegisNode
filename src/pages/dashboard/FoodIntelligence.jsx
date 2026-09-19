import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useHealthStore } from "../../store/useHealthStore";
import { mockProfile } from "../../lib/mockData";
import { COMMON_FOODS, analyzeFood } from "../../lib/healthData";
import { useToast } from "../../lib/toastContext";

const VERDICT_STYLES = {
  green: { dot: "bg-teal", label: "Good choice", text: "text-teal" },
  amber: { dot: "bg-amber", label: "Worth moderating", text: "text-amber" },
  red: { dot: "bg-coral", label: "Consider limiting", text: "text-coral" },
};

function ResultCard({ result, onLog, onTryAnother, readOnly }) {
  const style = VERDICT_STYLES[result.verdict];
  return (
    <Card className="mt-6">
      <div className="flex items-center gap-2">
        <span className={clsx("h-3 w-3 rounded-full", style.dot)} />
        <p className={clsx("text-sm font-medium", style.text)}>{style.label}</p>
      </div>
      <h3 className="mt-3 text-xl text-ink">{result.name}</h3>
      <div className="mt-3 flex gap-6 text-sm">
        <p>
          <span className="text-slate">Sodium: </span>
          <span className="capitalize text-ink">{result.sodium}</span>
        </p>
        <p>
          <span className="text-slate">Sugar: </span>
          <span className="capitalize text-ink">{result.sugar}</span>
        </p>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-slate">{result.message}</p>
      {!readOnly && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" onClick={onLog} className="flex-1">
            Log this meal
          </Button>
          <Button variant="ghost-ink" onClick={onTryAnother} className="flex-1">
            Try another
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function FoodIntelligence() {
  const logs = useHealthStore((s) => s.logs);
  const meals = useHealthStore((s) => s.meals);
  const addMeal = useHealthStore((s) => s.addMeal);
  const pushToast = useToast();

  const [query, setQuery] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [viewingMeal, setViewingMeal] = useState(null);

  const trimmedQuery = query.trim().toLowerCase();
  const exactMatch = COMMON_FOODS.some((f) => f.name.toLowerCase() === trimmedQuery);
  const suggestions =
    inputFocused && trimmedQuery.length > 0 && !exactMatch
      ? COMMON_FOODS.filter((f) => f.name.toLowerCase().includes(trimmedQuery)).slice(0, 5)
      : [];

  function handleAnalyze(name) {
    const value = (name ?? query).trim();
    if (!value) return;
    setQuery(value);
    setInputFocused(false);
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(analyzeFood(value, mockProfile, logs));
    }, 800);
  }

  function handleLog() {
    if (!result) return;
    addMeal({ ...result, loggedAt: new Date().toISOString() });
    pushToast?.("Meal logged.");
    setResult(null);
    setQuery("");
  }

  function handleTryAnother() {
    setResult(null);
    setQuery("");
  }

  return (
    <div className="max-w-xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl text-ink">Food Intelligence</h1>
        <p className="mt-1 text-[15px] text-slate">
          Get a plain-English read on how a meal interacts with your profile.
        </p>
      </motion.div>

      <div className="relative mt-8">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setResult(null);
          }}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setTimeout(() => setInputFocused(false), 150)}
          disabled={analyzing}
          placeholder="What are you about to eat?"
          className="min-h-[52px] w-full rounded-sm border border-mist bg-paper px-4 text-[15px] text-ink outline-none focus:border-teal focus:shadow-[0_0_0_3px_rgba(14,79,69,0.12)] disabled:opacity-60"
        />
        {suggestions.length > 0 && !result && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-sm border border-mist bg-paper shadow-lg">
            {suggestions.map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => handleAnalyze(f.name)}
                className="block w-full px-4 py-3 text-left text-[15px] text-ink hover:bg-mist/50"
              >
                {f.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <Button variant="primary" className="mt-4 w-full" onClick={() => handleAnalyze()} disabled={analyzing || !query.trim()}>
        {analyzing ? (
          <span className="flex items-center gap-2">
            <motion.span
              className="h-2 w-2 rounded-full bg-paper"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            Analyzing…
          </span>
        ) : (
          "Analyze"
        )}
      </Button>

      {result && <ResultCard result={result} onLog={handleLog} onTryAnother={handleTryAnother} />}

      {meals.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wider text-slate">Recent Meals</h2>
          <div className="mt-3 flex flex-col divide-y divide-mist rounded-card border border-mist">
            {meals.map((meal) => (
              <button
                key={meal.loggedAt}
                type="button"
                onClick={() => setViewingMeal(meal)}
                className="flex items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <span className="text-[15px] text-ink">{meal.name}</span>
                <span className={clsx("h-2.5 w-2.5 rounded-full", VERDICT_STYLES[meal.verdict].dot)} />
              </button>
            ))}
          </div>
        </div>
      )}

      {viewingMeal && (
        <div className="mt-4">
          <button type="button" onClick={() => setViewingMeal(null)} className="text-sm text-teal hover:underline">
            ← Close
          </button>
          <ResultCard result={viewingMeal} readOnly />
        </div>
      )}
    </div>
  );
}
