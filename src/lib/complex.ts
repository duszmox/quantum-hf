export interface Complex {
  re: number;
  im: number;
}

export const complex = (re: number, im = 0): Complex => ({ re, im });

export const ZERO = complex(0);
export const ONE = complex(1);
export const I = complex(0, 1);

export function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function mul(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

export function abs(a: Complex): number {
  return Math.hypot(a.re, a.im);
}

export function arg(a: Complex): number {
  return Math.atan2(a.im, a.re);
}

export function fromPolar(r: number, beta: number): Complex {
  return { re: r * Math.cos(beta), im: r * Math.sin(beta) };
}

export function format(a: Complex, digits = 4): string {
  if (a.im == 0) {
    return `${a.re.toFixed(digits)}`
  }
  const sign = a.im < 0 ? "-" : "+";
  return `${a.re.toFixed(digits)} ${sign} ${Math.abs(a.im).toFixed(digits)}i`;
}
