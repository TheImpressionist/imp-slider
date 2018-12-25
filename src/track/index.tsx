
import * as React from 'react';

import {
  TRACK_STYLE_WRAPPER,
  TRACK_ACTIVE_STYLE_WRAPPER,
} from './track.style';

import { resolveDisabled } from './util';

export interface ISliderTrackProps extends React.Props<HTMLElement> {
  position: number;
  disabled?: boolean;
  onClick?(evt: React.MouseEvent<HTMLElement>): void;
}

const SLIDER_TRACK: React.SFC<ISliderTrackProps> = (props: ISliderTrackProps): JSX.Element => (
  <TRACK_STYLE_WRAPPER className={resolveDisabled(props.disabled as boolean)} onMouseDown={props.onClick}>
    <TRACK_ACTIVE_STYLE_WRAPPER
      style={{ width: `${props.position}%` }}
      onMouseDown={props.onClick}
    />
  </TRACK_STYLE_WRAPPER>
);

export default SLIDER_TRACK;
