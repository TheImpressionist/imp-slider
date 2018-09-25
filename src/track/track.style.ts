
import styled from 'styled-components';

const TRACK_STYLE_WRAPPER = styled.div`
  width: 100%;
  height: 5px;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background-color: #efefef;

  &.disabled {
    cursor: not-allowed;

    >div {
      cursor: not-allowed;
      background-color: rgba(0, 0, 0, 0.25);
    }
  }
`;

const TRACK_ACTIVE_STYLE_WRAPPER = styled.div`
  height: 100%;
  background-color: #000;
`;

export {
  TRACK_STYLE_WRAPPER,
  TRACK_ACTIVE_STYLE_WRAPPER
};
