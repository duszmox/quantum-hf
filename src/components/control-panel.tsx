import { Plus, Undo2, X } from "lucide-react";
import { useState } from "react";
import AngleInput from "./angle-input";
import Tex from "./tex";
import { Button } from "./ui/button";
import {
  fromAnglesZeroOne,
  isSameState,
  toAnglesFromZeroOne,
} from "../lib/coordinate-converter";
import { R_GATES, PAULI_GATES, PHASE_GATES, type Gate } from "../lib/gates";
import { KETS } from "../lib/states";
import type { Arrow, State } from "../lib/types";
import { cn, formatPi } from "../lib/utils";

const DEG = Math.PI / 180;

interface Angles {
  alpha: number;
  beta: number;
}

export interface ControlPanelProps {
  arrows: Arrow[];
  selected: number;
  showAll: boolean;
  history: Gate[];
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
  onAddArrow: () => void;
  onShowAllChange: (showAll: boolean) => void;
  onSetState: (state: State) => void;
  onSetColor: (color: string) => void;
  onApplyGate: (gate: Gate) => void;
  onUndo: () => void;
}

export default function ControlPanel({
  arrows,
  selected,
  showAll,
  history,
  onSelect,
  onDelete,
  onAddArrow,
  onShowAllChange,
  onSetState,
  onSetColor,
  onApplyGate,
  onUndo,
}: ControlPanelProps) {
  const arrow = arrows[selected]!;
  const { alpha, beta } = toAnglesFromZeroOne(arrow.state);

  const [typed, setTyped] = useState<Angles>({ alpha: 0, beta: 0 });
  const angles: Angles = isSameState(
    fromAnglesZeroOne(typed.alpha * DEG, typed.beta * DEG),
    arrow.state,
  )
    ? typed
    : { alpha: alpha / DEG, beta: beta / DEG };
  const betaDisabled = Math.abs(angles.alpha) < 1e-6;

  const setAngle = (key: keyof Angles, degrees: number) => {
    const next = { ...angles, [key]: degrees };
    if (next.alpha === 0) next.beta = 0;
    setTyped(next);
    onSetState(fromAnglesZeroOne(next.alpha * DEG, next.beta * DEG));
  };

  const [gateAngle, setGateAngle] = useState(90);

  return (
    <aside className="z-10 flex w-80 shrink-0 flex-col gap-6 overflow-y-auto bg-gray-500 p-5 text-white shadow-lg shadow-blue-500/20">
      <h2 className="text-lg font-semibold">Bloch Gömb Szimulátor</h2>

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Állapotok</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {arrows.map((a, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={i === selected}
              aria-label={`Arrow ${i + 1}`}
              className={cn(
                "flex items-center gap-1 rounded group bg-gray-900 hover:bg-gray-800 py-1.5 text-sm",
                i === selected && "ring-2 ring-pink-500",
                arrows.length > 1
                  ? "pl-3 pr-3 hover:pr-1 transition-normal"
                  : "px-3",
              )}
              onClick={() => onSelect(i)}
            >
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: a.color }}
              />
              {i + 1}
              {arrows.length > 1 && (
                <span
                  className="hidden group-hover:block"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(i);
                  }}
                >
                  <X height={16} />
                </span>
              )}
            </button>
          ))}
          <Button
            type="button"
            size="icon-sm"
            aria-label="Új állapot"
            title="Új állapot"
            onClick={onAddArrow}
          >
            <Plus />
          </Button>
        </div>
      </section>
      <div className="flex flex-row gap-2">
        <label htmlFor="all">
          Összes mutatása
        </label>
        <input
          type="checkbox"
          name="all"
          className="accent-pink-500"
          id="all"
          checked={showAll}
          onChange={(e) => onShowAllChange(e.target.checked)}
        />
      </div>
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Szín</h3>

        <input
          type="color"
          id="color"
          name="color"
          value={arrow.color}
          onChange={(e) => onSetColor(e.target.value)}
        />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Kezdőállapot</h3>
        <label htmlFor="alpha" className="text-sm">
          <Tex>{`\\alpha = ${formatPi(alpha)}`}</Tex>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            className="min-w-0 flex-1 accent-pink-500"
            value={angles.alpha}
            min={0}
            max={180}
            step={1}
            onChange={(e) => setAngle("alpha", e.currentTarget.valueAsNumber)}
          />
          <AngleInput
            id="alpha"
            className="w-24"
            value={angles.alpha}
            onChange={(deg) => setAngle("alpha", deg)}
          />
        </div>

        <label htmlFor="beta" className="text-sm">
          <Tex>{`\\beta = ${formatPi(beta)}`}</Tex>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            aria-label="Béta csúszka"
            className="min-w-0 flex-1 accent-pink-500 disabled:accent-gray-500"
            disabled={betaDisabled}
            value={angles.beta}
            min={-180}
            max={180}
            step={1}
            onChange={(e) => setAngle("beta", e.currentTarget.valueAsNumber)}
          />
          <AngleInput
            id="beta"
            className="w-24"
            disabled={betaDisabled}
            value={angles.beta}
            onChange={(deg) => setAngle("beta", deg)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Alapállapotok</h3>
        <div className="grid grid-cols-4 gap-2">
          {KETS.map(([label, ket]) => (
            <Button
              key={label}
              type="button"
              className={
                isSameState(arrow.state, ket)
                  ? "bg-pink-500 hover:bg-pink-400"
                  : ""
              }
              onClick={() => onSetState(ket)}
            >
              <Tex>{label}</Tex>
            </Button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Kapuk</h3>
        <div className="grid grid-cols-4 gap-2">
          {[...PAULI_GATES, ...PHASE_GATES].map((gate) => (
            <Button
              key={gate.label}
              type="button"
              onClick={() => onApplyGate(gate)}
            >
              <Tex>{gate.label}</Tex>
            </Button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Forgatási és fáziskapuk</h3>
        <div className="flex items-center gap-3">
          <label htmlFor="gate-angle" className="text-sm">
            <Tex>{"\\theta ="}</Tex>
          </label>
          <AngleInput
            id="gate-angle"
            className="flex-1"
            value={gateAngle}
            onChange={setGateAngle}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {R_GATES.map(({ name, create }) => (
            <Button
              key={name}
              type="button"
              onClick={() => onApplyGate(create(gateAngle))}
            >
              <Tex>{name}</Tex>
            </Button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Kapu előzmény</h3>
        {history.length === 0 ? (
          <p className="text-sm text-white/70">Használj egy kaput először</p>
        ) : (
          <div className="flex flex-row flex-wrap gap-2">
            {history.map((h, i) => (
              <span className="px-3 py-2 rounded bg-gray-900" key={i}>
                <Tex>{h.label}</Tex>
              </span>
            ))}
          </div>
        )}
        {history.length > 0 && (
          <Button type="button" onClick={onUndo}>
            <Undo2 />
            Visszavonás
          </Button>
        )}
      </section>

      <a
        href="https://github.com/duszmox/quantum-hf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded px-2 text-sm underline underline-offset-4 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5 shrink-0"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.303-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.805 5.624-5.478 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
        Forráskód
      </a>
    </aside>
  );
}
