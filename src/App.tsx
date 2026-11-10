import "./index.css";
import MeshCanvas from "./components/canvas";
import BlochSphere from "./components/meshes/bloch-sphere";
import ArrowLine from "./components/meshes/axis-arrow";
import ControlPanel from "./components/control-panel";
import StateInfo from "./components/state-info";
import { useState } from "react";
import * as THREE from "three";
import type { Arrow, State } from "./lib/types";
import { KETZero } from "./lib/states";
import { apply, type Gate } from "./lib/gates";
import StateArrow, { type Transition } from "./components/meshes/state-arrow";

interface ArrowEntry extends Arrow {
  history: Gate[];
  transition: Transition | null;
}

const PALETTE = [
  "#FFFF00",
  "#FF00FF",
  "#FF8800",
  "#FFFFFF",
  "#A855F7",
  "#F472B6",
  "#FACC15",
  "#94A3B8",
];

const createArrow = (color: string): ArrowEntry => ({
  state: KETZero,
  color,
  history: [],
  transition: null,
});

export function App() {
  const [arrows, setArrows] = useState<ArrowEntry[]>([createArrow(PALETTE[0]!)]);
  const [selected, setSelected] = useState(0);
  const [showAll, setShowAll] = useState(true);
  const [trail, setTrail] = useState<THREE.Vector3[] | null>(null);

  const current = arrows[selected]!;

  const updateArrow = (
    index: number,
    update: (entry: ArrowEntry) => ArrowEntry,
  ) => {
    setArrows((prev) => prev.map((e, i) => (i === index ? update(e) : e)));
  };

  const select = (index: number) => {
    if (index === selected) return;
    setSelected(index);
    setTrail(null);
  };

  const deleteArrow = (index: number) => {
    if (arrows.length === 1) return;
    setArrows((prev) => prev.filter((_, i) => i !== index));
    if (index < selected) {
      setSelected(selected - 1);
    } else if (index === selected) {
      setSelected(Math.max(0, index - 1));
      setTrail(null);
    }
  };

  const addArrow = () => {
    setArrows((prev) =>
      prev.concat(createArrow(PALETTE[prev.length % PALETTE.length]!)),
    );
    select(arrows.length);
  };

  const resetTo = (state: State) => {
    updateArrow(selected, (e) => ({
      ...e,
      state,
      transition: null,
      history: [],
    }));
    setTrail(null);
  };

  const animateGate = (gate: Gate, undo = false) => {
    updateArrow(selected, (e) => {
      const from = e.transition?.to ?? e.state;
      return {
        ...e,
        state: from,
        transition: {
          to: apply(undo ? gate.inverse : gate.matrix, from),
          axis: gate.axis,
          angle: undo ? -gate.angle : gate.angle,
          undo,
        },
        history: undo ? e.history.slice(0, -1) : e.history.concat(gate),
      };
    });
  };

  const visible = showAll
    ? arrows.map((entry, index) => ({ entry, index }))
    : [{ entry: current, index: selected }];

  return (
    <div className="flex w-screen h-screen">
      <ControlPanel
        arrows={arrows}
        selected={selected}
        showAll={showAll}
        history={current.history}
        onSelect={select}
        onDelete={deleteArrow}
        onAddArrow={addArrow}
        onShowAllChange={setShowAll}
        onSetState={resetTo}
        onSetColor={(color) => updateArrow(selected, (e) => ({ ...e, color }))}
        onApplyGate={(gate) => animateGate(gate)}
        onUndo={() => {
          const last = current.history[current.history.length - 1];
          if (last) animateGate(last, true);
        }}
      />

      <main className="relative min-w-0 flex-1">
        <MeshCanvas className="w-full h-full">
          <BlochSphere />
          <ArrowLine color="red" end={new THREE.Vector3(0, 0, -1.25)} label="Y" />
          <ArrowLine color="red" end={new THREE.Vector3(0, 0, 1.25)} label="-Y" />

          <ArrowLine color="blue" end={new THREE.Vector3(1.25, 0, 0)} label="X" />
          <ArrowLine color="blue" end={new THREE.Vector3(-1.25, 0, 0)} label="-X" />

          <ArrowLine color="green" end={new THREE.Vector3(0, 1.25, 0)} label="Z" />
          <ArrowLine color="green" end={new THREE.Vector3(0, -1.25, 0)} label="-Z" />
          {visible.map(({ entry, index }) => (
            <StateArrow
              key={index}
              state={entry.state}
              transition={entry.transition}
              trail={index === selected ? trail : null}
              showTrail={index === selected}
              color={entry.color}
              onDone={(endedTrail) => {
                const done = entry.transition;
                if (!done) return;
                updateArrow(index, (e) =>
                  e.transition === done
                    ? { ...e, state: done.to, transition: null }
                    : e,
                );
                if (index === selected) setTrail(endedTrail);
              }}
            />
          ))}
        </MeshCanvas>
        <StateInfo state={current.transition?.to ?? current.state} />
      </main>
    </div>
  );
}

export default App;
