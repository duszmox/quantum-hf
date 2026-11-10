import { complex } from "./complex";
import type { State } from "./types";

const SQRT1_2 = Math.SQRT1_2;

export const KETZero: State = { 0: complex(1), 1: complex(0) };
export const KETOne: State = { 0: complex(0), 1: complex(1) };

export const KETPlus: State = {
  0: complex(SQRT1_2),
  1: complex(SQRT1_2),
};
export const KETMinus: State = {
  0: complex(SQRT1_2),
  1: complex(-SQRT1_2),
};

export const KETS: readonly (readonly [label: string, ket: State])[] = [
  ["\\ket{0}", KETZero],
  ["\\ket{1}", KETOne],
  ["\\ket{+}", KETPlus],
  ["\\ket{-}", KETMinus],
];
