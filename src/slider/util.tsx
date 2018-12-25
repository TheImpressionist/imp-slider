
import * as React from 'react';

import { ISliderProps } from './';
import SliderPoint, { SliderPointValue, IPoint } from '../points';
import {
  inRange,
  isObject,
  isNumber,
  isUndefined,
  closestNumber,
  calculatePercentFromRange,
} from '../util';


/**
 * [resolveInitialValue description]
 * @param  {[type]} props [description]
 * @return {[type]}       [description]
 */

export function resolveInitialValue(props: ISliderProps): number {
  switch (true) {
    case !isUndefined(props.value) && isNumber(props.value):
      return calculatePositionFromRange(props.value as number, [props.min, props.max]);
    case !isUndefined(props.defaultValue) && isNumber(props.defaultValue):
      return calculatePositionFromRange(props.defaultValue as number, [props.min, props.max]);
    default:
      return calculatePositionFromRange(0, [props.min, props.max]);
  }
}




/**
 * [calculatePositionFromRange description]
 * @param  {[type]} value [description]
 * @param  {[type]} range [description]
 * @return {[type]}       [description]
 */

export function calculatePositionFromRange(value: number, range: Array<number>): number {
  const isInRange: boolean = inRange(value, range[0], range[1]);

  switch (true) {
    case isInRange:
      return calculatePercentFromRange(value, range);;
    default:
      return closestNumber(value, range[0], range[1]);
  }
}




/**
 * [calculatePointPosition description]
 *
 * @param  {[type]} point [description]
 * @param  {[type]} range [description]
 * @return {[type]}       [description]
 */

export function calculatePointPosition(point: SliderPointValue, range: Array<number>): number {
  switch (true) {
    case isObject(point):
      return calculatePositionFromRange((point as IPoint).key, range);
    default:
      return calculatePositionFromRange(point as number, range);
  }
}




/**
 * [resolvePoints description]
 *
 * @param  {[type]} points   [description]
 * @param  {[type]} position [description]
 * @param  {[type]} range    [description]
 * @return {[type]}          [description]
 */

export function resolvePoints(points: Array<SliderPointValue>, position: number, range: Array<number>): React.ReactNode | Array<React.ReactNode> {
  switch (true) {
    case !isUndefined(points):
      return points.map((point: SliderPointValue, idx: number) => {
        const pointPos: number = calculatePointPosition(point, range);

        return (
          <SliderPoint
            key={`${idx}`}
            active={position >= pointPos}
            position={pointPos}
            value={point}
          />
        );
      });
    default:
      return null;
  }
}




/**
 * [getStepLength description]
 *
 * @param  {[type]} step   [description]
 * @param  {[type]} length [description]
 * @param  {[type]} range  [description]
 * @return {[type]}        [description]
 */

export function getStepLength(step: number, length: number, range: Array<number>): number {
  const totalSteps: number = Math.floor((range[1] - range[0]) / step);
  const singleStepLength: number = length / totalSteps;

  return Number(singleStepLength.toFixed(2));
}




/**
 * [getNextStep description]
 *
 * @param  {[type]} startPos   [description]
 * @param  {[type]} currentPos [description]
 * @param  {[type]} stepLength [description]
 * @return {[type]}            [description]
 */

export function getNextStep(startPos: number, currentPos: number, stepLength: number): number {
  const moved: number = currentPos - startPos;
  const stepsMoved: number = Math.round(moved / stepLength);

  return stepsMoved * stepLength + startPos;
}




/**
 * [calculateNextPos description]
 *
 * @param  {[type]} slider   [description]
 * @param  {[type]} range    [description]
 * @param  {[type]} step     [description]
 * @param  {[type]} mousePos [description]
 * @return {[type]}          [description]
 */

export function calculateNextPos(slider: HTMLElement, range: Array<number>, step: number, mousePos: number): number {
  const sliderPos: Array<number> = [slider.offsetLeft, slider.offsetWidth];
  const length: number = sliderPos[1] - sliderPos[0];
  const stepLength: number = getStepLength(step as number, length, range);
  const stepsPosPx: number = getNextStep(slider.offsetLeft, mousePos, stepLength);

  if (stepsPosPx >= slider.offsetWidth + slider.offsetLeft) {
    return slider.offsetWidth + slider.offsetLeft;
  }

  return Math.round(calculatePercentFromRange(stepsPosPx, sliderPos));
}




/**
 * [findClosestPoints description]
 *
 * @param  {number}           mousePos [description]
 * @param  {NodeList}         points   [description]
 * @return {HTMLElement[]}          [description]
 */

export function findClosestPoints(mousePos: number, points: NodeList): Array<HTMLElement | void> {
  for (let i: number = 0; i < points.length; i++) {
    const point: HTMLElement = points.item(i) as HTMLElement;
    const nextPoint: HTMLElement = points.item(i + 1)  as HTMLElement;

    switch (true) {
      case mousePos <= point.offsetLeft && points.item(i - 1) === null:
        return [void 0, point];
      case mousePos >= point.offsetLeft && nextPoint === null:
        return [point, void 0];
      case inRange(mousePos, point.offsetLeft, nextPoint.offsetLeft):
        return [point, nextPoint];
      default:
        continue;
    }
  }

  return [];
}




/**
 * [getMiddleBetweenPoints description]
 *
 * @param  {HTMLElement | void} start     [description]
 * @param  {HTMLElement | void} end       [description]
 * @param  {HTMLElement}        container [description]
 * @return {number}                          [description]
 */

export function getMiddleBetweenPoints(start: HTMLElement | void, end: HTMLElement | void, container: HTMLElement): number {
  const containerEndPos: number = container.offsetWidth + container.offsetLeft;

  switch (true) {
    case !isUndefined(start) && !isUndefined(end):
      return ((end as HTMLElement).offsetLeft - (start as HTMLElement).offsetLeft) / 2 + (start as HTMLElement).offsetLeft;
    case isUndefined(start) && !isUndefined(end):
      return ((end as HTMLElement).offsetLeft - container.offsetLeft) / 2 + container.offsetLeft;
    case !isUndefined(start) && isUndefined(end):
      return (containerEndPos - (start as HTMLElement).offsetLeft) / 2 + (start as HTMLElement).offsetLeft;
    default:
      return 0;
  }
}




/**
 * [getMovementX description]
 * @param  {number} startPos   [description]
 * @param  {number} currentPos [description]
 * @return {number}            [description]
 */

export function getMovementX(startPos: number, currentPos: number): number {
  return currentPos - startPos;
}




/**
 * [getAbsoluteMovementX description]
 * @param  {number} startPos   [description]
 * @param  {number} currentPos [description]
 * @return {number}            [description]
 */
export function getAbsoluteMovementX(startPos: number, currentPos: number): number {
  return Math.abs(currentPos - startPos);
}




/**
 * [getNextJumpPoint description]
 *
 * @param  {number}         mousePos  [description]
 * @param  {number}         movementX [description]
 * @param  {NodeList}       points    [description]
 * @param  {HTMLElement}    slider    [description]
 * @return {number}                   [description]
 */

export function getNextJumpPoint(mousePos: number, points: NodeList, container: HTMLElement): number {
  const closestPoints: Array<HTMLElement | void> = findClosestPoints(mousePos, points);
  const middle: number = getMiddleBetweenPoints(closestPoints[0], closestPoints[1], container);
  const containerEndPoint: number = container.offsetLeft + container.offsetWidth;

  switch (true) {
    case !isUndefined(closestPoints[1]) && middle > 0 && mousePos >= middle:
      return calculatePercentFromRange((closestPoints[1] as HTMLElement).offsetLeft, [container.offsetLeft, containerEndPoint]);
    case !isUndefined(closestPoints[0]) && middle > 0 && mousePos <= middle:
      return calculatePercentFromRange((closestPoints[0] as HTMLElement).offsetLeft, [container.offsetLeft, containerEndPoint]);
    default:
      return -1;
  }
}



export function getValueFromPosition(position: number, max: number): number {
  return position * max / 100;
}