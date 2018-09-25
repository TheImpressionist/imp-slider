
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
} from './';

const types: any[] = [
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
    value: 'hello!'
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
  }
];

const range: any[] = [
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
  }
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
  const range: number[] = [8, 1067];
  const value: number = 60;
  const expected: number = 5.67;

  expect(calculatePercentFromRange(value, range)).toBe(expected);
});

test('Returns the expected closest number', () => {
  const nums: any[] = [{
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
