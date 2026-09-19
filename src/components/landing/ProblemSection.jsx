import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import UnsplashImage from "../ui/UnsplashImage";

const STATS = [
  { value: "240,000", label: "Nigerians lost to stroke & heart disease every year*" },
  { value: "657", label: "deaths a day — most with no prior diagnosis" },
  { value: "~80%", label: "of cardiac arrests happen outside a hospital" },
];

const MOMENTS = [
  {
    label: "Prevention",
    headline: "Notices the drift before it becomes a crisis.",
    copy: "Daily check-ins, AI lifestyle insights, and blood trend tracking so you know what's changing — weeks before it matters.",
    query: "person healthy lifestyle wellness monitoring",
  },
  {
    label: "Emergency",
    headline: "Ready before you arrive.",
    copy: "One tap puts your blood type, allergies, conditions, and emergency contacts in a responder's hands — even with weak signal.",
    query: "paramedic first responder emergency",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-ink-deep py-16 md:py-32">
      <div className="content-container">
        {/* Stat strip */}
        <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3" stagger={0.1}>
          {STATS.map((s) => (
            <RevealItem key={s.label} className="rounded-lg border border-teal/20 bg-teal/5 p-6">
              <p className="font-display text-4xl text-teal">{s.value}</p>
              <p className="mt-2 text-sm leading-relaxed text-mist/70">{s.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-3 text-right text-xs text-mist/30">
          *WHO Global Health Estimates / Nigeria NCD Alliance
        </p>

        {/* Two-card layout */}
        <Reveal className="mt-16 text-center">
          <h2 className="text-3xl text-paper md:text-4xl">One profile. Two moments it matters.</h2>
        </Reveal>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2" stagger={0.12}>
          {MOMENTS.map((m) => (
            <RevealItem key={m.label}>
              <div className="overflow-hidden rounded-lg border border-teal/20 h-full">
                <UnsplashImage
                  query={m.query}
                  className="h-52 w-full"
                  alt={m.headline}
                />
                <div className="bg-teal/5 p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-teal">{m.label}</p>
                  <h3 className="mt-2 text-xl text-paper">{m.headline}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-mist/70">{m.copy}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10 text-center">
          <p className="text-lg italic text-mist/60">
            "The AI that warns you on Monday is the same AI whose data saves you on Saturday."
          </p>
        </Reveal>
      </div>
    </section>
  );
}
