
import {
  getNextStep,
  getStepLength,
  getNextJumpPoint,
  findClosestPoints,
  resolveInitialValue,
  getMiddleBetweenPoints,
  calculatePointPosition,
  calculatePositionFromRange,
} from './util';
import * as util from '../util';

const oldInRange = (util as any).inRange;

(util as any).inRange = jest.fn();

test('Returns a valid % value when in range', () => {
  const range: Array<number> = [8, 1067];
  const value: number = 60;
  const expected: number = 5.67;

  (util.inRange as any).mockReturnValueOnce(true);

  expect(calculatePositionFromRange(value, range)).toBe(expected);
});

test('Returns closest point value when not in range', () => {
  const range: Array<number> = [8, 1067];
  const value: number = 0;
  const expected: number = 8;

  (util.inRange as any).mockReturnValueOnce(false);

  expect(calculatePositionFromRange(value, range)).toBe(expected);
});

test('Returns a correct step length for a given range', () => {
  const ranges = [{
    range: [-1, 23],
    length: 1059,
    step: 0.1,
    expected: 4.41,
  }, {
    range: [0, 350],
    length: 1059,
    step: 3.2,
    expected: 9.72,
  }];

  ranges.forEach(r => expect(
    getStepLength(r.step, r.length, r.range)).toBe(r.expected),
  );
});

test('Calculates relative point position based on value range', () => {
  const range: Array<number> = [0, 10];
  const points: Array<any> = [{
    point: 0,
    expected: 0,
  }, {
    point: 5,
    expected: 50,
  }, {
    point: 10,
    expected: 100,
  }];

  points.forEach(point => {
    (util.inRange as any).mockReturnValueOnce(true);
    expect(calculatePointPosition(point.point, range)).toBe(point.expected);
  });
});

test('Calculates relative point custom position based on value range', () => {
  const range: Array<number> = [0, 10];
  const points: Array<any> = [{
    point: { key: 0, value: 'v1' },
    expected: 0,
  }, {
    point: { key: 5, value: 'v2' },
    expected: 50,
  }, {
    point: { key: 10, value: 'v3' },
    expected: 100,
  }];

  points.forEach(point => {
    (util.inRange as any).mockReturnValueOnce(true);
    expect(calculatePointPosition(point.point, range)).toBe(point.expected);
  });
});

test('Finds correct two possible jump points based on mouse position', () => {
  const points: Array<HTMLElement> = <Array<HTMLElement>>[{
    offsetLeft: 100,
  }, {
    offsetLeft: 150,
  }, {
    offsetLeft: 300,
  }];
  const mousePos: number = 130;
  const nodeList: NodeList = <NodeList>{
    length: 3,
    item: (index: number) => points[index] ? points[index] : null,
  };
  (util.inRange as any).mockReturnValueOnce(true);
  const closestPoints: Array<any> = findClosestPoints(mousePos, nodeList);

  expect(closestPoints).toHaveLength(2);
  expect(closestPoints[0]).toEqual(points[0]);
  expect(closestPoints[1]).toEqual(points[1]);
});

test('Finds one possible jump point when mouse is at the start', () => {
  const points: Array<HTMLElement> = <Array<HTMLElement>>[{
    offsetLeft: 100,
  }, {
    offsetLeft: 150,
  }, {
    offsetLeft: 300,
  }];
  const mousePos: number = 90;
  const nodeList: NodeList = <NodeList>{
    length: 3,
    item: (index: number) => points[index] ? points[index] : null,
  };
  const closestPoints: Array<any> = findClosestPoints(mousePos, nodeList);

  expect(closestPoints).toHaveLength(2);
  expect(closestPoints[0]).toBeUndefined();
  expect(closestPoints[1]).toEqual(points[0]);
});

test('Finds one possible jump points when mouse is at the end', () => {
  const points: Array<HTMLElement> = <Array<HTMLElement>>[{
    offsetLeft: 100,
  }, {
    offsetLeft: 150,
  }, {
    offsetLeft: 300,
  }];
  const mousePos: number = 340;
  const nodeList: NodeList = <NodeList>{
    length: 3,
    item: (index: number) => points[index] ? points[index] : null,
  };
  const closestPoints: Array<any> = findClosestPoints(mousePos, nodeList);

  expect(closestPoints).toHaveLength(2);
  expect(closestPoints[1]).toBeUndefined();
  expect(closestPoints[0]).toEqual(points[2]);
});

test('Returns the correct middle between two points', () => {
  const slider: HTMLElement = <HTMLElement>{
    offsetLeft: 0,
    offsetWidth: 100,
  };
  const points: Array<HTMLElement> = <Array<HTMLElement>>[{
    offsetLeft: 20,
  }, {
    offsetLeft: 70,
  },
  void 0,
  void 0, {
    offsetLeft: 90,
  }];

  const expected: Array<number> = [45, 85, 0, 45];

  expect(getMiddleBetweenPoints(points[0], points[1], slider)).toBe(expected[0]);
  expect(getMiddleBetweenPoints(points[1], points[2], slider)).toBe(expected[1]);
  expect(getMiddleBetweenPoints(points[2], points[3], slider)).toBe(expected[2]);
  expect(getMiddleBetweenPoints(points[3], points[4], slider)).toBe(expected[3]);
});

test('Returns correct next point value to jump to', () => {
  const slider: HTMLElement = <HTMLElement>{
    offsetLeft: 1,
    offsetWidth: 101,
  };
  const points: Array<HTMLElement> = <Array<HTMLElement>>[{
    offsetLeft: 20,
  }, {
    offsetLeft: 50,
  }, {
    offsetLeft: 70,
  }];
  const nodeList: NodeList = <NodeList>{
    length: 3,
    item: (index: number) => points[index] ? points[index] : null,
  };
  const expected: Array<any> = [{
    mousePos: 11,
    expected: 19.8,
  }, {
    mousePos: 9,
    expected: -1,
  }, {
    mousePos: 40,
    expected: 49.5,
  }, {
    mousePos: 35,
    expected: 49.5,
  }, {
    mousePos: 62,
    expected: 69.31,
  }, {
    mousePos: 88,
    expected: -1,
  }];
  (util.inRange as any) = oldInRange;

  expected.forEach(e => {
    expect(getNextJumpPoint(e.mousePos, nodeList, slider)).toBe(e.expected);
  });
});

test('Returns correct initial position value', () => {
  const tests: Array<any> = [{
    value: 10,
    min: 0,
    max: 100,
  }, {
    defaultValue: 50,
    min: 0,
    max: 100,
  }, {
    min: 0,
    max: 100,
  }, {
    min: 0,
    max: 100,
    value: 70,
    defaultValue: 50,
  }];
  const expected: Array<number> = [10, 50, 0, 70];
  (util as any).inRange = oldInRange;
  tests.forEach((props, idx) => {
    expect(resolveInitialValue(props)).toBe(expected[idx]);
  });
});
