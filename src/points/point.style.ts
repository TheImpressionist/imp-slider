
import styled from 'styled-components';

const POINT_WRAPPER: any = styled.div`
  top: 0;
  display: flex;
  position: absolute;
  align-items: center;
  flex-direction: column;
  transform: translateX(calc(-50% + 1px));
`;

const POINT_INDICATOR_STYLE: any = styled.div`
  width: 2px;
  height: 2px;
  border: 2px solid #000;
  background-color: ${(props: any) => props.active
    ? '#000'
    : '#efefef'
  };
`;

const POINT_VALUE_STYLE: any = styled.div`
  color: ${(props: any) => props.active
    ? '#000'
    : '#efefef'
  };
  font-size: 14px;
`;

export {
  POINT_WRAPPER,
  POINT_VALUE_STYLE,
  POINT_INDICATOR_STYLE,
};
