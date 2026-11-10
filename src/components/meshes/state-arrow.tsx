import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import Arrow from "./axis-arrow";
import {
  blochToScene,
  fromAngles,
  toAnglesFromZeroOne,
} from "@/lib/coordinate-converter";
import type { BlochAxis } from "@/lib/gates";
import type { State } from "@/lib/types";
import { Line } from "@react-three/drei";

const DURATION = 0.6;
const TRAIL_SEGMENTS = 64;

export interface Transition {
  to: State;
  axis: BlochAxis;
  angle: number;
  undo: boolean;
}

// SOURCE: https://easings.net/#easeInOutCubic
const ease = (x: number) =>
 x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

function blochVector(state: State): THREE.Vector3 {
  const { alpha, beta } = toAnglesFromZeroOne(state);
  return fromAngles(alpha, beta);
}

export interface StateArrowProps {
  state: State;
  transition: Transition | null;
  trail: THREE.Vector3[] | null
  onDone: (trail: THREE.Vector3[] | null) => void;
  color?: string;
  thickness?: number;
  showTrail?: boolean;
}

export default function StateArrow({
  state,
  transition,
  trail,
  onDone,
  color,
  thickness = 0.02,
  showTrail = true,
}: StateArrowProps) {
  const [anim, setAnim] = useState<{ target: Transition; t: number } | null>(
    null,
  );
  const elapsed = useRef(0);
  const target = useRef<Transition | null>(null);

  useFrame((_, delta) => {
    if (!transition) return;
    if (target.current !== transition) {
      target.current = transition;
      elapsed.current = 0;
    }
    elapsed.current = Math.min(elapsed.current + delta, DURATION);
    const t = elapsed.current / DURATION;
    setAnim({ target: transition, t });
    if (t >= 1) {
    if (!transition.undo) {
      const segments = Math.max(1, Math.ceil(TRAIL_SEGMENTS * t));
      const endedTrail = Array.from({ length: segments + 1 }, (_, i) =>
        rotate((t * i) / segments),
      );
      onDone(endedTrail);
    } else {
      onDone(null);
    }}
    
  });

  const start = blochVector(state);
  if (!transition) {
    return (
      <>
        <Arrow color={color} thickness={thickness} end={start} />
        {trail && <Line points={trail} color="cyan" lineWidth={3} />}
      </>
    );
  }

  const t = ease(anim?.target === transition ? anim.t : 0);
  const axis = blochToScene(...transition.axis).normalize();
  const rotate = (t: number) =>
    start
      .clone()
      .applyQuaternion(
        new THREE.Quaternion().setFromAxisAngle(axis, transition.angle * t),
      );

  const segments = Math.max(1, Math.ceil(TRAIL_SEGMENTS * t));
  const currentTrail = Array.from({ length: segments + 1 }, (_, i) =>
    rotate((t * i) / segments),
  );

  return (
    <>
      <Arrow color={color} thickness={thickness} end={rotate(t)} />
      {showTrail && t > 0 && !transition.undo && <Line points={currentTrail} color="cyan" lineWidth={3} />}
    </>
  );
}
