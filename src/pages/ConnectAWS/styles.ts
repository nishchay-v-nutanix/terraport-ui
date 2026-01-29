import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow: auto;
  padding: 40px 60px;
  background: var(--color-background-body);
`;

export const ContentWrapper = styled.div`
  display: flex;
  gap: 40px;
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

export const MainContent = styled.div`
  flex: 1;
  max-width: 860px;
`;

export const Sidebar = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 4px;
  background: var(--color-background-alt);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 16px;
`;

export const ProgressBarFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${props => props.percent}%;
  background: var(--color-background-interactive-primary);
  border-radius: 2px;
  transition: width 0.3s ease;
`;

export const FormCard = styled.div`
  background: var(--color-background-base);
  border: 1px solid var(--color-border-separator);
  border-radius: var(--border-radius-m);
  padding: 24px;
  margin-top: 24px;
`;

export const InfoCard = styled.div`
  background: var(--color-background-base);
  border: 1px solid var(--color-border-separator);
  border-radius: var(--border-radius-m);
  padding: 20px;
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
  gap: 20px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
`;

export const HelpCard = styled.div`
  background: var(--color-background-base);
  border: 1px solid var(--color-border-separator);
  border-radius: var(--border-radius-m);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--color-border-interactive);
  }
`;

export const StepLabel = styled.span`
  color: var(--color-text-link);
  font-weight: 600;
  font-size: 12px;
`;
