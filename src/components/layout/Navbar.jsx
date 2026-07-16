import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import NfcMark from "../ui/NfcMark";
import Button from "../ui/Button";

const LINKS = [
  { to: "/how-it-works", label: "How It Works" },
  { to: "/hospitals", label: "For Hospitals" },
  { to: "/order", label: "Pricing" },
  { to: "/about", label: "About" },
];

// On /scan-demo the mobile menu shows Tunde's dashboard sections instead of
// marketing links — the page after a real tag scan is meant to feel like
// you've landed inside the (hardcoded, no-auth-for-now) patient account, not
// on a marketing page. Desktop nav is unaffected.
const DASHBOARD_MOBILE_LINKS = [
  { to: "/dashboard", label: "Overview" },
  { to: "/dashboard/tag", label: "My Tag" },
  { to: "/onboarding", label: "Medical Profile" },
  { to: "/dashboard/vitals", label: "Vitals" },
  { to: "/dashboard/settings", label: "Settings" },
];

export default function Navbar({ transparentOnTop = true }) {
  const [scrolled, setScrolled] = useState(!transparentOnTop);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isScanDemo = location.pathname === "/scan-demo";
  const mobileLinks = isScanDemo ? DASHBOARD_MOBILE_LINKS : [...LINKS, { to: "/dashboard", label: "Dashboard" }];

  useEffect(() => {
    if (!transparentOnTop) return;
    function onScroll() {
      setScrolled(window.scrollY > window.innerHeight * 0.75);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  const solid = scrolled || !transparentOnTop;

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        solid ? "bg-paper border-b border-mist" : "bg-transparent border-b border-transparent"
      )}
    >
      <nav className="content-container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <NfcMark className="h-6 w-6" color={solid ? "#0E4F45" : "#FAF9F6"} />
          <span
            className={clsx(
              "font-display text-lg transition-colors duration-300",
              solid ? "text-ink" : "text-paper"
            )}
          >
            Aegis Node
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    "text-sm font-medium transition-colors duration-300",
                    solid
                      ? isActive
                        ? "text-teal"
                        : "text-ink/80 hover:text-teal"
                      : isActive
                        ? "text-paper"
                        : "text-paper/80 hover:text-paper"
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/dashboard"
            className={clsx(
              "text-sm font-medium transition-colors duration-300",
              solid ? "text-ink/80 hover:text-teal" : "text-paper/80 hover:text-paper"
            )}
          >
            Dashboard
          </Link>
          <Button as={Link} to="/order" variant="primary" size="sm">
            Get Your Tag
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className={clsx(
            "flex h-11 w-11 items-center justify-center md:hidden",
            solid ? "text-ink" : "text-paper"
          )}
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col bg-paper md:hidden"
          >
            <div className="content-container flex h-20 items-center justify-between">
              <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                <NfcMark className="h-6 w-6" color="#0E4F45" />
                <span className="font-display text-lg text-ink">Aegis Node</span>
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center text-ink"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <motion.ul
              className="content-container flex flex-1 flex-col justify-center gap-2"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            >
              {mobileLinks.map((link) => (
                <motion.li
                  key={link.to}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 font-display text-4xl text-ink"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="pt-4"
              >
                <Button as={Link} to="/order" onClick={() => setMenuOpen(false)} variant="primary" className="w-full">
                  Get Your Tag
                </Button>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
