import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import Card from "../ui/Card";
import UnsplashImage from "../ui/UnsplashImage";

const FEATURES = [
  {
    title: "Daily check-in",
    copy: "Log BP, heart rate, sleep, stress and activity against your own baseline — not a population average.",
    query: "person checking blood pressure home",
  },
  {
    title: "Lifestyle insights",
    copy: "Plain-English patterns. \"Your BP is elevated every Monday morning.\" Helix notices so you don't have to.",
    query: "health data analytics dashboard",
  },
  {
    title: "Food intelligence",
    copy: "Sodium and sugar impact of a meal for your profile — including jollof, suya and egusi.",
    query: "nigerian food meal healthy",
  },
  {
    title: "Blood trend intelligence",
    copy: "Rising, stable or improving — with an early warning flag before a drift becomes a crisis.",
    query: "medical chart heart rate trend",
  },
];

export default function PreventionFeatures() {
  return (
    <section className="bg-paper py-16 md:py-32">
      <div className="content-container">
        <Reveal>
          <h2 className="text-3xl text-ink md:text-4xl">Your daily health companion.</h2>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-slate">
            Most heart events don't come out of nowhere. Helix watches the slow
            drift — so you can act before it becomes an emergency.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {FEATURES.map(({ title, copy, query }) => (
            <RevealItem key={title}>
              <Card className="h-full" padded={false}>
                <UnsplashImage
                  query={query}
                  className="h-44 w-full rounded-t-card"
                  alt={title}
                />
                <div className="p-5">
                  <h3 className="text-lg text-ink">{title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-slate">{copy}</p>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-8">
          <p className="text-sm text-slate/60 italic">
            Guidance, not a diagnosis. Always consult a doctor for medical decisions.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
