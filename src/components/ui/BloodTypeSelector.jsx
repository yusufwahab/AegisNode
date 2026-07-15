import clsx from "clsx";
import { bloodTypes } from "../../lib/mockData";

export default function BloodTypeSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
      {bloodTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={clsx(
            "flex min-h-[52px] items-center justify-center rounded-full border text-[15px] font-medium transition-colors duration-200",
            value === type
              ? "border-teal bg-teal text-paper"
              : "border-mist text-ink hover:border-teal hover:text-teal"
          )}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
