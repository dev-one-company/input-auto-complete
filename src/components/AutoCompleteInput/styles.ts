import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: min(1000px, 90%);
  border-radius: 1rem;
  font-size: 5rem;
`;

export const Input = styled.input`
  font-size: inherit;
  border-radius: 1rem;
  border: 5px solid #c2c2c2;
  outline: none;
  width: 100%;
  transition: all 250ms linear;
  color: #34373d;
  font-weight: 600;
  padding: 0 1rem;
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;

  &::selection {
    background: #8fb8ff;
  }

  &:hover {
    box-shadow: #2b79ff10 0px 10px 15px -3px, #2b79ff05 0px 4px 6px -2px;
    border-color: #d9d9d9;
  }

  &:focus {
    border-color: #2b79ff;
    box-shadow: #2b79ff10 0px 10px 15px -3px, #2b79ff05 0px 4px 6px -2px;
  }
`;

export const InputPlaceholder = styled(Input)`
  position: absolute;
  top: 0;
  left: 0;
  color: #c2c2c2;
  pointer-events: none;
  z-index: 1;
`;
