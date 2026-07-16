import { useEffect, useState } from "react";
import { Volume2, VolumeX, MessageCircleWarning } from "lucide-react";

function buildRecommendation(profile) {
  const sentences = [];
  sentences.push(
    `This is a safety recommendation for ${profile.name || "this patient"}, generated from their Aegis Node tag.`
  );
  sentences.push("Do not give them food, water, or any medication.");
  sentences.push("Try not to move them unless they are in immediate danger.");

  if (profile.allergies?.length) {
    sentences.push(
      `They have a documented allergy to ${profile.allergies.join(" and ")}, so avoid exposing them to this.`
    );
  }
  if (profile.conditions?.length) {
    sentences.push(`They are also managing ${profile.conditions.join(" and ")}. Keep them calm and still.`);
  }

  sentences.push("Call your local emergency number now and ask for an ambulance.");

  if (profile.emergencyContact?.phone) {
    const who = profile.emergencyContact.relationship
      ? `their ${profile.emergencyContact.relationship}`
      : "their emergency contact";
    sentences.push(`Once help is on the way, you can also notify ${who} at ${profile.emergencyContact.phone}.`);
  }

  return sentences.join(" ");
}

function speak(text, { onStart, onEnd } = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
}

/**
 * Rule-based bystander guidance, not a real LLM call — generated from the
 * patient's own structured tag data (allergies/conditions/contact), then
 * read aloud with the browser's built-in speech synthesis. Standing in for
 * a real voice model (e.g. YarnGPT) without needing an API key or network
 * call, which matters for something that has to work reliably mid-pitch.
 */
export default function BystanderGuidance({ profile }) {
  const [message] = useState(() => buildRecommendation(profile));
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window
  );

  useEffect(() => {
    speak(message, { onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false) });
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [message]);

  function handleToggle() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      speak(message, { onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false) });
    }
  }

  return (
    <div className="mt-4 rounded-card border border-teal/30 bg-teal-light/40 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageCircleWarning size={18} strokeWidth={1.5} className="text-teal" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate">Bystander Guidance</span>
        </div>
        {supported && (
          <button
            type="button"
            onClick={handleToggle}
            className="flex min-h-9 items-center gap-1.5 rounded-full border border-teal/40 bg-paper px-3 text-xs font-medium text-teal hover:bg-teal-light"
          >
            {speaking ? <VolumeX size={14} strokeWidth={1.5} /> : <Volume2 size={14} strokeWidth={1.5} />}
            {speaking ? "Stop" : "Play"}
          </button>
        )}
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-ink">{message}</p>

      <p className="mt-3 text-[11px] text-slate/70">
        Simulated preview, not a substitute for professional medical advice — read aloud using your browser's
        built-in voice.
      </p>
    </div>
  );
}
