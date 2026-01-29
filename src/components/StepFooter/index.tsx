import React from 'react';
import {
  Button,
  FlexLayout,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@nutanix-ui/prism-reactjs';
import styled from 'styled-components';

const FooterContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px !important;
  background-color: var(--color-background-base);
  border-top: 1px solid var(--color-border-separator);
  z-index: 100;
`;

export interface StepFooterProps {
  currentStep: number;
  totalSteps: number;
  nextLabel?: string;
  backLabel?: string;
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
  nextIcon?: React.ReactNode;
  extraContent?: React.ReactNode;
}

export default function StepFooter({
  currentStep,
  nextLabel = 'Continue',
  backLabel = 'Back',
  onNext,
  onBack,
  showBack = true,
  isNextDisabled = false,
  isNextLoading = false,
  nextIcon,
  extraContent,
}: StepFooterProps): React.ReactElement {
  return (
    <FooterContainer>
      {/* Left side - Back button */}
      <div>
        {showBack && currentStep > 1 && onBack && (
          <Button type={Button.ButtonTypes.SECONDARY} onClick={onBack}>
            <FlexLayout alignItems="center" itemGap="XS" padding="0px-10px">
              <ChevronLeftIcon />
              {backLabel}
            </FlexLayout>
          </Button>
        )}
      </div>

      {/* Center - Step indicator */}


      {/* Right side - Next button */}
      <FlexLayout alignItems="center" itemGap="XL">
        {extraContent}
        {onNext && (
          <Button
            type={Button.ButtonTypes.PRIMARY}
            onClick={onNext}
            disabled={isNextDisabled || isNextLoading}
          >
            <FlexLayout alignItems="center" itemGap="XS" padding="0px-10px">
              {isNextLoading ? 'Loading...' : nextLabel}
              {nextIcon || <ChevronRightIcon />}
            </FlexLayout>
          </Button>
        )}
      </FlexLayout>
    </FooterContainer>
  );
}

// Export the footer height constant for padding calculations
export const STEP_FOOTER_HEIGHT = 68;
