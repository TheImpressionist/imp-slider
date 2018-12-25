
import * as React from 'react';

import { IPoint } from './';
import { isObject } from '../util';

export function resolvePointValue(point: number | IPoint): React.ReactNode {
  switch (true) {
    case isObject(point) && point.hasOwnProperty('value'):
      return (<IPoint>point).value;
    default:
      return point;
  }
}
