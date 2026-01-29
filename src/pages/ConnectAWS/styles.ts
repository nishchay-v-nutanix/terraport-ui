import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 40px 48px 60px;
  box-sizing: border-box;
`;

export const ContentWrapper = styled.div`
  display: flex;
  gap: 60px;
  flex: 1;
  width: 100%;

  @media (max-width: 1100px) {
    flex-direction: column;
    gap: 40px;
  }
`;

export const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 720px;
`;

export const Sidebar = styled.div`
  width: 360px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-self: flex-start;
  position: sticky;
  top: 40px;

  @media (max-width: 1100px) {
    width: 100%;
    max-width: 100%;
    position: static;
  }
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background: var(--color-background-alt);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 12px;
`;

export const ProgressBarFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${props => props.percent}%;
  background: var(--color-background-interactive-primary);
  border-radius: 3px;
  transition: width 0.3s ease;
`;

export const FormCard = styled.div`
  background: var(--color-background-base);
  border: 1px solid var(--color-border-separator);
  border-radius: 8px;
  padding: 32px;
  margin-top: 32px;
`;

export const InfoCard = styled.div`
  background: var(--color-background-base);
  border: 1px solid var(--color-border-separator);
  border-radius: 8px;
  padding: 24px;
`;

export const IconWrapper = styled.div<{ color?: string }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || 'var(--color-text-primary-label)'};
`;

export const PermissionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

export const CheckIcon = styled.span`
  color: var(--color-text-success);
  font-size: 14px;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const VisibilityToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary-label);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--color-text-primary-label);
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-separator);
`;

export const HelpCard = styled.div`
  background: var(--color-background-base);
  border: 1px solid var(--color-border-separator);
  border-radius: 8px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-border-interactive);
    background: var(--color-background-alt);
  }
`;

export const StepLabel = styled.span`
  color: var(--color-text-link);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
`;

export const PageDescription = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-secondary-label);
  margin: 0;
  max-width: 600px;
`;
