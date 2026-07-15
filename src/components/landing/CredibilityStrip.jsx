import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import { credibilityLogos } from "../../lib/mockData";

export default function CredibilityStrip() {
  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="content-container">
        <Reveal>
          <p className="text-center text-sm font-medium uppercase tracking-wider text-slate">
            Built with input from
          </p>
        </Reveal>
        <RevealGroup
          className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6"
          stagger={0.06}
        >
          {credibilityLogos.map((name) => (
            <RevealItem key={name}>
              <div className="flex h-10 items-center rounded-sm bg-mist px-5 text-sm font-medium text-slate/70">
                {name}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
