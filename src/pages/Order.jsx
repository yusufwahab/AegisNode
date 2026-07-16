import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Minus, Plus, Check } from "lucide-react";
import Button from "../components/ui/Button";
import Accordion from "../components/ui/Accordion";
import { Reveal } from "../components/ui/Reveal";
import { useToast } from "../lib/toastContext";
import { faqItems } from "../lib/mockData";

const FEATURES = [
  "Custom-engraved tag",
  "Lifetime data updates",
  "Works with any NFC phone",
  "Offline, always",
];

function ProductTile() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-7, 7]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div style={{ perspective: 1000 }} className="mx-auto w-full max-w-sm">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="flex aspect-square items-center justify-center rounded-lg bg-linear-to-br from-ink-deep to-teal shadow-xl"
      >
        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-paper/20 bg-paper/5">
          <div className="h-14 w-14 rounded-full border border-paper/30" />
        </div>
      </motion.div>
      <p className="mt-3 text-center text-xs text-slate">
        Product mockup shown — swap for real photography.
      </p>
    </div>
  );
}

export default function Order() {
  const [qty, setQty] = useState(1);
  const pushToast = useToast();

  return (
    <div className="content-container py-16 md:py-24">
      <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <ProductTile />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-sm font-medium uppercase tracking-wider text-teal">Aegis Node Tag</p>
          <h1 className="mt-2 text-4xl text-ink md:text-5xl">₦350</h1>

          <ul className="mt-8 space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-[15px] text-ink">
                <Check size={16} strokeWidth={1.5} className="text-teal" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-4">
            <span className="text-sm font-medium text-ink">Quantity</span>
            <div className="flex items-center rounded-sm border border-mist">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-11 w-11 items-center justify-center text-slate hover:text-teal"
              >
                <Minus size={16} strokeWidth={1.5} />
              </button>
              <span className="w-8 text-center text-[15px] text-ink">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex h-11 w-11 items-center justify-center text-slate hover:text-teal"
              >
                <Plus size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <Button
            variant="coral"
            size="lg"
            className="mt-8 w-full sm:w-auto"
            onClick={() => pushToast?.(`Added ${qty} tag${qty > 1 ? "s" : ""} to cart`)}
          >
            Add to Cart
          </Button>
        </Reveal>
      </div>

      <Reveal className="mx-auto mt-24 max-w-2xl md:mt-32">
        <h2 className="text-2xl text-ink">Frequently asked</h2>
        <div className="mt-4">
          <Accordion items={faqItems} />
        </div>
      </Reveal>
    </div>
  );
}
