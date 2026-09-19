import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import UnsplashImage from "../ui/UnsplashImage";

const TRUST_POINTS = [
  {
    title: "Only emergency fields are public",
    copy: "Responders see blood type, allergies, conditions and contacts. Nothing else.",
    query: "data privacy security lock",
  },
  {
    title: "You control your profile",
    copy: "Update or remove any field at any time from your dashboard.",
    query: "person using phone app settings",
  },
  {
    title: "Lost tag? Revoke instantly.",
    copy: "Deactivate a lost tag in one tap. It stops working immediately.",
    query: "nfc card deactivate security",
  },
  {
    title: "Not a diagnosis",
    copy: "Helix provides guidance and pattern awareness. Always consult a doctor for medical decisions.",
    query: "doctor patient consultation nigeria",
  },
];

const ROADMAP = [
  { phase: "Now — Prototype", items: ["Simulated sensor feed", "Real medical profile", "NFC tag demo", "Emergency contact alerts"] },
  { phase: "Next — Early real-world", items: ["Bluetooth BP monitor integration", "Real wristband (Helix Band)", "Live emergency alerts", "SMS contact notifications"] },
  { phase: "Later — Mature", items: ["Clinical partner integrations", "Hospital triage dashboard", "Pharmacy network", "NDPR compliance audit"] },
];

export default function TrustPrivacy() {
  return (
    <section className="bg-mist/40 py-16 md:py-32">
      <div className="content-container">
        <Reveal>
          <h2 className="text-3xl text-ink md:text-4xl">Trust and privacy.</h2>
        </Reveal>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {TRUST_POINTS.map(({ title, copy, query }) => (
            <RevealItem key={title}>
              <div className="overflow-hidden rounded-lg border border-mist bg-paper h-full">
                <UnsplashImage
                  query={query}
                  className="h-36 w-full"
                  alt={title}
                />
                <div className="p-5">
                  <h3 className="text-base font-medium text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate">{copy}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Roadmap */}
        <Reveal className="mt-16">
          <h2 className="text-2xl text-ink">Where we are.</h2>
          <p className="mt-2 text-[15px] text-slate">Judges tend to reward honesty. Here's ours.</p>
        </Reveal>

        <RevealGroup className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3" stagger={0.1}>
          {ROADMAP.map((r, i) => (
            <RevealItem key={r.phase}>
              <div className={`rounded-lg border p-5 h-full ${i === 0 ? "border-teal/40 bg-teal/5" : "border-mist bg-paper"}`}>
                <p className={`text-xs font-medium uppercase tracking-wider ${i === 0 ? "text-teal" : "text-slate"}`}>
                  {r.phase}
                </p>
                <ul className="mt-3 space-y-2">
                  {r.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-slate">
                      <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${i === 0 ? "bg-teal" : "bg-slate/40"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
