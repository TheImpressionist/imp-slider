
export const BOOLEAN: string = '[object Boolean]';
export const NULL: string = '[object Null]';
export const UNDEFINED: string = '[object Undefined]';
export const NUMBER: string = '[object Number]';
export const STRING: string = '[object String]';
export const SYMBOL: string = '[object Symbol]';
export const OBJECT: string = '[object Object]';
export const ARRAY: string = '[object Array]';
export const DATE: string = '[object Date]';
export const FUNCTION: string = '[object Function]';

export function callPrototype(value: any): string {
  return Object.prototype.toString.call(value);
}

export function isObject(value: any): boolean {
  return callPrototype(value) === OBJECT;
}

export function isArray(value: any): boolean {
  return callPrototype(value) === ARRAY;
}

export function isUndefined(value: any): boolean {
  return callPrototype(value) === UNDEFINED;
}

export function isNumber(value: any): boolean {
  return callPrototype(value) === NUMBER;
}

export function isFunction(value: any): boolean {
  return callPrototype(value) === FUNCTION;
}

export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function roundValueByStep(value: number, step: number): number {
  if (step >= 1) {
    return value;
  }

  const decimalPlaces: number = step.toString().replace(/0\./, '').length;
  return Number(value.toFixed(decimalPlaces));
}

export function closestNumber(value: number, lower: number, upper: number): number {
  const upperDiff: number = Math.abs(upper - value);
  const lowerDiff: number = Math.abs(value - lower);

  switch (true) {
    case upperDiff > lowerDiff:
      return lower;
    case upperDiff <= lowerDiff:
      return upper;
    default:
      return value;
  }
}

export function calculatePercentFromRange(value: number, range: number[]): number {
  return Number((100 * value / (range[1] - range[0])).toFixed(2));
}
