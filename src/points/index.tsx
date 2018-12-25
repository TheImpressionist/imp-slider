
import * as React from 'react';

import {
  POINT_WRAPPER,
  POINT_VALUE_STYLE,
  POINT_INDICATOR_STYLE,
} from './point.style';
import { resolvePointValue } from './util';

export type PointValueType = string | number | React.ReactNode;

export interface IPoint {
  key: number;
  value: PointValueType;
}

export type SliderPointValue = number | IPoint;

export interface ISliderPointProps extends React.Props<void> {
  active: boolean;
  position: number;
  value: SliderPointValue;
}

const SliderPoint: React.SFC<ISliderPointProps> = (props: ISliderPointProps): JSX.Element => (
  <POINT_WRAPPER style={{ left: `${props.position}%` }}>
    <POINT_INDICATOR_STYLE active={props.active} />

    <POINT_VALUE_STYLE active={props.active}>
      {resolvePointValue(props.value)}
    </POINT_VALUE_STYLE>
  </POINT_WRAPPER>
);

export default SliderPoint;
