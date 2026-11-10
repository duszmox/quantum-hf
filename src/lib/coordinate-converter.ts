import * as THREE from "three";
import { abs, arg, complex, fromPolar } from "./complex";
import type { State } from "./types";

const EPSILON = 1e-9;

export function blochToScene(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, z, -y);
}

export function fromAngles(alpha: number, beta: number): THREE.Vector3 {
  const x = Math.sin(alpha) * Math.cos(beta);
  const y = Math.sin(alpha) * Math.sin(beta);
  const z = Math.cos(alpha);
  return blochToScene(x, y, z);
}

export function toAngles(vector: THREE.Vector3): {
  alpha: number;
  beta: number;
} {
  const alpha = Math.acos(vector.z / vector.length());
  const beta = Math.atan2(vector.y, vector.x);
  return { alpha, beta };
}

function wrapAngle(angle: number): number {
  const wrapped = angle - 2 * Math.PI * Math.floor((angle + Math.PI) / (2 * Math.PI));
  return wrapped === -Math.PI ? Math.PI : wrapped;
}

export function toAnglesFromZeroOne(state: State): {
  alpha: number;
  beta: number;
} {
  const r0 = abs(state[0]);
  const r1 = abs(state[1]);
  const alpha = 2 * Math.atan2(r1, r0);
  const beta = r0 < EPSILON || r1 < EPSILON ? 0 : wrapAngle(arg(state[1]) - arg(state[0]));
  return { alpha, beta };
}

export function fromAnglesZeroOne(alpha: number, beta: number): State {
  return {
    0: complex(Math.cos(alpha / 2)),
    1: fromPolar(Math.sin(alpha / 2), beta),
  };
}

export function isSameState(lhs: State, rhs: State): boolean {
  const a = toAnglesFromZeroOne(lhs);
  const b = toAnglesFromZeroOne(rhs);
  if (Math.abs(a.alpha - b.alpha) >= EPSILON) return false;
  const atPole = Math.abs(Math.sin(a.alpha)) < EPSILON;
  return atPole || Math.abs(wrapAngle(a.beta - b.beta)) < EPSILON;
}
