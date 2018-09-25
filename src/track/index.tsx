
import * as React from 'react';

import {
  TRACK_STYLE_WRAPPER,
  TRACK_ACTIVE_STYLE_WRAPPER,
} from './track.style';

import { resolveDisabled } from './util';

export interface SliderTrackProps extends React.Props<HTMLDivElement> {
  position: number;
  disabled?: boolean;
  onClick?(evt: React.MouseEvent<HTMLDivElement>): void;
}

const SLIDER_TRACK: React.SFC<SliderTrackProps> = (props: SliderTrackProps): JSX.Element => (
  <TRACK_STYLE_WRAPPER className={resolveDisabled(props.disabled as boolean)} onMouseDown={props.onClick}>
    <TRACK_ACTIVE_STYLE_WRAPPER
      style={{ width: `${props.position}%` }}
      onMouseDown={props.onClick}
    />
  </TRACK_STYLE_WRAPPER>
);

export default SLIDER_TRACK;
