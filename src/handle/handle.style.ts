
import styled from 'styled-components';

const HANDLE_STYLE = styled.div`
  width: 8px;
  height: 8px;
  border: 2px solid #000;
  border-radius: 100%;
  position: absolute;
  top: 50%;
  background-color: #efefef;
  cursor: grab;
  transform: translateX(calc(-50% + 1px)) translateY(-50%);
  z-index: 2;

  &:active {
    cursor: grabbing;
  }

  &.disabled {
    cursor: not-allowed;
    background-color: #efefef;
    border-color: rgba(0,0,0,0.25);
  }
`;

export {
  HANDLE_STYLE,
};
