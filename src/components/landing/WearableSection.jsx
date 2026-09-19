import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import Card from "../ui/Card";

const PRODUCTS = [
  {
    name: "Helix Tag",
    badge: "Available — Prototype",
    badgeColor: "bg-teal/10 text-teal",
    features: [
      "Passive NFC — nothing to charge, nothing to unlock",
      "Stores your critical medical profile directly on the tag",
      "Works with any NFC-enabled phone, no app required",
      "Revoke a lost tag instantly from your dashboard",
    ],
  },
  {
    name: "Helix Band",
    badge: "Roadmap",
    badgeColor: "bg-slate/10 text-slate",
    features: [
      "Continuous heart rate and HRV monitoring",
      "Fall detection with automatic emergency escalation",
      "Flags sharp shifts — prompts you to take a real cuff reading",
      "Rechargeable sensor wristband",
    ],
  },
];

export default function WearableSection() {
  return (
    <section className="bg-mist/40 py-16 md:py-32">
      <div className="content-container">
        <Reveal>
          <h2 className="text-3xl text-ink md:text-4xl">
            Helix doesn't guess your blood pressure.
          </h2>
          <p className="mt-3 text-xl text-teal">It tells you when to check it.</p>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-slate">
            The Band tracks heart rate and HRV, detects falls, and flags sharp
            shifts — so you take a real cuff reading at the right moment, not
            every hour.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2" stagger={0.12}>
          {PRODUCTS.map((p) => (
            <RevealItem key={p.name}>
              <Card className="h-full" padded={false}>
                <div className="p-7">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl text-ink">{p.name}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2 text-[15px] leading-relaxed text-slate">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
