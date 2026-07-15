import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Wifi } from "lucide-react";
import UnsplashImage from "../components/ui/UnsplashImage";
import FinalCtaBand from "../components/FinalCtaBand";
import { Reveal } from "../components/ui/Reveal";
import { howItWorksSteps } from "../lib/mockData";

function SignalBars({ connected }) {
  return (
    <div className="flex items-end gap-1" aria-hidden="true">
      {[6, 10, 14, 18].map((h, i) => (
        <motion.span
          key={h}
          className="w-1.5 rounded-sm"
          style={{ height: h }}
          animate={{ backgroundColor: connected ? "#0E4F45" : "#E8E6E0" }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        />
      ))}
      <Wifi
        size={16}
        strokeWidth={1.5}
        className={clsx("ml-2 transition-colors duration-500", connected ? "text-teal" : "text-mist")}
      />
    </div>
  );
}

function StepBlock({ step, index, setActive }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(index);
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, setActive]);

  return (
    <div ref={ref} className="grid grid-cols-1 items-center gap-10 py-20 md:py-32 lg:grid-cols-2 lg:gap-16">
      <Reveal>
        <UnsplashImage query={step.query} className="aspect-[4/3] w-full rounded-lg" alt={step.title} />
      </Reveal>
      <Reveal delay={0.1}>
        <span className="text-sm font-medium text-teal">Step {index + 1}</span>
        <h2 className="mt-2 text-3xl text-ink md:text-4xl">{step.title}</h2>
        <p className="mt-4 max-w-md text-[17px] leading-relaxed text-slate">{step.copy}</p>
        {step.title === "Sync & Alert" && (
          <div className="mt-6">
            <SignalBars connected />
          </div>
        )}
      </Reveal>
    </div>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="content-container pt-16 md:pt-24">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wider text-teal">How It Works</p>
          <h1 className="mt-3 max-w-2xl text-4xl text-ink md:text-6xl">
            From tap to treatment, step by step.
          </h1>
        </Reveal>
      </div>

      <div className="content-container grid grid-cols-1 lg:grid-cols-[200px_1fr] lg:gap-16">
        <div className="hidden lg:block">
          <div className="sticky top-32 flex flex-col gap-6">
            {howItWorksSteps.map((step, i) => (
              <div key={step.title} className="flex items-center gap-3">
                <span
                  className={clsx(
                    "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-colors duration-300",
                    i === active
                      ? "border-teal bg-teal text-paper"
                      : "border-mist text-slate"
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={clsx(
                    "text-sm font-medium transition-colors duration-300",
                    i === active ? "text-ink" : "text-slate"
                  )}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          {howItWorksSteps.map((step, i) => (
            <StepBlock key={step.title} step={step} index={i} setActive={setActive} />
          ))}
        </div>
      </div>

      <FinalCtaBand />
    </div>
  );
}
