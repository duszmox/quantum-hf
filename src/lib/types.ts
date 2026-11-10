import type { Complex } from "./complex";

export interface State {
  0: Complex;
  1: Complex;
}

export interface Arrow {
  color: string
  state: State
}
