// extracted from p5js

export function map(
  n: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
  withinBounds: boolean = true
) {
  const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
}

export function constrain(n: number, low: number, high: number) {
  return Math.max(Math.min(n, high), low);
}

export function lerp(start: number, stop: number, amt: number) {
  return amt * (stop - start) + start;
}

export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
