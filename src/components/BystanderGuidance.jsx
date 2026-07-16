import { useRef, useState } from "react";
import { Volume2, VolumeX, MessageCircleWarning, AlertTriangle } from "lucide-react";

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

// Voice lists load asynchronously and can be empty on the very first call —
// waiting for the list (or the voiceschanged event) avoids a silent no-op.
function getVoicesReady() {
  return new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener("voiceschanged", finish);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", finish);
    setTimeout(finish, 1000);
  });
}

async function speakOnce(text, { onEnd, onNoVoice }) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const voices = await getVoicesReady();
  if (voices.length === 0) {
    onNoVoice?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.voice = voices.find((v) => v.lang?.toLowerCase().startsWith("en")) || voices[0];
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
}

const REPEAT_GAP_MS = 1500;
const RESUME_KEEPALIVE_MS = 5000;

/**
 * Rule-based bystander guidance, not a real LLM call — generated from the
 * patient's own structured tag data, read aloud on a loop with the
 * browser's built-in speech synthesis once the user presses Play. Manual
 * start/stop only — no autoplay, since many mobile browsers silently block
 * audio that isn't triggered by an explicit tap anyway.
 */
export default function BystanderGuidance({ profile }) {
  const [message] = useState(() => buildRecommendation(profile));
  const [active, setActive] = useState(false);
  const [noVoice, setNoVoice] = useState(false);
  const [supported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);
  const activeRef = useRef(false);
  const timeoutRef = useRef(null);
  const keepAliveRef = useRef(null);

  function loop() {
    speakOnce(message, {
      onEnd: () => {
        if (!activeRef.current) return;
        timeoutRef.current = setTimeout(() => {
          if (activeRef.current) loop();
        }, REPEAT_GAP_MS);
      },
      onNoVoice: () => setNoVoice(true),
    });
  }

  function handleToggle() {
    if (activeRef.current) {
      activeRef.current = false;
      clearTimeout(timeoutRef.current);
      clearInterval(keepAliveRef.current);
      window.speechSynthesis.cancel();
      setActive(false);
    } else {
      activeRef.current = true;
      setActive(true);
      setNoVoice(false);
      loop();
      keepAliveRef.current = setInterval(() => {
        if (activeRef.current && window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        }
      }, RESUME_KEEPALIVE_MS);
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
            {active ? <VolumeX size={14} strokeWidth={1.5} /> : <Volume2 size={14} strokeWidth={1.5} />}
            {active ? "Stop" : "Play"}
          </button>
        )}
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-ink">{message}</p>

      {noVoice && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-coral">
          <AlertTriangle size={14} strokeWidth={1.5} />
          No voice found on this device yet — text is shown above; try Play again in a moment.
        </p>
      )}
      {!supported && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-coral">
          <AlertTriangle size={14} strokeWidth={1.5} />
          Your browser doesn't support text-to-speech — showing the text instead.
        </p>
      )}

      <p className="mt-3 text-[11px] text-slate/70">
        Simulated preview, not a substitute for professional medical advice — press Play to hear it read aloud
        using your browser's built-in voice.
      </p>
    </div>
  );
}
