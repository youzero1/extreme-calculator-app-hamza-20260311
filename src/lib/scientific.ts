export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function factorial(n: number): number {
  if (n < 0) throw new Error('Factorial of negative number');
  if (!Number.isInteger(n)) throw new Error('Factorial requires integer');
  if (n > 170) throw new Error('Factorial too large');
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export const PHI = (1 + Math.sqrt(5)) / 2;

export function nthRoot(x: number, n: number): number {
  if (n === 0) throw new Error('Root index cannot be zero');
  if (x < 0 && n % 2 === 0) throw new Error('Even root of negative number');
  const sign = x < 0 ? -1 : 1;
  return sign * Math.pow(Math.abs(x), 1 / n);
}

export function logBase(x: number, base: number): number {
  if (x <= 0) throw new Error('Log of non-positive number');
  if (base <= 0 || base === 1) throw new Error('Invalid log base');
  return Math.log(x) / Math.log(base);
}
