import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import UnsplashImage from "../ui/UnsplashImage";

const AUDIENCES = [
  {
    label: "Nigerian adults 30+",
    copy: "Managing or monitoring heart health, BP, or diabetes.",
    query: "nigerian adult man health wellness",
  },
  {
    label: "Families with elderly parents",
    copy: "Peace of mind when you can't always be there.",
    query: "elderly parent family care nigeria",
  },
  {
    label: "People between hospital visits",
    copy: "Can't afford frequent check-ups — Helix fills the gap.",
    query: "community health clinic africa",
  },
  {
    label: "Anyone undiagnosed",
    copy: "Never had your BP checked? That's exactly who this is for.",
    query: "blood pressure check screening",
  },
];

export default function WhoItsFor() {
  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="content-container">
        <Reveal>
          <h2 className="text-3xl text-ink md:text-4xl">Built for Nigeria.</h2>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-slate">
            1% of Nigerian adults is about 1.5 million people monitoring their
            heart health for the first time.
          </p>
        </Reveal>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {AUDIENCES.map(({ label, copy, query }) => (
            <RevealItem key={label}>
              <div className="overflow-hidden rounded-lg border border-mist">
                <UnsplashImage
                  query={query}
                  className="h-40 w-full"
                  alt={label}
                />
                <div className="bg-mist/30 p-4">
                  <h3 className="text-base font-medium text-ink">{label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate">{copy}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
