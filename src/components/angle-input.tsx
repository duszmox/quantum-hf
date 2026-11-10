import { useState } from "react";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";

const format = (degrees: number) => String(Number(degrees.toFixed(2)));

export interface AngleInputProps {
  id?: string;
  value: number;
  onChange: (degrees: number) => void;
  className?: string;
  disabled?: boolean;
}

export default function AngleInput({ id, value, onChange, className, disabled }: AngleInputProps) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <div className={cn("relative", className)}>
      <Input
        id={id}
        disabled={disabled}
        type="number"
        step="any"
        inputMode="decimal"
        className="border-gray-700 bg-gray-900 pr-7 text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={draft ?? format(value)}
        onFocus={() => setDraft(format(value))}
        onBlur={() => setDraft(null)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        onChange={(e) => {
          setDraft(e.target.value);
          const n = e.target.valueAsNumber;
          if (Number.isFinite(n)) onChange(n);
        }}
      />
      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-white/70">
        °
      </span>
    </div>
  );
}
