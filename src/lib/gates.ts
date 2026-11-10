import { add, complex, fromPolar, I, mul, ONE, ZERO, type Complex } from "./complex";
import type { State } from "./types";

export type Matrix = readonly [[Complex, Complex], [Complex, Complex]];

export type BlochAxis = readonly [number, number, number];

export const X_AXIS: BlochAxis = [1, 0, 0];
export const Y_AXIS: BlochAxis = [0, 1, 0];
export const Z_AXIS: BlochAxis = [0, 0, 1];
export const H_AXIS: BlochAxis = [Math.SQRT1_2, 0, Math.SQRT1_2];

export interface Gate {
  label: string;
  matrix: Matrix;
  inverse: Matrix;
  axis: BlochAxis;
  angle: number;
}

export function apply([[m00, m01], [m10, m11]]: Matrix, state: State): State {
  return {
    0: add(mul(m00, state[0]), mul(m01, state[1])),
    1: add(mul(m10, state[0]), mul(m11, state[1])),
  };
}

const NEG_ONE = complex(-1);
const NEG_I = complex(0, -1);
const H = complex(Math.SQRT1_2);
const NEG_H = complex(-Math.SQRT1_2);

const X: Matrix = [[ZERO, ONE], [ONE, ZERO]];
const Y: Matrix = [[ZERO, NEG_I], [I, ZERO]];
const Z: Matrix = [[ONE, ZERO], [ZERO, NEG_ONE]];
const HADAMARD: Matrix = [[H, H], [H, NEG_H]];

const pauli = (label: string, matrix: Matrix, axis: BlochAxis): Gate => ({
  label,
  matrix,
  inverse: matrix,
  axis,
  angle: Math.PI,
});

const phaseMatrix = (phi: number): Matrix => [
  [ONE, ZERO],
  [ZERO, fromPolar(1, phi)],
];

const rxMatrix = (theta: number): Matrix => {
  const c = complex(Math.cos(theta / 2));
  const s = complex(0, -Math.sin(theta / 2));
  return [[c, s], [s, c]];
};

const ryMatrix = (theta: number): Matrix => {
  const c = complex(Math.cos(theta / 2));
  const s = Math.sin(theta / 2);
  return [[c, complex(-s)], [complex(s), c]];
};

const rzMatrix = (theta: number): Matrix => [
  [fromPolar(1, -theta / 2), ZERO],
  [ZERO, fromPolar(1, theta / 2)],
];

const phaseGate = (label: string, phi: number): Gate => ({
  label,
  matrix: phaseMatrix(phi),
  inverse: phaseMatrix(-phi),
  axis: Z_AXIS,
  angle: phi,
});

export const PAULI_GATES: readonly Gate[] = [
  pauli("X", X, X_AXIS),
  pauli("Y", Y, Y_AXIS),
  pauli("Z", Z, Z_AXIS),
  pauli("H", HADAMARD, H_AXIS),
];

export const PHASE_GATES: readonly Gate[] = [
  phaseGate("S", Math.PI / 2),
  phaseGate("S^\\dagger", -Math.PI / 2),
  phaseGate("T", Math.PI / 4),
  phaseGate("T^\\dagger", -Math.PI / 4),
];

const formatDegrees = (deg: number) => `${Number(deg.toFixed(2))}^\\circ`;

const DEG = Math.PI / 180;

export const R_GATES: readonly {
  name: string;
  create: (degrees: number) => Gate;
}[] = [
  {
    name: "R_x",
    create: (d) => ({
      label: `R_x(${formatDegrees(d)})`,
      matrix: rxMatrix(d * DEG),
      inverse: rxMatrix(-d * DEG),
      axis: X_AXIS,
      angle: d * DEG,
    }),
  },
  {
    name: "R_y",
    create: (d) => ({
      label: `R_y(${formatDegrees(d)})`,
      matrix: ryMatrix(d * DEG),
      inverse: ryMatrix(-d * DEG),
      axis: Y_AXIS,
      angle: d * DEG,
    }),
  },
  {
    name: "R_z",
    create: (d) => ({
      label: `R_z(${formatDegrees(d)})`,
      matrix: rzMatrix(d * DEG),
      inverse: rzMatrix(-d * DEG),
      axis: Z_AXIS,
      angle: d * DEG,
    }),
  },
  {
    name: "P",
    create: (d) => phaseGate(`P(${formatDegrees(d)})`, d * DEG),
  },
];
