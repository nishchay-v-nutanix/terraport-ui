import styled from 'styled-components';

// Minimal styled-component for grid layout only
export const ProvidersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 900px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 320px;
  }
`;
