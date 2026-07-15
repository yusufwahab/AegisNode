import { forwardRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const VARIANTS = {
  primary: "bg-teal text-paper hover:bg-[#0b3f37] border border-transparent",
  coral: "bg-coral text-paper hover:bg-[#c94a24] border border-transparent",
  secondary: "bg-transparent text-ink border border-ink/20 hover:border-teal hover:text-teal",
  ghost: "bg-transparent text-paper border border-paper/50 hover:bg-paper/10",
  "ghost-ink": "bg-transparent text-ink border border-mist hover:border-teal hover:text-teal",
  text: "bg-transparent text-teal border border-transparent underline-offset-4 hover:underline px-0",
};

const SIZES = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
};

const Button = forwardRef(
  ({ variant = "primary", size = "md", className, children, as: Component = "button", ...props }, ref) => {
    const MotionComponent = motion.create ? motion.create(Component) : motion(Component);
    return (
      <MotionComponent
        ref={ref}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-[8px] font-medium tracking-tight transition-colors duration-200 cursor-pointer select-none",
          "min-h-[44px]",
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

Button.displayName = "Button";
export default Button;
