import { styled } from 'styled-components';

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  width: 100%;

  //toda div vier tiver dentro do header
  > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;
