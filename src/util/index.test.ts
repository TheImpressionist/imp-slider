
import {
  isArray,
  isObject,
  isUndefined,
  callPrototype,
  inRange,
  closestNumber,
  calculatePercentFromRange,
  BOOLEAN,
  NULL,
  UNDEFINED,
  NUMBER,
  STRING,
  SYMBOL,
  OBJECT,
  ARRAY,
  DATE,
  roundValueByStep,
} from './';

const types: Array<any> = [
  {
    expected: BOOLEAN,
    value: true,
  },
  {
    expected: NULL,
    value: null,
  },
  {
    expected: UNDEFINED,
    value: void 0,
  },
  {
    expected: NUMBER,
    value: 124,
  },
  {
    expected: NUMBER,
    value: 12.33,
  },
  {
    expected: STRING,
    value: 'hello!',
  },
  {
    expected: STRING,
    value: '',
  },
  {
    expected: STRING,
    value: '123',
  },
  {
    expected: SYMBOL,
    value: Symbol(),
  },
  {
    expected: OBJECT,
    value: {},
  },
  {
    expected: OBJECT,
    value: new Object(),
  },
  {
    expected: ARRAY,
    value: [],
  },
  {
    expected: DATE,
    value: new Date(),
  },
];

const range: Array<any> = [
  {
    value: 1,
    range: [0, 10],
    expected: true,
  },
  {
    value: -1,
    range: [0, 10],
    expected: false,
  },
  {
    value: 11,
    range: [0, 10],
    expected: false,
  },
  {
    value: NaN,
    range: [0, 10],
    expected: false,
  },
  {
    value: '1000',
    range: [0, 10],
    expected: false,
  },
  {
    value: '9',
    range: [0, 10],
    expected: true,
  },
  {
    value: 'asdbfasdc',
    range: [0, 10],
    expected: false,
  },
];

test('Returns correct type from object prototype call with any type', () => {
  types.forEach(type => {
    expect(callPrototype(type.value)).toBe(type.expected);
  });
});

test('Returns TRUE with correct array argument', () => {
  expect(isArray([])).toBeTruthy();
});


test('Returns FALSE with an incorrect argument', () => {
  expect(isArray('[123, 123]')).toBeFalsy();
});

test('Returns TRUE with correct object argument', () => {
  expect(isObject({})).toBeTruthy();
});

test('Returns FALSE with an incorrect object argument', () => {
  expect(isObject('Not an Object')).toBeFalsy();
});

test('Returns TRUE with correct void argument', () => {
  expect(isUndefined(void 0)).toBeTruthy();
});

test('Returns FALSE with an incorrect void argument', () => {
  expect(isUndefined(123)).toBeFalsy();
});

test('Returns expected bool value', () => {
  range.forEach(r => {
    expect(inRange(r.value, r.range[0], r.range[1])).toBe(r.expected);
  });
});

test('Returns a correct % value when in range', () => {
  const range: Array<number> = [8, 1067];
  const value: number = 60;
  const expected: number = 5.67;

  expect(calculatePercentFromRange(value, range)).toBe(expected);
});

test('Returns the expected closest number', () => {
  const nums: Array<any> = [{
    value: 14,
    lower: 10,
    upper: 20,
    expected: 10,
  }, {
    value: 12,
    lower: -1,
    upper: 20,
    expected: 20,
  }, {
    value: 5,
    lower: 0,
    upper: 10,
    expected: 10,
  }];

  nums.forEach(num => expect(closestNumber(num.value, num.lower, num.upper)).toBe(num.expected));
});

test('Rounds number to the point based on the step provided to the slider', () => {
  const values = [{
    value: 1.02564,
    expected: 1.03,
    step: 0.01,
  }, {
    value: 1,
    expected: 1,
    step: 0.001,
  }, {
    value: 1.88888,
    expected: 1.889,
    step: 0.007,
  }];

  values.forEach(v => expect(roundValueByStep(v.value, v.step)).toEqual(v.expected));
});