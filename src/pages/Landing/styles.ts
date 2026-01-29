import styled from 'styled-components';

// Minimal styled-components - only for grid layout not directly supported by Prism
export const EnvironmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const AddEnvironmentCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--color-background-alt);
  border: 1px solid var(--color-border-separator);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 240px;

  &:hover {
    border-color: var(--color-border-interactive);
    background: var(--color-background-base);
  }
`;
