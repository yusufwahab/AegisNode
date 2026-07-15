import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import NfcMark from "../components/ui/NfcMark";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-deep px-6 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 40%, rgba(14,79,69,0.25) 0%, rgba(11,15,16,0) 70%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <NfcMark className="mx-auto h-8 w-8" color="#FAF9F6" />
        <p className="mt-6 text-sm font-medium uppercase tracking-wider text-slate">404</p>
        <h1 className="mt-3 text-3xl text-paper md:text-5xl">This page didn't sync.</h1>
        <p className="mt-4 text-[15px] text-mist/70">
          It may have moved, or the connection dropped before it reached you.
        </p>
        <Button as={Link} to="/" variant="coral" size="lg" className="mt-9">
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
}
