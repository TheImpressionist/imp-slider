
import * as React from 'react';

import { HANDLE_STYLE } from './handle.style';
import { resolveDisabled } from './util';

export interface ISliderHandleProps extends React.Props<HTMLDivElement> {
  position: number;
  disabled?: boolean;
  onMouseOver?(evt: React.MouseEvent<HTMLDivElement>): void;
  onMouseDown?(evt: React.MouseEvent<HTMLDivElement>): void;
  onMouseMove?(evt: React.MouseEvent<HTMLDivElement>): void;
  onMouseUp?(evt: React.MouseEvent<HTMLDivElement>): void;
}

const SLIDER_HANDLE: React.SFC<ISliderHandleProps> = (props: ISliderHandleProps): JSX.Element => (
  <HANDLE_STYLE
    style={{ left: `${props.position}%` }}
    className={resolveDisabled(props.disabled as boolean, 'imp-slider__handle')}
    onMouseOver={props.onMouseOver}
    onMouseDown={props.onMouseDown}
    onMouseUp={props.onMouseUp}
    onMouseMove={props.onMouseMove}
  />
);

export default SLIDER_HANDLE;
