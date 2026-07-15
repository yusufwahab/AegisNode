import { RevealGroup, RevealItem } from "../ui/Reveal";
import { trustStats } from "../../lib/mockData";

export default function TrustStrip() {
  return (
    <section className="bg-paper py-14 md:py-20">
      <RevealGroup className="content-container grid grid-cols-2 gap-8 md:grid-cols-4" stagger={0.1}>
        {trustStats.map((stat) => (
          <RevealItem key={stat.label} className="text-center md:text-left">
            <p className="font-display text-4xl text-teal md:text-5xl">{stat.value}</p>
            <p className="mt-2 text-sm text-slate">{stat.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
