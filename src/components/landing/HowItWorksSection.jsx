import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Smartphone, Database, RadioTower } from "lucide-react";
import Card from "../ui/Card";
import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import UnsplashImage from "../ui/UnsplashImage";
import { viewportOnce } from "../../lib/motion";
import { howItWorksSteps } from "../../lib/mockData";

const ICONS = [Smartphone, Database, RadioTower];

export default function HowItWorksSection() {
  return (
    <section className="bg-mist/60 py-16 md:py-32">
      <div className="content-container">
        <Reveal>
          <h2 className="text-center text-3xl text-ink md:text-4xl">
            From tap to treatment, in three steps.
          </h2>
        </Reveal>

        <div className="relative mt-16">
          <svg
            className="pointer-events-none absolute left-0 right-0 top-6 hidden w-full lg:block"
            height="2"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="16.5%"
              x2="83.5%"
              y1="1"
              y2="1"
              stroke="#0E4F45"
              strokeWidth="2"
              strokeDasharray="8 8"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          <RevealGroup className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8" stagger={0.12}>
            {howItWorksSteps.map((step, i) => {
              const Icon = ICONS[i];
              return (
                <RevealItem key={step.title}>
                  <Card
                    className="group h-full transition-all duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-md"
                    padded={false}
                  >
                    <div className="p-6 md:p-7">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-light text-teal">
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <h3 className="mt-5 text-xl text-ink">{step.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-slate">{step.copy}</p>
                    </div>
                    <UnsplashImage
                      query={step.query}
                      className="h-40 w-full rounded-b-card"
                      alt={step.title}
                    />
                  </Card>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>

        <Reveal className="mt-12 text-center">
          <Link to="/how-it-works" className="text-sm font-medium text-teal underline-offset-4 hover:underline">
            See the full walkthrough →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
