import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Mail, Globe, Rss } from "lucide-react";
import clsx from "clsx";
import NfcMark from "../ui/NfcMark";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How It Works", to: "/how-it-works" },
      { label: "For Hospitals", to: "/hospitals" },
      { label: "Pricing", to: "/order" },
      { label: "Try a Live Scan", to: "/scan-demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Mission", to: "/about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Hospital Console", to: "/hospital-dashboard" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/about" },
      { label: "Terms of Service", to: "/about" },
    ],
  },
];

function FooterColumn({ title, links }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-mist py-4 md:border-none md:py-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-semibold text-ink md:pointer-events-none md:mb-4"
      >
        {title}
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={clsx("text-slate transition-transform md:hidden", open && "rotate-180")}
        />
      </button>
      <ul className={clsx("mt-3 flex-col gap-2.5 md:mt-0 md:flex", open ? "flex" : "hidden")}>
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="text-sm text-slate hover:text-teal">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-mist bg-paper">
      <div className="content-container grid grid-cols-2 gap-x-8 py-16 md:grid-cols-4 md:gap-x-12">
        {COLUMNS.map((col) => (
          <FooterColumn key={col.title} {...col} />
        ))}
      </div>

      <div className="content-container flex flex-col gap-6 border-t border-mist py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <NfcMark className="h-5 w-5" color="#0E4F45" />
          <div>
            <p className="font-display text-base text-ink">Aegis Node</p>
            <p className="text-xs text-slate">
              Your medical history, ready before you arrive.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" aria-label="Email" className="text-slate hover:text-teal">
            <Mail size={18} strokeWidth={1.5} />
          </a>
          <a href="#" aria-label="Website" className="text-slate hover:text-teal">
            <Globe size={18} strokeWidth={1.5} />
          </a>
          <a href="#" aria-label="Blog" className="text-slate hover:text-teal">
            <Rss size={18} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <div className="content-container border-t border-mist py-4">
        <p className="text-xs text-slate">
          © {new Date().getFullYear()} Aegis Node. Photography via{" "}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-teal"
          >
            Unsplash
          </a>
          , attributed inline where used.
        </p>
      </div>
    </footer>
  );
}
