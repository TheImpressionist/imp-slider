
import * as React from 'react';

import { isUndefined } from '../util';
import SliderTrack from '../track';
import SliderHandle from '../handle';
import { SliderPointValue } from '../points';
import {
  resolvePoints,
  calculateNextPos,
  getNextJumpPoint,
  resolveInitialValue,
  calculatePositionFromRange,
} from './util';
import {
  SLIDER_STYLE_WRAPPER,
  SLIDER_TRACK_WRAPPER,
  SLIDER_POINT_WRAPPER,
} from './slider.style';

// TODO: On Change method
// TODO: On After Change method
// TODO: Ability to provide a tooltip
//       Should pass value data to it
// TODO: Implement value control from the outside (DONE)
// TODO: Implement disabled (DONE)
// TODO: Normalize jumping between points when clicking (DONE)

export interface SliderProps extends React.Props<HTMLDivElement> {
  min: number;
  max: number;
  step?: number;
  jump?: boolean;
  disabled?: boolean;
  points?: SliderPointValue[];
  value?: number;
  defaultValue?: number;
  onChange?(evt: React.ChangeEvent<HTMLElement>, value: number): void;
  onMouseUp?(evt: React.MouseEvent<HTMLElement>, value: number): void;
  onMouseDown?(evt: React.MouseEvent<HTMLElement>, value: number): void;
}

export interface SliderState {
  position: number;
}

export default class Slider extends React.Component<SliderProps, SliderState> {
  private self: HTMLDivElement | void = void 0;
  private mouseHeldDown: boolean = false;
  private pointWrapper: HTMLDivElement | void = void 0;
  private startPos: number = 0;

  public state: SliderState = {
    position: 0,
  };

  public static defaultProps: SliderProps = {
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 0,
  };

  constructor(props: SliderProps) {
    super(props);

    this.resolveInitialPosition(props);
  }

  public componentDidUpdate(prevProps: SliderProps): void {
    if (!isUndefined(this.props.value) && prevProps.value !== this.props.value)
      return this.setState({
        ...this.state,
        position: calculatePositionFromRange(this.props.value as number, [this.props.min, this.props.max]),
      });
  }

  public render(): JSX.Element {
    return (
      <SLIDER_STYLE_WRAPPER
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        <SLIDER_TRACK_WRAPPER innerRef={this.assignSelfRef}>
          <SliderTrack
            disabled={this.props.disabled}
            position={this.state.position}
            onClick={this.handleTrackClick}
          />
          <SliderHandle
            disabled={this.props.disabled}
            position={this.state.position}
            onMouseDown={this.onMouseDown}
          />
        </SLIDER_TRACK_WRAPPER>

        <SLIDER_POINT_WRAPPER innerRef={this.assignPointRef}>
          {resolvePoints(this.props.points as SliderPointValue[], this.state.position, [this.props.min, this.props.max])}
        </SLIDER_POINT_WRAPPER>
      </SLIDER_STYLE_WRAPPER>
    );
  }

  private assignSelfRef = (el: HTMLDivElement): void => {
    this.self = el;
  }

  private assignPointRef = (el: HTMLDivElement): void => {
    this.pointWrapper = el;
  }

  private resolveInitialPosition(props: SliderProps): void {
    const position: number = resolveInitialValue(props);

    switch (position) {
      case 0:
        break;
      default:
        this.state.position = position;
        break;
    }
  }

  private onMouseDown = (evt: React.MouseEvent<HTMLDivElement>): void => {
    if (!this.mouseHeldDown && !this.props.disabled) {
      this.mouseHeldDown = true;
      this.startPos = evt.pageX;
    }
  }

  private onMouseUp = (evt: React.MouseEvent<HTMLDivElement>): void => {
    if (this.mouseHeldDown && !this.props.disabled) {
      this.mouseHeldDown = false;
      this.startPos = evt.pageX;
    }
  }

  private onMouseMove = (evt: React.MouseEvent<HTMLDivElement>): void => {
    if (!this.mouseHeldDown || this.props.disabled)
      return;

    switch (this.props.jump) {
      case true:
        return this.setJumpPosition(evt);
      default:
        return this.setPosition(evt);
    }
  }

  private handleTrackClick = (evt: React.MouseEvent<HTMLDivElement>): void => {
    if (this.mouseHeldDown)
      this.mouseHeldDown = false;

    evt.stopPropagation();
    switch (true) {
      case this.props.disabled:
        return;
      case this.props.jump && this.props.points && this.props.points.length:
        return this.setJumpPosition(evt);
      default:
        return this.setPosition(evt);
    }
  }

  private setPosition = (evt: React.MouseEvent<HTMLDivElement>): void => {
    if (!this.self)
      return;

    const position: number = calculateNextPos(
      this.self,
      [this.props.min, this.props.max],
      this.props.step as number,
      evt.pageX,
    );

    this.setState({ ...this.state, position });
  }

  private setJumpPosition = (evt: React.MouseEvent<HTMLDivElement>): void => {
    const position: number = getNextJumpPoint(
      evt.pageX,
      (this.pointWrapper as HTMLDivElement).childNodes,
      (this.pointWrapper as HTMLDivElement),
    );

    switch (true) {
      case position === -1:
        return;
      default:
        return this.setState(
          { ...this.state, position },
          () => this.startPos = evt.pageX,
        );
    }
  }
}
