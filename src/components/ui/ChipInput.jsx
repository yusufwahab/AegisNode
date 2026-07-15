import { useState } from "react";
import { X } from "lucide-react";

export default function ChipInput({ label, values, onChange, placeholder = "Type and press Enter" }) {
  const [draft, setDraft] = useState("");

  function commit() {
    const value = draft.trim();
    if (value && !values.includes(value)) {
      onChange([...values, value]);
    }
    setDraft("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && values.length) {
      onChange(values.slice(0, -1));
    }
  }

  function removeAt(i) {
    onChange(values.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      {label && <label className="mb-2 block text-sm font-medium text-ink">{label}</label>}
      <div className="flex min-h-[52px] flex-wrap items-center gap-2 rounded-sm border border-mist bg-paper px-3 py-2 focus-within:border-teal focus-within:shadow-[0_0_0_3px_rgba(14,79,69,0.12)] transition-shadow duration-200">
        {values.map((value, i) => (
          <span
            key={value}
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-light px-3 py-1 text-sm text-teal"
          >
            {value}
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label={`Remove ${value}`}
              className="rounded-full hover:bg-teal/10"
            >
              <X size={13} strokeWidth={1.5} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder={values.length ? "" : placeholder}
          className="min-w-[120px] flex-1 border-none bg-transparent text-[15px] text-ink outline-none placeholder:text-slate/70"
        />
      </div>
    </div>
  );
}
