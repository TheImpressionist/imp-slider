
import * as React from 'react';

import { Point } from './';
import { isObject } from '../util';

export function resolvePointValue(point: number | Point): React.ReactNode {
  switch (true) {
    case isObject(point) && point.hasOwnProperty('value'):
      return (<Point>point).value;
    default:
      return point;
  }
}
