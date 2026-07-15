import { motion } from "framer-motion";

export default function SuccessCheck() {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-light"
    >
      <motion.svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        initial="hidden"
        animate="show"
      >
        <motion.circle
          cx="18"
          cy="18"
          r="16"
          stroke="#0E4F45"
          strokeWidth="1.5"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            show: { pathLength: 1, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
          }}
        />
        <motion.path
          d="M10 18.5L15.5 24L26 12"
          stroke="#0E4F45"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0 },
            show: {
              pathLength: 1,
              transition: { duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        />
      </motion.svg>
    </motion.div>
  );
}
