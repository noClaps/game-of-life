export const CELL_SIZE = 16;
export const WIDTH = Math.floor(innerWidth / CELL_SIZE);
export const HEIGHT = Math.floor(innerHeight / CELL_SIZE);
export const THRESHOLD = 0.75;
export const STEP_TIME = 100;

export function mod(a: number, b: number) {
  return ((a % b) + b) % b;
}

export function index(r: number, c: number) {
  return r * WIDTH + c;
}

export function diff(a: Uint8Array, b: Uint8Array) {
  console.assert(a.length === b.length, "Arrays were of different length");
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      const td = document.querySelector(`[data-index="${i}"]`)!;
      td.classList.toggle("alive");
    }
  }
}
