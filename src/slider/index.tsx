
import * as React from 'react';

import {
  isFunction,
  isUndefined,
  closestNumber,
  roundValueByStep,
} from '../util';
import SliderTrack from '../track';
import SliderHandle, { ISliderHandleProps } from '../handle';
import { SliderPointValue } from '../points';
import {
  resolvePoints,
  calculateNextPos,
  getNextJumpPoint,
  resolveInitialValue,
  getValueFromPosition,
  calculatePositionFromRange,
} from './util';
import {
  SLIDER_STYLE_WRAPPER,
  SLIDER_TRACK_WRAPPER,
  SLIDER_POINT_WRAPPER,
} from './slider.style';

// TODO: On Change method (TEST)
// TODO: On After Change method (TEST)
// TODO: Ability to provide a custom handle (TEST)
// TODO: Implement value control from the outside (DONE)
// TODO: Implement disabled (DONE)
// TODO: Normalize jumping between points when clicking (DONE)

export interface ISliderProps extends React.Props<HTMLElement> {
  min: number;
  max: number;
  step?: number;
  jump?: boolean;
  disabled?: boolean;
  points?: SliderPointValue[];
  value?: number;
  defaultValue?: number;
  handle?(props: ISliderHandleProps): React.ReactNode;
  onChange?(value?: number): void;
  onMouseUp?(evt?: React.MouseEvent<HTMLElement>, value?: number): void;
  onMouseDown?(evt?: React.MouseEvent<HTMLElement>, value?: number): void;
}

export interface ISliderState {
  value?: number;
  position: number;
}

export default class Slider extends React.Component<ISliderProps, ISliderState> {
  private self: HTMLElement | void = void 0;
  private mouseHeldDown: boolean = false;
  private pointWrapper: HTMLElement | void = void 0;

  public state: ISliderState = {
    value: isUndefined(this.props.value)
      ? closestNumber(this.props.defaultValue || 0, this.props.min, this.props.max)
      : closestNumber(this.props.value || 0, this.props.min, this.props.max),
    position: 0,
  };

  public static defaultProps: ISliderProps = {
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 0,
  };

  constructor(props: ISliderProps) {
    super(props);
    this.resolveInitialPosition(props);
  }

  public componentDidUpdate(prevProps: ISliderProps): void {
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
          {this.getHandle()}
        </SLIDER_TRACK_WRAPPER>

        <SLIDER_POINT_WRAPPER innerRef={this.assignPointRef}>
          {resolvePoints(this.props.points as SliderPointValue[], this.state.position, [this.props.min, this.props.max])}
        </SLIDER_POINT_WRAPPER>
      </SLIDER_STYLE_WRAPPER>
    );
  }

  private getHandle = (): React.ReactNode => {
    switch (true) {
      case this.props.handle !== void 0 && isFunction(this.props.handle):
        // This is just a dumb workaround the issue that typescript disregards undefined
        // checks if it's in a switch statement, for some reason.
        return this.props.handle && this.props.handle({
          position: this.state.position,
          disabled: this.props.disabled,
          onMouseDown: this.onMouseDown,  
        });
      default:
        return (
          <SliderHandle
            position={this.state.position}
            disabled={this.props.disabled}
            onMouseDown={this.onMouseDown}
          />
        );
    }
  }

  private assignSelfRef = (el: HTMLElement): void => {
    this.self = el;
  }

  private assignPointRef = (el: HTMLElement): void => {
    this.pointWrapper = el;
  }

  private resolveInitialPosition(props: ISliderProps): void {
    const position: number = resolveInitialValue(props);

    switch (position) {
      case 0:
        break;
      default:
        this.state.position = position;
        break;
    }
  }

  private onMouseDown = (evt: React.MouseEvent<HTMLElement>): void => {
    if (!this.mouseHeldDown && !this.props.disabled) {
      this.mouseHeldDown = true;
    }
  }

  private onMouseUp = (evt: React.MouseEvent<HTMLElement>): void => {
    if (this.mouseHeldDown && !this.props.disabled) {
      const value: number = closestNumber(
        getValueFromPosition(this.state.position, this.props.max),
        this.props.min,
        this.props.max,
      );
      const roundedValue: number = roundValueByStep(value, this.props.step || 1);
      this.mouseHeldDown = false;
      this.props.onMouseUp && this.props.onMouseUp(evt, roundedValue);
      this.setState({ ...this.state, value });
    }
  }

  private onMouseMove = (evt: React.MouseEvent<HTMLElement>): void => {
    // Mouse move should be bound to the document instead
    // And removed on mouse up
    
    // TODO: Check for controlled value
    //       If controlled, do not update the position on move
    if (!this.mouseHeldDown || this.props.disabled) {
      return;
    }

    switch (this.props.jump) {
      case true:
        return this.setJumpPosition(evt);
      default:
        return this.setPosition(evt);
    }
  }

  private handleTrackClick = (evt: React.MouseEvent<HTMLElement>): void => {
    if (this.mouseHeldDown) {
      this.mouseHeldDown = false;
    }

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

  private setPosition = (evt: React.MouseEvent<HTMLElement>): void => {
    if (!this.self) {
      return;
    }

    const position: number = calculateNextPos(
      this.self,
      [this.props.min, this.props.max],
      this.props.step as number,
      evt.pageX,
    );
    const value: number = closestNumber(
      getValueFromPosition(position, this.props.max),
      this.props.min,
      this.props.max,
    );
    const roundedValue: number = roundValueByStep(value, this.props.step || 1);

    this.setState(
      { ...this.state, position },
      () => this.props.onChange && this.props.onChange(roundedValue),
    );
  }

  private setJumpPosition = (evt: React.MouseEvent<HTMLElement>): void => {
    const position: number = getNextJumpPoint(
      evt.pageX,
      (this.pointWrapper as HTMLElement).childNodes,
      (this.pointWrapper as HTMLElement),
    );
    const value: number = closestNumber(
      getValueFromPosition(position, this.props.max),
      this.props.min,
      this.props.max,
    );
    const roundedValue: number = roundValueByStep(value, this.props.step || 1);

    switch (true) {
      case position === -1:
        return;
      default:
        return this.setState(
          { ...this.state, position },
          () => this.props.onChange && this.props.onChange(roundedValue),
        );
    }
  }
}
