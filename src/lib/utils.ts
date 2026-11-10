import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PI_EPSILON = 1e-9;

export function formatPi(angle: number): string {
  const ratio = angle / Math.PI;
  const absR = Math.abs(ratio);
  if (absR < PI_EPSILON) return "0";
  const sign = ratio < 0 ? "-" : "";
  for (let denominator = 1; denominator <= 8; denominator++) {
    const num = Math.round(absR * denominator);
    if (Math.abs(absR - num / denominator) < 1e-6) {
      const pi = num === 1 ? "\\pi" : `${num}\\pi`;
      return denominator === 1 ? `${sign}${pi}` : `${sign}\\frac{${pi}}{${denominator}}`;
    }
  }
  return `${sign}${absR.toFixed(3)}\\pi`;
}
