import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Tex from "./tex";
import { cn, formatPi } from "../lib/utils";
import { fromAngles, toAnglesFromZeroOne } from "../lib/coordinate-converter";
import type { State } from "../lib/types";

const VALUE = "#f9a8d4";
const B_VALUE = "#b3c1ff";
const X_COLOR = "#93c5fd";
const Y_COLOR = "#fca5a5";
const Z_COLOR = "#86efac";

const fixed = (n: number, digits = 3) =>
  (Math.abs(n) < 0.5 * 10 ** -digits ? 0 : n).toFixed(digits);

const color = (hex: string, tex: string) => `\\textcolor{${hex}}{${tex}}`;

export interface StateInfoProps {
  state: State;
}

export default function StateInfo({ state }: StateInfoProps) {
  const [open, setOpen] = useState(true);
  const { alpha, beta } = toAnglesFromZeroOne(state);
  const halfTheta = formatPi(alpha / 2);
  const phi = formatPi(beta);

  const p0 = Math.cos(alpha / 2) ** 2;
  const p1 = 1 - p0;

  const scene = fromAngles(alpha, beta);
  const x = scene.x;
  const y = -scene.z;
  const z = scene.y;

  const formula =
    `\\ket{\\psi} = \\cos\\left(${color(VALUE, halfTheta)}\\right)\\ket{0}` +
    ` + e^{i\\left(${color(B_VALUE, phi)}\\right)}\\sin\\left(${color(VALUE, halfTheta)}\\right)\\ket{1}`;

  return (
    <div className={cn("pointer-events-none absolute right-4 bottom-4 z-10 flex flex-col gap-4 rounded-lg bg-gray-500 p-5 text-white shadow-lg shadow-blue-500/20", open ? "min-w-[450px]" : "")}>
      <button
        type="button"
        aria-expanded={open}
        className="pointer-events-auto flex items-center justify-between gap-4 text-left font-semibold"
        onClick={() => setOpen((o) => !o)}
      >
        Állapot
        <ChevronDown
          className={cn("size-4 transition-transform", !open && "rotate-180")}
        />
      </button>

      {open && (
        <>
          <Tex className="text-lg">{formula}</Tex>

          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Valószínűségek</h3>
            <div className="flex justify-between gap-6 text-sm">
              <Tex>{`P(\\ket{0}) = ${(p0 * 100).toFixed(1)}\\%`}</Tex>
              <Tex>{`P(\\ket{1}) = ${(p1 * 100).toFixed(1)}\\%`}</Tex>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-blue-500">
              <div className="bg-pink-500" style={{ width: `${p0 * 100}%` }} />
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Koordináták</h3>
            <div className="flex gap-2 text-sm">
              {(
                [
                  ["x", x, X_COLOR],
                  ["y", y, Y_COLOR],
                  ["z", z, Z_COLOR],
                ] as const
              ).map(([label, value, hex]) => (
                <span
                  key={label}
                  className="flex-1 rounded bg-gray-900 px-3 py-1.5 text-center"
                >
                  <Tex>{`${color(hex, label)} = ${fixed(value)}`}</Tex>
                </span>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
