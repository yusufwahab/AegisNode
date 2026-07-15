import clsx from "clsx";

export default function Card({ className, children, padded = true, ...props }) {
  return (
    <div
      className={clsx(
        "rounded-card bg-paper border border-mist",
        padded && "p-6 md:p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
